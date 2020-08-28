import IChannel from './IChannel';
import axios from 'axios';
import { Message } from 'element-ui'
import BytesOutputStream from './serialization/BytesOutputStream';
import BinSerializer from './serialization/BinSerializer';
import BytesInputStream from './serialization/BytesInputStream';
import BinDeserializer from './serialization/BinDeserializer';
import MessageType from "./MessageType";
import InvokeErrorCode from "./InvokeErrorCode";

export default class WebSocketChannel implements IChannel {
    private socket: WebSocket;
    private msgIdIndex = 0; // 当前消息流水计数器
    private waitHandles = []; // 已成功发送待回复的请求列表
    private pendingRequires = []; // 链路断开后挂起的请求列表

    /**
     * 连接至服务端
     */
    private connect() {
        let scheme = document.location.protocol === 'https:' ? 'wss' : 'ws';
        let port = document.location.port ? (':' + document.location.port) : '';
        let connectionUrl = scheme + '://' + document.location.hostname + port + '/ws';

        this.socket = new WebSocket(connectionUrl);
        this.socket.binaryType = "arraybuffer";
        this.socket.onopen = (e) => this.onopen(e);
        this.socket.onclose = (e) => this.onclose(e);
        this.socket.onerror = (e) => this.onerror(e);
        this.socket.onmessage = (e) => this.onmessage(e);
    }

    /**
     * WebSocket链路打开
     */
    private onopen(event: Event) {
        console.log('连接建立' + event.type);
        if (this.pendingRequires.length > 0) {
            for (let i = 0; i < this.pendingRequires.length; i++) {
                let element = this.pendingRequires[i];
                this.sendRequire(element.S, element.A, element.C);
            }
            this.pendingRequires.splice(0, this.pendingRequires.length);
        }
    }

    private onclose(event: CloseEvent) {
        if (event.code !== 1000) {
            Message.error('连接关闭，请重新登录')
            // store.router.replace('/')
        }
    }

    private onerror(event: Event) {
        //TODO:清除所有待发送以及已发送待响应的所有请求
        Message.error('连接异常，请重新登录')
        // store.router.replace('/')
    }

    /**
     * 接收到服务端消息，格式参照说明
     */
    private onmessage(event: MessageEvent) {
        console.log("收到WebSocket消息:", event.data);

        if (event.data instanceof ArrayBuffer) {
            let rs = new BytesInputStream(event.data);
            let msgType = rs.ReadByte(); //先读消息类型
            if (msgType == MessageType.InvokeResponse) {
                let reqMsgId = rs.ReadInt32();
                let errorCode: InvokeErrorCode = rs.ReadByte();
                let result: any;
                if (rs.Remaining > 0) { //因有些错误可能不包含数据，只有错误码
                    let bs = new BinDeserializer(rs);
                    try {
                        result = bs.Deserialize();
                    } catch (error) {
                        // console.error("DeserializeResponse error:", error);
                        errorCode = InvokeErrorCode.DeserializeResponseFail;
                        result = error;
                    }
                }
                this.onInvokeResponse(reqMsgId, errorCode, result);
            } else {
                console.warn("Receive unknown message type:", msgType);
            }
        } else {
            console.warn("Receive none binary message: ", event.data);
        }
    }

    private onInvokeResponse(reqId: number, error: InvokeErrorCode, result: any) {
        for (var i = 0; i < this.waitHandles.length; i++) {
            if (this.waitHandles[i].Id === reqId) {
                let cb = this.waitHandles[i].Cb;
                this.waitHandles.splice(i, 1)
                // console.log('移除请求等待者, 还余: ' + waitHandles.length)
                if (error != InvokeErrorCode.None) {
                    cb(error.toString() + ":" + result, null);
                } else {
                    cb(null, result);
                }
                return;
            }
        }
    }

    /**
     * 链路断开时添加挂起的请求
     */
    private addRequire(service: string, args: [], cb) {
        this.pendingRequires.push({ S: service, A: args, C: cb })
    }

    /**
     * 发送Api调用请求
     */
    private sendRequire(service: string, args: [], callback) {
        // 先加入等待者列表
        this.msgIdIndex++;
        if (this.msgIdIndex > 0x7FFFFFFF) {
            this.msgIdIndex = 0;
        }
        let msgId = this.msgIdIndex;
        this.waitHandles.push({ Id: msgId, Cb: callback });
        // console.log('加入请求等待者, 还余: ' + waitHandles.length)

        //序列化请求
        let ws = new BytesOutputStream();
        let bs = new BinSerializer(ws);
        //写入消息头
        bs.WriteByte(MessageType.InvokeRequest);
        bs.WriteInt32(msgId);   //请求消息标识
        //写入消息体(InvokeRequest)
        bs.WriteString(service);
        bs.WriteVariant(args.length);
        for (const arg of args) {
            bs.Serialize(arg);
        }

        // 通过socket发送请求
        try {
            this.socket.send(ws.Bytes);
        } catch (error) {
            console.log('WebSocket发送数据错误: ' + error.message)
            this.onInvokeResponse(msgId, InvokeErrorCode.SendRequestFail, error);
            return false
        }

        // 启动超时定时器
        // setTimeout(function () {
        //     onResult({ I: msgId, E: '请求超时' })
        // }, 10000)
        return true
    }

    login(user: string, pwd: string, external: any): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            axios.post('/login', { u: user, p: pwd, e: external }, {}).then(res => {
                console.log('登录结果:', res);
                resolve(res.data);
                // if (response.data.succeed) {
                // 	resolve(response.data.userInfo)
                // } else {
                // 	reject(response.data.error)
                // }
            }).catch(err => {
                reject(err)
            })
        })
        return promise;
    }

    logout(): void {
        throw new Error("Method not implemented.");
    }

    invoke(service: string, args: []): Promise<any> {
        var promise = new Promise((resolve, reject) => {
            if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
                if (!this.socket || this.socket.readyState !== WebSocket.CONNECTING) {
                    this.connect();
                }
                // TODO:考虑挂起的列表超过阀值直接reject
                this.addRequire(service, args, (err, res) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(res)
                    }
                });
            } else {
                this.sendRequire(service, args, (err, res) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(res)
                    }
                });
            }
        })
        return promise
    }

}