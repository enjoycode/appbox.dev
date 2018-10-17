const EInputNumber = [{
  Label: 'Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'value',
			Explanation: '绑定值',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'min',
			Explanation: '设置计数器允许的最小值',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '0'
  }, {
      Name: 'max',
			Explanation: '设置计数器允许的最大值	',
			Type: 'number',
			OptionalValue: '-',
			Defaults: 'Infinity'
  }, {
      Name: 'step',
			Explanation: '计数器步长',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '1'
  }, {
      Name: 'size',
			Explanation: '计数器尺寸',
			Type: 'string',
			OptionalValue: 'large, small',
			Defaults: '-'
  }, {
      Name: 'disabled',
			Explanation: '是否禁用计数器',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'controls',
			Explanation: '是否使用控制按钮',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }, {
      Name: 'debounce',
			Explanation: '输入时的去抖延迟，毫秒',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '300'
  }]
}, {
  Label: 'Events',
	Type: 'events',
	Options: [{
      Name: 'change',
		Explanation: '绑定值变化时触发的事件',
		CallBackArg: '最后变更的值'
  }]
}]

module.exports = EInputNumber
