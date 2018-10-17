const ECarousel = [{
  Label: 'Carousel Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'height',
			Explanation: '走马灯的高度',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'initial-index',
			Explanation: '初始状态激活的幻灯片的索引，从 0 开始',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '0'
  }, {
      Name: 'trigger',
			Explanation: '指示器的触发方式',
			Type: 'string',
			OptionalValue: 'click',
			Defaults: '-'
  }, {
      Name: 'autoplay',
			Explanation: '是否自动切换',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }, {
      Name: 'interval',
			Explanation: '自动切换的时间间隔，单位为毫秒',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '3000'
  }, {
      Name: 'indicator-position',
			Explanation: '指示器的位置',
			Type: 'string',
			OptionalValue: 'outside/none',
			Defaults: '-'
  }, {
      Name: 'arrow',
			Explanation: '切换箭头的显示时机',
			Type: 'string',
			OptionalValue: 'always/hover/never',
			Defaults: 'hover'
  }, {
      Name: 'type',
			Explanation: '走马灯的类型',
			Type: 'string',
			OptionalValue: 'card',
			Defaults: '-'
  }]
}, {
	Label: 'Carousel Events',
	Type: 'events',
	Options: [{
		Name: 'change',
		Explanation: '幻灯片切换时触发',
		CallBackArg: '目前激活的幻灯片的索引，原幻灯片的索引'
	}]
}, {
	Label: 'Carousel Methods',
	Type: 'methods',
	Options: [{
		Name: 'setActiveItem',
		Explanation: '手动切换幻灯片',
		CallBackArg: '需要切换的幻灯片的索引，从 0 开始；或相应 el-carousel-item 的 name 属性值'
	}, {
		Name: 'prev',
		Explanation: '切换至上一张幻灯片',
		CallBackArg: '-'
	}, {
		Name: 'next',
		Explanation: '切换至下一张幻灯片',
		CallBackArg: '-'
	}]
}, {
  Label: 'Carousel-Item Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'name',
			Explanation: '幻灯片的名字，可用作 setActiveItem 的参数',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'label',
			Explanation: '该幻灯片所对应指示器的文本',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }]
}]

module.exports = ECarousel
