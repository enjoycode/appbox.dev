import {Entity} from './Entity'

// 参考: https://github.com/airyland/vux/blob/v2/src/plugins/device/index.js
const _isAndroid = /(Android);?[\s/]+([\d.]+)?/.test(navigator.userAgent)
const _isIpad = /(iPad).*OS\s([\d_]+)/.test(navigator.userAgent)
const _isIphone = !_isIpad && /(iPhone\sOS)\s([\d_]+)/.test(navigator.userAgent)
const _isWechat = /micromessenger/i.test(navigator.userAgent)
const _isAlipay = /alipayclient/i.test(navigator.userAgent)

export default {

    _isDevelopment: false,
    cookie: null,
    channel: null,

    isAndroid() {
        return _isAndroid
    },
    isIpad() {
        return _isIpad
    },
    isIphone() {
        return _isIphone
    },
    isWechat() {
        return _isWechat
    },
    isAlipay() {
        return _isAlipay
    },

    /** 用于预览窗口判断是否正在设计时 */
    isDevelopment() {
        return this._isDevelopment
    },

    /** 根据模型标识新建实体实例 */
    newEntity(modelId, obj) {
        return Object.assign(new Entity(modelId), obj)
    },

    //TODO: 提供require([js1, js2])加载外部js

    /** 获取微信JS SDK */
    getWxSdk() {
        return new Promise((resolve, reject) => { // todo: fix IE, 参照vue-resources的Promise polyfill实现
            require.ensure([], function (require) {
                resolve(require('weixin-js-sdk'))
            }, 'wxsdk')
        })
    }
}
