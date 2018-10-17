const ERate = [{
  Label: 'Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'max',
			Explanation: '最大分值',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '5'
  }, {
      Name: 'disabled',
			Explanation: '是否为只读',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'allow-half',
			Explanation: '是否允许半选',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'low-threshold',
			Explanation: '低分和中等分数的界限值，值本身被划分在低分中',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '2'
  }, {
      Name: 'high-threshold',
			Explanation: '高分和中等分数的界限值，值本身被划分在高分中',
			Type: 'string',
			OptionalValue: '-',
			Defaults: 'file'
  }, {
      Name: 'with-credentials',
			Explanation: '支持发送 cookie 凭证信息',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '4'
  }, {
      Name: 'colors',
			Explanation: 'icon 的颜色数组，共有 3 个元素，为 3 个分段所对应的颜色',
			Type: 'array',
			OptionalValue: '-',
			Defaults: '[\'#F7BA2A\', \'#F7BA2A\', \'#F7BA2A\']'
  }, {
      Name: 'void-color',
			Explanation: '未选中 icon 的颜色',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '#C6D1DE'
  }, {
      Name: 'disabled-void-color',
			Explanation: '只读时未选中 icon 的颜色',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '#EFF2F7'
  }, {
      Name: 'icon-classes',
			Explanation: 'icon 的类名数组，共有 3 个元素，为 3 个分段所对应的类名',
			Type: 'array',
			OptionalValue: '-',
			Defaults: '[\'el-icon-star-on\', \'el-icon-star-on\',\'el-icon-star-on\']'
  }, {
      Name: 'void-icon-class',
			Explanation: '未选中 icon 的类名',
			Type: 'string',
			OptionalValue: '-',
			Defaults: 'el-icon-star-off'
  }, {
      Name: 'disabled-void-icon-class',
			Explanation: '只读时未选中 icon 的类名',
			Type: 'string',
			OptionalValue: '-',
			Defaults: 'el-icon-star-on'
  }, {
      Name: 'show-text',
			Explanation: '是否显示辅助文字',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'text-color',
			Explanation: '辅助文字的颜色',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '#1F2D3D'
  }, {
      Name: 'texts',
			Explanation: '辅助文字数组',
			Type: 'array',
			OptionalValue: '-',
			Defaults: '[\'极差\', \'失望\', \'一般\', \'满意\', \'惊喜\']'
  }, {
      Name: 'text-template',
			Explanation: '只读时的辅助文字模板',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '{value}'
  }]
}, {
  Label: 'Events',
	Type: 'events',
	Options: [{
    Name: 'change',
		Explanation: '分值改变时触发',
		CallBackArg: '改变后的分值'
  }]
}]

module.exports = ERate
