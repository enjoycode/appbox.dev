const EDialog = [{
  Label: 'Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'visible',
			Explanation: '是否显示 Dialog，支持 .sync 修饰符',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'title',
			Explanation: 'Dialog 的标题，也可通过具名 slot （见下表）传入',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'size',
			Explanation: 'Dialog 的大小',
			Type: 'string',
			OptionalValue: 'tiny/small/large/full',
			Defaults: 'small'
  }, {
      Name: 'top',
			Explanation: 'Dialog CSS 中的 top 值（仅在 size 不为 full 时有效）',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '15%'
  }, {
      Name: 'modal',
			Explanation: '是否需要遮罩层',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }, {
      Name: 'modal-append-to-body',
			Explanation: '遮罩层是否插入至 body 元素上，若为 false，则遮罩层会插入至 Dialog 的父元素上',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }, {
      Name: 'lock-scroll',
			Explanation: '是否在 Dialog 出现时将 body 滚动锁定',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }, {
      Name: 'custom-class',
			Explanation: 'Dialog 的自定义类名',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'close-on-click-modal',
			Explanation: '是否可以通过点击 modal 关闭 Dialog',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }, {
      Name: 'close-on-press-escape',
			Explanation: '是否可以通过按下 ESC 关闭 Dialog',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }, {
      Name: 'show-close',
			Explanation: '是否显示关闭按钮',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }, {
      Name: 'before-close',
			Explanation: '关闭前的回调，会暂停 Dialog 的关闭',
			Type: 'function(done)，done 用于关闭 Dialog',
			OptionalValue: '-',
			Defaults: '-'
  }]
}, {
  Label: 'Slot',
	Type: 'slot',
	Options: [{
      Name: '-',
			Explanation: 'Dialog 的内容'
  }, {
      Name: 'title',
			Explanation: 'Dialog 标题区的内容'
  }, {
      Name: 'footer',
			Explanation: 'Dialog 按钮操作区的内容'
  }]
}, {
  Label: 'Events',
	Type: 'events',
	Options: [{
      Name: 'close',
			Explanation: 'Dialog 关闭的回调',
      CallBackArg: '-'
  }, {
      Name: 'open',
			Explanation: 'Dialog 打开的回调',
      CallBackArg: '-'
  }]
}]

module.exports = EDialog
