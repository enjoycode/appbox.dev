import Vue from 'vue'
import Dialog from './NewEntityDialog'
import store from '@/design/DesignStore'

export default function() {
    var dlg = Vue.component('NewEntityDialog', Dialog)
    store.ide.showDialog(dlg)
}
