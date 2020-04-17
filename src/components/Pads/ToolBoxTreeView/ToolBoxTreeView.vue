<template>
    <div class="pane">
        <div class="search-pane">
            <div class="treeTitle">Toolbox</div>
            <div class="treeSearch">
                <el-input v-model="filterText" suffix-icon="fas fa-search" size="small"> </el-input>
            </div>
        </div>
        <div class="treewarp">
            <el-tree class="designTree" ref="toolBoxTree" :data="node" node-key="Name"
                @current-change="onCurrentChanged" :render-content="onRenderContent"
                :props="treeOption" :filter-node-method="filterNode" highlight-current>
            </el-tree>
        </div>
    </div>
</template>

<script>
// import ControlToolBox from './ControlToolBox'
// import ToolInfoDialog from './ToolInfoDialog'
import ReportToolbox from "@/components/Designers/Report/ReportToolbox"
import store from '@/design/DesignStore'

export default {
    name: 'ToolBoxTreeView',
    // components: {
    //     ToolInfoDialog
    // },
    data() {
        return {
            filterText: '',
            node: [], //ControlToolBox,
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
        filterText(val) { this.$refs.toolBoxTree.filter(val) }
    },
    methods: {
        filterNode(value, data) {
            if (!value) return true
            return data.Name.indexOf(value) !== -1
        },
        // 当前选择的节点改变
        onCurrentChanged(value, node) {
            // if (node.data.Type === 1) {
            //     this.DialogData = node.data.ItemInfo
            //     // ToolInfoDialog.data.apiModel = JSON.stringify(ToolInfoDialog.data.apiModel)
            //     store.ide.showDialog(ToolInfoDialog)
            // }
        },
        /** 获取当前选择 */
        getSelected() {
            return this.$refs.toolBoxTree.getCurrentNode()
        },
        /** 清除选择 */
        clearSelected() {
            this.$refs.toolBoxTree.setCurrentKey(null)
        },
        assignDialogData() {
            return this.DialogData
        }
    },
    mounted() {
        store.toolBoxTree = this
        // TODO:根据当前编辑器加载，暂直接加载报表工具箱
        this.node = ReportToolbox.GetToolboxItems()
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

.treewarp >>> .el-tree {
    background: none;
    border: none;
}

.treewarp >>> .el-tree-node__content {
    background-color: #f3f3f3;
}

.treewarp
    >>> .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: #b3b3b3;
}

.treewarp >>> .el-tree-node__content:hover {
    background-color: #e3e3e3;
}
</style>