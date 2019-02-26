import DesignStore from '../../DesignStore'

export default {
    triggerCharacters: ['.'],
    provideCompletionItems: function (model, position) {
        let wordToComplete = ''
        var wordAtPosition = model.getWordAtPosition(position) // getWordUntilPosition()
        if (wordAtPosition) {
            wordToComplete = wordAtPosition.word
            // console.log("WordToComplete: ", wordToComplete)
        }

        var promise = new Promise((resolve, reject) => {
            var args = [1, model.fileName, position.lineNumber, position.column, wordToComplete]
            DesignStore.channel.invoke('sys.DesignService.GetCompletion', args).then(res => {
                resolve({suggestions: res})
            }).catch(err => {
                reject(err)
            });
		})
		return promise
    }
}