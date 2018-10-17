// 重命名实体成员

import Vue from 'vue'
import store from '../DesignStore'
import { Message } from 'easeui'
import RenameDialog from './RenameDialog'
import ModelReferenceType from '../../enums/ModelReferenceType'

module.exports = function () {
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
