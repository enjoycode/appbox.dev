export default function (monaco) {
    monaco.editor.defineTheme('tm', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword.other.using', foreground: 'C678DD' },
            { token: 'keyword.other.new', foreground: 'C678DD' },
            { token: 'keyword.other.await.cs', foreground: 'C678DD' },
            { token: 'keyword.other.struct.cs', foreground: 'C678DD' },
            { token: 'keyword.other.class', foreground: 'C678DD' },
            { token: 'keyword.other.get', foreground: 'C678DD' },
            { token: 'keyword.other.set', foreground: 'C678DD' },
            { token: 'keyword.control.flow.return', foreground: 'C678DD' },
            { token: 'keyword.operator.arrow.cs', foreground: 'ABB2BF' },
            { token: 'keyword.operator.logical.cs', foreground: '56B6C2' },
            { token: 'keyword.operator.comparison.cs', foreground: '56B6C2' },
            { token: 'keyword.operator.assignment.cs', foreground: '56B6C2' },
            { token: 'keyword.preprocessor.region.cs', foreground: 'C678DD' },
            { token: 'keyword.preprocessor.endregion.cs', foreground: 'C678DD' },
    
            { token: 'constant.numeric.decimal.cs', foreground: 'D19A66' },
            { token: 'constant.language.null', foreground: 'D19A66' },
    
            { token: 'punctuation.definition.comment', foreground: '7F848E' },
            { token: 'punctuation.definition.string.begin', foreground: '98C379' },
            { token: 'punctuation.definition.string.end', foreground: '98C379' },
            { token: 'punctuation.definition.char.begin', foreground: '98C379' },
            { token: 'punctuation.definition.char.end', foreground: '98C379' },
    
            { token: 'entity.name.function', foreground: 'FF9B1E' /*'61AFEF'*/ },
            { token: 'entity.name.type.namespace', foreground: 'E5C07B' },
            { token: 'entity.name.type.class', foreground: '67DBF1' /*'E5C07B'*/ },
            { token: 'entity.name.type.struct.cs', foreground: '67DBF1' /*'E5C07B'*/ },
            { token: 'entity.name.tag.localname', foreground: 'E06C75' },
            { token: 'entity.name.variable.local', foreground: 'E06C75' },
            { token: 'entity.other.attribute-name.localname', foreground: 'D19A66' },
    
            { token: 'storage.type', foreground: '67DBF1' /*'E5C07B'*/ },
            { token: 'storage.modifier', foreground: 'C678DD' },
    
            { token: 'string.quoted.single', foreground: '98C379' },
            { token: 'string.quoted.double', foreground: '98C379' },
            { token: 'string.unquoted.preprocessor.message.cs', foreground: '98C379' },
    
            { token: 'variable.other.readwrite.cs', foreground: 'E06C75' },
            { token: 'variable.other.object', foreground: '67DBF1' /*'E06C75'*/ },
            { token: 'variable.other.object.property.cs', foreground: 'E06C75' },
    
            { token: 'comment.block.documentation', foreground: '7F848E' },
            { token: 'comment.line.double-slash', foreground: '7F848E' },
        ],
        // colors: {
        //     'editor.background': '#1E1E1E',
        //     'editor.foreground': '#D4D4D4',
        // }
    })
}