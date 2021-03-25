import {IVueEventAction, IVueLayoutItem, IVueLoadDataAction, IVueState} from '@/runtime/IVueVisual';

/** 生成运行时视图状态 */
export function BuildRunState(state: IVueState[]): object {
    let rs = {};
    for (const s of state) {
        //先都设为默认值
        let defaultValue: any = null;
        if (s.Type.endsWith('[]')) {
            defaultValue = [];
        } else if (s.Type == 'string') {
            defaultValue = '';
        } else if (s.Type == 'number') {
            defaultValue = 0;
        } else if (s.Type == 'date') {
            defaultValue = new Date();
        }
        rs[s.Name] = defaultValue;

        if (s.Value) { //有值设置，则转换为函数

        }
    }
    return rs;
}

/** 生成所有的事件处理 */
export function BuildEventHandler(items: IVueLayoutItem[], state: object): void {
    for (const item of items) {
        if (item.e) {
            let handlers = {};
            for (const prop in item.e) {
                if (item.e.hasOwnProperty(prop)) {
                    //TODO:无参数的服务调用及特殊Action可以不用生成代码
                    let script = BuildActionScript(item.e[prop]);
                    let f = new Function('s', '$runtime', 'e', script);
                    handlers[prop] = (v) => f(state, $runtime, v);
                }
            }
            item.a = handlers;
        }
    }
}

function BuildActionScript(action: IVueEventAction): string {
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
