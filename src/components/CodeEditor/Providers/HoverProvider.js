export default {
    provideHover: function (model, position) {
        // console.log('Hover at: ', model, position)
        var args = [model.fileName, position.lineNumber, position.column]
        return $runtime.channel.invoke('sys.DesignService.GetHover', args)
    }
}