import IEventHandler from '@/assets/js/Channel/IEventHandler';
import IInputStream from '@/assets/js/Serialization/IInputStream';

enum DebugEventType {
    Start,
    Stop,
    HitBreakPoint,
    Output //输出调试日志
}

interface IDebugEvent {
    Type: DebugEventType;
}

export default class DebugService implements IEventHandler {
    public static readonly DEBUG_EVENT: number = 12;

    /** 当前的服务设计器实例 */
    public static designer: any = null;

    /** 处理收到的调试事件 */
    process(stream: IInputStream) {
        if (!DebugService.designer) {
            console.warn('Cannot got ServiceDesigner on debug event');
            return;
        }

        let eventType = stream.ReadByte();
        switch (eventType) {
            case DebugEventType.Start:
                console.info('调试器已启动');
                break;
            case DebugEventType.Stop:
                DebugService.designer.onDebugStopped();
                break;
            case DebugEventType.HitBreakPoint:
                DebugService.designer.onHitBreakpoint({Thread: stream.ReadInt64(), Line: stream.ReadInt32()});
                break;
            case DebugEventType.Output:
                let msg = stream.ReadString();
                console.info('调试器输出: ' + msg);
                break;
            default:
                console.warn('Unknown debug event: ' + eventType);
        }
    }

}
