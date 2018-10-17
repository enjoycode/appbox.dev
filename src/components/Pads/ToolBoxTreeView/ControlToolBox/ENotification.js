const ENotification = [{
  Label: 'Options',
	Type: 'options',
	Options: [{
      Name: 'title',
			Explanation: '标题',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'message',
			Explanation: '说明文字',
			Type: 'string/Vue.VNode',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'type',
			Explanation: '主题样式，如果不在可选值内将被忽略',
			Type: 'string',
			OptionalValue: 'success/warning/info/error',
			Defaults: 'info'
  }, {
      Name: 'iconClass',
			Explanation: '自定义图标的类名。若设置了 type，则 iconClass 会被覆盖',
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
			Defaults: '4500'
  }, {
      Name: 'onClose',
			Explanation: '关闭时的回调函数',
			Type: 'function',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'onClick',
			Explanation: '点击 Notification 时的回调函数',
			Type: 'function',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'offset',
			Explanation: '偏移的距离，在同一时刻，所有的 Notification 实例应当具有一个相同的偏移量',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '0'
  }]
}, {
  Label: 'Methods',
	Type: 'methods',
	Options: [{
    Name: 'close',
		Explanation: '关闭当前的 Notification',
		CallBackArg: '-'
  }]
}]

module.exports = ENotification
