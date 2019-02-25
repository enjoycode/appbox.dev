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
// import DesignStore from '@/components/DesignStore'

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

        var t = monaco.languages.typescript.javascriptDefaults.addExtraLib(this.testGenServiceCode(), 'sys.Services.HelloService.d.ts');
        this.libs.push(new ModelLib('sys.Services.HelloService', t));
    }

    testGenServiceCode(): string {
        return 'declare namespace sys.Services.HelloService { function sayHello(): string; }'
    }

}

let extraLibs = new ExtraLibs();

export { monaco, ts }
export { extraLibs }