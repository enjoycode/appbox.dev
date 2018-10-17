const EPopover = [{
  Label: 'Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'trigger',
			Explanation: '触发方式',
			Type: 'String',
			OptionalValue: 'click/focus/hover/manual',
			Defaults: 'click'
  }, {
      Name: 'title',
			Explanation: '标题',
			Type: 'String',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'content',
			Explanation: '显示的内容，也可以通过 slot 传入 DOM',
			Type: 'String',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'width',
			Explanation: '宽度',
			Type: 'String, Number',
			OptionalValue: '-',
			Defaults: '最小宽度 150px'
  }, {
      Name: 'placement',
			Explanation: '出现位置',
			Type: 'String',
			OptionalValue: 'top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end',
			Defaults: 'bottom'
  }, {
      Name: 'disabled',
			Explanation: 'Popover 是否可用',
			Type: 'Boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'value(v-model)',
			Explanation: '状态是否可见',
			Type: 'Boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'offset',
			Explanation: '出现位置的偏移量',
			Type: 'Number',
			OptionalValue: '-',
			Defaults: '0'
  }, {
      Name: 'transition',
			Explanation: '定义渐变动画',
			Type: 'String',
			OptionalValue: '-',
			Defaults: 'fade-in-linear'
  }, {
      Name: 'visible-arrow',
			Explanation: '是否显示 Tooltip 箭头，更多参数可见Vue-popper',
			Type: 'Boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }, {
      Name: 'popper-options',
			Explanation: 'popper.js 的参数',
			Type: 'Object',
			OptionalValue: '参考 popper.js 文档',
			Defaults: '{ boundariesElement: \'body\', gpuAcceleration: false }'
  }, {
      Name: 'popper-class',
			Explanation: '为 popper 添加类名',
			Type: 'String',
			OptionalValue: '-',
			Defaults: '-'
  }]
}, {
  Label: 'Slot',
	Type: 'slot',
	Options: [{
    Name: '-',
		Explanation: 'Popover 内嵌 HTML 文本'
  }, {
    Name: 'reference',
		Explanation: '触发 Popover 显示的 HTML 元素'
  }]
}, {
  Label: 'Events',
	Type: 'events',
	Options: [{
    Name: 'show',
		Explanation: '显示时触发',
		CallBackArg: '-'
  }, {
    Name: 'hide',
		Explanation: '隐藏时触发',
		CallBackArg: '-'
  }]
}]

module.exports = EPopover
