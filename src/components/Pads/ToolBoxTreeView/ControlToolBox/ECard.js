const ECard = [{
  Label: 'Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'header',
			Explanation: '设置 header，也可以通过 slot#header 传入 DOM',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'body-style',
			Explanation: '设置 body 的样式',
			Type: 'object',
			OptionalValue: '-',
			Defaults: '{ padding: \'20px\' }'
  }]
}]

module.exports = ECard
