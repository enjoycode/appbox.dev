const EAlert = [{
  Label: 'Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'title',
			Explanation: '标题，必选参数',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'type',
			Explanation: '主题',
			Type: 'string',
			OptionalValue: 'success/warning/info/error',
			Defaults: 'info'
  }, {
      Name: 'description',
			Explanation: '辅助性文字。也可通过默认 slot 传入',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'closable',
			Explanation: '是否可关闭',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }, {
      Name: 'close-text',
			Explanation: '关闭按钮自定义文本',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'show-icon',
			Explanation: '是否显示图标',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }]
}, {
  Label: 'Events',
	Type: 'events',
	Options: [{
    Name: 'close',
		Explanation: '关闭alert时触发的事件',
		CallBackArg: '-'
  }]
}]

module.exports = EAlert
