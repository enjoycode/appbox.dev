import {IVueComponent} from '@/components/Designers/View/VueToolbox';

export default interface ILayoutItem {
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
    b?: string;
    /** 组件Props */
    p: any;
    /** 对应的工具箱组件定义 */
    c?: IVueComponent;
}
