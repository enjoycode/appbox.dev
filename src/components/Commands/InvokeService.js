import store from '@/design/DesignStore'
import { Message } from 'element-ui'

export default function () {
    var designer = store.designers.getActiveDesigner()
    if (designer && designer.designerType === 'ServiceDesigner') {
        designer.startInvoke()
    } else {
        Message.warning('Please do this at ServiceDesigner')
    }
}