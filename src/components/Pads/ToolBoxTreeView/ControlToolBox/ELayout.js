const ELayout = [{
  Label: 'Row Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'gutter',
			Explanation: '栅格间隔',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '0'
  }, {
      Name: 'type',
			Explanation: '布局模式，可选 flex，现代浏览器下有效',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'justify',
			Explanation: 'flex 布局下的水平排列方式',
			Type: 'string',
			OptionalValue: 'start/end/center/space-around/space-between',
			Defaults: 'start'
  }, {
      Name: 'align',
			Explanation: 'flex 布局下的垂直排列方式',
			Type: 'string',
			OptionalValue: 'top/middle/bottom',
			Defaults: 'top'
  }, {
      Name: 'tag',
			Explanation: '自定义元素标签',
			Type: 'string',
			OptionalValue: '*',
			Defaults: 'div'
  }]
}, {
  Label: 'Col Attributes',
	Type: 'attributes',
	Options: [{
      Name: 'span',
			Explanation: '栅格占据的列数',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'offset',
			Explanation: '栅格左侧的间隔格数',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '0'
  }, {
      Name: 'push',
			Explanation: '栅格向右移动格数',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '0'
  }, {
      Name: 'pull',
			Explanation: '栅格向左移动格数',
			Type: 'number',
			OptionalValue: '-',
			Defaults: '0'
  }, {
      Name: 'xs',
			Explanation: '<768px 响应式栅格数或者栅格属性对象',
			Type: 'number/object (例如： {span: 4, offset: 4})',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'sm',
			Explanation: '≥768px 响应式栅格数或者栅格属性对象',
			Type: 'number/object (例如： {span: 4, offset: 4})',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'md',
			Explanation: '≥992 响应式栅格数或者栅格属性对象',
			Type: 'number/object (例如： {span: 4, offset: 4})',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'lg',
			Explanation: '≥1200 响应式栅格数或者栅格属性对象',
			Type: 'number/object (例如： {span: 4, offset: 4})',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'tag',
			Explanation: '自定义元素标签',
			Type: 'string',
			OptionalValue: '*',
			Defaults: 'div'
  }]
}]

module.exports = ELayout
