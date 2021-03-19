<template>
    <div class="ide">
        <!--主菜单-->
        <main-menu class="ide-menu"></main-menu>
        <!-- body -->
        <div class="ide-body">
            <ex-splitter :pin-second="false" :minSize="50" :handlerSize="leftPadsHandlerSize" handlerColor="#f1f1f1"
                         :size="leftPadsPanelSize">
                <!--左边Pads-->
                <left-pads slot="panel1" class="ide-left" @LeftPadChanged="onLeftPadsChange"></left-pads>
                <ex-splitter slot="panel2" vertical :size="150" handlerColor="#fff">
                    <!--主编辑区域Pads-->
                    <designer-pads slot="panel1" class="ide-designers"
                                   @currentTabChanged="designTabChanged"></designer-pads>
                    <bottom-pads slot="panel2" class="ide-bottom"></bottom-pads>
                </ex-splitter>
            </ex-splitter>

            <!--对话框占位-->
            <component v-if="activeDialog" :is="activeDialog" :dlgProps="dlgProps" @close="closeDialog"></component>
        </div>
        <!-- 状态栏 -->
        <state-pads class="ide-status"></state-pads>
    </div>
</template>

<script>
import MainMenu from '@/components/Pads/MainMenu'
import LeftPads from '@/components/Pads/LeftPads'
import DesignerPads from '@/components/Pads/DesignerPads'
import BottomPads from '@/components/Pads/BottomPads'
import StatePads from '@/components/Pads/StatePads'
import store from '@/design/DesignStore'

export default {
    data() {
        return {
            activeDialog: null, // 当前打开的对话框
            dlgProps: null,
            leftPadsHandlerSize: 3,
            leftPadsPanelSize: 300
        }
    },
    components: {
        MainMenu: MainMenu,
        LeftPads: LeftPads,
        DesignerPads: DesignerPads,
        BottomPads: BottomPads,
        StatePads: StatePads
    },
    methods: {
        showDialog(dlg, props) {
            this.dlgProps = props
            this.activeDialog = dlg
        },
        closeDialog() {
            this.dlgProps = null
            this.activeDialog = null
        },
        // 当design pad中的（已打开的）tab手动切换时，同步tree中的选中节点
        designTabChanged(data) {
            store.tree.selectNode(data)
        },
        onLeftPadsChange(visible) {
            if (visible) {
                this.leftPadsPanelSize = 300
                this.leftPadsHandlerSize = 3
            } else {
                this.leftPadsPanelSize = 50
                this.leftPadsHandlerSize = 0
            }
        }
    },
    mounted: function () {
        store.ide = this // 设置设计时存储实例

        // 移除文本选中
        if (typeof this.$el.onselectstart !== 'undefined') {
            this.$el.onselectstart = function () {
                return false
            } // IE
        } else if (typeof this.$el.style.MozUserSelect !== 'undefined') {
            this.$el.style.MozUserSelect = 'none' // Moz
        } else {
            this.$el.onmousedown = function () {
                return false
            }
        }
    }
}
</script>

<style scoped>
.ide {
    height: 100%;
}

.ide-menu {
    height: 60px;
}

.ide-body {
    height: calc(100% - 80px);
}

.ide-status {
    height: 20px;
    overflow: hidden;
}

.ide-left {
    height: 100%;
    background-color: #ffffff;
}

.ide-designers {
    box-sizing: border-box;
    height: 100%;
    border-bottom: 1px solid #d3d3d3;
}

.ide-bottom {
    overflow: hidden;
}
</style>

<!-- 以下定义ide全局样式 -->
<style>
.ide-property-panel {
    background-color: #f3f3f3;
    padding: 5px;
    height: calc(100% - 10px);
    overflow-y: scroll;
}

.ide-property-panel > .ide-property-collapse {
    min-width: 200px;
    border: none;
    border-top: 1px solid #dfe6ec;
}

.ide-property-panel .el-row > .el-col {
    border: 1px solid #dee6ec;
    background-color: #fff;
}

.ide-property-panel .el-collapse-item__header {
    background-color: #f3f3f3;
    border-bottom: none;
    height: 30px;
    line-height: 30px;
    font-weight: bold;
}

.ide-property-panel .el-collapse-item__wrap {
    border-bottom: none;
    background-color: #f3f3f3;
}

.ide-property-panel .el-collapse-item__content {
    padding: 0 15px;
}

.ide-property-panel .el-form > .el-form-item > .el-form-item__label {
    font-size: 12px;
}

.ide-property-panel .el-form > .el-form-item {
    margin-bottom: 5px;
}

.ide-property-panel .el-color-picker--mini {
    height: 20px;
    vertical-align: middle;
}

.ide-property-panel .el-color-picker--mini .el-color-picker__trigger {
    padding: 0;
    height: 20px;
    width: 20px;
}

.ide-left-pane {
    background-color: #f3f3f3;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}

.ide-left-search-pane {
    height: 94px;
}

.ide-left-tree-title {
    height: 34px;
    padding-left: 18px;
    line-height: 34px;
    background-color: #f3f3f3;
    color: #838383;
    font-size: 10px;
}

.ide-left-tree-search {
    padding: 15px;
}

.ide-left-tree {
    width: 100%;
}

.ide-left-tree-warp {
    overflow: auto;
    height: calc(100% - 94px);
    padding: 0 10px 0 10px;
}

.ide-left-tree-warp > .el-tree {
    background: none;
    border: none;
}

.ide-left-tree-warp > .el-tree-node__content {
    background-color: #f3f3f3;
}

.ide-left-tree-warp > .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: #b3b3b3;
}

.ide-left-tree-warp > .el-tree-node__content:hover {
    background-color: #6d6c6c;
}
</style>
