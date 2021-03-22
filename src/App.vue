<template>
    <div id="app">
        <view-styles/>
        <router-view></router-view>
    </div>
</template>

<script>
import ViewStyles from './ViewStyles'
import Vue from "vue";
import {Component, Prop, Watch} from "vue-property-decorator";
import LoadView from "@/design/LoadView";
import * as tslib from "tslib";

// 关于实现body填充window参考: https://stackoverflow.com/questions/6654958/make-body-have-100-of-the-browser-height

export default {
    name: 'app',
    components: {ViewStyles: ViewStyles},
    created() {
        //初始化异步加载视图模型,设计与预览都需要
        window.Vue = Vue
        window.Component = Component
        window.Prop = Prop
        window.Watch = Watch
        window.tslib_1 = tslib
        window.View = (viewModelId) => LoadView(viewModelId, this.$root)
    }
}
</script>

<style>
html,
body,
#app {
    height: 100%;
}

body {
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    margin: 0;
    overflow: auto;
}
</style>
<style scoped>
#app >>> .el-table__header-wrapper th {
    /* 所有表头的背景色 */
    background-color: #F5F7FA;
}
</style>
