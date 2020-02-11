import SnippetCompletionProvider from './SnippetCompletionProvider'
import CompletionItemProvider from './CompletionItemProvider'
import DocumentFormattingProvider from './DocumentFormattingProvider'
import HoverProvider from './HoverProvider'

export default function (monaco) {
    monaco.languages.registerCompletionItemProvider('csharp', SnippetCompletionProvider)
    monaco.languages.registerCompletionItemProvider('csharp', CompletionItemProvider)
    monaco.languages.registerDocumentFormattingEditProvider('csharp', DocumentFormattingProvider)
    monaco.languages.registerHoverProvider('csharp', HoverProvider)
}