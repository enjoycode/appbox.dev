const EInput = [{
	Label: 'Input Attributes',
	Type: 'attributes',
	Options: [{
			Name: 'type',
			Explanation: '类型',
			Type: 'string',
			OptionalValue: 'text/textarea',
			Defaults: 'text'
		},
		{
			Name: 'value',
			Explanation: '绑定值',
			Type: 'string,number',
			OptionalValue: '-',
			Defaults: '-'
		},
		{
			Name: 'maxlength',
			Explanation: '最大输入长度',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '-'
		},
		{
			Name: 'minlength',
			Explanation: '最小输入长度',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '-'
		},
		{
			Name: 'placeholder',
			Explanation: '输入框占位文本',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
		},
		{
			Name: 'disabled',
			Explanation: '禁用',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
		},
		{
			Name: 'size',
			Explanation: '输入框尺寸，只在 type!="textarea" 时有效',
			Type: 'string',
			OptionalValue: 'large, small, mini',
			Defaults: '-'
		},
		{
			Name: 'icon',
			Explanation: '输入框尾部图标',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
		},
		{
			Name: 'rows',
			Explanation: '输入框行数，只对 type="textarea" 有效',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '2'
		},
		{
			Name: 'autosize',
			Explanation: '自适应内容高度，只对 type="textarea" 有效，可传入对象，如，{ minRows: 2, maxRows: 6 }',
			Type: 'boolean/object',
			OptionalValue: '-',
			Defaults: 'false'
		},
		{
			Name: 'auto-complete',
			Explanation: '原生属性，自动补全',
			Type: 'string',
			OptionalValue: 'on, off',
			Defaults: 'off'
		},
		{
			Name: 'name',
			Explanation: '原生属性',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
		},
		{
			Name: 'readonly',
			Explanation: '原生属性，是否只读',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
		},
		{
			Name: 'max',
			Explanation: '原生属性，设置最大值',
			Type: '-',
			OptionalValue: '-',
			Defaults: '-'
		},
		{
			Name: 'min',
			Explanation: '原生属性，设置最小值',
			Type: '-',
			OptionalValue: '-',
			Defaults: '-'
		},
		{
			Name: 'step',
			Explanation: '原生属性，设置输入字段的合法数字间隔',
			Type: '-',
			OptionalValue: '-',
			Defaults: '-'
		},
		{
			Name: 'resize',
			Explanation: '控制是否能被用户缩放',
			Type: 'string',
			OptionalValue: 'none, both, horizontal, vertical',
			Defaults: '-'
		},
		{
			Name: 'autofocus',
			Explanation: '原生属性，自动获取焦点',
			Type: 'boolean',
			OptionalValue: 'true, false',
			Defaults: 'false'
		},
		{
			Name: 'form',
			Explanation: '原生属性',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
		},
		{
			Name: 'on-icon-click',
			Explanation: '点击 Input 内的图标的钩子函数',
			Type: 'function',
			OptionalValue: '-',
			Defaults: '-'
		}
	]
}, {
	Label: 'Input Events',
	Type: 'events',
	Options: [{
		Name: 'click',
		Explanation: '点击Input内的图标时触发',
		CallBackArg: '(evet:Event)'
	},
	{
		Name: 'blur',
		Explanation: '在Input失去焦点时触发',
		CallBackArg: '(evet:Event)'
	},
	{
		Name: 'focus',
		Explanation: '在Input获得焦点时触发',
		CallBackArg: '(evet:Event)'
	},
	{
		Name: 'change',
		Explanation: '在Input值改变时触发',
		CallBackArg: '(value:string|number)'
	}
]
}, {
	Label: 'Autocomplete Attributes',
	Type: 'attributes',
	Options: [{
		Name: 'placeholder',
		Explanation: '输入框占位文本',
		Type: 'string',
		OptionalValue: '-',
		Defaults: '-'
	},
	{
		Name: 'disabled',
		Explanation: '禁用',
		Type: 'boolean',
		OptionalValue: '-',
		Defaults: 'false'
	},
	{
		Name: 'props',
		Explanation: '配置选项，具体见下表',
		Type: 'object',
		OptionalValue: '-',
		Defaults: '-'
	},
	{
		Name: 'value',
		Explanation: '必填值输入绑定值',
		Type: 'string',
		OptionalValue: '-',
		Defaults: '-'
	},
	{
		Name: 'custom-item',
		Explanation: '通过该参数指定自定义的输入建议列表项的组件名',
		Type: 'string',
		OptionalValue: '-',
		Defaults: '-'
	},
	{
		Name: 'fetch-suggestions',
		Explanation: '返回输入建议的方法，仅当你的输入建议数据 resolve 时，通过调用 callback(data:[]) 来返回它',
		Type: 'Function(queryString, callback)',
		OptionalValue: '-',
		Defaults: '-'
	},
	{
		Name: 'popper-class',
		Explanation: 'Autocomplete 下拉列表的类名',
		Type: 'string',
		OptionalValue: '-',
		Defaults: '-'
	},
	{
		Name: 'trigger-on-focus',
		Explanation: '是否在输入框 focus 时显示建议列表',
		Type: 'boolean',
		OptionalValue: '-',
		Defaults: 'true'
	},
	{
		Name: 'on-icon-click',
		Explanation: '点击图标的回调函数',
		Type: 'function',
		OptionalValue: '-',
		Defaults: '-'
	},
	{
		Name: 'icon',
		Explanation: '输入框尾部图标',
		Type: 'string',
		OptionalValue: '-',
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
		Defaults: 'value'
	}, {
		Name: 'label',
		Explanation: '指定选项标签为选项对象的某个属性值',
		Type: 'string',
		OptionalValue: '-',
		Defaults: 'value'
	}]
}, {
	Label: 'Autocomplete Events',
	Type: 'events',
	Options: [{
		Name: 'select',
		Explanation: '点击选中建议项时触发',
		CallBackArg: '选中建议项'
	}]
}]

module.exports = EInput
