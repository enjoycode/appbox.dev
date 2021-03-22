export interface IVueEvent {
    /** 事件名称 eg: click */
    n: string;
    /** 事件代码 */
    c: string;
}

/** 运行时的布局项 */
export interface IVueLayoutItem {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    /** 组件名称 eg: Input */
    n: string;
    /** v-text */
    t?: string;
    /** v-model */
    m?: string;
    /** 组件Props eg: {size: 'mini'} */
    p: object;
    /** 设计时事件处理定义 eg:[{n: 'click', c:'脚本代码' }] */
    e?: IVueEvent[];
    /** 运行时生成的事件处理器，用于v-on绑定 eg: {click: function()} */
    a?: object;
    /** 运行时动态加载的Vue组件 */
    c?: any;
}
