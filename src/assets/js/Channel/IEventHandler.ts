/** 事件消息处理器，用于处理后端发给前端的事件 */
import IInputStream from '@/assets/js/Serialization/IInputStream';

interface IEventHandler {
    /** 处理收到的事件消息，已读取头部，直接读取消息体 */
    process(stream: IInputStream);
}

export default IEventHandler;
