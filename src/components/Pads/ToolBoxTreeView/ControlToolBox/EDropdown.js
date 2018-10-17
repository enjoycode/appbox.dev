const EDropdown = [{
  Label: 'Dropdown Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'type',
			Explanation: '菜单按钮类型，同 Button 组件(只在split-button为 true 的情况下有效)',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'size',
			Explanation: '菜单按钮尺寸，同 Button 组件(只在split-button为 true 的情况下有效)',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'split-button',
			Explanation: '下拉触发元素呈现为按钮组',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'menu-align',
			Explanation: '菜单水平对齐方向',
			Type: 'string',
			OptionalValue: 'start, end',
			Defaults: 'end'
  }, {
      Name: 'trigger',
			Explanation: '触发下拉的行为',
			Type: 'string',
			OptionalValue: 'hover, click',
			Defaults: 'hover'
  }, {
      Name: 'hide-on-click',
			Explanation: '是否在点击菜单项后隐藏菜单',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }]
}, {
	Label: 'Dropdown Events',
	Type: 'events',
	Options: [{
		Name: 'click',
		Explanation: 'split-button 为 true 时，点击左侧按钮的回调',
		CallBackArg: '-'
	},
	{
		Name: 'command',
		Explanation: '点击菜单项触发的事件回调',
		CallBackArg: 'dropdown-item 的指令'
	},
	{
		Name: 'visible-change',
		Explanation: '下拉框出现/隐藏时触发',
		CallBackArg: '出现则为 true，隐藏则为 false'
	}]
}, {
  Label: 'Dropdown Menu Item Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'command',
			Explanation: '指令',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'disabled',
			Explanation: '禁用',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'divided',
			Explanation: '显示分割线',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }]
}]

module.exports = EDropdown
