const EBadge = [{
  Label: 'Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'value',
			Explanation: '显示值',
			Type: 'string, number',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'max',
			Explanation: '最大值，超过最大值会显示 \'{max}+\'，要求 value 是 Number 类型',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'is-dot',
			Explanation: '小圆点',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'hidden',
			Explanation: '隐藏 badge',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }]
}]

module.exports = EBadge
