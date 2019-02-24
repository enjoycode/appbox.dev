import CompletionItemProvider from './CompletionItemProvider'
import DocumentFormattingProvider from './DocumentFormattingProvider'
import HoverProvider from './HoverProvider'

export default function (monaco) {
    monaco.languages.registerCompletionItemProvider('csharp', CompletionItemProvider)
    monaco.languages.registerDocumentFormattingEditProvider('csharp', DocumentFormattingProvider)
    monaco.languages.registerHoverProvider('csharp', HoverProvider)

    // todo:暂用monarch语法着色器，等同于/vs/basic-languages/src/csharp.js
    // monaco.languages.setMonarchTokensProvider('csharp', CSharpSyntax)
}