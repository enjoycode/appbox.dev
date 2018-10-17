const EMessageBox = [{
  Label: 'Options',
	Type: 'options',
	Options: [{
      Name: 'title',
			Explanation: 'MessageBox 标题',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'message',
			Explanation: 'MessageBox 消息正文内容',
			Type: 'string / VNode',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'type',
			Explanation: '消息类型，用于显示图标',
			Type: 'string',
			OptionalValue: 'success/info/warning/error',
			Defaults: '-'
  }, {
      Name: 'customClass',
			Explanation: 'MessageBox 的自定义类名',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'callback',
			Explanation: '若不使用 Promise，可以使用此参数指定 MessageBox 关闭后的回调',
			Type: 'function(action, instance)，action 的值为\'confirm\'或\'cancel\', instance 为 MessageBox 实例，可以通过它访问实例上的属性和方法',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'beforeClose',
			Explanation: 'MessageBox 关闭前的回调，会暂停实例的关闭',
			Type: 'function(action, instance, done)，action 的值为\'confirm\'或\'cancel\'；instance 为 MessageBox 实例，可以通过它访问实例上的属性和方法；done 用于关闭 MessageBox 实例',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'lockScroll',
			Explanation: '是否在 MessageBox 出现时将 body 滚动锁定',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }, {
      Name: 'showCancelButton',
			Explanation: '是否显示取消按钮',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false（以 confirm 和 prompt 方式调用时为 true）'
  }, {
      Name: 'showConfirmButton',
			Explanation: '是否显示确定按钮',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true'
  }, {
      Name: 'cancelButtonText',
			Explanation: '取消按钮的文本内容',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '取消'
  }, {
      Name: 'confirmButtonText',
			Explanation: '确定按钮的文本内容',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '确定'
  }, {
      Name: 'cancelButtonClass',
			Explanation: '取消按钮的自定义类名',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'confirmButtonClass',
			Explanation: '确定按钮的自定义类名',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'closeOnClickModal',
			Explanation: '是否可通过点击遮罩关闭 MessageBox',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true（以 alert 方式调用时为 false）'
  }, {
      Name: 'closeOnPressEscape',
			Explanation: '是否可通过按下 ESC 键关闭 MessageBox',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'true（以 alert 方式调用时为 false）'
  }, {
      Name: 'showInput',
			Explanation: '是否显示输入框',
			Type: 'boolean',
			OptionalValue: '-',
			Defaults: 'false（以 prompt 方式调用时为 true）'
  }, {
      Name: 'inputPlaceholder',
			Explanation: '输入框的占位符',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'inputValue',
			Explanation: '输入框的初始文本',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'inputPattern',
			Explanation: '输入框的校验表达式',
			Type: 'regexp',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'inputValidator',
			Explanation: '输入框的校验函数。可以返回布尔值或字符串，若返回一个字符串, 则返回结果会被赋值给 inputErrorMessage',
			Type: 'function',
			OptionalValue: '-',
			Defaults: '-'
  }, {
      Name: 'inputErrorMessage',
			Explanation: '校验未通过时的提示文本',
			Type: 'string',
			OptionalValue: '-',
			Defaults: '输入的数据不合法!'
  }]
}]

module.exports = EMessageBox
