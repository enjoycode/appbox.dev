const EPagination = [{
  Label: 'Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'small',
			Explanation: '是否使用小型分页样式',
			Type: 'Boolean',
			OptionalValue: '-',
			Defaults: 'false'
  }, {
      Name: 'page-size',
			Explanation: '每页显示条目个数',
			Type: 'Number',
			OptionalValue: '-',
			Defaults: '10'
  }, {
      Name: 'total',
			Explanation: '总条目数',
			Type: 'Number',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'page-count',
			Explanation: '总页数，total 和 page-count 设置任意一个就可以达到显示页码的功能；如果要支持 page-sizes 的更改，则需要使用 total 属性',
			Type: 'Number',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'current-page',
			Explanation: '当前页数，支持 .sync 修饰符',
			Type: 'Number',
			OptionalValue: '-',
			Defaults: '1'
  }, {
      Name: 'layout',
			Explanation: '组件布局，子组件名用逗号分隔',
			Type: 'String',
			OptionalValue: 'sizes, prev, pager, next, jumper, ->, total, slot',
			Defaults: '\'prev, pager, next, jumper, ->, total\''
  }]
}, {
  Label: 'Events',
	Type: 'events',
	Options: [{
    Name: 'size-change',
		Explanation: 'pageSize 改变时会触发',
		CallBackArg: '每页条数size'
  }, {
    Name: 'current-change',
		Explanation: 'currentPage 改变时会触发',
		CallBackArg: '当前页currentPage'
  }]
}, {
  Label: 'Slot',
	Type: 'slot',
	Options: [{
    Name: '-',
		Explanation: '自定义内容，需要在 layout 中列出 slot'
  }]
}]

module.exports = EPagination
