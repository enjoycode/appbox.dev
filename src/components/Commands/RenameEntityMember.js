// 重命名实体成员

import Vue from 'vue'
import store from '@/design/DesignStore'
import { Message } from 'element-ui'
import RenameDialog from './RenameDialog'
import ModelReferenceType from '@/design/ModelReferenceType'

export default function () {
    var entityDesigner = store.designers.getActiveDesigner()
    if (!entityDesigner || !entityDesigner.currentMember) {
        Message.warning('请选择实体成员')
        return false
    }
    var modelId = entityDesigner.target.ID
    var memberName = entityDesigner.currentMember.Name

    var dlg = Vue.component('RenameDialog', RenameDialog)
    store.ide.showDialog(dlg, {
        target: modelId + '.' + memberName,
        targetModel: modelId,
        targetType: ModelReferenceType.EntityMemberName,
        oldName: memberName
    })
}
