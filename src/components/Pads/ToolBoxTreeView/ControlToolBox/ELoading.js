const ELoading = [{
  Label: 'Options',
	Type: 'options',
	Options: [{
      Name: 'target',
			Explanation: 'Loading 需要覆盖的 DOM 节点。可传入一个 DOM 对象或字符串；若传入字符串，则会将其作为参数传入 document.querySelector以获取到对应 DOM 节点',
			Type: 'object/string',
			OptionalValue: '-',
			Defaults: 'document.body'
  }, {
      Name: 'body',
			Explanation: '同 v-loading 指令中的 body 修饰符',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'fullscreen',
			Explanation: '同 v-loading 指令中的 fullscreen 修饰符',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }, {
      Name: 'lock',
			Explanation: '同 v-loading 指令中的 lock 修饰符',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'text',
			Explanation: '显示在加载图标下方的加载文案',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'customClass',
			Explanation: 'Loading 的自定义类名',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }]
}]

module.exports = ELoading
