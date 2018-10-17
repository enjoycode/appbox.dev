const ESwitch = [{
  Label: 'Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'disabled',
			Explanation: '是否禁用',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'width',
			Explanation: 'switch 的宽度（像素）',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '58（有文字）/ 46（无文字）'
  }, {
      Name: 'on-icon-class',
			Explanation: 'switch 打开时所显示图标的类名，设置此项会忽略 on-text',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'off-icon-class',
			Explanation: 'switch 关闭时所显示图标的类名，设置此项会忽略 off-text',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'on-text',
			Explanation: 'switch 打开时的文字',
			Type: 'string',
			OptionalValue: '-',
			Defaults: 'ON'
  }, {
      Name: 'off-text',
			Explanation: 'switch 关闭时的文字',
			Type: 'string',
			OptionalValue: '-',
			Defaults: 'OFF'
  }, {
      Name: 'on-value',
			Explanation: 'switch 打开时的值',
			Type: 'boolean / string / number',
			OptionalValue: '-',
			Defaults: 'true'
  }, {
      Name: 'off-value',
			Explanation: 'switch 关闭时的值',
			Type: 'boolean / string / number',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'on-color',
			Explanation: 'switch 打开时的背景色',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '#20A0FF'
  }, {
      Name: 'off-color',
			Explanation: 'switch 关闭时的背景色',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '#C0CCDA'
  }, {
      Name: 'name',
			Explanation: 'switch 对应的 name 属性',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }]
}, {
  Label: 'Events',
	Type: 'events',
	Options: [{
      Name: 'change',
		Explanation: 'switch 状态发生变化时的回调函数',
		CallBackArg: '新状态的值'
  }]
}]

module.exports = ESwitch
