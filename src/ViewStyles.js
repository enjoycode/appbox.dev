// 用于管理视图组件的局部样式
// todo:考虑移至App.vue内处理

export default {
    name: 'ViewStyles',
    data() {
        return {
            views: {},
            styles: []
        }
    },

    methods: {
        updateStyles() {
            var items = []
            for (var view in this.views) {
                items.push(this.views[view].styles)
            }
            this.styles = items
        },

        // 视图加载成功,注意：调用者过滤没有styles的组件
        viewCreated(viewId, styles) {
            var vid = viewId.replace('.', '_')
            if (this.views[vid]) {
                this.views[vid].count += 1
            } else {
                this.views[vid] = {
                    count: 1,
                    styles: styles
                }
                this.updateStyles()
            }
        },
        // 视图被destroyed
        viewDestroyed(viewId) {
            var vid = viewId.replace('.', '_')
            if (this.views[vid]) {
                this.views[vid].count -= 1
                if (this.views[vid].count <= 0) {
                    delete this.views[vid]
                    this.updateStyles() // this.$forceUpdate()
                }
            }
        }
    },
    render(h) {
        return h('div', this.styles.map(function (item) {
            return h('style', null, item)
        }))
    }
}
