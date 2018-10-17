const ECollapse = [{
  Label: 'Collapse Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'accordion',
			Explanation: '是否手风琴模式',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'value',
			Explanation: '当前激活的面板(如果是手风琴模式，绑定值类型需要为string，否则为array)',
			Type: 'string/array',
			OptionalValue: '-',
			Defaults: '-'
  }]
}, {
	Label: 'Collapse Events',
	Type: 'events',
	Options: [{
		Name: 'change',
		Explanation: '当前激活面板改变时触发(如果是手风琴模式，参数 activeNames 类型为string，否则为array)',
		CallBackArg: '(activeNames: array|string)'
	}]
}, {
  Label: 'Collapse Item Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'name',
			Explanation: '唯一标志符',
			Type: 'string/number',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'title',
			Explanation: '面板标题',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }]
}]

module.exports = ECollapse
