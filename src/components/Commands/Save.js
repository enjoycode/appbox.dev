// 保存当前的模型

import store from '../DesignStore'
import { Message } from 'easeui'

module.exports = function () {
    let designer = store.designers.getActiveDesigner()
    if (!designer || !designer.save || typeof designer.save !== 'function') {
        Message.warning('无当前设计器或设计器不支持保存')
        return
    }

    designer.save()
}
