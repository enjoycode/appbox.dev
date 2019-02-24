import DebugService from '../Designers/Service/DebugService'
import { Message } from 'element-ui'

export default function () {
    let designer = DebugService.designer
    if (!designer || !designer.continueBreakpoint || typeof designer.continueBreakpoint !== 'function') {
        Message.warning('无效的操作')
        return
    }

    designer.continueBreakpoint()
}