import Vue from 'vue';
import Router from 'vue-router';
import Meta from 'vue-meta';
import Login from '@/components/Login.vue';

Vue.use(Router);
Vue.use(Meta, { keyName: 'head' });

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'Login',
            component: Login
        },
        {
            path: '/ide',
            name: 'IDE',
            component: () => import(/* webpackChunkName: "appstudio" */ './components/AppStudio.vue'),
        },
        {
            path: '/preview',
            name: 'Preview',
            component: () => import(/* webpackChunkName: "preview" */ './components/Designers/View/Previewer.vue'),
        },
        {
            path: '/apitest',
            name: 'ApiTest',
            component: () => import(/* webpackChunkName: "apitest" */ './components/Tests/ApiTest.vue'),
        }
    ]
});
