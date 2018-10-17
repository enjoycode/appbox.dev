<template>
    <div :style="{zoom: zoom}" style="height:100%">
        <view-style ref="viewStyle"></view-style>
        <component v-if="dynamicView !== null" :is="dynamicView"></component>
    </div>
</template>

<script>
    import Vue from 'vue'
    // import { Component, Inject, Model, Prop, Watch } from 'vue-property-decorator'
    import { Component, Prop, Watch } from 'vue-property-decorator'


    var ViewStyle = {
        data() {
            return { styles: '' }
        },
        render(h) {
            return h('style', null, this.styles)
        }
    }

    export default {
        components: { ViewStyle: ViewStyle },

        data() {
            return { dynamicView: null, zoom: 1 }
        },

        created() {
            // 初始化运行时
            let store = window.$store
            window.$designer.previewer = this

            window.Vue = Vue // todo: check need it?
            window.Vue.prototype.$channel = store.channel
            window.Component = Component
            window.Prop = Prop
            window.Watch = Watch
            window.View = this.loadView
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
            },

            /** 该实现仅用于设计时异步加载ViewModel的组件，不使用缓存，加载的样式使用App.ViewStyles组件控制 */
            loadView(viewModelID) {
                var name = viewModelID.replace('.', '')
                return Vue.component(name, function (resolve, reject) {
                    // 开始Download代码及样式，注意：不能用this.$channel，因实例化时尚未注入
                    window.$store.channel.invoke('sys.DesignHub.LoadView', [viewModelID]).then(res => {
                        const result = JSON.parse(res)
                        if (!result.Code) {
                            reject('视图模型尚未编译')
                        }

                        // 定义需要的样式控制
                        var styleMixin = null
                        if (result.Style) {
                            styleMixin = {
                                created() {
                                    // console.log('织入样式', this.$root.$children[0].$children[0])
                                    this.$root.$children[0].$children[0].viewCreated(viewModelID, result.Style)
                                },
                                destroyed() {
                                    // console.log('取消织入样式')
                                    this.$root.$children[0].$children[0].viewDestroyed(viewModelID)
                                }
                            }
                        }

                        try {
                            var vueProfile = new Function(result.Code)() || {} // eslint-disable-line
                            if (result.Style) {
                                // vueProfile.options.mixins.push(styleMixin) // 此种方式无效，注入样式控制
                                if (vueProfile.options.created) {
                                    vueProfile.options.created = [styleMixin.created].concat(vueProfile.options.created)
                                } else {
                                    vueProfile.options.created = [styleMixin.created]
                                }
                                if (vueProfile.options.destroyed) {
                                    vueProfile.options.destroyed = [styleMixin.destroyed].concat(vueProfile.options.destroyed)
                                } else {
                                    vueProfile.options.destroyed = [styleMixin.destroyed]
                                }
                            }

                            resolve(vueProfile)
                        } catch (error) {
                            reject(error)
                        }
                    }).catch(err => {
                        reject(err)
                    })
                })
            }
        }
    }
</script>