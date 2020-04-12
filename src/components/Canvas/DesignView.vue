<template>
    <ex-splitter :size="300" @resize="onSplitterResize">
        <!--画布面板-->
        <div slot="panel1" class="stage" :style="{ background: background }">
            <canvas ref="surface" style="z-index:1" class="layer"></canvas>
            <canvas ref="adorner" style="z-index:2" class="layer" 
                @mousemove.self="onmousemove" @mousedown.self="onmousedown" @mouseup.self="onmouseup">
            </canvas>
        </div>
        <!--属性面板-->
        <property-panel slot="panel2" ref="propertyPanel"></property-panel>
    </ex-splitter>
</template>

<script>
import DesignSurface from './DesignSurface'
import MouseEventArgs from './EventArgs/MouseEventArgs'
import PropertyPanel from './PropertyPanel'

export default {
    components: { PropertyPanel: PropertyPanel },
    props: {
        background: { type: String, default: 'white' }
        //TODO: 画布大小属性
    },
    data() {
        return {
            designSurface: null,    //指向DesignSurface实例
            pixelRatio: 1           // hidpi缩放比例
        }
    },

    methods: {
        onmousemove(e) {
            // todo:根据浏览器处理e
            let deltaX = e.movementX
            let deltaY = e.movementY
            if (deltaX !== 0 || deltaY !== 0) {
                var arg = new MouseEventArgs(e.buttons, 0, e.layerX, e.layerY, deltaX, deltaY)
                this.designSurface.OnMouseMove(arg)
            }
        },
        onmousedown(e) {
            var arg = new MouseEventArgs(e.buttons, 0, e.layerX, e.layerY, 0, 0)
            this.designSurface.OnMouseDown(arg)
        },
        onmouseup(e) {
            // todo:同上
            var buttons = 0
            if (e.button === 0) {
                buttons = 1
            }
            var arg = new MouseEventArgs(buttons, 0, e.layerX, e.layerY, 0, 0)
            this.designSurface.OnMouseUp(arg)
        },
        onSplitterResize(newSize) {
            let canvasWidth = this.$children[0].panel1Size
            let canvasHeight = this.$children[0].height
            this.$refs.surface.width = this.$refs.adorner.width = canvasWidth
            this.$refs.surface.height = this.$refs.adorner.height = canvasHeight
            if (this.designSurface) { // 可能还没初始化
                this.designSurface.OnResize(newSize, canvasHeight)
            } else {
                this.designSurface = new DesignSurface(this.$refs.surface, this.$refs.adorner, this.pixelRatio, this.$refs.propertyPanel)
                this.$emit('ready') //激发已准备好事件
            }
        }
    },

    mounted() {
        this.pixelRatio = window.devicePixelRatio || 1
    }
}
</script>

<style scoped>
.stage {
    width: 100%;
    height: 100%;
    position: relative;
}

.layer {
    position: absolute;
}
</style>