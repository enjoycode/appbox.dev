const ESlider = [{
  Label: 'Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'min',
			Explanation: '最小值',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '0'
  }, {
      Name: 'max',
			Explanation: '最大值',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '100'
  }, {
      Name: 'disabled',
			Explanation: '是否禁用',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'step',
			Explanation: '步长',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '1'
  }, {
      Name: 'show-input',
			Explanation: '是否显示输入框，仅在非范围选择时有效',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'show-input-controls',
			Explanation: '在显示输入框的情况下，是否显示输入框的控制按钮',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }, {
      Name: 'show-stops',
			Explanation: '是否显示间断点',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'show-tooltip',
			Explanation: '是否显示 tooltip',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }, {
      Name: 'format-tooltip',
			Explanation: '格式化 tooltip message',
			Type: 'Function(value)',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'range',
			Explanation: '是否为范围选择',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'vertical',
			Explanation: '是否竖向模式',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'height',
			Explanation: 'Slider 高度，竖向模式时必填',
			Type: 'String',
			OptionalValue: '-',
			Defaults: '-'
  }]
}, {
  Label: 'Events',
	Type: 'events',
	Options: [{
    Name: 'change',
		Explanation: '值改变时触发（使用鼠标拖曳时，只在松开鼠标后触发）',
		CallBackArg: '改变后的值'
  }]
}]

module.exports = ESlider
