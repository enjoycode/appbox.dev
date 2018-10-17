const ETooltip = [{
  Label: 'Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'effect',
			Explanation: '默认提供的主题',
			Type: 'String',
			OptionalValue: 'dark/light',
			Defaults: 'dark'
  }, {
      Name: 'content',
			Explanation: '显示的内容，也可以通过 slot#content 传入 DOM',
			Type: 'String',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'placement',
			Explanation: 'Tooltip 的出现位置',
			Type: 'String',
			OptionalValue: 'top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end',
			Defaults: 'bottom'
  }, {
      Name: 'value(v-model)',
			Explanation: '状态是否可见',
			Type: 'Boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'disabled',
			Explanation: 'Tooltip 是否可用',
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
			Defaults: 'el-fade-in-linear'
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
      Name: 'open-delay',
			Explanation: '延迟出现，单位毫秒',
			Type: 'Number',
			OptionalValue: '-',
			Defaults: '0'
  }, {
      Name: 'manual',
			Explanation: '手动控制模式，设置为 true 后，mouseenter 和 mouseleave 事件将不会生效',
			Type: 'Boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'popper-class',
			Explanation: '为 Tooltip 的 popper 添加类名',
			Type: 'String',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'enterable',
			Explanation: '鼠标是否可进入到 tooltip 中',
			Type: 'Boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }]
}]

module.exports = ETooltip
