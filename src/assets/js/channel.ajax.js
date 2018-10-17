import axios from 'axios'
import rjson from './refJSON'

export default {
	config: {},

	/**
	 * 登录并建立通讯连接
	 * user 用户名
	 * pwd 密码
	 * external 外部用户模型标识
	 */
	login(user, pwd, external) {
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
	 * @param {string} token
	 * @param {string} validator
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

	// 调用Api的简化封装
	invoke(/* String */ service, /* Array */ args) {
		var promise = new Promise((resolve, reject) => { // todo: fix IE, 参照vue-resources的Promise polyfill实现
			axios.post('/api/Invoke', { I: 0, S: service, A: args }, {}).then(res => {
				if (res.data.E) {
					reject(res.data.E)
				} else {
					resolve(res.data.D)
				}
			}).catch(err => {
				reject(err)
			})
		})
		return promise
	},

	/**
	 * 简单ajax get封装
	 * @param {string} url
	 */
	get(url, config) {
		return axios.get(url, config)
	},

	resolveObjRef: rjson.resolveObjRef,
	solveObjRef: rjson.solveObjRef,
	fromRefJson: rjson.fromRefJson,
	toRefJson: rjson.toRefJson,
	/** 移除Entity实例的所有EntityRef及EntitySet引用，返回新对象 */
	detachEntityRefs: rjson.detachEntityRefs
}
