enum DesignNodeType
{
    ApplicationRoot = 0,
    DataStoreRootNode = 1,
    DataStoreNode = 2,
    ApplicationNode = 3,
    ModelRootNode = 4,
    ResourcesNode = 5,
    FolderNode = 6,
    AssemblyRoot = 7,
    OrgUnitNode = 8, // todo:??

    BlobStoreNode = 10,

    EntityModelNode = 20,
    ServiceModelNode = 21,
    ViewModelNode = 22,
    EnumModelNode = 23,
    EventModelNode = 24,
    PermissionModelNode = 25,
    WorkflowModelNode = 26,
    ReportModelNode = 27,

    MenuItemNode = 28,
}

export default DesignNodeType