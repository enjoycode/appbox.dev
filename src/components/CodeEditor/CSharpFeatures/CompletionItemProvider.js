import DesignStore from '../../DesignStore'

export default {
    triggerCharacters: ['.'],
    provideCompletionItems: function (model, position) {
        let wordToComplete = ''
        var wordAtPosition = model.getWordAtPosition(position) // getWordUntilPosition()
        if (wordAtPosition) {
            wordToComplete = wordAtPosition.word
            console.log("WordToComplete: ", wordToComplete)
        }

        return DesignStore.channel.invoke('sys.DesignHub.GetCompletion',
            [1, model.fileName, position.lineNumber, position.column, wordToComplete])
    }
}