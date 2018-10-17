const ETag = [{
  Label: 'Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'type',
			Explanation: '主题',
			Type: 'string',
			OptionalValue: 'primary/gray/success/warning/danger',
			Defaults: '-'
  }, {
      Name: 'closable',
			Explanation: '是否可关闭',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'close-transition',
			Explanation: '是否禁用关闭时的渐变动画',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'hit',
			Explanation: '是否有边框描边',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'color',
			Explanation: '背景色',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }]
}, {
  Label: 'Events',
	Type: 'events',
	Options: [{
    Name: 'close',
		Explanation: '关闭tag时触发的事件',
		CallBackArg: '-'
  }]
}]

module.exports = ETag
