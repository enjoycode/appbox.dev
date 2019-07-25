<template>
    <div class="e-splitter">
        <div v-if="visible !== 'second'" class="e-splitter-pane" :style="panel1Style">
            <slot name="panel1"></slot>
        </div>
        <div v-if="visible === 'both' && handlerSize > 0" @mousedown="onHandlerMouseDown" class="e-splitter-hand" :style="handlerStyle"></div>
        <div v-if="visible !== 'first'" class="e-splitter-pane" :style="panel2Style">
            <slot name="panel2"></slot>
        </div>
    </div>
</template>

<script>
    // 另一实现方案: https://github.com/wnr/element-resize-detector，备注：不用考虑，也用ResizeSensor实现
    import ResizeSensor from './ResizeSensor'

    export default {
        name: 'ExSplitter',
        props: {
            visible: { type: String, default: 'both' },// arg: first, second
            vertical: { type: Boolean, default: false },
            pinSecond: { type: Boolean, default: true }, // 是否固定第二个面板
            size: { type: Number, default: 200 }, // pinPanel默认尺寸
            minSize: { type: Number, default: 0 }, // pinPanel最小尺寸
            maxSize: { type: Number, default: Number.MAX_SAFE_INTEGER }, // pinPanel最大尺寸
            handlerSize: { type: Number, default: 3 },
            handlerColor: { default: 'gray' }
        },
        data() {
            return {
                width: 600,
                height: 400,
                panel1Size: this.size,
                resizeSensor: null
            }
        },

        watch: {
            size(val) {
                this.onPinPanelSizeChanged(val)
            }
        },

        computed: {
            panel1Style() {
                if (this.vertical) {
                    return { width: this.width + 'px', height: this.visible === 'first' ? this.height + 'px' : this.panel1Size + 'px' }
                } else {
                    return { width: this.visible === 'first' ? this.width + 'px' : this.panel1Size + 'px', height: this.height + 'px' }
                }
            },
            panel2Style() {
                if (this.vertical) {
                    return {
                        width: this.width + 'px',
                        height: this.visible === 'second' ? this.height + 'px' : (this.height - this.handlerSize - this.panel1Size) + 'px',
                        top: this.visible === 'second' ? '0px' : (this.panel1Size + this.handlerSize) + 'px'
                    }
                } else {
                    return {
                        width: this.visible === 'second' ? this.width + 'px' : (this.width - this.handlerSize - this.panel1Size) + 'px',
                        height: this.height + 'px',
                        left: this.visible === 'second' ? '0px' : (this.panel1Size + this.handlerSize) + 'px'
                    }
                }
            },
            handlerStyle() {
                if (this.vertical) {
                    return {
                        width: this.width + 'px',
                        height: this.handlerSize + 'px',
                        top: this.panel1Size + 'px',
                        cursor: this.handlerCursor,
                        backgroundColor: this.handlerColor
                    }
                } else {
                    return {
                        width: this.handlerSize + 'px',
                        height: this.height + 'px',
                        left: this.panel1Size + 'px',
                        cursor: this.handlerCursor,
                        backgroundColor: this.handlerColor
                    }
                }
            },
            handlerCursor() {
                return this.vertical === true ? 'ns-resize' : 'ew-resize'
            }
        },
        methods: {
            onPinPanelSizeChanged(val) {
                if (this.pinSecond) {
                    this.panel1Size = this.vertical ? this.height - val : this.width - val
                } else {
                    this.panel1Size = val
                }
            },
            /** 容器大小改变回调 */
            onresize(firstTime) {
                let newWidth = this.$el.clientWidth
                let newHeight = this.$el.clientHeight
                if (this.pinSecond) {
                    if (this.vertical) {
                        let maxSize = (this.maxSize === Number.MAX_SAFE_INTEGER) ? newHeight : this.maxSize
                        if (this.height === 0) { // 临时方案修复ResizeSensor
                            this.panel1Size = newHeight - this.size
                        } else {
                            let h = newHeight - this.height
                            if (((this.panel1Size + h) > this.minSize && (this.panel1Size + h) < maxSize) || ((this.panel1Size + h) <= this.minSize && h > 0) || ((this.panel1Size + h) > maxSize && h < 0)) {
                                this.panel1Size += h
                            }
                        }
                    } else {
                        let maxSize = (this.maxSize === Number.MAX_SAFE_INTEGER) ? newWidth : this.maxSize
                        if (this.width === 0) { // 临时方案修复ResizeSensor
                            this.panel1Size = newWidth - this.size
                        } else {
                            let w = newWidth - this.width
                            if (((this.panel1Size + w) > this.minSize && (this.panel1Size + w) < maxSize) || ((this.panel1Size + w) <= this.minSize && w > 0) || ((this.panel1Size + w) > maxSize && w < 0)) {
                                this.panel1Size += w
                            }
                        }
                    }
                }
                this.width = newWidth
                this.height = newHeight
                if (!firstTime) {
                    this.$emit('resize', this.panel1Size)
                }
            },
            onHandlerMouseDown(e) {
                if (e.button === 0) {
                    this.$el.style.cursor = this.handlerCursor
                    this.$el.addEventListener('mousemove', this.onMouseMove, true)
                    this.$el.addEventListener('mouseup', this.onMouseUp, true)
                }
            },
            onMouseMove(e) {
                e.preventDefault()
                e.stopPropagation()
                if (e.button === 0) {
                    let newPanel1Size = this.vertical ? this.panel1Size + e.movementY : this.panel1Size + e.movementX
                    if (newPanel1Size !== this.panel1Size) {
                        var newPinSize = newPanel1Size // 新的pinPanel大小
                        if (this.pinSecond) { // 如果固定第二个面板，则取总大小减去第一个面板板及handlerSize
                            newPinSize = this.vertical ? this.height - newPanel1Size - this.handlerSize : this.width - newPanel1Size - this.handlerSize
                        }
                        if (newPinSize < this.minSize || newPinSize > this.maxSize) {
                            this.stopDrag() // todo: fix to = 最小或最大
                        } else {
                            this.panel1Size = newPanel1Size
                        }
                    }
                }
            },
            onMouseUp(e) {
                if (e.button === 0) {
                    e.stopPropagation()
                    this.stopDrag()
                }
            },
            stopDrag() {
                this.$el.style.cursor = null
                this.$el.removeEventListener('mouseup', this.onMouseUp, true)
                this.$el.removeEventListener('mousemove', this.onMouseMove, true)

                this.$emit('resize', this.panel1Size)
            }
        },

        mounted() {
            this.width = this.$el.clientWidth
            this.height = this.$el.clientHeight
            this.onPinPanelSizeChanged(this.size)
            this.onresize()

            this.resizeSensor = new ResizeSensor(this.$el, this.onresize)
        },
        destroyed() {
            if (this.resizeSensor) {
                this.resizeSensor.detach()
            }
        }
    }
</script>

<style>
    .e-splitter {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .e-splitter-hand {
        position: absolute;
    }

    .e-splitter-pane {
        position: absolute;
        overflow: hidden;
    }
</style>