import Vue from 'vue'
import Dialog from './ExportAppDialog'
import store from '@/design/DesignStore'

export default function() {
    var dlg = Vue.component('ExportAppDialog', Dialog)
    store.ide.showDialog(dlg)
}
