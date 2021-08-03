export default {
    provideDefinition: function (model, position) {
        const args = [model.fileName, position.lineNumber, position.column]
        return $runtime.channel.invoke('sys.DesignService.GotoDefinition', args)
    }
}
