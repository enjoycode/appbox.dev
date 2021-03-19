<template>
    <div>
        <div class="icons">
            <el-menu :style="{ height:'100%', width:'50px' }" :default-active="activeMenu" @select="menuSelect"
                     background-color="#464b5b" active-text-color="#fff">
                <el-menu-item index="file" style="padding-left: 16px;font-size:22px">
                    <i class="fas fa-file"></i>
                </el-menu-item>
                <el-menu-item index="toolbox" style="padding-left: 13px;font-size:22px">
                    <i class="fas fa-wrench"></i>
                </el-menu-item>
                <el-menu-item index="debug" style="padding-left:13px;font-size:22px">
                    <i class="fas fa-bug"></i>
                </el-menu-item>
                <el-menu-item index="settings" style="padding-left: 13px;font-size:22px">
                    <i class="fas fa-cog"></i>
                </el-menu-item>
            </el-menu>
        </div>
        <div class="mainView">
            <keep-alive>
                <components :is="mainView"></components>
            </keep-alive>
        </div>
    </div>
</template>

<script>
import DesignTreeView from './DesignTreeView'
import ToolBoxTreeView from './ToolBoxTreeView'
import DebugView from "./DebugView";
import SettingsTreeView from './SettingsTreeView';

export default {
    data() {
        return {
            mainView: 'DesignTree',
            activeMenu: 'file'
        }
    },
    components: {
        DesignTree: DesignTreeView,
        ToolTree: ToolBoxTreeView,
        DebugView: DebugView,
        SettingsView: SettingsTreeView
    },
    methods: {
        menuSelect: function (index) {
            let visible = false;
            if (this.activeMenu === index) {
                this.activeMenu = ''
                this.mainView = ''
                visible = false
                this.$emit('LeftPadChanged', visible)
                return
            } else {
                visible = true
                this.activeMenu = index
            }
            visible = true
            if (index === 'file') {
                this.mainView = 'DesignTree'
            } else if (index === 'toolbox') {
                this.mainView = 'ToolTree'
            } else if (index === 'debug') {
                this.mainView = 'DebugView'
            } else if (index === 'settings') {
                this.mainView = 'SettingsView'
            } else {
                visible = false
                this.mainView = ''
            }
            this.$emit('LeftPadChanged', visible)
        }
    }
}
</script>

<style scoped>
.icons {
    float: left;
    width: 50px;
    height: 100%;
}

.mainView {
    display: inline-block;
    width: calc(100% - 50px);
    height: 100%;
}

/* .debug_icon {
    width: 24px;
    height: 24px;
    margin-top: 20px;
    background: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M17 19.488v4.248c0 .462.09 1.264-.373 1.264H15v-1h1v-3.19l-.173-.18c-1.453 1.205-3.528 1.248-4.67.108C10 19.578 10.118 18 11.376 16H8v1H7v-1.627C7 14.91 7.802 15 8.264 15h4.105L17 19.488zM14 9h-1V8h1.955c.46 0 1.045.22 1.045.682v3.345l.736.875c.18-.973.89-1.71 1.914-1.71.143 0 .35.014.35.04V9h1v2.618c0 .117.265.382.382.382H23v1h-2.233c.027 0 .042.154.042.298 0 1.025-.74 1.753-1.712 1.932l.875.77h3.346c.462 0 .682.583.682 1.045V19h-1v-1h-2.52L14 11.698V9zm2-5C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4zm10 12c0 2.397-.85 4.6-2.262 6.324L9.676 8.262A9.95 9.95 0 0 1 16 6c5.514 0 10 4.486 10 10zM6 16c0-2.398.85-4.6 2.262-6.324L22.324 23.74A9.961 9.961 0 0 1 16 26c-5.514 0-10-4.486-10-10z' fill='%23fff'/%3E%3C/svg%3E") no-repeat 50% 50%;
} */
</style>
