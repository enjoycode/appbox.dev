import Vue from 'vue'
import Dialog from './NewApplicationDialog'
import store from '../DesignStore'

module.exports = function() {
    var dlg = Vue.component('NewApplicationDialog', Dialog)
    store.ide.showDialog(dlg)
}
