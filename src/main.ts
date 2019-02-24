// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './components/DesignStore'
import Channel from '@/assets/js/channel.ws'
import cookie from '@/assets/js/cookie'
import registerComponents from './ComponentRegister'
import Runtime from '@/assets/js/Runtime'
import polyfill from './polyfill'
// import VueMoment from 'vue-moment'

Vue.config.productionTip = false

// Vue.use(VueMoment)

polyfill()

// 注册Vue相关插件
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
