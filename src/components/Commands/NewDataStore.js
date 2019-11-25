import Vue from 'vue'
import Dialog from './NewDataStoreDialog'
import store from '@/design/DesignStore'

export default function() {
    var dlg = Vue.component('NewDataStoreDialog', Dialog)
    store.ide.showDialog(dlg)
}
