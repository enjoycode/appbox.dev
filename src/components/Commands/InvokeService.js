import store from '../DesignStore'
import { Message } from 'easeui'

module.exports = function () {
    var designer = store.designers.getActiveDesigner()
    if (designer && designer.designerType === 'ServiceDesigner') {
        designer.startInvoke()
    } else {
        Message.warning('Please do this at ServiceDesigner')
    }
}