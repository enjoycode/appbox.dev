// 用于设计时全局状态与事件管理
// TODO: rename to DesignContext

import Vue from 'vue'
import DesignNodeType from './DesignNodeType'

let eventBus = new Vue()

export default {
    router: null, // 指向路由，仅方便使用
    ide: null, // 指向AppStudio实例
    tree: null, // 指向DesignTreeView实例
    designers: null, // 指向DesignerPads实例
    toolBoxTree: null, // 指向ToolBoxTree实例
    errors: null, // 指向ErrorsView实例
    usages: null, // 指向UsagesView实例

    emitEvent(eventId, arg1, arg2, arg3) {
        eventBus.$emit(eventId, arg1, arg2, arg3)
    },
    onEvent(eventId, callback) {
        eventBus.$on(eventId, callback)
    },
    offEvent(eventId, callback) {
        eventBus.$off(eventId, callback)
    },

    /** 根据名称(eg: sys.Order)找到相应的ID(eg:"12321324242")，找不到报错 */ //TODO:暂放在这里
    getEntityIdByName(appName, entityModelName) {
        var loopFind = function (nodes) {
            for (var i = 0; i < nodes.length; i++) {
                var element = nodes[i]
                if (element.Type === DesignNodeType.EntityModelNode && element.Name === entityModelName) {
                    return element
                }
                if (element.Nodes && element.Nodes.length > 0) {
                    var found = loopFind(element.Nodes)
                    if (found) {
                        return found
                    }
                }
            }
            return null
        }

        let apps = this.tree.designNodes[1].Nodes
        let app = apps.find(t => t.Text === appName)
        let entities = app.Nodes[0];
        return loopFind(entities.Nodes).ID
    }

}
