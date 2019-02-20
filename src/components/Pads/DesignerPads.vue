<template>
    <div class="designerPads">
        <e-tabs ref="tabs" v-model="currentTab" @tab-click="tabClick" closable type="card" @tab-remove="removeTab">
            <e-tab-pane :key="item.name" v-for="(item, index) in openedTabs" :label="item.title" :name="item.name">
                <component class="clearfix" :is="item.designer" :target="item.target"></component>
            </e-tab-pane>
        </e-tabs>
    </div>
</template>

<script>
    import Welcome from '../Designers/Welcome'
    import BlobDesigner from '../Designers/DataStore/BlobStore/BlobDesigner'
    import ServiceDesigner from '../Designers/Service/ServiceDesigner'
    import EntityDesigner from '../Designers/Entity/EntityDesigner'
    import EnumDesigner from '../Designers/Enum/EnumDesigner'
    import ViewDesigner from '../Designers/View/ViewDesigner'
    import WorkflowDesigner from '../Designers/Workflow/WorkflowDesigner'
    import ReportDesigner from '../Designers/Report/ReportDesigner'
    import ResourcePads from '../Designers/Resource/ResourcePads'
    import store from '../DesignStore'
    import DesignNodeType from '../../enums/DesignNodeType'

    export default {
        components: {
            ServiceDesigner: ServiceDesigner,
            EntityDesigner: EntityDesigner,
            EnumDesigner: EnumDesigner,
            ViewDesigner: ViewDesigner
        },
        data() {
            return {
                currentTab: 'Welcome',
                openedTabs: [
                    {
                        title: 'Welcome',
                        name: 'Welcome',
                        target: null, // 目标设计节点， 可能为null
                        designer: Welcome
                    }
                ]
            }
        },

        methods: {
            // 注意： targetName = nodeData.ID + '-' + nodeData.Type
            removeTab(targetName) {
                let tabs = this.openedTabs
                let activeName = this.currentTab
                var targetNode = null
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1]
                            if (nextTab) {
                                activeName = nextTab.name
                            }
                            targetNode = tab.target
                        }
                    })
                }

                // 发送关闭请求至服务端
                if (targetNode) {
                    this.$channel.invoke('sys.DesignService.CloseDesigner', [targetNode.Type, targetNode.ID])
                }

                this.currentTab = activeName
                this.openedTabs = tabs.filter(tab => tab.name !== targetName)
            },
            removeTabByNode(node) {
                this.removeTab(node.ID + '-' + node.Type)
            },
            onCurrentNodeChanged(node) {
                var key = node.ID + '-' + node.Type
                if (node.Type === 5) {
                    key = node.AppID + '.' + node.ID + '-' + node.Type
                }
                // 检查是否已打开
                for (var index = 0; index < this.openedTabs.length; index++) {
                    if (this.openedTabs[index].name === key) {
                        this.currentTab = key
                        return
                    }
                }
                // 没有则新建tab
                var tab = {
                    title: node.App + '.' + node.Name,
                    name: key,
                    target: node,
                    designer: null
                }
                switch (node.Type) {
                    case DesignNodeType.ResourcesNode: tab.designer = ResourcePads; break
                    case DesignNodeType.ServiceModelNode: tab.designer = ServiceDesigner; break
                    case DesignNodeType.EntityModelNode: tab.designer = EntityDesigner; break
                    case DesignNodeType.ViewModelNode: tab.designer = ViewDesigner; break
                    case DesignNodeType.EnumModelNode: tab.designer = EnumDesigner; break
                    case DesignNodeType.WorkflowModelNode: tab.designer = WorkflowDesigner; break
                    case DesignNodeType.ReportModelNode: tab.designer = ReportDesigner; break
                    case DesignNodeType.BlobStoreNode: tab.designer = BlobDesigner; break
                    default: return
                }

                this.openedTabs.push(tab)
                this.currentTab = tab.name
            },
            tabClick(tab) {
                let val = tab.$children[0].target
                if (val) {
                    var key = val.ID + '-' + val.Type
                    for (var index = 0; index < this.openedTabs.length; index++) {
                        if (this.openedTabs[index].name === key) {
                            this.currentTab = key
                            this.$emit('currentTabChanged', val)
                            return
                        }
                    }
                } else { // Welcome tab
                    this.currentTab = 'Welcome'
                }
            },
            /** 获取当前的设计器实例，注意：不用计算属性实现 */
            getActiveDesigner() {
                if (this.currentTab === 'Welcome') {
                    return null
                }
                let children = this.$refs.tabs.$children
                for (var i = 0; i < children.length; i++) {
                    var element = children[i]
                    if (element.name && element.name === this.currentTab) {
                        return element.$children[0] // 注意返回子级，因为当前是TabPane实例
                    }
                }
                return null
            },
            /** 节点签出后根据是否需要重新加载刷新已打开的设计器内容 */
            onNodeCheckout(node, needUpdate) {
                if (node.Type >= 20 || node.Type === 2) { // 模型节点或存储节点
                    // 找到已打开的对应的设计器，通知其重新加载模型
                    let children = this.$refs.tabs.$children
                    for (var i = 0; i < children.length; i++) {
                        let designer = children[i].$children[0] // 注意返回子级，因为当前是TabPane实例
                        if (designer && designer.target && designer.target.Type === node.Type && designer.target.ID === node.ID) {
                            if (designer.onCheckout) {
                                designer.onCheckout(needUpdate)
                            }
                            break
                        }
                    }
                }
            },
            onPublish() {
                let children = this.$refs.tabs.$children
                for (var i = 0; i < children.length; i++) {
                    let designer = children[i].$children[0] // 注意返回子级，因为当前是TabPane实例
                    if (designer && designer.target && !designer.readOnly) {
                        designer.readOnly = true
                    }
                }
            },
            /** 刷新所有打开的设计器的内容，主要用于后端改变模型后（如重命名）后通知前端刷新 */
            refreshDesigners(updates) {
                let children = this.$refs.tabs.$children
                for (var i = 0; i < children.length; i++) {
                    let designer = children[i].$children[0] // 注意返回子级，因为当前是TabPane实例
                    if (designer && designer.target) {
                        for (let j = 0; j < updates.length; j++) {
                            if (designer.target.ID + '-' + designer.target.ModelType === updates[j]) {
                                designer.refresh()
                                break
                            }
                        }
                    }
                }
            }
        },
        mounted() {
            store.designers = this
            store.onEvent('CurrentNodeChanged', this.onCurrentNodeChanged) // 侦听DesignTreeView当前节点改变
            store.onEvent('NodeCheckout', this.onNodeCheckout)
            store.onEvent('Publish', this.onPublish)
        },
        destroyed() {
            store.offEvent('CurrentNodeChanged', this.onCurrentNodeChanged)
            store.offEvent('NodeCheckout', this.onNodeCheckout)
            store.offEvent('Publish', this.onPublish)
        }
    }

</script>

<style>
    .designerPads {
        height: 100%;
    }

    .designerPads>.el-tabs {
        height: 100%
    }

    .designerPads>.el-tabs>.el-tabs__content {
        height: calc(100% - 35px);
    }

    .designerPads>.el-tabs>.el-tabs__content>.el-tab-pane {
        height: 100%;
    }

    .designerPads>.el-tabs>.el-tabs__header {
        margin: 0px;
    }

    .designerPads>.el-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll {
        background-color: #f3f3f3;
    }

    .designerPads>.el-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__item {
        background-color: #ececec;
        border-color: #f3f3f3;
        border-bottom-color: transparent;
        height: 34px;
        line-height: 34px;
        color: #969696;
    }

    .designerPads>.el-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__item.is-active {
        background-color: #ffffff;
        border-color: #f3f3f3;
        border-bottom-color: transparent;
        color: #424242;
    }
</style>