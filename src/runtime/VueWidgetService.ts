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
            //TODO:
        }
    }
    return rs;
}

/** 生成所有的事件处理及绑定的Props */
export function BuildEventsAndBindProps(vm: any, items: IVueLayoutItem[], state: object): void {
    for (const item of items) {
        if (item.e) {
            let handlers = {};
            for (const prop in item.e) {
                if (!item.e.hasOwnProperty(prop)) {
                    continue;
                }
                const action: IVueEventAction = item.e[prop];
                if (action.Type == 'LoadData') {
                    buildLoadDataAction(<IVueLoadDataAction> action, prop, handlers, vm, state);
                } else {
                    //TODO:
                }
            }
            item.a = handlers;
        }

        if (item.b) {
            for (const prop in item.b) {
                if (!item.b.hasOwnProperty(prop)) {
                    continue;
                }
                vm.$watch('runState.' + item.b[prop].substring(1), (newVal, oldVal) => {
                    vm.$set(item.p, prop, newVal);
                });
            }
        }
    }
}

function buildLoadDataAction(action: IVueLoadDataAction, prop: string, handlers: object, vm: any, state: object): void {
    if (action.ServiceArgs && action.ServiceArgs.length > 0) {
        //TODO:无参数的服务调用及特殊Action可以不用生成代码
        let script = buildLoadDataScript(action);
        let f = new Function('s', '$runtime', 'e', script);
        handlers[prop] = v => f(state, $runtime, v);
    } else {
        handlers[prop] = v => {
            $runtime.channel.invoke(action.Service, []).then(res => {
                state[action.State] = res;
                // vm.$set(state, action.State, res);
            }).catch(err => alert(err));
        };
    }
}

function buildLoadDataScript(action: IVueLoadDataAction): string {
    let s = '$runtime.channel.invoke("' + action.Service + '",[';
    let needSep = false;
    for (const arg of action.ServiceArgs) {
        if (needSep) {
            s += ',';
        } else {
            needSep = true;
        }
        s += arg.Value;
    }
    s += ']).then(res=>s.' + action.State + '=res)';
    s += '.catch(err=>alert(err))';
    return s;
}
