import Vue from 'vue'
import Dialog from './NewPermissionDialog'
import store from '@/design/DesignStore'

export default function() {
    var dlg = Vue.component('NewPermissionDialog', Dialog)
    store.ide.showDialog(dlg)
}
