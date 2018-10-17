const ESteps = [{
  Label: 'Steps Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'space',
			Explanation: '每个 step 的间距，不填写将自适应间距。支持百分比。',
			Type: 'Number,String',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'direction',
			Explanation: '显示方向',
			Type: 'string',
			OptionalValue: 'vertical/horizontal',
			Defaults: 'horizontal'
  }, {
      Name: 'active',
			Explanation: '设置当前激活步骤',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '0'
  }, {
      Name: 'process-status',
			Explanation: '设置当前步骤的状态',
			Type: 'string',
			OptionalValue: 'wait/process/finish/error/success',
			Defaults: 'process'
  }, {
      Name: 'finish-status',
			Explanation: '设置结束步骤的状态',
			Type: 'string',
			OptionalValue: 'wait/process/finish/error/success',
			Defaults: 'finish'
  }, {
      Name: 'align-center',
			Explanation: '标题描述居中对齐',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'center',
			Explanation: '组件居中显示',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }]
}, {
  Label: 'Step Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'title',
			Explanation: '标题',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'description',
			Explanation: '描述性文字',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'icon',
			Explanation: '图标',
			Type: 'Element Icon 提供的图标，如果要使用自定义图标可以通过 slot 方式写入',
			OptionalValue: 'string',
			Defaults: 'false'
  }, {
      Name: 'status',
			Explanation: '设置当前步骤的状态，不设置则根据 steps 确定状态',
			Type: 'wait/process/finish/error/success',
			OptionalValue: '-',
			Defaults: '-'
  }]
}, {
  Label: 'Step Slot',
	Type: 'slot',
	Options: [{
      Name: 'icon',
			Explanation: '图标'
  }, {
      Name: 'title',
			Explanation: '标题'
  }, {
      Name: 'description',
			Explanation: '描述性文字'
  }]
}]

module.exports = ESteps
