export default {

    provideDocumentFormattingEdits(model, options, token) {
        // console.log('格式化文档')
        return $runtime.channel.invoke('sys.DesignService.FormatDocument', [model.fileName])
    }

}