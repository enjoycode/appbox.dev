// https://microsoft.github.io/monaco-editor/
// 注意: 修改monaco-editor/esm/vs/language/typescript/lib/typescriptServices.js最后加export default ts;
// 同时修改typescriptServices.d.ts
// declare module "monaco-editor/esm/vs/language/typescript/lib/typescriptServices" {
//    export = ts
//}

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api' //自定languages不能import * as monaco from 'monaco-editor'
import ts from 'monaco-editor/esm/vs/language/typescript/lib/typescriptServices'
import CSharpFeatures from './CSharpFeatures'
import TypeScriptFeatures from './TypeScriptFeatures'
import DesignStore from '@/components/DesignStore'

CSharpFeatures(monaco)
TypeScriptFeatures(monaco)

class ModelLib {
    readonly name: string;
    readonly target: monaco.IDisposable;

    constructor(name: string, target: monaco.IDisposable) {
        this.name = name;
        this.target = target;
    }
}

class ExtraLibs {
    private hasLoad: boolean; // 是否已经加载过
    private libs: ModelLib[] = [];

    /**
     * 如果没有则生成虚拟代码（从服务端设计时加载服务模型的虚拟代码）
     */
    ensureLoad() {
        if (this.hasLoad) {
            return;
        }
        this.hasLoad = true;

        var ls = monaco.languages.typescript.javascriptDefaults;

        //异步加载所有服务模型的声明
        DesignStore.channel.invoke("sys.DesignService.GenTSDeclare", [null]).then(res => {
            for (let i = 0; i < res.length; i++) {
                const element = res[i];
                var t = ls.addExtraLib(element.Declare, element.Name + '.d.ts');
                this.libs.push(new ModelLib(element.Name, t));
            }
        }).catch(err => {
            console.log("加载服务声明错误: " + err); // TODO: show to IDE output pad.
        });

        //同步生成实体、枚举、视图模型声明
    }

}

let extraLibs = new ExtraLibs();

export { monaco, ts }
export { extraLibs }