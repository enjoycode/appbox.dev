const ETabs = [{
  Label: 'Tabs Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'type',
			Explanation: '风格类型',
			Type: 'string',
			OptionalValue: 'card/border-card',
			Defaults: '-'
  }, {
      Name: 'closable',
			Explanation: '标签是否可关闭',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'addable',
			Explanation: '标签是否可增加',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'editable',
			Explanation: '标签是否同时可增加和关闭',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'active-name(deprecated)',
			Explanation: '选中选项卡的 name',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '第一个选项卡的 name'
  }, {
      Name: 'value',
			Explanation: '绑定值，选中选项卡的 name',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '第一个选项卡的 name'
  }]
}, {
	Label: 'Tabs Events',
	Type: 'events',
	Options: [{
		Name: 'tab-click',
		Explanation: 'tab 被选中时触发',
		CallBackArg: '被选中的标签 tab 实例'
	},
	{
		Name: 'tab-remove',
		Explanation: '点击 tab 移除按钮后触发',
		CallBackArg: '被删除的标签的 name'
	},
	{
		Name: 'tab-add',
		Explanation: '点击 tabs 的新增按钮后触发',
		CallBackArg: '-'
	}, {
		Name: 'edit',
		Explanation: '点击 tabs 的新增按钮或 tab 被关闭后触发',
		CallBackArg: '(targetName, action)'
	}]
}, {
  Label: 'Tab-pane Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'label',
			Explanation: '选项卡标题',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'disabled',
			Explanation: '是否禁用',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'name',
			Explanation: '与选项卡 activeName 对应的标识符，表示选项卡别名',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '该选项卡在选项卡列表中的顺序值，如第一个选项卡则为\'1\''
  }, {
      Name: 'closable',
			Explanation: '标签是否可关闭',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }]
}]

module.exports = ETabs
