// 发布修改过的模型

import Vue from 'vue'
import Dialog from './PublishDialog'
import store from '../DesignStore'

export default function() {
    var dlg = Vue.component('PublishDialog', Dialog)
    store.ide.showDialog(dlg)
}
