import Vue from 'vue'
import Dialog from './NewDataStoreDialog'
import store from '../DesignStore'

module.exports = function() {
    var dlg = Vue.component('NewDataStoreDialog', Dialog)
    store.ide.showDialog(dlg)
}
