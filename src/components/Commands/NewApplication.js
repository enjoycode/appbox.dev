import Vue from 'vue'
import Dialog from './NewApplicationDialog'
import store from '@/design/DesignStore'

export default function() {
    var dlg = Vue.component('NewApplicationDialog', Dialog)
    store.ide.showDialog(dlg)
}
