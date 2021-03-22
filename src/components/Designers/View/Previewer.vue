<template>
    <div :style="{zoom: zoom}" style="height:100%">
        <view-style ref="viewStyle"></view-style>
        <component v-if="dynamicView !== null" :is="dynamicView"></component>
    </div>
</template>

<script>
const ViewStyle = {
    data() {
        return {styles: ''}
    },
    render(h) {
        return h('style', null, this.styles)
    }
};

export default {
    components: {ViewStyle: ViewStyle},

    data() {
        return {dynamicView: null, zoom: 1}
    },

    created() {
        // 初始化运行时
        let store = window.$store
        window.$designer.previewer = this
        // 设置路由拦截，注意：拦截的是当前的路由实例
        this.$router.beforeEach((to, from, next) => {
            console.log('路由:', from, to)
            if (from.name === 'Preview') {
                let paths = to.path.split('/')
                // todo:特殊路径如自定义的处理
                if (paths.length === 3) {
                    let node = store.tree.findNode(22, paths[1] + '.' + paths[2])
                    if (node) {
                        store.tree.selectNode(node)
                        store.tree.onCurrentChanged(node) // 暂手动激发变更事件
                    }
                    next(false)
                    return
                }
            }
            next()
        })
    },
    mounted() {
        window.$designer.updatePreview() // 通知视图设计器更新预览
    },
    destroyed() {
        window.$designer.previewer = null
    },

    methods: {
        update(code, styles) { // 注意：不能在IDE编译好后传入，存在window.View指向问题
            if (styles) {
                this.$refs.viewStyle.styles = styles
            }

            if (code) {
                try {
                    this.dynamicView = new Function(code)() || {} // eslint-disable-line
                } catch (error) {
                    console.log('组件定义错误: ' + error) // todo:返回错误
                }
            }
        },

        /** 用于改变自适应模式的缩放比率，注意：不改变相应的iframe的大小 */
        changeZoom(val) {
            this.zoom = val
        }
    }
}
</script>
