import Vue from 'vue'
import Dialog from './NewFolderDialog'
import store from '../DesignStore'

module.exports = function() {
    var dlg = Vue.component('NewFolderDialog', Dialog)
    store.ide.showDialog(dlg)
}
