const ECascader = [{
  Label: 'Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'options',
			Explanation: '可选项数据源，键名可通过 props 属性配置',
			Type: 'array',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'props',
			Explanation: '配置选项，具体见下表',
			Type: 'object',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'value',
			Explanation: '选中项绑定值	',
			Type: 'array',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'popper-class',
			Explanation: '自定义浮层类名',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'placeholder',
			Explanation: '输入框占位文本',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '请选择'
  }, {
      Name: 'disabled',
			Explanation: '是否禁用',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'clearable',
			Explanation: '是否支持清空选项',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'expand-trigger',
			Explanation: '次级菜单的展开方式',
			Type: 'string',
			OptionalValue: 'click / hover',
			Defaults: 'click'
  }, {
      Name: 'show-all-levels',
			Explanation: '输入框中是否显示选中值的完整路径',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }, {
      Name: 'filterable',
			Explanation: '是否可搜索选项',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'debounce',
			Explanation: '搜索关键词输入的去抖延迟，毫秒',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '300'
  }, {
      Name: 'change-on-select',
			Explanation: '是否允许选择任意一级的选项',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'size',
			Explanation: '尺寸',
			Type: 'string',
			OptionalValue: 'large / small / mini',
			Defaults: '-'
  }]
}, {
  Label: 'props',
	Type: 'objectInfo',
	Options: [{
      Name: 'value',
			Explanation: '指定选项的值为选项对象的某个属性值',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'label',
			Explanation: '指定选项标签为选项对象的某个属性值',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'children',
			Explanation: '指定选项的子选项为选项对象的某个属性值',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'disabled',
			Explanation: '指定选项的禁用为选项对象的某个属性值',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'before-filter',
			Explanation: '可选参数, 筛选之前的钩子，参数为输入的值，若返回 false 或者返回 Promise 且被 reject，则停止筛选。',
			Type: 'function(value)',
			OptionalValue: '-',
			Defaults: '-'
  }]
}, {
  Label: 'Events',
	Type: 'events',
	Options: [{
    Name: 'change',
		Explanation: '当绑定值变化时触发的事件',
		CallBackArg: '当前值'
  }, {
    Name: 'active-item-change',
		Explanation: '当父级选项变化时触发的事件，仅在 change-on-select 为 false 时可用',
		CallBackArg: '各父级选项组成的数组'
  }]
}]

module.exports = ECascader
