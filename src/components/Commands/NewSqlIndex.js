// 新建索引

import Vue from 'vue'
import Dialog from './NewSqlIndexDialog'
import store from '../DesignStore'
import { Message } from 'easeui'

module.exports = function () {
    var designer = store.designers.getActiveDesigner()
    if (designer && designer.designerType === 'EntityDesigner' && !designer.isDTO) {
        var dlg = Vue.component('NewSqlIndexDialog', Dialog)
        store.ide.showDialog(dlg)
    } else {
        Message.warning('请在映射至Sql存储的实体设计器内进行此操作')
    }
}
