<template>
    <div class="ide-left-pane">
        <div class="ide-left-search-pane">
            <div class="ide-left-tree-title">Toolbox</div>
            <div class="ide-left-tree-search">
                <el-input v-model="filterText" suffix-icon="fas fa-search" size="small"></el-input>
            </div>
        </div>
        <div class="ide-left-tree-warp">
            <el-tree class="ide-left-tree" ref="toolboxTree" :data="node" node-key="Name"
                     :render-content="onRenderContent" draggable :allow-drop="allowDrop"
                     @node-drag-start="onDragStart" @node-drag-end="onDragEnd"
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
                return (<span class="el-tree-node__label">
                        <i class={node.data.Icon + ' fa-fw'}></i> {node.data.Name}</span>)
            }
        }
    },
    watch: {
        filterText(val) {
            this.$refs.toolboxTree.filter(val)
        }
    },
    methods: {
        filterNode(value, data) {
            if (!value) return true
            return data.Name.indexOf(value) !== -1
        },
        allowDrop() {
            return false; /*always false*/
        },

        onDragStart(node, e) {
            this.$refs.toolboxTree.setCurrentKey(node.data.Name);
        },
        onDragEnd(snode, dnode, place, e) {
            let designer = store.designers.getActiveDesigner()
            if (designer && designer.onDragEnd) {
                designer.onDragEnd(e);
            }
        },

        /** 获取当前选择 */
        getSelected() {
            return this.$refs.toolboxTree.getCurrentNode()
        },
        /** 清除选择 */
        clearSelected() {
            this.$refs.toolboxTree.setCurrentKey(null)
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
        store.toolbox = this
        store.onEvent('DesignerChanged', this.onDesignerChanged)
    },
    destroyed() {
        store.offEvent('DesignerChanged', this.onDesignerChanged)
    }
}
</script>
