const EColorPicker = [{
  Label: 'Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'show-alpha',
			Explanation: '是否支持透明度选择',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'color-format',
			Explanation: '写入 v-model 的颜色的格式',
			Type: 'string',
			OptionalValue: 'hsl / hsv / hex / rgb',
			Defaults: 'hex（show-alpha 为 false）/ rgb（show-alpha 为 true）'
  }]
}, {
  Label: 'Events',
	Type: 'events',
	Options: [{
    Name: 'change',
		Explanation: '当绑定值变化时触发',
		CallBackArg: '当前值'
  }]
}]

module.exports = EColorPicker
