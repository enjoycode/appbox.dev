const EButton = [{
  Label: 'Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'size',
			Explanation: '尺寸',
			Type: 'string',
			OptionalValue: 'large,small,mini',
			Defaults: '-'
  }, {
      Name: 'type',
			Explanation: '类型',
			Type: 'string',
			OptionalValue: 'primary,success,warning,danger,info,text',
			Defaults: '-'
  }, {
      Name: 'plain',
			Explanation: '是否朴素按钮',
			Type: 'Boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'loading',
			Explanation: '是否加载中状态',
			Type: 'Boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'disabled',
			Explanation: '是否禁用状态',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'icon',
			Explanation: '图标，已有的图标库中的图标名',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'autofocus',
			Explanation: '是否默认聚焦',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'native-type',
			Explanation: '原生 type 属性',
			Type: 'string',
			OptionalValue: 'button,submit,reset',
			Defaults: 'button'
  }]
}]

module.exports = EButton
