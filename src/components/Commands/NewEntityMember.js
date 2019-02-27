// 新建实体成员模型

import Vue from 'vue'
import Dialog from './NewEntityMemberDialog'
import store from '@/design/DesignStore'

export default function () {
    var dlg = Vue.component('NewEntityMemberDialog', Dialog)
    store.ide.showDialog(dlg)
}
