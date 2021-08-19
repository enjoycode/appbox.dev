import CheckoutCommand from './Checkout'
import SaveCommand from './Save'
import PublishCommand from './Publish'
import DeleteModelCommand from './DeleteModel'
import ExportAppCommand from './ExportApp'
import ImportAppCommand from './ImportApp'
import GetAssemblyCommand from './GetAssembly'
import FindModelUsagesCommand from "./FindModelUsages";
import RenameModelCommand from "@/components/Commands/RenameModel";

import Vue from 'vue'
import NewDataStoreDialog from './NewDataStoreDialog'
import NewModelDialog from './NewModelDialog'
import NewEntityDialog from './NewEntityDialog'
import store from '@/design/DesignStore'

export default {
    NewDataStore: function () {
        store.ide.showDialog(Vue.component('NewDataStoreDialog', NewDataStoreDialog))
    },
    Checkout: CheckoutCommand,
    Save: SaveCommand,
    FindModelUsages: FindModelUsagesCommand,
    RenameModel: RenameModelCommand,
    Publish: PublishCommand,
    NewView: function () {
        store.ide.showDialog(Vue.component('NewModelDialog', NewModelDialog), 'View')
    },
    NewEntity: function () {
        store.ide.showDialog(Vue.component('NewEntityDialog', NewEntityDialog))
    },
    DeleteModel: DeleteModelCommand,
    NewPermission: function () {
        store.ide.showDialog(Vue.component('NewModelDialog', NewModelDialog), 'Permission')
    },
    NewEnum: function () {
        store.ide.showDialog(Vue.component('NewModelDialog', NewModelDialog), 'Enum')
    },
    NewApplication: function () {
        store.ide.showDialog(Vue.component('NewModelDialog', NewModelDialog), 'Application')
    },
    NewFolder: function () {
        store.ide.showDialog(Vue.component('NewModelDialog', NewModelDialog), 'Folder')
    },
    NewService: function () {
        store.ide.showDialog(Vue.component('NewModelDialog', NewModelDialog), 'Service')
    },
    NewReport: function () {
        store.ide.showDialog(Vue.component('NewModelDialog', NewModelDialog), 'Report')
    },
    ExportApp: ExportAppCommand,
    ImportApp: ImportAppCommand,
    ReloadTree: function () {
        store.tree.loadTree()
    },
    GetAssembly: GetAssemblyCommand
}
