const EMessage = [{
  Label: 'Options',
	Type: 'options',
	Options: [{
      Name: 'message',
			Explanation: '消息文字',
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
      Name: 'iconClass',
			Explanation: '自定义图标的类名，会覆盖 type',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'customClass',
			Explanation: '自定义类名',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'duration',
			Explanation: '显示时间, 毫秒。设为 0 则不会自动关闭',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '3000'
  }, {
      Name: 'showClose',
			Explanation: '是否显示关闭按钮',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'onClose',
			Explanation: '关闭时的回调函数, 参数为被关闭的 message 实例',
			Type: 'function',
			OptionalValue: '-',
			Defaults: '-'
  }]
}, {
  Label: 'Methods',
	Type: 'methods',
	Options: [{
    Name: 'close',
		Explanation: '关闭当前的 Message',
		CallBackArg: '-'
  }]
}]

module.exports = EMessage
