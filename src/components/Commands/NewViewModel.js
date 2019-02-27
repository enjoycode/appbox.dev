// 新建视图模型

import Vue from 'vue'
// import { Message } from 'element-ui'
import Dialog from './NewViewModelDialog'
import store from '@/design/DesignStore'

export default function () {
    var dlg = Vue.component('NewViewModelDialog', Dialog)
    store.ide.showDialog(dlg)
}
