// The signature help provider interface defines the contract between extensions and the parameter hints-feature.
export default {
    signatureHelpTriggerCharacters: ['(', ',', '<'],
    provideSignatureHelp: function (model, position, token, context) {
        var promise = new Promise((resolve, reject) => {
            var args = [model.fileName, position.lineNumber, position.column]
            $runtime.channel.invoke('sys.DesignService.SignatureHelp', args).then(res => {
                resolve({ value: res, dispose: () => { } })
            }).catch(err => {
                reject(err)
            });
        })
        return promise
    }
}