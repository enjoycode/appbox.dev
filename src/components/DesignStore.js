// 用于设计时全局状态与事件管理

import Vue from 'vue'

let eventBus = new Vue()

export default {
    channel: null, // 指向通道，仅方便使用
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
    }
}
