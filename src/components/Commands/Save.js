// 保存当前的模型

import store from '@/design/DesignStore'
import { Message } from 'element-ui'

export default function () {
    let designer = store.designers.getActiveDesigner()
    if (!designer || !designer.save || typeof designer.save !== 'function') {
        Message.warning('无当前设计器或设计器不支持保存')
        return
    }

    designer.save()
}
