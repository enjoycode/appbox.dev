// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './components/DesignStore'
import Channel from '@/assets/js/channel.ws'
import cookie from '@/assets/js/cookie'
import registerComponents from './ComponentRegister'
import Runtime from '@/assets/js/Runtime'
import VueMoment from 'vue-moment'

Vue.config.productionTip = false

// promise polyfill
if (!window.Promise) {
    var Promise = require('promise-polyfill').default
    var setAsap = require('setasap')
    Promise._immediateFn = setAsap
    window.Promise = Promise
}
// Array.find polyfill https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
    /* eslint-disable no-extend-native */
    Object.defineProperty(Array.prototype, 'find', {
        value: function (predicate) {
            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw new TypeError('"this" is null or not defined')
            }
            var o = Object(this)
            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0
            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function')
            }
            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            var thisArg = arguments[1]
            // 5. Let k be 0.
            var k = 0
            // 6. Repeat, while k < len
            while (k < len) {
                // a. Let Pk be ! ToString(k).
                // b. Let kValue be ? Get(O, Pk).
                // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                // d. If testResult is true, return kValue.
                var kValue = o[k]
                if (predicate.call(thisArg, kValue, k, o)) {
                    return kValue
                }
                // e. Increase k by 1.
                k++
            }

            // 7. Return undefined.
            return undefined
        }
    })
}

Vue.use(VueMoment)

// 注册Vue相关插件
Vue.prototype.$cookie = cookie // todo: 待移除
Runtime._isDevelopment = true
Runtime.cookie = cookie
Vue.prototype.$runtime = Runtime

// todo:根据是否预览加载不同的路由表
// 根据是否预览进行相关处理
const isPreview = document.location.href.indexOf('/preview') > 0 // todo:暂简单判断
if (!isPreview) {
    Vue.prototype.$channel = Channel
    store.router = router
}

// 注册全局组件
registerComponents()

/* eslint-disable no-new */
new Vue({ el: '#app', router, render: h => h(App) })
