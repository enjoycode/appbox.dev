<template>
    <div class="pane">
        <div calss="search-pane">
            <div class="treeTitle">Models</div>
            <div class="treeSearch">
                <el-input v-model="keyword" size="small" suffix-icon="fas fa-search"> </el-input>
            </div>
        </div>
        <div class="tree-pane">
            <el-tree class="designTree" ref="designTree" draggable highlight-current v-loading="loading" 
                node-key="ID" :current-node-key="currentNodeKey" :expand-on-click-node="false"
                @current-change="onCurrentChanged" :render-content="onRenderContent"
                @node-drop="onDrop" :allow-drag="allowDrag" :allow-drop="allowDrop"
                :filter-node-method="filterNode" :data="designNodes" :props="treeOption" 
                :default-expanded-keys="['Applications','sys']">
            </el-tree>
        </div>
    </div>
</template>

<script lang="tsx">
import Vue from 'vue'
import store from '@/design/DesignStore'
import DataStoreKind from '@/design/DataStoreKind'
import DesignNodeType from '@/design/DesignNodeType'
import ModelType from '@/design/ModelType'
import { IDesignNode, IModelNode, IEntityModelNode } from '@/design/IDesignNode'
import { modelLibs } from '@/components/CodeEditor/EditorService'

const iconClasses = {
    n0: 'fas fa-folder fa-fw',
    n1: 'fas fa-folder fa-fw',
    n2: 'fas fa-database fa-fw',
    n3: 'fas fa-th-large fa-fw',
    n4: 'fas fa-folder fa-fw',
    n5: 'fas fa-image fa-fw',
    n6: 'fas fa-folder fa-fw',
    n7: 'fas fa-plus fa-fw',
    n8: 'fas fa-plus fa-fw',
    n20: 'fas fa-table fa-fw',
    n21: 'fas fa-cog fa-fw',
    n22: 'far fa-window-maximize fa-fw',
    n23: 'fas fa-th-list fa-fw',
    n24: 'fas fa-envelope fa-fw',
    n25: 'fas fa-lock fa-fw',
    n26: 'fas fa-random fa-fw',
    n27: 'fas fa-chart-pie fa-fw',
    n28: 'fas fa-plus fa-fw'
}

