import DesignStore from '../../DesignStore'

export default {
    provideHover: function (model, position) {
        // console.log('Hover at: ', model, position)
        var args = [model.fileName, position.lineNumber, position.column]
        return DesignStore.channel.invoke('sys.DesignService.GetHover', args)
    }
}