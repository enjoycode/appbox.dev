import Vue from 'vue'
import Dialog from './NewEntityDialog'
import store from '../DesignStore'

module.exports = function() {
    var dlg = Vue.component('NewEntityDialog', Dialog)
    store.ide.showDialog(dlg)
}
