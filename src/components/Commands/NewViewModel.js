// 新建视图模型

import Vue from 'vue'
// import { Message } from 'easeui'
import Dialog from './NewViewModelDialog'
import store from '../DesignStore'

module.exports = function () {
    var dlg = Vue.component('NewViewModelDialog', Dialog)
    store.ide.showDialog(dlg)
}
