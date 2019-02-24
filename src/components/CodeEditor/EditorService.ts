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

export { monaco, ts }