const ECheckbox = [{
  Label: 'Checkbox Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'label',
			Explanation: '选中状态的值（只有在checkbox-group或者绑定对象类型为array时有效）',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'true-label',
			Explanation: '选中时的值',
			Type: 'string, number',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'false-label',
			Explanation: '没有选中时的值',
			Type: 'string, number',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'name',
			Explanation: '原生 name 属性',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'disabled',
			Explanation: '按钮禁用',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'checked',
			Explanation: '当前是否勾选',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'indeterminate',
			Explanation: '设置 indeterminate 状态，只负责样式控制',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }]
}, {
  Label: 'Checkbox-group Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'size',
			Explanation: 'Checkbox 按钮组尺寸',
			Type: 'string',
			OptionalValue: 'large, small',
			Defaults: '-'
  }, {
      Name: 'fill',
			Explanation: '按钮激活时的填充色和边框色',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '#20a0ff'
  }, {
      Name: 'text-color',
			Explanation: '按钮激活时的文本颜色',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '#ffffff'
  }, {
      Name: 'min',
			Explanation: '可被勾选的 checkbox 的最小数量',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'max',
			Explanation: '可被勾选的 checkbox 的最大数量',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '-'
  }]
}, {
  Label: 'Checkbox-group Events',
	Type: 'events',
	Options: [{
      Name: 'change',
		Explanation: '绑定值变化时触发的事件',
		CallBackArg: 'event 事件对象'
  }]
}]

module.exports = ECheckbox
