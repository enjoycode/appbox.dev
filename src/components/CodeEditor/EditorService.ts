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

CSharpFeatures(monaco)
TypeScriptFeatures(monaco)

interface ServiceDeclare {
    Name: string;
    Declare: string;
}

class ModelLib {
    readonly name: string;
    readonly target: monaco.IDisposable;

    constructor(name: string, target: monaco.IDisposable) {
        this.name = name;
        this.target = target;
    }
}

class ModelLibManager {
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

        //异步加载所有服务模型的声明
        var ls = monaco.languages.typescript.javascriptDefaults;
        $runtime.channel.invoke("sys.DesignService.GenServiceDeclare", [null]).then(res => {
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

    /**
     * 用于保存服务模型后更新声明
     * @param serviceModelId 服务模型标识
     */
    updateService(serviceModelId: string) {
        $runtime.channel.invoke("sys.DesignService.GenServiceDeclare", [serviceModelId]).then(res => {
            var element = res[0] as ServiceDeclare;
            var ls = monaco.languages.typescript.javascriptDefaults;
            // 先移除旧的
            let index = this.libs.findIndex(t => t.name == element.Name);
            if (index >= 0) {
                this.libs[index].target.dispose();
                this.libs.splice(0, 1);
            }
            // 再重新加入
            var t = ls.addExtraLib(element.Declare, element.Name + '.d.ts');
            this.libs.push(new ModelLib(element.Name, t));
        }).catch(err => {
            console.log("更新服务声明错误: " + err); // TODO: show to IDE output pad.
        });
    }

    private GenViewDeclare() {
        
    }

}

let modelLibs = new ModelLibManager();

export { monaco, ts }
export { modelLibs }