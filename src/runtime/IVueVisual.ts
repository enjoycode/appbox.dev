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

/** 基于Grid的布局项 */
export interface IVueGridLayoutItem extends IVueLayoutItem {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
}

/** 设计时的视图状态项 */
export interface IVueState {
    Name: string;
    Type: string;
    /**设置状态值的操作，eg: 调用服务后设置状态值 */
    Value: IVueEventAction;
}

/** 运行时的视图状态 */
export class RuntimeVueState {
    // [index: string]: any;
    /** 处理好的设置状态值的行为 eg: {data: function(){...}} */
    private _valueActions: object | null = null;

    public get ValueActions(): object {
        if (!this._valueActions) {
            this._valueActions = {};
        }
        return this._valueActions;
    }

    /** 刷新运行时状态 */
    public Refresh(): void {
        if (this._valueActions) {
            for (const prop in this._valueActions) {
                if (!this._valueActions.hasOwnProperty(prop)) {
                    continue;
                }
                this._valueActions[prop]();
            }
        }
    }
}

export type EventAction = 'LoadData' | 'PostData' | 'RunScript';

export interface IVueEventAction {
    /** 操作类型, eg: LoadData */
    readonly Type: EventAction;
}

export interface IVueLoadDataAction extends IVueEventAction {
    /** 状态目标 eg: State = LoadService() */
    State: string;
    Service: string;
    ServiceArgs: any[]; //eg: [{Name:'arg1', Type:'string', Value:'"rick"'}], Value为表达式
}
