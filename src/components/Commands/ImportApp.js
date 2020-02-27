import Vue from 'vue'
import Dialog from './ImportAppDialog'
import store from '@/design/DesignStore'

export default function() {
    var dlg = Vue.component('ImportAppDialog', Dialog)
    store.ide.showDialog(dlg)
}
