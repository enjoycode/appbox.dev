const EUpload = [{
  Label: 'Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'action',
			Explanation: '必选参数, 上传的地址',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'headers',
			Explanation: '可选参数, 设置上传的请求头部',
			Type: 'object',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'multiple',
			Explanation: '可选参数, 是否支持多选文件',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'data',
			Explanation: '可选参数, 上传时附带的额外参数',
			Type: 'object',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'name',
			Explanation: '可选参数, 上传的文件字段名',
			Type: 'string',
			OptionalValue: '-',
			Defaults: 'file'
  }, {
      Name: 'with-credentials',
			Explanation: '支持发送 cookie 凭证信息',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'show-file-list',
			Explanation: '是否显示已上传文件列表',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }, {
      Name: 'drag',
			Explanation: '是否启用拖拽上传',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'accept',
			Explanation: '可选参数, 接受上传的文件类型（thumbnail-mode 模式下此参数无效）',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'on-preview',
			Explanation: '可选参数, 点击已上传的文件链接时的钩子, 可以通过file.response拿到服务端返回数据',
			Type: 'function(file)',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'on-remove',
			Explanation: '可选参数, 文件列表移除文件时的钩子',
			Type: 'function(file, fileList)',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'on-success',
			Explanation: '可选参数, 文件上传成功时的钩子',
			Type: 'function(response, file, fileList)',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'on-error',
			Explanation: '可选参数, 文件上传失败时的钩子',
			Type: 'function(err, file, fileList)',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'on-progress',
			Explanation: '可选参数, 文件上传时的钩子',
			Type: 'function(event, file, fileList)',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'on-change',
			Explanation: '可选参数, 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用',
			Type: 'function(file, fileList)',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'before-upload',
			Explanation: '可选参数, 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。',
			Type: 'function(file)',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'list-type',
			Explanation: '文件列表的类型',
			Type: 'string',
			OptionalValue: 'text/picture/picture-card',
			Defaults: 'text'
  }, {
      Name: 'auto-upload',
			Explanation: '是否在选取文件后立即进行上传',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }, {
      Name: 'file-list',
			Explanation: '上传的文件列表, 例如: [{name:\'food.jpeg\', url:\'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100\'}]',
			Type: 'array',
			OptionalValue: '-',
			Defaults: '[ ]'
  }, {
      Name: 'http-request',
			Explanation: '覆盖默认的上传行为，可以自定义上传的实现',
			Type: 'function',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'disabled',
			Explanation: '是否禁用',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }]
}, {
  Label: 'Methods',
	Type: 'methods',
	Options: [{
    Name: 'clearFiles',
		Explanation: '清空已上传的文件列表（该方法不支持在 before-upload 中调用）',
		CallBackArg: '-'
  }, {
    Name: 'abort',
		Explanation: '取消上传请求',
		CallBackArg: '（file: fileList中的file对象）'
  }]
}]

module.exports = EUpload
