import NewDataStoreCommand from './NewDataStore'
import CheckoutCommand from './Checkout'
import SaveCommand from './Save'
import PublishCommand from './Publish'
import NewViewModelCommand from './NewViewModel'
import NewEntityCommand from './NewEntity'
import DeleteModelCommand from './DeleteModel'
import NewEnumModelCommand from './NewEnumModel'
import NewEnumItemCommand from './NewEnumItem'
import DeleteEnumItemCommand from './DeleteEnumItem'
import NewApplicationCommand from './NewApplication'
import NewPermissionCommand from './NewPermission'
import NewFolderCommand from './NewFolder'
import NewServiceCommand from './NewService'
import ExportAppCommand from './ExportApp'
import ImportAppCommand from './ImportApp'

import store from '@/design/DesignStore'

export default {
    NewDataStore: NewDataStoreCommand,
    Checkout: CheckoutCommand,
    Save: SaveCommand,
    Publish: PublishCommand,
    NewViewModel: NewViewModelCommand,
    NewEntity: NewEntityCommand,
    DeleteModel: DeleteModelCommand,
    NewPermission: NewPermissionCommand,
    NewEnumModel: NewEnumModelCommand,
    NewEnumItem: NewEnumItemCommand,
    DeleteEnumItem: DeleteEnumItemCommand,
    NewApplication: NewApplicationCommand,
    NewFolder: NewFolderCommand,
    NewService: NewServiceCommand,
    ExportApp: ExportAppCommand,
    ImportApp: ImportAppCommand,
    ReloadTree: function () { store.tree.loadTree() }
}
