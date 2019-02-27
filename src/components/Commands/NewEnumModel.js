// 新建实体成员模型

import Vue from 'vue'
import Dialog from './NewEnumModelDialog'
import store from '@/design/DesignStore'

export default function () {
    var dlg = Vue.component('NewEnumModelDialog', Dialog)
    store.ide.showDialog(dlg)
}
