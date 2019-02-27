import Vue from 'vue'
import Dialog from './NewFolderDialog'
import store from '@/design/DesignStore'

export default function() {
    var dlg = Vue.component('NewFolderDialog', Dialog)
    store.ide.showDialog(dlg)
}
