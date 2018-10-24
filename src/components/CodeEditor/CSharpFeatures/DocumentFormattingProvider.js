import DesignStore from '../../DesignStore'

export default {

    provideDocumentFormattingEdits(model, options, token) {
        // console.log('格式化文档')
        return DesignStore.channel.invoke('sys.DesignService.FormatDocument', [model.fileName])
    }

}