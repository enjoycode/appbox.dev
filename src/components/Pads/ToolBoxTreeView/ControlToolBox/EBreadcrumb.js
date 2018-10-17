const EBreadcrumb = [{
  Label: 'Breadcrumb Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'separator',
			Explanation: '分隔符',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '斜杠\'/\''
  }]
}, {
  Label: 'Breadcrumb Item Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'to',
			Explanation: '路由跳转对象，同 vue-router 的 to',
			Type: 'string/object',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'replace',
			Explanation: '在使用 to 进行路由跳转时，启用 replace 将不会向 history 添加新记录',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }]
}]

module.exports = EBreadcrumb