export default Vue.extend({
    name: 'DesignTreeView',
    data() {
        return {
            keyword: '',
            loading: false, // 是否在加载中或刷新中
            currentNode: null, // 当前的节点，注意是数据
            currentNodeKey: null, // 当前选中节点的key值
            designNodes: [],
            onRenderContent: (h, node) => {
                var iconClass
                if (node.data.Type === DesignNodeType.BlobStoreNode) { // 存储节点单独处理
                    iconClass = 'fas fa-hdd'
                } else {
                    iconClass = iconClasses['n' + node.data.Type]
                }

                if (node.data.CheckoutBy) {
                    if (node.data.CheckoutBy === 'Me') {
                        return (<span class="el-tree-node__label" style="color:green"><i class={iconClass}></i> {node.data.Text}</span>)
                    } else {
                        return (<span class="el-tree-node__label" style="color:gray"><i class={iconClass}></i> {node.data.Text}</span>)
                    }
                } else {
                    return (<span class="el-tree-node__label"><i class={iconClass}></i> {node.data.Text}</span>)
                }
            }
        }
    },

    computed: {
        treeOption() {
            return { label: 'Text', children: 'Nodes' }
        }
    },

    watch: {
        keyword(val) {
            (this.$refs.designTree as any).filter(val)
        }
    },

    methods: {
        loadTree() {
            if (this.loading) { return }
            var _this = this
            this.loading = true
            $runtime.channel.invoke('sys.DesignService.LoadDesignTree', []).then(res => {
                _this.designNodes = res
                _this.loading = false
            }).catch(err => {
                _this.loading = false
                _this.$message.error(err)
            })
        },
        filterNode(value, data) {
            if (!value) return true
            return data.Text.indexOf(value) !== -1
        },

        /** 当前选择的节点改变 */
        onCurrentChanged(value, node) {
            this.currentNode = value
            store.emitEvent('CurrentNodeChanged', value)
        },

        /** 根据节点类型及标识查找节点，注意：返回的是数据项 */
        findNode(type, id) {
            var loopFind = function (nodes, type, id) {
                for (var i = 0; i < nodes.length; i++) {
                    var element = nodes[i]
                    if (element.Type === type && element.ID === id) {
                        return element
                    }
                    if (element.Nodes && element.Nodes.length > 0) {
                        var found = loopFind(element.Nodes, type, id)
                        if (found) {
                            return found
                        }
                    }
                }
                return null
            }
            return loopFind(this.designNodes, type, id)
        },

        /** 用于新建成功返回后刷新模型根节点或添加新建的节点 */
        onNewNode(nodeInfo) {
            // TODO:待重构
            // if (nodeInfo.RootNodeID) { // 否则重新刷新模型根节点，因为可能已经改变过目录结构
            //     let rootNode = this.findNode(DesignNodeType.ModelRootNode, nodeInfo.RootNodeID)
            //     this.onNodeCheckout(rootNode, true)
            // } else { // 根节点之前已签出则简单添加
            if (nodeInfo.ParentNodeType === DesignNodeType.DataStoreRootNode) { // 存储根节点
                this.designNodes[0].Nodes.push(nodeInfo.NewNode)
            } else {
                let parent = this.findNode(nodeInfo.ParentNodeType, nodeInfo.ParentNodeID)
                parent.Nodes.splice(nodeInfo.InsertIndex, 0, nodeInfo.NewNode)
            }
            // }
        },

        /** 用于服务端删除成功后刷新模型根节点或移除删除的节点 */
        onDeleteNode(node, /* String */ rootNodeID) {
            // 移除前端声明 TODO:向上查找获取路径
            if (node.Type === DesignNodeType.ServiceModelNode) {
                modelLibs.remove(node.App + '.Services.' + node.Name)
            } else if (node.Type === DesignNodeType.ViewModelNode) {
                modelLibs.remove(node.App + '.Views.' + node.Name)
            } else if (node.Type === DesignNodeType.EntityModelNode) {
                modelLibs.remove(node.App + '.Entities.' + node.Name)
            }
            // 如果自动签出了模型根节点，则刷新根节点
            if (rootNodeID) {
                let rootNode = this.findNode(DesignNodeType.ModelRootNode, rootNodeID)
                this.onNodeCheckout(rootNode, true)
            }
            // 找到待删除的节点并移除
            var loopFind = function (nodes, type, id) {
                for (var index = 0; index < nodes.length; index++) {
                    var n = nodes[index]
                    if (n.Type === type && n.ID === id) {
                        nodes.splice(index, 1)
                        return
                    }
                    if (n.Nodes && n.Nodes.length > 0) {
                        loopFind(n.Nodes, type, id)
                    }
                }
            }
            // TODO:优化查找
            loopFind(this.designNodes, node.Type, node.ID)
        },
        /** 选中node，不激活相应的设计器 */
        selectNode(data) {
            this.currentNode = data
            this.currentNodeKey = data.ID
        },
        /**
         * 用于绑定Select控件上
         * 取出设计树中的所有Entity并根据application分组
         * result为数组 然后传入
         * 绑定示例参见NewEntityMemberDialog.vue
         */
        getAllEntityNodes(result, storeId /*实体模型存储标识*/) {
            result = result || []
            this.loopGetModelNodes(this.designNodes as IDesignNode[], result as IDesignNode[],
                DesignNodeType.EntityModelNode, ModelType.Entity, true, storeId)
        },
        /** 获取所有实体存储节点，用于新建实体时选择映射的存储 */
        getAllStoreNodes() {
            var result = []
            this.designNodes[0].Nodes.forEach(node => {
                if (node.Kind === DataStoreKind.Sql || node.Kind === DataStoreKind.Cql) {
                    result.push(node)
                }
            })
            return result
        },
        /** 获取指定类型的模型节点 */
        getAllModelNodes(nodeType: DesignNodeType, modelType: ModelType): IDesignNode[] {
            let result: IDesignNode[] = [];
            this.loopGetModelNodes(this.designNodes as IDesignNode[], result, nodeType, modelType, false, null);
            return result;
        },
        /** 从树中获取指定类型的模型节点 */
        loopGetModelNodes(nodes: IDesignNode[], result: IDesignNode[],
            nodeType: DesignNodeType, modelType: ModelType, groupByApp: boolean, storeId/*实体模型存储标识*/) {
            nodes.forEach(node => {
                if (node.Type == DesignNodeType.ApplicationNode) {
                    if (groupByApp) {
                        result.push(this.shallowCloneNode(node));
                    }
                    this.loopGetModelNodes(node.Nodes, result, nodeType, modelType, groupByApp, storeId);
                } else if (node.Type == nodeType) {
                    //暂仅添加相同存储的实体模型节点
                    if (node.Type != DesignNodeType.EntityModelNode || (node as IEntityModelNode).StoreId == storeId) {
                        if (groupByApp) {
                            let group = result.find(t => t.ID == (node as IModelNode).App);
                            group.Nodes.push(this.shallowCloneNode(node));
                        } else {
                            result.push(node); //直接引用
                        }
                    }
                } else if (node.Type == DesignNodeType.ModelRootNode) {
                    if (node.Nodes && node.Nodes.length > 0) {
                        let rootNodeTargetType = parseInt(node.ID.split('-')[1]) as ModelType;
                        if (rootNodeTargetType == modelType) {
                            this.loopGetModelNodes(node.Nodes, result, nodeType, modelType, groupByApp, storeId);
                        }
                    }
                } else if (node.Nodes && node.Nodes.length > 0) { //其他包含下级的节点
                    this.loopGetModelNodes(node.Nodes, result, nodeType, modelType, groupByApp, storeId);
                }
            });
        },

        /** 复制节点数据 注意：此复制为浅复制, 子级Nodes不会复制 */
        shallowCloneNode(node): IDesignNode {
            var o = {}
            for (var key in node) {
                if (node[key] instanceof Array) {
                    o[key] = []
                } else {
                    o[key] = node[key]
                }
            }
            return o as IDesignNode
        },

        /** 重新刷新节点，主要用于签出状态变更 */
        refreshNode(node) {
            var temp = node.Text
            node.Text = ''
            node.Text = temp
        },

        /** 签出节点成功后更新状态显示 */
        onNodeCheckout(node, needUpdate /* TODO:移除此参数 */) {
            node.CheckoutBy = 'Me'
            this.refreshNode(node)
            // 判断是否签出模型根节点，是则开始刷新(目前更新所有子目录签出状态)
            if (node.Type === DesignNodeType.ModelRootNode) {
                let loopCheckout = function (tree, nodes) {
                    if (!nodes) { return }
                    for (let i = 0; i < nodes.length; i++) {
                        const element = nodes[i]
                        if (element.Type === DesignNodeType.FolderNode) {
                            element.CheckoutBy = 'Me'
                            tree.refreshNode(element)
                        }
                        loopCheckout(tree, element.Nodes)
                    }
                }
                loopCheckout(this, node.Nodes)
            }
        },

        /** 发布成功后更新所有签出节点的状态显示 */
        onPublish() {
            let _this = this
            function loopCheckin(node) {
                if (node.CheckoutBy === 'Me') {
                    delete node['CheckoutBy']
                    _this.refreshNode(node)
                }
                if (node.Nodes && node.Nodes.length > 0) {
                    for (var i = 0; i < node.Nodes.length; i++) {
                        var child = node.Nodes[i]
                        loopCheckin(child)
                    }
                }
            }
            for (var i = 0; i < this.designNodes.length; i++) {
                loopCheckin(this.designNodes[i])
            }
        },

        // ====以下drag drop处理====
        getParentNodeByType(node, nodeType) { // 用于往上查找指定类型的节点
            if (node.parent) {
                if (node.parent.data.Type === nodeType) {
                    return node.parent
                } else {
                    return this.getParentNodeByType(node.parent, nodeType)
                }
            } else {
                return null
            }
        },
        allowDrag(node) { // 用于判断节点是否可拖动
            let nodeType = node.data.Type
            if (nodeType === DesignNodeType.FolderNode) { // FolderNode判断模型根节点是否签出
                if(node.data.CheckoutBy !== 'Me') { return false }
            } else if (nodeType >= DesignNodeType.EntityModelNode 
                && nodeType <= DesignNodeType.ReportModelNode) { // 模型节点判断当前节点及模型根节点是否签出
                if (node.data.CheckoutBy !== 'Me') {
                    return false
                } else {
                    let rootNode = this.getParentNodeByType(node, DesignNodeType.ModelRootNode)
                    if (!rootNode || rootNode.data.CheckoutBy !== 'Me') {
                        return false
                    }
                }
            } else { // 暂不支持其他类型节点拖动
                return false
            }
            return true
        },
        allowDrop(dragNode, dropNode, type) { // 用于判断是否允许drop
            let snode = dragNode.data
            let tnode = dropNode.data
            if (snode.Type === DesignNodeType.FolderNode) { // 源为FolderNode
                if (tnode.Type !== DesignNodeType.FolderNode && tnode.Type !== DesignNodeType.ModelRootNode) { // 目标为模型节点
                    return false
                } else if (type !== 'inner') { // 暂不支持排序
                    return false
                }
            } else { // 源为ModelNode
                if (tnode.Type === DesignNodeType.FolderNode || tnode.Type === DesignNodeType.ModelRootNode) { // 目标为Folder或ModelRoot
                    if (type !== 'inner') { return false }
                    let targetAppNode = this.getParentNodeByType(dropNode, DesignNodeType.ApplicationNode)
                    if (targetAppNode.data.ID !== snode.App) {
                        return false
                    }
                } else {
                    return false
                }
            }
            return true
        },
        onDrop(dragNode, dropNode, type, ev) {
            let source = dragNode.data
            let target = dropNode.data
            let args = [source.Type, source.ID, target.Type, target.ID, type]
            let _this = this
            $runtime.channel.invoke('sys.DesignService.DragDropNode', args).catch(err => {
                // TODO:失败回滚
                _this.$message.error(err)
            })
        }
    },

    mounted() {
        store.tree = this
        this.loadTree()
        // 订阅事件
        store.onEvent('NodeCheckout', this.onNodeCheckout)
        store.onEvent('Publish', this.onPublish)
    },

    destroyed() {
        store.offEvent('NodeCheckout', this.onNodeCheckout)
        store.offEvent('Publish', this.onPublish)
    }
})
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

.tree-pane {
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

.tree-pane >>> .el-tree {
    background: none;
    border: none;
}

.tree-pane >>> .el-tree-node__content {
    background-color: #f3f3f3;
}

.tree-pane
    >>> .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: #b3b3b3;
}

.tree-pane >>> .el-tree-node__content:hover {
    background-color: #e3e3e3;
}
</style>