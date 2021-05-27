const events = []
/**
 * 通知订阅
 * @param {*} eventName 发布通知的事件名称
 * @param {*} eventData 发布事件的数据
 */
function publish(eventName, eventData) {
	// 查找当前事件名称的事件订阅列表
	let evs = events.filter(t => t.eventName == eventName)
	if (!evs || evs.length === 0)
		return
	for (const ev of evs) {
		// 防止调用的回调出错导致后续的回调终止
		try {
			ev.callback(eventData)
		} catch (error) {
		}
	}
}

export default {
	/**
	 * 注册事件监听器，监听服务端发送的事件
	 * 注意：订阅后，应在适当的时机调用@function unregister 方法取消事件的订阅
	 * @param eventName 监听的事件名称，即服务端发送时的eventName的值
	 * @param callback 收到对应的事件后的回调函数，其中会接收服务端发送改事件的事件数据参数
	 */
	register(eventName, callback) {
		events.push({ eventName, callback })
		console.log('注册事件', eventName, events.length)
	},
	/**
	 * 取消事件监听
	 * @param eventName 取消事件监听的名称
	 * @param callback 订阅时监听事件的回调函数
	 */
	unregister(eventName, callback) {
		let index = events.findIndex(t => t.eventName === eventName && t.callback === callback)
		if (index > -1)
			events.splice(index, 1)
		console.log('移除事件注册', eventName, events.length)
	},
	// 处理服务端发送的事件通知
	// 通过这个处理时，服务端返回的字段中应该包含eventName字段，用于区分事件类型
	handleEvent(body) {
		if (!body || !body.eventName)
			return
		publish(body.eventName, body)
		// console.log('receive event body', body)
	}
}