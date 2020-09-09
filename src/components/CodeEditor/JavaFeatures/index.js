import CompletionItemProvider from '../CSharpFeatures/CompletionItemProvider'

export default function (monaco) {
    monaco.languages.registerCompletionItemProvider('java', CompletionItemProvider)
}