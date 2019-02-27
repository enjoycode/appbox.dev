import store from '@/design/DesignStore'
import { Message } from 'element-ui'

export default function () {
    let designer = store.designers.getActiveDesigner()
    if (!designer || !designer.startDebug || typeof designer.startDebug !== 'function') {
        Message.warning('无当前设计器或设计器不支持调试')
        return
    }

    designer.startDebug()
}