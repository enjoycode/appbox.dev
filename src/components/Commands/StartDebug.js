import store from '../DesignStore'
import { Message } from 'easeui'

module.exports = function () {
    let designer = store.designers.getActiveDesigner()
    if (!designer || !designer.startDebug || typeof designer.startDebug !== 'function') {
        Message.warning('无当前设计器或设计器不支持调试')
        return
    }

    designer.startDebug()
}