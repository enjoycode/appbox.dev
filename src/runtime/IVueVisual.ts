export interface IVueLayoutItem {
    /** 组件名称 eg: Input */
    n: string;
    /** v-text */
    t?: string;
    /** v-model */
    m?: string;
    /** 组件Props eg: {size: 'mini'} */
    p: object;
    /** 组件绑定的Props eg: {data:':data'} */
    b?: object;
    /** 设计时事件定义 eg: {click: {IVueEventAction}} */
    e?: object;
    /** 运行时生成的事件处理器，用于v-on绑定 eg: {click: function(){...}} */
    a?: object;
    /** 运行时动态加载的Vue组件 */
    c?: any;
}

/** 运行时的布局项 */
export interface IVueGridLayoutItem extends IVueLayoutItem {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
}

/** 设计时的视图状态项 */
export interface IVueState {
    readonly Name: string;
    readonly Type: string;
    readonly Value: any;
}

type EventAction = 'LoadData' | 'PostData' | 'RunScript';

export interface IVueEventAction {
    /** 操作类型, eg: LoadData */
    readonly Type: EventAction;
}

export interface IVueLoadDataAction extends IVueEventAction {
    State: string;
    Service: string;
    ServiceArgs: any[]; //eg: [{Name:'arg1', Type:'string', Value:'"rick"'}], Value为表达式
}
