const ETimePicker = [{
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
      Name: 'value',
			Explanation: '绑定值',
			Type: 'TimePicker: DateTimeSelect: String',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'align',
			Explanation: '对齐方式',
			Type: 'string',
			OptionalValue: 'left, center, right',
			Defaults: 'left'
  }, {
      Name: 'popper-class',
			Explanation: 'TimePicker 下拉框的类名',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'picker-options',
			Explanation: '当前时间日期选择器特有的选项参考下表',
			Type: 'object',
			OptionalValue: '-',
			Defaults: '{ }'
  }]
}, {
  Label: 'Time Select Options',
	Type: 'objectInfo',
	Options: [{
      Name: 'start',
			Explanation: '开始时间',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '09:00'
  }, {
      Name: 'end',
			Explanation: '结束时间',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '18:00'
  }, {
      Name: 'step',
			Explanation: '间隔时间',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '00:30'
  }, {
      Name: 'minTime',
			Explanation: '最小时间，小于该时间的时间段将被禁用',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '00:00'
  }, {
      Name: 'maxTime',
			Explanation: '最大时间，大于该时间的时间段将被禁用',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }]
}, {
  Label: 'Time Picker Options',
	Type: 'objectInfo',
	Options: [{
      Name: 'selectableRange',
			Explanation: '可选时间段，例如\'18:30:00 - 20:30:00\'或者传入数组[\'09:30:00 - 12:00:00\', \'14:30:00 - 18:30:00\']',
			Type: 'string/array',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'format',
			Explanation: '时间格式化(TimePicker)',
			Type: 'string',
			OptionalValue: '小时：HH，分：mm，秒：ss',
			Defaults: '\'HH:mm:ss\''
  }]
}, {
  Label: 'Events',
	Type: 'events',
	Options: [{
    Name: 'change',
		Explanation: '当 input 的值改变时触发，返回值和文本框一致',
		CallBackArg: 'formatted value'
  }]
}]

module.exports = ETimePicker
