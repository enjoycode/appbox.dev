import IChannel from './IChannel';
import axios, { AxiosRequestConfig } from 'axios';
import BytesOutputStream from './serialization/BytesOutputStream';
import BinSerializer from './serialization/BinSerializer';

const POST_CONFIG: AxiosRequestConfig = {
    responseType: "arraybuffer", transformRequest: data => data
};

export default class HttpChannel implements IChannel {

    login(user: string, pass: string, external: any): void {
        throw new Error("Method not implemented.");
    }

    logout(): void {
        throw new Error("Method not implemented.");
    }

    invoke(service: string, args: []): Promise<any> {
        var promise = new Promise((resolve, reject) => {
            //序列化请求
            var ws = new BytesOutputStream();
            var bs = new BinSerializer(ws);
            bs.WriteString(service);
            bs.WriteVariant(args.length);
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
        })
        return promise;
    }

}