import DebugService from '../Designers/Service/DebugService'
import { Message } from 'easeui'

module.exports = function () {
    let designer = DebugService.designer
    if (!designer || !designer.continueBreakpoint || typeof designer.continueBreakpoint !== 'function') {
        Message.warning('无效的操作')
        return
    }

    designer.continueBreakpoint()
}