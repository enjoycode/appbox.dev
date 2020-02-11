import snippets from './snippets.json' // port from omnisharp-vscode

export default {
    //triggerCharacters: ['.'],
    provideCompletionItems: function (model, position) {
        let wordToComplete = ''
        var wordAtPosition = model.getWordAtPosition(position) // getWordUntilPosition()
        if (wordAtPosition) {
            wordToComplete = wordAtPosition.word
        }
        if (!wordToComplete || wordToComplete === ' ') {
            // no snippets when suggestions have been triggered by space
            return undefined
        }

        var suggestions = []
        for (const name in snippets) {
            if (snippets.hasOwnProperty(name)) {
                const element = snippets[name];
                if (element.prefix.startsWith(wordToComplete)) {
                    suggestions.push({
                        label: name,
                        insertText: element.body.join('\n'),
                        documentation: element.description,
                        kind: 25, //CompletionItemKind.Snippet
                        insertTextRules: 4 //CompletionItemInsertTextRule.InsertAsSnippet
                    })
                }
            }
        }
        return { suggestions: suggestions }
    }
}