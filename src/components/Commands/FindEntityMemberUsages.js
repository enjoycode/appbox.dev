// 查找实体成员的引用项

import store from '@/design/DesignStore'
import { Message } from 'element-ui'
import ModelReferenceType from '@/design/ModelReferenceType'

export default function () {
    var entityDesigner = store.designers.getActiveDesigner()
    if (!entityDesigner || !entityDesigner.currentMember) {
        Message.warning('请选择实体成员')
        return false
    }
    var modelId = entityDesigner.target.ID
    var memberName = entityDesigner.currentMember.Name

    let args = [ModelReferenceType.EntityMemberName, modelId, memberName]
    $runtime.channel.invoke('sys.DesignService.FindUsages', args).then(res => {
        store.usages.update(res)
    }).catch(err => {
        Message.error(err)
    })
}
