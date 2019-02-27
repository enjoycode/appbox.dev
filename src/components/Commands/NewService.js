import Vue from 'vue'
import Dialog from './NewServiceDialog'
import store from '@/design/DesignStore'

export default function() {
    var dlg = Vue.component('NewServiceDialog', Dialog)
    store.ide.showDialog(dlg)
}
