// https://microsoft.github.io/monaco-editor/

// 注意: How to hack monaco & typescript service，目前ts版本3.7.5
//1. 修改monaco-editor/esm/vs/language/typescript/lib/typescriptServices.js最后加export default ts;
//2. 同时修改typescriptServices.d.ts（从node_modules/typescript复制）
// declare module "monaco-editor/esm/vs/language/typescript/lib/typescriptServices" {
//    export = ts
//}

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api' //自定languages不能import * as monaco from 'monaco-editor'
// import * as monaco from 'monaco-editor'
import ts from 'monaco-editor/esm/vs/language/typescript/lib/typescriptServices'
import { Docomment } from './CSharpFeatures/Docomment/Docomment'
import TextMateTheme from './TextMateTheme'
import CSharpFeatures from './CSharpFeatures'
import TypeScriptFeatures from './TypeScriptFeatures'
import { IModelNode, IDesignNode } from '@/design/IDesignNode'
import store from '@/design/DesignStore'
import DesignNodeType from '@/design/DesignNodeType'
import ModelType from '@/design/ModelType'
import { loadWASM } from 'onigasm'
import { Registry, StackElement, INITIAL } from 'monaco-textmate'

init();

/** 初始化代码编辑服务 */
async function init() {
    // 初始化Textmate
    try {
        await loadWASM('/dev/onigasm.wasm');
    } catch { //防止开发时热加载
        // return
    }
    const registry = new Registry({
        getGrammarDefinition: async (scopeName) => {
            return {
                format: 'json',
                content: await (await fetch('/dev/csharp.tmLanguage.json')).text()
            }
        }
    });
    // 先注册csharp language，因为自定义monaco webpack plugin没有加载默认csharp
    monaco.languages.register({ id: 'csharp' });
    // map of monaco "language id's" to TextMate scopeNames
    const grammars = new Map();
    grammars.set('csharp', 'source.cs');
    await wireTmGrammars(registry, grammars);

    // Docomment hook
    monaco.editor.onDidCreateEditor(editor => {
        Docomment.Hook(editor);
    });
    // 注册Theme
    TextMateTheme(monaco);
    // 初始化CS功能
    CSharpFeatures(monaco);
    // 初始化TS功能
    TypeScriptFeatures(monaco);
}

class TokenizerState implements monaco.languages.IState {

    constructor(
        private _ruleStack: StackElement
    ) { }

    public get ruleStack(): StackElement {
        return this._ruleStack
    }

    public clone(): TokenizerState {
        return new TokenizerState(this._ruleStack);
    }

    public equals(other: monaco.languages.IState): boolean {
        if (!other ||
            !(other instanceof TokenizerState) ||
            other !== this ||
            other._ruleStack !== this._ruleStack
        ) {
            return false;
        }
        return true;
    }
}

function wireTmGrammars(registry: Registry, languages: Map<string, string>) {
    return Promise.all(
        Array.from(languages.keys())
            .map(async (languageId) => {
                const grammar = await registry.loadGrammar(languages.get(languageId))
                monaco.languages.setTokensProvider(languageId, {
                    getInitialState: () => new TokenizerState(INITIAL),
                    tokenize: (line: string, state: TokenizerState) => {
                        // console.log('csharp tokenize: ' + line)
                        const res = grammar.tokenizeLine(line, state.ruleStack)
                        // console.log('tokenize res: ', res)
                        return {
                            endState: new TokenizerState(res.ruleStack),
                            tokens: res.tokens.map(token => ({
                                ...token,
                                // TODO: At the moment, monaco-editor doesn't seem to accept array of scopes
                                scopes: token.scopes[token.scopes.length - 1]
                            })),
                        }
                    }
                })
            })
    )
}

//TODO: 以下ModelLib相关移至单独文件

interface ModelDeclare {
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

        // monaco.languages.typescript.javascriptDefaults.addExtraLib('declare namespace sys {const a: string;}', 'a.d.ts');
        //异步加载所有实体模型的声明
        this.loadAll(ModelType.Entity);
        //异步加载所有服务模型的声明
        this.loadAll(ModelType.Service);
        //同步生成视图模型声明
        let viewNodes = store.tree.getAllModelNodes(DesignNodeType.ViewModelNode, ModelType.View) as IDesignNode[];
        viewNodes.forEach(n => {
            this.addView(n as IModelNode);
        });
    }

    private getDeclareService(type: ModelType): string {
        if (type == ModelType.Service) {
            return "sys.DesignService.GenServiceDeclare";
        } else if (type == ModelType.Entity) {
            return "sys.DesignService.GenEntityDeclare";
        } else {
            throw "NotImpl";
        }
    }

    /** 仅用于初始加载 */
    private loadAll(type: ModelType) {
        let service = this.getDeclareService(type);
        $runtime.channel.invoke(service, [null]).then(res => {
            let declares = res as ModelDeclare[];
            let ls = monaco.languages.typescript.javascriptDefaults;
            declares.forEach(d => {
                let t = ls.addExtraLib(d.Declare, d.Name + '.d.ts');
                this.libs.push(new ModelLib(d.Name, t));
            });
        }).catch(err => {
            console.log("加载模型声明错误: " + err); // TODO: show to IDE output pad.
        });
    }

    /** 用于初次加载或新建完视图模型生成相应的声明 */
    addView(viewNode: IModelNode) {
        // TODO:考虑ViewDesigner编译生成,然后保存至ViewModel
        let ls = monaco.languages.typescript.javascriptDefaults;
        let name = `${viewNode.App}.Views.${viewNode.Name}`;
        let declare = `declare namespace ${viewNode.App}.Views{const ${viewNode.Name}:Promise<Component>;}`;
        let t = ls.addExtraLib(declare, `${name}.d.ts`);
        this.libs.push(new ModelLib(name, t));
    }

    /**
     * 用于保存实体或服务服务模型后更新声明
     * @param modelId 实体或服务模型标识
     */
    update(type: ModelType, modelId: string) {
        var service = this.getDeclareService(type);
        $runtime.channel.invoke(service, [modelId]).then(res => {
            let declare = res[0] as ModelDeclare;
            let ls = monaco.languages.typescript.javascriptDefaults;
            // 先移除旧的
            let index = this.libs.findIndex(t => t.name == declare.Name);
            if (index >= 0) {
                this.libs[index].target.dispose();
                this.libs.splice(0, 1);
            }
            // 再重新加入
            let t = ls.addExtraLib(declare.Declare, declare.Name + '.d.ts');
            this.libs.push(new ModelLib(declare.Name, t));
        }).catch(err => {
            console.log("更新模型声明错误: " + err); // TODO: show to IDE output pad.
        });
    }

}

let modelLibs = new ModelLibManager();

export { monaco, ts }
export { modelLibs }