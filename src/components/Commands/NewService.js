import Vue from 'vue'
import Dialog from './NewServiceDialog'
import store from '../DesignStore'

module.exports = function() {
    var dlg = Vue.component('NewServiceDialog', Dialog)
    store.ide.showDialog(dlg)
}
