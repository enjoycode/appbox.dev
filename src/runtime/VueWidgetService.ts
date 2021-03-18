import {IVueLayoutItem} from '@/runtime/IVueVisual';

export function BuildEventHandler(item: IVueLayoutItem, state: any, runtime: any): void {
    if (!item.e || item.e.length === 0) {
        return;
    }

    let handlers = {};
    for (const e of item.e) {
        let f = new Function('s', '$runtime', 'e', e.c);
        handlers[e.n] = (v) => f(state, runtime, v);
    }
    console.log('生成事件处理器: ' + item.i + ' ' + item.n, handlers);
    item.a = handlers;
}
