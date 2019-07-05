<template>
    <div class="mainMenu">
        <e-menu mode="horizontal" @select="onSelect" background-color="#464b5b" text-color="#fff" active-text-color="#fff">
            <template v-for="sub in nodes">
                <e-submenu :index="sub.index" :key="sub.index">
                    <template slot="title">
                        <i v-if="sub.icon" :class="sub.icon"></i>
                        {{sub.title}}
                    </template>
                    <template v-for="item in sub.nodes">
                        <e-menu-item :index="item.index" :key="item.index">
                            <i v-if="item.icon" :class="item.icon"></i> {{item.title}}
                        </e-menu-item>
                    </template>
                </e-submenu>
            </template>
        </e-menu>
    </div>
</template>

<script>
    import Commands from '../Commands'
    import store from '@/design/DesignStore'

    export default {
        data() {
            return {
                defaultActive: 'model',
                nodes: [{
                    title: 'New',
                    icon: null,
                    index: 'new',
                    nodes: [
                        { title: 'Application', icon: 'fas fa-th-large fa-fw', index: 'NewApplication' },
                        { title: 'Folder', icon: 'fas fa-folder fa-fw', index: 'NewFolder' },
                        { title: 'Entity', icon: 'fas fa-table fa-fw', index: 'NewEntity' },
                        { title: 'Service', icon: 'fas fa-cog fa-fw', index: 'NewService' },
                        { title: 'View', icon: 'far fa-window-maximize fa-fw', index: 'NewViewModel' },
                        { title: 'Enum', icon: 'fas fa-th-list fa-fw', index: 'NewEnumModel' },
                        { title: 'Permission', icon: 'fas fa-lock fa-fw', index: 'NewPermission' }
                    ]
                },
                {
                    title: 'Models',
                    icon: null,
                    index: 'model',
                    nodes: [
                        { title: 'Save', icon: 'fas fa-save fa-fw', index: 'Save' },
                        { title: 'Checkout', icon: 'fas fa-edit fa-fw', index: 'Checkout' },
                        { title: 'Delete', icon: 'fas fa-trash fa-fw', index: 'DeleteModel' },
                        { title: 'Publish', icon: 'fas fa-archive fa-fw', index: 'Publish' },
                        { title: 'DiscardChanges', icon: 'fas fa-archive fa-fw', index: 'DiscardChanges' }
                    ]
                },
                {
                    title: 'Entity',
                    icon: null,
                    index: 'entity',
                    nodes: [
                        { title: 'New Member', icon: 'fas fa-columns fa-fw', index: 'NewEntityMember' },
                        { title: 'Delete Member', icon: 'fas fa-trash fa-fw', index: 'DeleteEntityMember' },
                        { title: 'Find Member Usages', icon: 'fas fa-link fa-fw', index: 'FindEntityMemberUsages' },
                        { title: 'Rename Member', icon: 'fas fa-edit fa-fw', index: 'RenameEntityMember' }
                    ]
                },
                {
                    title: 'Enum',
                    icon: null,
                    index: 'enum',
                    nodes: [
                        { title: 'New Item', icon: 'fas fa-plus fa-fw', index: 'NewEnumItem' },
                        { title: 'Delete Item', icon: 'fas fa-times fa-fw', index: 'DeleteEnumItem' }
                    ]
                },
                {
                    title: 'Service',
                    icon: null,
                    index: 'service',
                    nodes: [
                        { title: 'Invoke', icon: 'fas fa-bug fa-fw', index: 'InvokeService' },
                        { title: 'Start Debug', icon: 'fas fa-bug fa-fw', index: 'StartDebug' },
                        { title: 'Continue', icon: 'fas fa-play fa-fw', index: 'ContinueBreakpoint' },
                        { title: 'Step', icon: 'fas fa-forward fa-fw', index: 'StepOver' },
                        { title: 'Stop Debug', icon: 'fas fa-stop fa-fw', index: 'StopDebug' }
                    ]
                },
                {
                    title: 'Report',
                    icon: null,
                    index: 'report',
                    nodes: [
                        { title: 'Add Row', icon: '', index: 'InsertRow' },
                        { title: 'Add Column', icon: '', index: 'InsertColumn' },
                        { title: 'Merge Cells', icon: '', index: 'MergeCells' },
                        { title: 'Split Cell', icon: '', index: 'SplitCells' }
                    ]
                },
                {
                    title: 'AppStore',
                    icon: null,
                    index: 'appstore',
                    nodes: [
                        { title: 'Export View Model', icon: 'fas fa-cloud-upload-alt fa-fw', index: 'ExportViewModel' },
                        { title: 'Import View Model', icon: 'fas fa-cloud-download-alt fa-fw', index: 'ImportViewModel' },
                        { title: 'Export Application', icon: 'fas fa-cloud-upload-alt fa-fw', index: 'ExportApp' },
                        { title: 'Import Application', icon: 'fas fa-cloud-download-alt fa-fw', index: 'ImportApp' }
                    ]
                }]
            }
        },
        methods: {
            onSelect: function (menuName) {
                // menuName为menu item 的index属性值
                var canExecute = this.canExecute(menuName)
                if (!canExecute) {
                    return
                }
                var cmd = Commands[menuName]
                if (cmd) {
                    cmd()
                } else {
                    console.log('无法找到对应的Command: ' + menuName)
                }
            },
            canExecute: function (menuName) {
                var currentTreeNode = store.tree.currentNode
                var activeDesigner = store.designers.getActiveDesigner()
                if (!currentTreeNode) {
                    this.$message.warning('请选择对应的模型节点')
                    return false
                }
                switch (menuName) {
                    case 'Save':
                        break
                    case 'NewMember':// type=4
                        // if (currentTreeNode.Type !== 4) {
                        //     this.$message.warning('请选择Entities节点')
                        //     return false
                        // }
                        break
                    case 'NewEntityMember':
                        if (activeDesigner.designerType !== 'EntityDesigner') {
                            this.$message.warning('请切换至对应的实体设计面板')
                            return false
                        }
                        break
                    case 'DeleteEntityMember':
                        if (activeDesigner.designerType !== 'EntityDesigner') {
                            this.$message.warning('请切换至对应的实体设计面板')
                            return false
                        }
                        break
                    case 'NewEnumItem':
                    case 'DeleteEnumItem':
                        if (activeDesigner.designerType !== 'EnumDesigner') {
                            this.$message.warning('请切换至对应的枚举设计面板')
                            return false
                        }
                        break
                    case 'SplitCells':
                        if (activeDesigner.designerType !== 'ReportDesigner') {
                            this.$message.warning('请切换至对应的报表设计面板')
                            return false
                        }
                        activeDesigner.SplitCells()
                        break
                    case 'MergeCells':
                        if (activeDesigner.designerType !== 'ReportDesigner') {
                            this.$message.warning('请切换至对应的报表设计面板')
                            return false
                        }
                        activeDesigner.MergeCells()
                        break
                    case 'InsertRow':
                        if (activeDesigner.designerType !== 'ReportDesigner') {
                            this.$message.warning('请切换至对应的报表设计面板')
                            return false
                        }
                        activeDesigner.InsertRow()
                        break
                    case 'InsertColumn':
                        if (activeDesigner.designerType !== 'ReportDesigner') {
                            this.$message.warning('请切换至对应的报表设计面板')
                            return false
                        }
                        activeDesigner.InsertColumn()
                        break
                    default:
                        break
                }
                return true
            }
        }
    }
</script>

<style>
    .mainMenu>.el-menu {
        padding-left: 50px;
    }

    /*
    .mainMenu>.el-menu>.el-menu-item {
        color: #ababab;
    }

    .mainMenu>.el-menu>.el-submenu>.el-submenu__title>i {
        color: #ababab;
    }

    .mainMenu>.el-menu>.el-submenu>.el-submenu__title {
        color: #ababab;
        border-bottom: none;
    }

    .mainMenu>.el-menu--horizontal.el-menu--dark .el-submenu__title:hover {
        background-color: #464b5b;
        color: #ffffff;
    }

    .mainMenu>.el-menu--horizontal.el-menu--dark .el-submenu__title:hover>i {
        color: #ffffff;
    }

    .mainMenu>.el-menu--horizontal>.el-submenu:hover>.el-submenu__title {
        border-bottom: none;
    }

    .mainMenu>.el-menu--horizontal>.el-submenu.is-active .el-submenu__title {
        border-bottom: none;
    } */
</style>