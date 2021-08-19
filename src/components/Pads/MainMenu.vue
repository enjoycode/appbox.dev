<template>
    <div class="mainMenu">
        <el-menu mode="horizontal" @select="onSelect" background-color="#464b5b" text-color="#fff"
                 active-text-color="#fff">
            <template v-for="sub in nodes">
                <el-submenu :index="sub.index" :key="sub.index">
                    <template slot="title">
                        <i v-if="sub.icon" :class="sub.icon"></i>
                        {{ sub.title }}
                    </template>
                    <template v-for="item in sub.nodes">
                        <el-menu-item :index="item.index" :key="item.index">
                            <i v-if="item.icon" :class="item.icon"></i> {{ item.title }}
                        </el-menu-item>
                    </template>
                </el-submenu>
            </template>
        </el-menu>
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
                title: 'DataStore',
                icon: null,
                index: 'store',
                nodes: [
                    {title: 'New DataStore', icon: 'fas fa-plus fa-fw', index: 'NewDataStore'},
                    {title: 'Delete DataStore', icon: 'fas fa-times fa-fw', index: 'DeleteDataStore'}
                ]
            },
                {
                    title: 'New',
                    icon: null,
                    index: 'new',
                    nodes: [
                        {title: 'Application', icon: 'fas fa-th-large fa-fw', index: 'NewApplication'},
                        {title: 'Folder', icon: 'fas fa-folder fa-fw', index: 'NewFolder'},
                        {title: 'Entity', icon: 'fas fa-table fa-fw', index: 'NewEntity'},
                        {title: 'Service', icon: 'fas fa-cog fa-fw', index: 'NewService'},
                        {title: 'View', icon: 'far fa-window-maximize fa-fw', index: 'NewView'},
                        {title: 'Report', icon: 'far fa-file fa-fw', index: 'NewReport'},
                        {title: 'Enum', icon: 'fas fa-th-list fa-fw', index: 'NewEnum'},
                        {title: 'Permission', icon: 'fas fa-lock fa-fw', index: 'NewPermission'}
                    ]
                },
                {
                    title: 'Models',
                    icon: null,
                    index: 'model',
                    nodes: [
                        {title: 'Save', icon: 'fas fa-save fa-fw', index: 'Save'},
                        {title: 'Checkout', icon: 'fas fa-edit fa-fw', index: 'Checkout'},
                        {title: 'Delete', icon: 'fas fa-trash fa-fw', index: 'DeleteModel'},
                        {title: 'Rename', icon: 'fas fa-edit fa-fw', index: 'RenameModel'},
                        {title: 'Usages', icon: 'fas fa-link fa-fw', index: 'FindModelUsages'},
                        {title: 'Publish', icon: 'fas fa-archive fa-fw', index: 'Publish'},
                        {title: 'Discard Changes', icon: 'fas fa-undo fa-fw', index: 'DiscardChanges'},
                        {title: 'Reload', icon: 'fas fa-sync fa-fw', index: 'ReloadTree'},
                    ]
                },
                // {
                //     title: 'Report',
                //     icon: null,
                //     index: 'report',
                //     nodes: [
                //         { title: 'Add Row', icon: '', index: 'InsertRow' },
                //         { title: 'Add Column', icon: '', index: 'InsertColumn' },
                //         { title: 'Merge Cells', icon: '', index: 'MergeCells' },
                //         { title: 'Split Cell', icon: '', index: 'SplitCells' }
                //     ]
                // },
                {
                    title: 'Tools',
                    icon: null,
                    index: 'Tools',
                    nodes: [
                        {title: 'DB to Model', icon: 'fas fa-database fa-fw', index: 'DB2Model'},
                        {title: 'Get Assembly', icon: 'fas fa-database fa-fw', index: 'GetAssembly'}
                    ]
                },
                {
                    title: 'AppStore',
                    icon: null,
                    index: 'appstore',
                    nodes: [
                        {title: 'Export View Model', icon: 'fas fa-cloud-upload-alt fa-fw', index: 'ExportViewModel'},
                        {title: 'Import View Model', icon: 'fas fa-cloud-download-alt fa-fw', index: 'ImportViewModel'},
                        {title: 'Export Application', icon: 'fas fa-cloud-upload-alt fa-fw', index: 'ExportApp'},
                        {title: 'Import Application', icon: 'fas fa-cloud-download-alt fa-fw', index: 'ImportApp'}
                    ]
                }]
        }
    },
    methods: {
        onSelect: function (menuName) {
            // menuName为menu item 的index属性值
            const canExecute = this.canExecute(menuName);
            if (!canExecute) {
                return
            }
            const cmd = Commands[menuName];
            if (cmd) {
                cmd()
            } else {
                console.log('无法找到对应的Command: ' + menuName)
            }
        },
        canExecute: function (menuName) {
            if (menuName === 'ExportApp' || menuName === 'ImportApp' || menuName === 'ReloadTree') {
                return true // 暂简单排除不需要选择节点的命令
            }

            const currentTreeNode = store.tree.currentNode;
            const activeDesigner = store.designers.getActiveDesigner();
            if (!currentTreeNode) {
                this.$message.warning('请选择对应的模型节点')
                return false
            }
            switch (menuName) {
                case 'NewEnumItem':
                case 'DeleteEnumItem':
                    if (activeDesigner.designerType !== 'EnumDesigner') {
                        this.$message.warning('请切换至对应的枚举设计面板')
                        return false
                    }
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
.mainMenu > .el-menu {
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
