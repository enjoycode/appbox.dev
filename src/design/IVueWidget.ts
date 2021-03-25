import {IVueGridLayoutItem} from '@/runtime/IVueVisual';

/** 仅用于工具箱定义 */
export interface IVueProp {
    readonly Name: string;
    readonly Type: string;
    readonly Default?: any;         //默认值
    readonly Editor?: string        //属性编辑器
    readonly EditorOptions?: any;   //属性编辑器选项
    e?: any;                        //运行时编辑器,不用序列化
}

/** 仅用于工具箱定义 */
export interface IVueEvent {
    readonly Name: string;
}

/** 仅用于工具箱定义 */
export interface IVueWidget {
    readonly Name: string;          //工具箱的显示名称
    readonly Icon: string;          //工具箱显示图标
    readonly Component: string;     //全局组件名称: eg: ElInput或者自定义名称 eg:sys.Views.Dashboard
    readonly Model?: string;       //v-model, 保存的为类型 eg:string
    readonly Text?: string;        //Button类组件的v-text
    readonly Width: number;        //默认宽度，单位:网格
    readonly Height: number;       //默认高度，单位:网格
    readonly Style?: object;        //默认样式，如Button默认宽100%
    readonly Props?: IVueProp[];
    readonly Events?: IVueEvent[];
}

/** 设计时的布局项 */
export interface IDesignLayoutItem extends IVueGridLayoutItem {
    /** 对应的工具箱Widget定义 */
    Widget?: IVueWidget;
}
