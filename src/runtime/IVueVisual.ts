export interface IVueLayoutItem {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    /** 组件名称 eg: Textbox */
    n: string;
    /** v-text */
    t?: string;
    /** v-model */
    m?: string;
    /** 组件Props */
    p: any;
}

export interface IVueVisual {
    /** 状态 */
    readonly s: object;
    /** 布局 */
    readonly l: IVueLayoutItem[];
}
