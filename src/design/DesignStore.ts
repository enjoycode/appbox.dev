import Vue from 'vue';

type EventId = 'NodeCheckout' | 'CurrentNodeChanged' | 'SettingsChanged' | 'DesignerChanged' | 'Publish'

/** 用于设计时全局状态与事件管理 */
export default class DesignStore { //TODO: rename to DesignContext?
    private static readonly eventBus = new Vue();

    static router: any = null;      // 指向路由，仅方便使用
    static ide: any = null;         // 指向AppStudio实例
    static tree: any = null;        // 指向DesignTreeView实例
    static designers: any = null;   // 指向DesignerPads实例
    static toolBoxTree: any = null; // 指向ToolBoxTree实例
    static errors: any = null;      // 指向ErrorsView实例
    static usages: any = null;      // 指向UsagesView实例

    static emitEvent(eventId: EventId, arg1?: any, arg2?: any, arg3?: any): void {
        DesignStore.eventBus.$emit(eventId, arg1, arg2, arg3);
    }

    static onEvent(eventId: EventId, callback: any): void {
        DesignStore.eventBus.$on(eventId, callback);
    }

    static offEvent(eventId: EventId, callback: any) {
        DesignStore.eventBus.$off(eventId, callback);
    }
}
