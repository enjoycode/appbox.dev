import NewDataStoreCommand from './NewDataStore'
import CheckoutCommand from './Checkout'
import SaveCommand from './Save'
import PublishCommand from './Publish'
import NewViewModelCommand from './NewViewModel'
import NewEntityCommand from './NewEntity'
import DeleteModelCommand from './DeleteModel'
import NewEntityMemberCommand from './NewEntityMember'
import DeleteEntityMemberCommand from './DeleteEntityMember'
import NewEnumModelCommand from './NewEnumModel'
import NewEnumItemCommand from './NewEnumItem'
import DeleteEnumItemCommand from './DeleteEnumItem'
import NewApplicationCommand from './NewApplication'
import NewPermissionCommand from './NewPermission'
import NewFolderCommand from './NewFolder'
import NewServiceCommand from './NewService'
import StartDebugCommand from './StartDebug'
import ContinueBreakpointCommand from './ContinueBreakpoint'
import FindEntityMemberUsagesCommand from './FindEntityMemberUsages'
import RenameEntityMemberCommand from './RenameEntityMember'
import InvokeServiceCommand from './InvokeService'

export default {
    NewDataStore: NewDataStoreCommand,
    Checkout: CheckoutCommand,
    Save: SaveCommand,
    Publish: PublishCommand,
    NewViewModel: NewViewModelCommand,
    NewEntity: NewEntityCommand,
    DeleteModel: DeleteModelCommand,
    NewEntityMember: NewEntityMemberCommand,
    NewPermission : NewPermissionCommand,
    DeleteEntityMember: DeleteEntityMemberCommand,
    NewEnumModel: NewEnumModelCommand,
    NewEnumItem: NewEnumItemCommand,
    DeleteEnumItem: DeleteEnumItemCommand,
    NewApplication: NewApplicationCommand,
    NewFolder: NewFolderCommand,
    NewService: NewServiceCommand,
    InvokeService: InvokeServiceCommand,
    StartDebug: StartDebugCommand,
    ContinueBreakpoint: ContinueBreakpointCommand,
    FindEntityMemberUsages: FindEntityMemberUsagesCommand,
    RenameEntityMember: RenameEntityMemberCommand
}
