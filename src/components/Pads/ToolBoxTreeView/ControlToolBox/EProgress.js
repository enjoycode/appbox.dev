const EProgress = [{
  Label: 'Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'percentage',
			Explanation: '百分比（必填）',
			Type: 'number',
			OptionalValue: '0-100',
			Defaults: '0'
  }, {
      Name: 'type',
			Explanation: '进度条类型',
			Type: 'string',
			OptionalValue: 'line/circle',
			Defaults: 'line'
  }, {
      Name: 'stroke-width',
			Explanation: '进度条的宽度，单位 px',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '6'
  }, {
      Name: 'text-inside',
			Explanation: '进度条显示文字内置在进度条内（只在 type=line 时可用）',
			Type: 'Boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'status',
			Explanation: '进度条当前状态',
			Type: 'string',
			OptionalValue: 'success/exception',
			Defaults: '-'
  }, {
      Name: 'width',
			Explanation: '环形进度条画布宽度（只在 type=circle 时可用）',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '126'
  }, {
      Name: 'show-text',
			Explanation: '是否显示进度条文字内容',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }]
}]

module.exports = EProgress
