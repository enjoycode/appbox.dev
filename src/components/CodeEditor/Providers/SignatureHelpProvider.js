// The signature help provider interface defines the contract between extensions and the parameter hints-feature.
export default {
    signatureHelpTriggerCharacters: ['(', ',', '<'],
    provideSignatureHelp: function (model, position, token, context) {
        return new Promise((resolve, reject) => {
            const args = [model.fileName, position.lineNumber, position.column];
            $runtime.channel.invoke('sys.DesignService.SignatureHelp', args).then(res => {
                if (res) {
                    //后端序列化可能无activeParameter或activeSignature
                    if (!res.activeSignature) res.activeSignature = 0;
                    if (!res.activeParameter) res.activeParameter = 0;
                    resolve({value: res, dispose: () => {}})
                } else {
                    resolve(undefined)
                }
            }).catch(err => {
                reject(err)
            });
        })
    }
}
