export default {
    provideDocumentSymbols: function (model, position, token) {
        var promise = new Promise((resolve, reject) => {
            var args = [model.fileName, position.lineNumber, position.column]
            $runtime.channel.invoke('sys.DesignService.GetDocSymbol', args).then(res => {
                resolve(res.elements)
            }).catch(err => {
                reject(err)
            })
        })
        return promise
    }
}