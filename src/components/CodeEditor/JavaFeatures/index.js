import CompletionItemProvider from '../CSharpFeatures/CompletionItemProvider'
import HoverProvider from '../CSharpFeatures/HoverProvider'

export default function (monaco) {
    monaco.languages.registerCompletionItemProvider('java', CompletionItemProvider)
    monaco.languages.registerHoverProvider('java', HoverProvider)
}
