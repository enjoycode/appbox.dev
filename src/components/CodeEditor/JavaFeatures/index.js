import CompletionItemProvider from '../Providers/CompletionItemProvider'
import HoverProvider from '../Providers/HoverProvider'
import DocumentSymbolProvider from '../Providers/DocumentSymbolProvider'
import SignatureHelpProvider from '../Providers/SignatureHelpProvider'

export default function (monaco) {
    monaco.languages.registerCompletionItemProvider('java', CompletionItemProvider)
    monaco.languages.registerHoverProvider('java', HoverProvider)
    monaco.languages.registerDocumentSymbolProvider('java', DocumentSymbolProvider)
    monaco.languages.registerSignatureHelpProvider('java', SignatureHelpProvider)
}
