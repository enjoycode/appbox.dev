const ESelect = [{
  Label: 'Select Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'multiple',
			Explanation: '是否多选',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'disabled',
			Explanation: '是否禁用',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'size',
			Explanation: '输入框尺寸	',
			Type: 'string',
			OptionalValue: 'large/small/mini',
			Defaults: '-'
  }, {
      Name: 'clearable',
			Explanation: '单选时是否可以清空选项',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'multiple-limit',
			Explanation: '多选时用户最多可以选择的项目数，为 0 则不限制',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '0'
  }, {
      Name: 'name',
			Explanation: 'select input 的 name 属性',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'placeholder',
			Explanation: '占位符',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '请选择'
  }, {
      Name: 'filterable',
			Explanation: '是否可搜索',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'allow-create',
			Explanation: '是否允许用户创建新条目，需配合 filterable 使用',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'filter-method',
			Explanation: '自定义过滤方法',
			Type: 'function',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'remote',
			Explanation: '是否为远程搜索',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'remote-method',
			Explanation: '远程搜索方法',
			Type: 'function',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'loading',
			Explanation: '是否正在从远程获取数据',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'loading-text',
			Explanation: '远程加载时显示的文字',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '加载中'
  }, {
      Name: 'no-match-text',
			Explanation: '搜索条件无匹配时显示的文字',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '无匹配数据'
  }, {
      Name: 'no-data-text',
			Explanation: '选项为空时显示的文字',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '无数据'
  }, {
      Name: 'popper-class',
			Explanation: 'Select 下拉框的类名',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'default-first-option',
			Explanation: '在输入框按下回车，选择第一个匹配项。需配合 filterable 或 remote 使用',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }]
}, {
  Label: 'Select Events',
	Type: 'events',
	Options: [{
      Name: 'change',
		Explanation: '选中值发生变化时触发',
		CallBackArg: '目前的选中值'
  }, {
      Name: 'visible-change',
		Explanation: '下拉框出现/隐藏时触发',
		CallBackArg: '出现则为 true，隐藏则为 false'
  }, {
      Name: 'remove-tag',
		Explanation: '多选模式下移除tag时触发',
		CallBackArg: '移除的tag值'
  }, {
      Name: 'clear',
		Explanation: '可清空的单选模式下用户点击清空按钮时触发',
		CallBackArg: '-'
  }]
}, {
  Label: 'Option Group Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'label',
			Explanation: '分组的组名',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'disabled',
			Explanation: '是否将该分组下所有选项置为禁用',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }]
}, {
  Label: 'Option Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'value',
			Explanation: '选项的值',
			Type: 'string/number/object',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'label',
			Explanation: '选项的标签，若不设置则默认与 value 相同',
			Type: 'string/number',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'disabled',
			Explanation: '是否禁用该选项',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }]
}]

module.exports = ESelect
