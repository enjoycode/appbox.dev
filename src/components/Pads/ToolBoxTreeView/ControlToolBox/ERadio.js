const ERadio = [{
  Label: 'Radio Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'label',
			Explanation: 'Radio 的 value',
			Type: 'string,number,boolean',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'disabled',
			Explanation: '是否禁用',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'name',
			Explanation: '原生 name 属性',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }]
}, {
  Label: 'Radio-group Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'size',
			Explanation: 'Radio 按钮组尺寸',
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
  }]
}, {
  Label: 'Radio-group Events',
	Type: 'events',
	Options: [{
      Name: 'change',
		Explanation: '绑定值变化时触发的事件',
		CallBackArg: '选中的 Radio label 值'
  }]
}, {
  Label: 'Radio-button Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'label',
			Explanation: 'Radio 的 value',
			Type: 'string,number',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'disabled',
			Explanation: '是否禁用',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }]
}]

module.exports = ERadio
