const EForm = [{
  Label: 'Form Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'model',
			Explanation: '表单数据对象',
			Type: 'object',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'rules',
			Explanation: '表单验证规则',
			Type: 'object',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'inline',
			Explanation: '行内表单模式',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'label-position',
			Explanation: '表单域标签的位置',
			Type: 'string',
			OptionalValue: 'right/left/top',
			Defaults: 'right'
  }, {
      Name: 'label-width',
			Explanation: '表单域标签的宽度，所有的 form-item 都会继承 form 组件的 labelWidth 的值',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'label-suffix',
			Explanation: '表单域标签的后缀',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'show-message',
			Explanation: '是否显示校验错误信息',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }]
}, {
  Label: 'Form Methods',
	Type: 'methods',
	Options: [{
    Name: 'validate',
		Explanation: '对整个表单进行校验的方法',
		CallBackArg: 'Function(callback: Function(boolean))'
  }, {
    Name: 'validateField',
		Explanation: '对部分表单字段进行校验的方法',
		CallBackArg: 'Function(prop: string, callback: Function(errorMessage: string))'
  }, {
    Name: 'resetFields',
		Explanation: '对整个表单进行重置，将所有字段值重置为初始值并移除校验结果',
		CallBackArg: '-'
  }]
}, {
  Label: 'Form-Item Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'prop',
			Explanation: '表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的',
			Type: 'string',
			OptionalValue: '传入 Form 组件的 model 中的字段',
			Defaults: '-'
  }, {
      Name: 'label',
			Explanation: '标签文本',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'label-width',
			Explanation: '表单域标签的的宽度，例如 \'50px\'',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'required',
			Explanation: '是否必填，如不设置，则会根据校验规则自动生成',
			Type: 'bolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'rules',
			Explanation: '表单验证规则',
			Type: 'object',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'error',
			Explanation: '表单域验证错误信息, 设置该值会使表单验证状态变为error，并显示该错误信息',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'show-message',
			Explanation: '是否显示校验错误信息',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }]
}, {
  Label: 'Form-Item Slot',
	Type: 'slot',
	Options: [{
    Name: '-',
		Explanation: 'Form Item 的内容'
  }, {
    Name: 'label',
		Explanation: '标签文本的内容'
  }]
}]

module.exports = EForm
