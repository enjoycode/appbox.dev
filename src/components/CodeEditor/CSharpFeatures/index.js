import SnippetCompletionProvider from './SnippetCompletionProvider'
import CompletionItemProvider from '../Providers/CompletionItemProvider'
import DocumentFormattingProvider from '../Providers/DocumentFormattingProvider'
import DocumentSymbolProvider from '../Providers/DocumentSymbolProvider'
import HoverProvider from '../Providers/HoverProvider'
import SignatureHelpProvider from '../Providers/SignatureHelpProvider'

export default function (monaco) {
    monaco.languages.registerCompletionItemProvider('csharp', SnippetCompletionProvider)
    monaco.languages.registerCompletionItemProvider('csharp', CompletionItemProvider)
    monaco.languages.registerDocumentFormattingEditProvider('csharp', DocumentFormattingProvider)
    monaco.languages.registerDocumentSymbolProvider('csharp', DocumentSymbolProvider)
    monaco.languages.registerHoverProvider('csharp', HoverProvider)
    monaco.languages.registerSignatureHelpProvider('csharp', SignatureHelpProvider)
}
