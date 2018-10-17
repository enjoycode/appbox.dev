const ETree = [{
  Label: 'Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'data',
			Explanation: '展示数据',
			Type: 'array',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'empty-text',
			Explanation: '内容为空的时候展示的文本',
			Type: 'String',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'node-key',
			Explanation: '每个树节点用来作为唯一标识的属性，整颗树应该是唯一的',
			Type: 'String',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'props',
			Explanation: '配置选项，具体看下表	',
			Type: 'object',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'load',
			Explanation: '加载子树数据的方法',
			Type: 'function(node, resolve)',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'render-content',
			Explanation: '树节点的内容区的渲染 Function',
			Type: 'Function(h, { node }',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'highlight-current',
			Explanation: '是否高亮当前选中节点，默认值是 false。',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'current-node-key',
			Explanation: '当前选中节点的 key，只写属性',
			Type: 'string, number',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'default-expand-all',
			Explanation: '是否默认展开所有节点',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'expand-on-click-node',
			Explanation: '是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }, {
      Name: 'auto-expand-parent',
			Explanation: '展开子节点的时候是否自动展开父节点',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }, {
      Name: 'default-expanded-keys',
			Explanation: '默认展开的节点的 key 的数组',
			Type: 'array',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'show-checkbox',
			Explanation: '节点是否可被选择',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'check-strictly',
			Explanation: '在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'default-checked-keys',
			Explanation: '默认勾选的节点的 key 的数组',
			Type: 'array',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'filter-node-method',
			Explanation: '对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏',
			Type: 'Function(value, data, node)',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'accordion',
			Explanation: '是否每次只打开一个同级树节点展开',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'indent',
			Explanation: '相邻级节点间的水平缩进，单位为像素',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '16'
  }]
}, {
  Label: 'props',
	Type: 'objectInfo',
	Options: [{
      Name: 'label',
			Explanation: '指定节点标签为节点对象的某个属性值',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'children',
			Explanation: '指定子树为节点对象的某个属性值',
			Type: 'String',
			OptionalValue: '-',
			Defaults: '-'
  }]
}, {
  Label: 'Methods',
	Type: 'methods',
	Options: [{
    Name: 'filter',
		Explanation: '对树节点进行筛选操作',
		CallBackArg: '接收一个任意类型的参数，该参数会在 filter-node-method 中作为第一个参数'
  }, {
    Name: 'getCheckedNodes',
		Explanation: '若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点所组成的数组',
		CallBackArg: '(leafOnly) 接收一个 boolean 类型的参数，若为 true 则仅返回被选中的叶子节点，默认值为 false'
  }, {
    Name: 'setCheckedNodes',
		Explanation: '设置目前勾选的节点，使用此方法必须设置 node-key 属性',
		CallBackArg: '(nodes) 接收勾选节点数据的数组'
  }, {
    Name: 'getCheckedKeys',
		Explanation: '若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点所组成的数组',
		CallBackArg: '(leafOnly) 接收一个 boolean 类型的参数，若为 true 则仅返回被选中的叶子节点的 keys，默认值为 false'
  }, {
    Name: 'setCheckedKeys',
		Explanation: '通过 keys 设置目前勾选的节点，使用此方法必须设置 node-key 属性',
		CallBackArg: '(keys, leafOnly) 接收两个参数，1. 勾选节点的 key 的数组 2. boolean 类型的参数，若为 true 则仅设置叶子节点的选中状态，默认值为 false'
  }, {
    Name: 'setChecked',
		Explanation: '通过 key / data 设置某个节点的勾选状态，使用此方法必须设置 node-key 属性',
		CallBackArg: '(key/data, checked, deep) 接收三个参数，1. 勾选节点的 key 或者 data 2. boolean 类型，节点是否选中 3. boolean 类型，是否设置子节点 ，默认为 false'
  }]
}, {
  Label: 'Events',
	Type: 'events',
	Options: [{
    Name: 'node-click',
		Explanation: '节点被点击时的回调',
		CallBackArg: '共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。'
  }, {
    Name: 'check-change',
		Explanation: '节点选中状态发生变化时的回调',
		CallBackArg: '共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点'
  }, {
    Name: 'current-change',
		Explanation: '当前选中节点变化时触发的事件',
		CallBackArg: '共两个参数，依次为：当前节点的数据，当前节点的 Node 对象'
  }, {
    Name: 'node-expand',
		Explanation: '节点被展开时触发的事件',
		CallBackArg: '共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。'
  }, {
    Name: 'node-collapse',
		Explanation: '节点被关闭时触发的事件',
		CallBackArg: '共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。'
  }]
}]

module.exports = ETree
