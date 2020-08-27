
/**
 * 客户端与服务端通信的通道，目前为Http及WebSocket.
 */
interface IChannel {

    /**
     * 用户登录
     * @param user 
     * @param pass 
     * @param external 外部用户模型标识
     */
    login(user: string, pass: string, external: any): void;

    logout(): void;

    /**
     * 调用服务
     * @param service 
     * @param args 
     */
    invoke(service: string, args: []): Promise<any>;

}

export default IChannel;