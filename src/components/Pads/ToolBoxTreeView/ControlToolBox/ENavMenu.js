const ENavMenu = [{
  Label: 'Menu Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'mode',
			Explanation: '模式',
			Type: 'string',
			OptionalValue: 'horizontal,vertical',
			Defaults: 'vertical'
  }, {
      Name: 'theme',
			Explanation: '主题色',
			Type: 'string',
			OptionalValue: 'light,dark',
			Defaults: 'light'
  }, {
      Name: 'default-active',
			Explanation: '当前激活菜单的 index',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'default-openeds',
			Explanation: '当前打开的submenu的 key 数组',
			Type: 'Array',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'unique-opened',
			Explanation: '是否只保持一个子菜单的展开',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'menu-trigger',
			Explanation: '子菜单打开的触发方式(只在 mode 为 horizontal 时有效)',
			Type: 'string',
			OptionalValue: '-',
			Defaults: 'hover'
  }, {
      Name: 'router',
			Explanation: '是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }]
}, {
	Label: 'Menu Events',
	Type: 'events',
	Options: [{
		Name: 'select',
		Explanation: '菜单激活回调',
		CallBackArg: 'index: 选中菜单项的 indexPath: 选中菜单项的 index path'
	},
	{
		Name: 'open',
		Explanation: 'SubMenu 展开的回调',
		CallBackArg: 'index: 打开的 subMenu 的 index， indexPath: 打开的 subMenu 的 index path'
	},
	{
		Name: 'close',
		Explanation: 'SubMenu 收起的回调',
		CallBackArg: 'index: 收起的 subMenu 的 index， indexPath: 收起的 subMenu 的 index path'
	}]
}, {
  Label: 'SubMenu Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'index',
			Explanation: '唯一标志',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }]
}, {
  Label: 'Menu-Item Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'index',
			Explanation: '唯一标志',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'route',
			Explanation: 'Vue Router 路径对象',
			Type: 'Object',
			OptionalValue: '-',
			Defaults: '-'
  }]
}, {
  Label: 'Menu-Group Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'title',
			Explanation: '分组标题',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }]
}]

module.exports = ENavMenu
