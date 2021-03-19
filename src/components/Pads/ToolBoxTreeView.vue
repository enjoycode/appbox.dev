<template>
    <div class="pane">
        <div class="search-pane">
            <div class="treeTitle">Toolbox</div>
            <div class="treeSearch">
                <el-input v-model="filterText" suffix-icon="fas fa-search" size="small"></el-input>
            </div>
        </div>
        <div class="treewarp">
            <el-tree class="designTree" ref="toolBoxTree" :data="node" node-key="Name"
                     :render-content="onRenderContent"
                     :props="treeOption" :filter-node-method="filterNode" highlight-current>
            </el-tree>
        </div>
    </div>
</template>

<script lang="jsx">
import store from '@/design/DesignStore'

export default {
    name: 'ToolBoxTreeView',
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
                const iconClass = 'fa fa-' + node.data.Icon;
                return (<span class="el-tree-node__label"><i class={iconClass}></i> {node.data.Name}</span>)
            }
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
        /** 获取当前选择 */
        getSelected() {
            return this.$refs.toolBoxTree.getCurrentNode()
        },
        /** 清除选择 */
        clearSelected() {
            this.$refs.toolBoxTree.setCurrentKey(null)
        },
        /** 当前的编辑器改变后加载相应的工具箱 */
        onDesignerChanged() {
            let designer = store.designers.getActiveDesigner()
            if (designer && designer.toolbox) {
                this.node = designer.toolbox()
            } else {
                this.node = [];
            }
        }
    },

    activated() {
        this.onDesignerChanged()
    },

    mounted() {
        store.toolBoxTree = this
        store.onEvent('DesignerChanged', this.onDesignerChanged)
    },
    destroyed() {
        store.offEvent('DesignerChanged', this.onDesignerChanged)
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
    padding: 0 10px 0 10px;
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

.treewarp >>> .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: #b3b3b3;
}

.treewarp >>> .el-tree-node__content:hover {
    background-color: #e3e3e3;
}
</style>
