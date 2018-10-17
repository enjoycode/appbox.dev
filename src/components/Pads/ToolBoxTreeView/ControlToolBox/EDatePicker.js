const EDatePicker = [{
  Label: 'Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'readonly',
			Explanation: '完全只读',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'disabled',
			Explanation: '禁用',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'editable',
			Explanation: '文本框可输入',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }, {
      Name: 'clearable',
			Explanation: '是否显示清除按钮',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }, {
      Name: 'size',
			Explanation: '输入框尺寸',
			Type: 'string',
			OptionalValue: 'large, small, mini',
			Defaults: '-'
  }, {
      Name: 'placeholder',
			Explanation: '占位内容',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'type',
			Explanation: '显示类型',
			Type: 'string',
			OptionalValue: 'year/month/date/week/ datetime/datetimerange/daterange',
			Defaults: 'date'
  }, {
      Name: 'format',
			Explanation: '时间日期格式化',
			Type: 'string',
			OptionalValue: '年 yyyy，月 MM，日 dd，小时 HH，分 mm，秒 ss',
			Defaults: 'yyyy-MM-dd'
  }, {
      Name: 'align',
			Explanation: '对齐方式',
			Type: 'string',
			OptionalValue: 'left, center, right',
			Defaults: 'left'
  }, {
      Name: 'popper-class',
			Explanation: 'DatePicker 下拉框的类名',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'picker-options',
			Explanation: '当前时间日期选择器特有的选项参考下表',
			Type: 'object',
			OptionalValue: '-',
			Defaults: '{ }'
  }, {
      Name: 'range-separator',
			Explanation: '选择范围时的分隔符',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '\' - \''
  }, {
      Name: 'default-value',
			Explanation: '可选，DatePicker打开时默认显示的时间',
			Type: 'Date',
			OptionalValue: '可被new Date()解析',
			Defaults: '-'
  }]
}, {
  Label: 'Picker Options',
	Type: 'objectInfo',
	Options: [{
      Name: 'shortcuts',
			Explanation: '设置快捷选项，需要传入 { text, onClick } 对象用法参考 demo 或下表',
			Type: 'Object[]',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'disabledDate',
			Explanation: '设置禁用状态，参数为当前日期，要求返回 Boolean',
			Type: 'Function',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'firstDayOfWeek',
			Explanation: '周起始日',
			Type: 'Number',
			OptionalValue: '1 到 7',
			Defaults: '7'
  }, {
      Name: 'onPick',
			Explanation: '选中日期后会执行的回调，只有当 daterange 或 datetimerange 才生效',
			Type: 'Function({ maxDate, minDate })',
			OptionalValue: '-',
			Defaults: '-'
  }]
}, {
  Label: 'Shortcuts',
	Type: 'objectInfo',
	Options: [{
      Name: 'text',
			Explanation: '标题文本',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'onClick',
			Explanation: '选中后的回调函数，参数是vm，可通过触发\'pick\'事件设置选择器的值。例如 vm.$emit(\'pick\', new Date())',
			Type: 'function',
			OptionalValue: '-',
			Defaults: '-'
  }]
}, {
  Label: 'Events',
	Type: 'events',
	Options: [{
    Name: 'change',
		Explanation: '当 input 的值改变时触发，返回值和文本框一致',
		CallBackArg: '格式化后的值'
  }]
}]

module.exports = EDatePicker
