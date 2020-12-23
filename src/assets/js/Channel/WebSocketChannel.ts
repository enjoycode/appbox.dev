import IChannel from './IChannel';
import axios from 'axios';
import {Message} from 'element-ui';
import BytesOutputStream from '../Serialization/BytesOutputStream';
import BytesInputStream from '../Serialization/BytesInputStream';
import MessageType from './MessageType';
import InvokeErrorCode from '../InvokeErrorCode';

export default class WebSocketChannel implements IChannel {
    private socket: WebSocket;
    private msgIdIndex = 0;         // 当前消息流水计数器
    private waitHandles = [];       // 待回复的请求列表
    private pendingRequires = [];   // 等待发送的请求列表
    private sending = false;        // 是否正在发送中

    /** 连接至服务端 */
    private connect() {
        let scheme = document.location.protocol === 'https:' ? 'wss' : 'ws';
        let port = document.location.port ? (':' + document.location.port) : '';
        let connectionUrl = scheme + '://' + document.location.hostname + port + '/ws';

        this.socket = new WebSocket(connectionUrl);
        this.socket.binaryType = 'arraybuffer';
        this.socket.onopen = (e) => this.onopen(e);
        this.socket.onclose = (e) => this.onclose(e);
        this.socket.onerror = (e) => this.onerror(e);
        this.socket.onmessage = (e) => this.onmessage(e);
    }

    /** WebSocket链路打开 */
    private onopen(event: Event) {
        console.log('连接建立' + event.type);
        this.sendPendings();
    }

    private onclose(event: CloseEvent) {
        if (event.code !== 1000) {
            Message.error('连接关闭，请重新登录');
            // store.router.replace('/')
        }
    }

    private onerror(event: Event) {
        //TODO:清除所有待发送以及已发送待响应的所有请求
        Message.error('连接异常，请重新登录');
        // store.router.replace('/')
    }

    /** 接收到服务端消息，格式参照说明 */
    private async onmessage(event: MessageEvent): Promise<void> {
        // console.log("收到WebSocket消息:", event.data);

        if (event.data instanceof ArrayBuffer) {
            let rs = new BytesInputStream(event.data);
            let msgType = rs.ReadByte(); //先读消息类型
            if (msgType == MessageType.InvokeResponse) {
                let reqMsgId = rs.ReadInt32();
                let errorCode: InvokeErrorCode = rs.ReadByte();
                let result: any;
                if (rs.Remaining > 0) { //因有些错误可能不包含数据，只有错误码
                    try {
                        result = await rs.DeserializeAsync();
                    } catch (error) {
                        // console.error("DeserializeResponse error:", error);
                        errorCode = InvokeErrorCode.DeserializeResponseFail;
                        result = error;
                    }
                }
                this.onInvokeResponse(reqMsgId, errorCode, result);
            } else {
                console.warn('Receive unknown message type:', msgType);
            }
        } else {
            console.warn('Receive none binary message: ', event.data);
        }
    }

    private onInvokeResponse(reqId: number, error: InvokeErrorCode, result: any) {
        //console.log('收到调用回复: ', error, result);

        for (let i = 0; i < this.waitHandles.length; i++) {
            if (this.waitHandles[i].Id === reqId) {
                let cb = this.waitHandles[i].Cb;
                this.waitHandles.splice(i, 1);
                // console.log('移除请求等待者, 还余: ' + waitHandles.length)
                if (error != InvokeErrorCode.None) {
                    cb(error.toString() + ':' + result, null);
                } else {
                    cb(null, result);
                }
                return;
            }
        }
    }

    /** 按序发送请求 */
    private async sendPendings() {
        if (this.pendingRequires.length == 0 || this.sending) {
            return;
        }

        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            if (!this.socket || this.socket.readyState !== WebSocket.CONNECTING) {
                this.connect();
            }
            return;
        }

        this.sending = true;
        while (this.pendingRequires.length > 0) {
            const first = this.pendingRequires.splice(0, 1);
            const req = first[0];
            //序列化请求
            let ws = new BytesOutputStream();
            //写入消息头
            ws.WriteByte(MessageType.InvokeRequest);
            ws.WriteInt32(req.I);   //请求消息标识
            //写入消息体(InvokeRequest)
            ws.WriteString(req.S);
            for (const arg of req.A) {
                await ws.SerializeAsync(arg);
            }

            try {
                this.socket.send(ws.Bytes);
            } catch (error) {
                console.log('WebSocket发送数据错误: ' + error.message);
                this.onInvokeResponse(req.I, InvokeErrorCode.SendRequestFail, error);
            }
        }
        this.sending = false;
    }

    public async login(user: string, pwd: string, external: any): Promise<any> {
        let res = await axios.post('/login',
            {u: user, p: pwd, e: external}, {responseType: 'arraybuffer'});
        let rs = new BytesInputStream(res.data);
        let errorCode = rs.ReadByte();
        let result = await rs.DeserializeAsync();
        if (errorCode == 0) {
            return result;
        } else {
            throw new Error(result);
        }
    }

    logout(): void {
        throw new Error('Method not implemented.');
    }

    invoke(service: string, args: []): Promise<any> {
        //加入等待者列表
        this.msgIdIndex++;
        if (this.msgIdIndex > 0x7FFFFFFF) {
            this.msgIdIndex = 0;
        }
        let msgId = this.msgIdIndex;
        let wait = {Id: msgId, Cb: null};
        this.waitHandles.push(wait);

        let promise = new Promise((resolve, reject) => {
            wait.Cb = (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            };
        });

        //加入发送队列异步发送 TODO:考虑挂起的列表超过阀值直接reject
        this.pendingRequires.push({I: msgId, S: service, A: args});
        this.sendPendings();

        return promise;
    }

}
