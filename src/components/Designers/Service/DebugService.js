export default {
    /** 当前的服务设计器实例 */
    designer: null,

    /** 处理收到的调试事件 */
    handleDebugEvent(body) {
        // console.log('收到调试事件: ', body)
        if (!this.designer) {
            return
        }
        switch (body.Type) {
            case 'HitBreakpoint':
                this.designer.onHitBreakpoint(body)
                break
            case 'Result':
                this.designer.onDebugStopped(body)
                break
            default:
                break
        }
    }
}