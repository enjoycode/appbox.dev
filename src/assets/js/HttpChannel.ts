import IChannel from './IChannel';
import axios, {AxiosRequestConfig} from 'axios';
import BytesOutputStream from './serialization/BytesOutputStream';
import BinSerializer from './serialization/BinSerializer';

const POST_CONFIG: AxiosRequestConfig = {
    responseType: "arraybuffer", transformRequest: data => data
};

export default class HttpChannel implements IChannel {

    login(user: string, pwd: string, external: any): Promise<any> {
        return new Promise((resolve, reject) => {
            axios.post('/login', {u: user, p: pwd, e: external}, {}).then(res => {
                console.log('登录结果:', res);
                resolve(res);
                // if (response.data.succeed) {
                // 	resolve(response.data.userInfo)
                // } else {
                // 	reject(response.data.error)
                // }
            }).catch(err => {
                reject(err)
            })
        });
    }

    logout(): void {
        throw new Error("Method not implemented.");
    }

    invoke(service: string, args: []): Promise<any> {
        return new Promise((resolve, reject) => {
            //序列化请求
            let ws = new BytesOutputStream();
            let bs = new BinSerializer(ws);
            bs.WriteString(service);
            for (const arg of args) {
                bs.Serialize(arg);
            }

            //Post请求，注意：配置覆盖transformRequest(默认Axios's defaults.js会转换为Uint8Array.buffer)
            axios.post('/api', ws.Bytes, POST_CONFIG).then(res => {
                console.log("Axios res:", res)
                if (res.data.E) {
                    reject(res.data.E);
                } else {
                    resolve(res.data.D);
                }
            }).catch(err => {
                reject(err);
            });
        });
    }

}
