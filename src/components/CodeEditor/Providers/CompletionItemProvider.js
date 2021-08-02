export default {
    triggerCharacters: ['.'],
    provideCompletionItems: function (model, position) {
        let wordToComplete = ''
        const wordAtPosition = model.getWordAtPosition(position); // getWordUntilPosition()
        if (wordAtPosition) {
            wordToComplete = wordAtPosition.word
            // console.log("WordToComplete: ", wordToComplete)
        }

        return new Promise((resolve, reject) => {
            const args = [1, model.fileName, position.lineNumber, position.column, wordToComplete];
            $runtime.channel.invoke('sys.DesignService.GetCompletion', args).then(res => {
                resolve({suggestions: res})
            }).catch(err => {
                console.log('completion error: ' + err);
                resolve({suggestions: []})
            });
        })
    }
}
