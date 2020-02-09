import CompletionItemProvider from './CompletionItemProvider'
import DocumentFormattingProvider from './DocumentFormattingProvider'
import HoverProvider from './HoverProvider'

export default function (monaco) {
    monaco.languages.registerCompletionItemProvider('csharp', CompletionItemProvider)
    monaco.languages.registerDocumentFormattingEditProvider('csharp', DocumentFormattingProvider)
    monaco.languages.registerHoverProvider('csharp', HoverProvider)

    monaco.editor.defineTheme('tm', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword.other.using.cs', foreground: 'C678DD' },
            { token: 'keyword.other.new.cs', foreground: 'C678DD' },
            { token: 'keyword.other.await.cs', foreground: 'C678DD' },
            { token: 'keyword.other.struct.cs', foreground: 'C678DD' },
            { token: 'keyword.other.class.cs', foreground: 'C678DD' },
            { token: 'keyword.other.get.cs', foreground: 'C678DD' },
            { token: 'keyword.other.set.cs', foreground: 'C678DD' },
            { token: 'keyword.control.flow.return.cs', foreground: 'C678DD' },
            { token: 'keyword.operator.arrow.cs', foreground: 'ABB2BF' },
            { token: 'keyword.operator.logical.cs', foreground: '56B6C2' },
            { token: 'keyword.operator.comparison.cs', foreground: '56B6C2' },
            { token: 'keyword.operator.assignment.cs', foreground: '56B6C2' },
            { token: 'keyword.preprocessor.region.cs', foreground: 'C678DD' },
            { token: 'keyword.preprocessor.endregion.cs', foreground: 'C678DD' },

            { token: 'constant.numeric.decimal.cs', foreground: 'D19A66' },
            { token: 'constant.language.null.cs', foreground: 'D19A66' },

            { token: 'punctuation.definition.comment.cs', foreground: '7F848E' },
            { token: 'punctuation.definition.string.begin.cs', foreground: '98C379' },
            { token: 'punctuation.definition.string.end.cs', foreground: '98C379' },
            { token: 'punctuation.definition.char.begin.cs', foreground: '98C379' },
            { token: 'punctuation.definition.char.end.cs', foreground: '98C379' },

            { token: 'entity.name.function.cs', foreground: 'FF9B1E' /*'61AFEF'*/ },
            { token: 'entity.name.type.namespace.cs', foreground: 'E5C07B' },
            { token: 'entity.name.type.class.cs', foreground: '67DBF1' /*'E5C07B'*/ },
            { token: 'entity.name.type.struct.cs', foreground: '67DBF1' /*'E5C07B'*/ },
            { token: 'entity.name.tag.localname', foreground: 'E06C75' },
            { token: 'entity.name.variable.local.cs', foreground: 'E06C75' },
            { token: 'entity.other.attribute-name.localname.cs', foreground: 'D19A66' },

            { token: 'storage.type.cs', foreground: '67DBF1' /*'E5C07B'*/ },
            { token: 'storage.modifier.cs', foreground: 'C678DD' },

            { token: 'string.quoted.single.cs', foreground: '98C379' },
            { token: 'string.quoted.double.cs', foreground: '98C379' },
            { token: 'string.unquoted.preprocessor.message.cs', foreground: '98C379' },

            { token: 'variable.other.readwrite.cs', foreground: 'E06C75' },
            { token: 'variable.other.object.cs', foreground: '67DBF1' /*'E06C75'*/ },
            { token: 'variable.other.object.property.cs', foreground: 'E06C75' },

            { token: 'comment.block.documentation.cs', foreground: '7F848E' },
            { token: 'comment.line.double-slash.cs', foreground: '7F848E' }
        ],
        // colors: {
        //     'editor.background': '#1E1E1E',
        //     'editor.foreground': '#D4D4D4',
        // }
    })
}