import CompletionItemProvider from '../Providers/CompletionItemProvider'
import HoverProvider from '../Providers/HoverProvider'
import DocumentSymbolProvider from '../Providers/DocumentSymbolProvider'
import SignatureHelpProvider from '../Providers/SignatureHelpProvider'
import DocumentFormattingProvider from '../Providers/DocumentFormattingProvider'
import DefinitionProvider from "../Providers/DefinitionProvider";

export default function (monaco) {
    monaco.languages.registerCompletionItemProvider('java', CompletionItemProvider)
    monaco.languages.registerDocumentFormattingEditProvider('java', DocumentFormattingProvider)
    monaco.languages.registerHoverProvider('java', HoverProvider)
    monaco.languages.registerDocumentSymbolProvider('java', DocumentSymbolProvider)
    monaco.languages.registerSignatureHelpProvider('java', SignatureHelpProvider)
    monaco.languages.registerDefinitionProvider('java', DefinitionProvider)
}
