import { Message } from 'element-ui'
import store from '@/design/DesignStore'
import axios from 'axios'
import rjson from './refJSON'
import jsonp from './jsonp'
import DebugService from '@/components/Designers/Service/DebugService'

var socket

var msgIdIndex = 0 // 当前消息流水计数器
var waitHandles = [] // 已成功发送待回复的请求列表
var pendingRequires = [] // 链路断开后挂起的请求列表

/**
 * 连接至服务端
 */
function connect() {
	var scheme = document.location.protocol === 'https:' ? 'wss' : 'ws'
	var port = document.location.port ? (':' + document.location.port) : ''
	var connectionUrl = scheme + '://' + document.location.hostname + port + '/wsapi'

	socket = new WebSocket(connectionUrl)
	socket.onopen = onopen
	socket.onclose = onclose
	socket.onerror = onerror
	socket.onmessage = onmessage
}

/**
 * WebSocket链路打开
 */
function onopen(event) {
	console.log('连接建立' + event.type)
	if (pendingRequires.length > 0) {
		for (var i = 0; i < pendingRequires.length; i++) {
			var element = pendingRequires[i]
			sendRequire(element.S, element.A, element.C)
		}
		pendingRequires.splice(0, pendingRequires.length)
	}
}

function onclose(event) {
	if (event.code !== 1000) {
		Message.error('连接关闭，请重新登录')
		store.router.replace('/')
	}
}

function onerror(event) {
	Message.error('连接异常，请重新登录')
	store.router.replace('/')
}

/**
 * 接收到服务端消息，格式参照说明
 */
function onmessage(event) {
	const res = JSON.parse(event.data) // 注意：这里不做循环引用Json处理，由调用者根据需要处理
	onResult(res)
}

function onResult(res) {
	if (res.ES) { // Event
		if (res.ES === 2) { // 调试事件
			DebugService.handleDebugEvent(res.BD) //TODO: 交由DesignStore处理
		}
	} else { // InvokeResponse
		for (var i = 0; i < waitHandles.length; i++) {
			if (waitHandles[i].Id === res.I) {
				var cb = waitHandles[i].Cb
				waitHandles.splice(i, 1)
				// console.log('移除请求等待者, 还余: ' + waitHandles.length)
				if (res.E) {
					cb(res.E, null)
				} else {
					cb(null, res.D)
				}
				return
			}
		}
	}
}

/**
 * 链路断开时添加挂起的请求
 */
function addRequire(service, args, cb) {
	pendingRequires.push({ S: service, A: args, C: cb })
}

/**
 * 发送Api调用请求
 */
function sendRequire(service, args, callback) {
	// 先加入等待者列表
	msgIdIndex++
	waitHandles.push({ Id: msgIdIndex, Cb: callback })
	// console.log('加入请求等待者, 还余: ' + waitHandles.length)
	// 通过socket发送请求
	var require = { I: msgIdIndex, S: service, A: args }
	try {
		// todo:暂用此方法转义unicode
		var json = JSON.stringify(require).replace(/[\u007f-\uffff]/g,
			function (c) {
				return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4)
			}
		)
		socket.send(json)
	} catch (error) {
		console.log('WebSocket发送数据错误: ' + error.message)
		onResult({ I: require.msgIdIndex, E: '发送请求失败:' + error.message })
		return false
	}

	// 启动超时定时器
	setTimeout(function () {
		onResult({ I: require.msgIdIndex, E: '请求超时' })
	}, 10000)
	return true
}

export default {

	/**
	 * 登录并建立通讯连接
	 * user 用户名
	 * pwd 密码
	 * external 外部用户模型标识
	 */
	login(user, pwd, external) {
		// 临时方案判断socket是否已打开，已打开则关闭，主要用于防止重新登录时服务端WebSocket还绑定旧会话
		if (socket && socket.readyState === WebSocket.OPEN) {
			// socket.close(4999, 'relogin') 无效
			socket.close()
		}

		var promise = new Promise((resolve, reject) => {
			axios.post('/api/Login/post', { User: user, Password: pwd, ExternalModelID: external }, {}).then(function (response) {
				if (response.data.succeed) {
					resolve(response.data.userInfo)
				} else {
					reject(response.data.error)
				}
			}).catch(err => {
				reject(err)
			})
		})
		return promise
	},

	/**
	 * 通过第三方token验证登录
	 * @param {*} token
	 * @param {*} validator
	 */
	loginByToken(token, validator) {
		var promise = new Promise((resolve, reject) => {
			axios.post('/api/Login/LoginByToken', { Token: token, Validator: validator }, {}).then(function (response) {
				if (response.data.succeed) {
					resolve(response.data.userInfo)
				} else {
					reject(response.data.error)
				}
			}).catch(err => {
				reject(err)
			})
		})
		return promise
	},

	/**
	 * 退出登录
	 */
	logout() {
		var promise = new Promise((resolve, reject) => {
			axios.post('/api/Login/Logout', {}, {}).then(function (response) {
				resolve()
			}).catch(err => {
				reject(err)
			})
		})
		return promise
	},

	/**
	 * 调用服务端Api
	 */
	invoke(service, args) {
		var promise = new Promise((resolve, reject) => { // todo: fix IE, 参照vue-resources的Promise polyfill实现
			if (!socket || socket.readyState !== WebSocket.OPEN) {
				if (!socket || socket.readyState !== WebSocket.CONNECTING) {
					connect()
				}
				// todo:考虑挂起的列表超过阀值直接reject
				addRequire(service, args, function (err, res) {
					if (err) {
						reject(err)
					} else {
						resolve(res)
					}
				})
			} else {
				sendRequire(service, args, function (err, res) {
					if (err) {
						reject(err)
					} else {
						resolve(res)
					}
				})
			}
		})
		return promise
	},

	/**
	 * 简单ajax get封装
	 * @param {*} url
	 */
	get(url, config) {
		return axios.get(url, config)
	},

	jsonp: jsonp,

	/**
	 * 注册事件侦听器
     */
	registerEventListener(eventId, callback) {
		// todo:
	},

	resolveObjRef: rjson.resolveObjRef,
	solveObjRef: rjson.solveObjRef,
	fromRefJson: rjson.fromRefJson,
	toRefJson: rjson.toRefJson,
	/** 移除Entity实例的所有EntityRef及EntitySet引用，返回新对象 */
	detachEntityRefs: rjson.detachEntityRefs
}
