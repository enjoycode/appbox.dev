// 新建枚举成员模型

import Vue from 'vue'
import Dialog from './NewEnumItemDialog'
import store from '@/design/DesignStore'

export default function () {
    var dlg = Vue.component('NewEnumItemDialog', Dialog)
    store.ide.showDialog(dlg)
}
