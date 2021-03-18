import {IVueLayoutItem} from '@/runtime/IVueVisual';

export interface IVueProp {
    readonly Name: string;
    readonly Type: string;
    readonly Default?: any;         //默认值
    readonly Editor?: string        //属性编辑器
    readonly EditorOptions?: any;   //属性编辑器选项
}

export interface IVueEvent {
    readonly Name: string;
}

export interface IVueState {
    readonly Name: string;
    readonly Type: string;
    readonly Value: any;
}

export interface IVueWidget {
    readonly Name: string;          //工具箱的显示名称
    readonly Icon: string;          //工具箱显示图标
    readonly Component: string;     //全局组件名称: eg: ElInput或者自定义名称 eg:sys.Views.Dashboard
    readonly VModel?: string;       //v-model, 保存的为类型 eg:string
    readonly VText?: string;        //Button类组件的v-text
    readonly DWidth: number;        //默认宽度，单位:网格
    readonly DHeight: number;       //默认高度，单位:网格
    readonly Style?: object;        //默认样式，如Button默认宽100%
    readonly Props?: IVueProp[];
    readonly Events?: IVueEvent[];
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

export function BuildActionScript(action: IVueEventAction): string {
    if (action.Type == 'LoadData') {
        let loadData: IVueLoadDataAction = <IVueLoadDataAction> action;
        let s = '$runtime.channel.invoke("' + loadData.Service + '",[';
        let needSep = false;
        for (const arg of loadData.ServiceArgs) {
            if (needSep) {
                s += ',';
            } else {
                needSep = true;
            }
            s += arg.Value;
        }
        s += ']).then(res=>s.' + loadData.State + '=res)';
        s += '.catch(err=>alert(err))';
        return s;
    } else {
        //TODO:
        return '';
    }
}

/** 设计时的布局项 */
export interface IDesignLayoutItem extends IVueLayoutItem {
    /** 对应的工具箱Widget定义 */
    Widget?: IVueWidget;
    /** 设计时事件定义 eg: {click: {IVueEventAction}} */
    Events?: object;
}
