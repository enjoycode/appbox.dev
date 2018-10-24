import DesignStore from '../../DesignStore'

export default {
    provideHover: function (model, position) {
        // console.log('Hover at: ', model, position)
        // return xhr('../playground.html').then(function(res) {
        // 	return {
        // 		range: new monaco.Range(1, 1, model.getLineCount(), model.getLineMaxColumn(model.getLineCount())),
        // 		contents: [
        // 			'**SOURCE**',
        // 			{ language: 'html', value: res.responseText.substring(0, 200) }
        // 		]
        // 	}
        // });

        return DesignStore.channel.invoke('sys.DesignService.GetHover', [model.fileName, position.lineNumber, position.column])
    }
}