import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import AppStudio from '@/components/AppStudio'
import Previewer from '@/components/Designers/View/Previewer'
import ApiTest from '@/components/Tests/ApiTest'
import Meta from 'vue-meta'

Vue.use(Router)
Vue.use(Meta, { keyName: 'head' })

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/ide',
      name: 'IDE',
      component: AppStudio
    },
    {
      path: '/preview',
      name: 'Preview',
      component: Previewer
    },
    {
      path: '/apitest',
      name: 'ApiTest',
      component: ApiTest
    }
  ]
})
