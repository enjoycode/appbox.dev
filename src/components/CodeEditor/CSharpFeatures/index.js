import CompletionItemProvider from './CompletionItemProvider'
import DocumentFormattingProvider from './DocumentFormattingProvider'
import HoverProvider from './HoverProvider'

export default function () {
    window.monaco.languages.registerCompletionItemProvider('csharp', CompletionItemProvider)
    window.monaco.languages.registerDocumentFormattingEditProvider('csharp', DocumentFormattingProvider)
    window.monaco.languages.registerHoverProvider('csharp', HoverProvider)

    // todo:暂用monarch语法着色器，等同于/vs/basic-languages/src/csharp.js
    // window.monaco.languages.setMonarchTokensProvider('csharp', CSharpSyntax)
}