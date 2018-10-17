<template>
    <div class="pane">
        <div class="search-pane">
            <div class="treeTitle">Toolbox</div>
            <div class="treeSearch">
                <e-input v-model="filterText" suffix-icon="fas fa-search" size="small"> </e-input>
            </div>
        </div>
        <div class="treewarp">
            <e-tree class="designTree" ref='toolBoxTree' @current-change="onCurrentChanged" :data="node" :render-content="onRenderContent"
                :props="treeOption" :filter-node-method="filterNode" highlight-current>
            </e-tree>
        </div>
    </div>
</template>

<script>
    import ControlToolBox from './ControlToolBox'
    import ToolInfoDialog from './ToolInfoDialog'
    import store from '../../DesignStore'

    export default {
        name: 'ToolBoxTreeView',
        data() {
            return {
                filterText: '',
                node: ControlToolBox,
                treeHeight: 0,
                treeOption: {
                    label: 'Name',
                    children: 'Item'
                },
                onRenderContent: (h, node) => {
                    // return h('span', {staticClass: 'el-tree-node__label'}, node.data.Text)
                    var iconClass = 'fa fa-' + node.data.Icon
                    return (<span class="el-tree-node__label"><i class={iconClass}></i> {node.data.Name}</span>)
                },
                DialogData: ''
            }
        },
        watch: {
            filterText(val) {
                this.$refs.toolBoxTree.filter(val)
            }
        },
        methods: {
            filterNode(value, data) {
                if (!value) return true
                return data.Name.indexOf(value) !== -1
            },
            // 当前选择的节点改变
            onCurrentChanged(value, node) {
                console.log(node.data.Type)
                if (node.data.Type === 1) {
                    this.DialogData = node.data.ItemInfo
                    // ToolInfoDialog.data.apiModel = JSON.stringify(ToolInfoDialog.data.apiModel)
                    store.ide.showDialog(ToolInfoDialog)
                }
            },
            assignDialogData() {
                return this.DialogData
            }
        },
        components: {
            ToolInfoDialog
        },
        mounted() {
            store.toolBoxTree = this
        }
    }
</script>

<style scoped>
    .pane {
        background-color: #f3f3f3;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    }

    .search-pane {
        height: 94px;
    }

    .treewarp {
        overflow: auto;
        height: calc(100% - 94px);
        padding: 0 10px 0px 10px;
    }

    .treeTitle {
        height: 34px;
        padding-left: 18px;
        line-height: 34px;
        background-color: #f3f3f3;
        color: #838383;
        font-size: 10px;
    }

    .treeSearch {
        padding: 15px;
    }

    .designTree {
        width: 100%;
    }

    .treewarp>>>.el-tree {
        background: none;
        border: none;
    }

    .treewarp>>>.el-tree-node__content {
        background-color: #f3f3f3;
    }

    .treewarp>>>.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
        background-color: #b3b3b3;
    }

    .treewarp>>>.el-tree-node__content:hover {
        background-color: #e3e3e3;
    }
</style>