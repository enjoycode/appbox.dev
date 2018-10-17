const ETable = [{
  Label: 'Table Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'data',
			Explanation: '显示的数据',
			Type: 'array',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'height',
			Explanation: 'Table 的高度，默认为自动高度。如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则 Table 的高度受控于外部样式。',
			Type: 'string/number',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'max-height',
			Explanation: 'Table 的最大高度',
			Type: 'string/number',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'stripe',
			Explanation: '是否为斑马纹 table',
			Type: 'boolean	',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'border',
			Explanation: '是否带有纵向边框',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'fit',
			Explanation: '列的宽度是否自撑开	',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }, {
      Name: 'show-header',
			Explanation: '是否显示表头',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }, {
      Name: 'highlight-current-row',
			Explanation: '是否要高亮当前行',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'current-row-key',
			Explanation: '当前行的 key，只写属性',
			Type: 'String,Number',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'row-class-name',
			Explanation: '行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。',
			Type: 'Function(row, index)/String',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'row-style',
			Explanation: '行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。',
			Type: 'Function(row, index)/Object',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'row-key',
			Explanation: '行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能的情况下，该属性是必填的',
			Type: 'Function(row)/String',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'empty-text',
			Explanation: '空数据时显示的文本内容，也可以通过 slot="empty" 设置',
			Type: 'String',
			OptionalValue: '-',
			Defaults: '暂无数据'
  }, {
      Name: 'default-expand-all',
			Explanation: '是否默认展开所有行，当 Table 中存在 type="expand" 的 Column 的时候有效',
			Type: 'Boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'expand-row-keys',
			Explanation: '可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。',
			Type: 'Array',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'default-sort',
			Explanation: '默认的排序列的prop和顺序。它的prop属性指定默认的排序的列，order指定默认排序的顺序',
			Type: 'Object',
			OptionalValue: 'order: ascending, descending',
			Defaults: '如果只指定了prop, 没有指定order, 则默认顺序是ascending'
  }, {
      Name: 'tooltip-effect',
			Explanation: 'tooltip effect 属性',
			Type: 'String',
			OptionalValue: 'dark/light',
			Defaults: '-'
  }, {
      Name: 'show-summary',
			Explanation: '是否在表尾显示合计行',
			Type: 'Boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'sum-text',
			Explanation: '合计行第一列的文本',
			Type: 'String',
			OptionalValue: '-',
			Defaults: '合计'
  }, {
      Name: 'summary-method',
			Explanation: '自定义的合计计算方法',
			Type: 'Function({ columns, data })',
			OptionalValue: '-',
			Defaults: '-'
  }]
}, {
  Label: 'Table Events',
	Type: 'events',
	Options: [{
    Name: 'select',
		Explanation: '当用户手动勾选数据行的 Checkbox 时触发的事件',
		CallBackArg: 'selection, row'
  }, {
    Name: 'select-all',
		Explanation: '当用户手动勾选全选 Checkbox 时触发的事件',
		CallBackArg: 'selection'
  }, {
    Name: 'selection-change',
		Explanation: '当选择项发生变化时会触发该事件',
		CallBackArg: 'selection'
  }, {
    Name: 'cell-mouse-enter',
		Explanation: '当单元格 hover 进入时会触发该事件',
		CallBackArg: 'row, column, cell, event'
  }, {
    Name: 'cell-mouse-leave',
		Explanation: '当单元格 hover 退出时会触发该事件',
		CallBackArg: 'row, column, cell, event'
  }, {
    Name: 'cell-click',
		Explanation: '当某个单元格被点击时会触发该事件',
		CallBackArg: 'row, column, cell, event'
  }, {
    Name: 'cell-dblclick',
		Explanation: '当某个单元格被双击击时会触发该事件',
		CallBackArg: 'row, column, cell, event'
  }, {
    Name: 'row-click',
		Explanation: '当某一行被点击时会触发该事件',
		CallBackArg: 'row, column, cell, event'
  }, {
    Name: 'row-contextmenu',
		Explanation: '当某一行被鼠标右键点击时会触发该事件',
		CallBackArg: 'row, event'
  }, {
    Name: 'row-dblclick',
		Explanation: '当某一行被双击时会触发该事件',
		CallBackArg: 'row, event'
  }, {
    Name: 'header-click',
		Explanation: '当某一列的表头被点击时会触发该事件',
		CallBackArg: 'column, event'
  }, {
    Name: 'sort-change',
		Explanation: '当表格的排序条件发生变化的时候会触发该事件',
		CallBackArg: '{ column, prop, order }'
  }, {
    Name: 'filter-change',
		Explanation: '当表格的筛选条件发生变化的时候会触发该事件，参数的值是一个对象，对象的 key 是 column 的 columnKey，对应的 value 为用户选择的筛选条件的数组。',
		CallBackArg: 'filters'
  }, {
    Name: 'current-change',
		Explanation: '当表格的当前行发生变化的时候会触发该事件，如果要高亮当前行，请打开表格的 highlight-current-row 属性',
		CallBackArg: 'currentRow, oldCurrentRow'
  }, {
    Name: 'header-dragend',
		Explanation: '当拖动表头改变了列的宽度的时候会触发该事件',
		CallBackArg: 'newWidth, oldWidth, column, event'
  }, {
    Name: 'expand',
		Explanation: '当用户对某一行展开或者关闭的上会触发该事件',
		CallBackArg: 'row, expanded'
  }]
}, {
  Label: 'Table Methods',
	Type: 'methods',
	Options: [{
    Name: 'clearSelection',
		Explanation: '用于多选表格，清空用户的选择，当使用 reserve-selection 功能的时候，可能会需要使用此方法',
		CallBackArg: 'selection'
  }, {
    Name: 'toggleRowSelection',
		Explanation: '用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）',
		CallBackArg: 'row, selected'
  }, {
    Name: 'setCurrentRow',
		Explanation: '用于单选表格，设定某一行为选中行，如果调用时不加参数，则会取消目前高亮行的选中状态。',
		CallBackArg: 'row'
  }]
}, {
  Label: 'Table Slot',
	Type: 'slot',
	Options: [{
    Name: 'append',
		Explanation: '插入至表格最后一行之后的内容，仍然位于 <tbody> 标签内。如果需要对表格的内容进行无限滚动操作，可能需要用到这个 slot。若表格有合计行，该 slot 会位于合计行之上。'
  }]
}, {
  Label: 'Table-column Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'type',
			Explanation: '对应列的类型。如果设置了 selection 则显示多选框；如果设置了 index 则显示该行的索引（从 1 开始计算）；如果设置了 expand 则显示为一个可展开的按钮',
			Type: 'string',
			OptionalValue: 'selection/index/expand',
			Defaults: '-'
  }, {
      Name: 'column-key',
			Explanation: 'column 的 key，如果需要使用 filter-change 事件，则需要此属性标识是哪个 column 的筛选条件',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'label',
			Explanation: '显示的标题',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'prop',
			Explanation: '对应列内容的字段名，也可以使用 property 属性',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'width',
			Explanation: '对应列的宽度',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'min-width',
			Explanation: '对应列的最小宽度，与 width 的区别是 width 是固定的，min-width 会把剩余宽度按比例分配给设置了 min-width 的列	',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'fixed',
			Explanation: '列是否固定在左侧或者右侧，true 表示固定在左侧',
			Type: 'string, boolean',
			OptionalValue: 'true, left, right',
			Defaults: '-'
  }, {
      Name: 'render-header',
			Explanation: '列标题 Label 区域渲染使用的 Function',
			Type: 'Function(h, { column, $index })',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'sortable',
			Explanation: '对应列是否可以排序，如果设置为 \'custom\'，则代表用户希望远程排序，需要监听 Table 的 sort-change 事件',
			Type: 'boolean, string',
			OptionalValue: 'true, false, \'custom\'',
			Defaults: 'false'
  }, {
      Name: 'sort-method',
			Explanation: '对数据进行排序的时候使用的方法，仅当 sortable 设置为 true 的时候有效，需返回一个布尔值',
			Type: 'Function(a, b)',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'resizable',
			Explanation: '对应列是否可以通过拖动改变宽度（需要在 el-table 上设置 border 属性为真）',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }, {
      Name: 'formatter',
			Explanation: '用来格式化内容',
			Type: 'Function(row, column)',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'show-overflow-tooltip',
			Explanation: '当内容过长被隐藏时显示 tooltip',
			Type: 'Boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'align',
			Explanation: '对齐方式',
			Type: 'String',
			OptionalValue: 'left/center/right',
			Defaults: 'left'
  }, {
      Name: 'header-align',
			Explanation: '表头对齐方式，若不设置该项，则使用表格的对齐方式',
			Type: 'String',
			OptionalValue: 'left/center/right',
			Defaults: '-'
  }, {
      Name: 'class-name',
			Explanation: '列的 className',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'label-class-name',
			Explanation: '当前列标题的自定义类名',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'selectable',
			Explanation: '仅对 type=selection 的列有效，类型为 Function，Function 的返回值用来决定这一行的 CheckBox 是否可以勾选',
			Type: 'Function(row, index)',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'reserve-selection',
			Explanation: '仅对 type=selection 的列有效，类型为 Boolean，为 true 则代表会保留之前数据的选项，需要配合 Table 的 clearSelection 方法使用。',
			Type: 'Boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'filters',
			Explanation: '数据过滤的选项，数组格式，数组中的元素需要有 text 和 value 属性。',
			Type: 'Array[{ text, value }]',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'filter-placement',
			Explanation: '过滤弹出框的定位',
			Type: 'String',
			OptionalValue: '与 Tooltip 的 placement 属性相同',
			Defaults: '-'
  }, {
      Name: 'filter-multiple',
			Explanation: '数据过滤的选项是否多选',
			Type: 'Boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }, {
      Name: 'filter-method',
			Explanation: '数据过滤使用的方法，如果是多选的筛选项，对每一条数据会执行多次，任意一次返回 true 就会显示。',
			Type: 'Function(value, row)',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'filtered-value',
			Explanation: '选中的数据过滤项，如果需要自定义表头过滤的渲染方式，可能会需要此属性。',
			Type: 'Array',
			OptionalValue: '-',
			Defaults: '-'
  }]
}]

module.exports = ETable
