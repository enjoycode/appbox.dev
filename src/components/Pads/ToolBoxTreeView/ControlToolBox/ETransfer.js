const ETransfer = [{
  Label: 'Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'data',
			Explanation: 'Transfer 的数据源',
			Type: 'array[{ key, label, disabled }]',
			OptionalValue: '-',
			Defaults: '[ ]'
  }, {
      Name: 'filterable',
			Explanation: '是否可搜索',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'filter-placeholder',
			Explanation: '搜索框占位符',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '请输入搜索内容'
  }, {
      Name: 'filter-method',
			Explanation: '自定义搜索方法',
			Type: 'function',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'titles',
			Explanation: '自定义列表标题',
			Type: 'array',
			OptionalValue: '-',
			Defaults: '[\'列表1\', \'列表2\']'
  }, {
      Name: 'button-texts',
			Explanation: '自定义按钮文案',
			Type: 'array',
			OptionalValue: '-',
			Defaults: '[ ]'
  }, {
      Name: 'render-content',
			Explanation: '自定义数据项渲染函数',
			Type: 'function(h, option)',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'footer-format',
			Explanation: '列表底部勾选状态文案',
			Type: 'object{noChecked, hasChecked}',
			OptionalValue: '-',
			Defaults: '{noChecked: \'共 ' + '$' + '{total} 项\', hasChecked: \'已选 ' + '$' + '{checked}/' + '$' + '{total} 项\'}'
  }, {
      Name: 'props',
			Explanation: '数据源的字段别名',
			Type: 'object{key, label, disabled}',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'left-default-checked',
			Explanation: '初始状态下左侧列表的已勾选项的 key 数组',
			Type: 'array',
			OptionalValue: '-',
			Defaults: '[ ]'
  }, {
      Name: 'right-default-checked',
			Explanation: '初始状态下右侧列表的已勾选项的 key 数组',
			Type: 'array',
			OptionalValue: '-',
			Defaults: '[ ]'
  }]
}, {
  Label: 'Slot',
	Type: 'slot',
	Options: [{
    Name: 'left-footer',
		Explanation: '左侧列表底部的内容'
  }, {
    Name: 'right-footer',
		Explanation: '右侧列表底部的内容'
  }]
}, {
  Label: 'Events',
	Type: 'events',
	Options: [{
    Name: 'change',
		Explanation: '右侧列表元素变化时触发',
		CallBackArg: '当前值、数据移动的方向（\'left\' / \'right\'）、发生移动的数据 key 数组'
  }, {
    Name: 'abort',
		Explanation: '取消上传请求',
		CallBackArg: '（file: fileList中的file对象）'
  }]
}]

module.exports = ETransfer
