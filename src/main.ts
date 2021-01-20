// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import polyfill from './polyfill'
import initRuntime from './InitRuntime'
import registerComponents from './ComponentRegister'

Vue.config.productionTip = false

polyfill()
initRuntime() // IDE初始化运行时
registerComponents() // 注册全局组件

/* eslint-disable no-new */
new Vue({ el: '#app', router, render: h => h(App) })
