<template>
    <ex-splitter :pin-second="true" :minSize="300" handlerColor="#a2a2a2" :size="300">
        <!-- 左边编辑区域 -->
        <div slot="panel1" style="height: 100%">
            <!-- 顶部工具栏 -->
            <div class="editorTool">
                <el-button size="mini" icon="fa fa-plus fa-fw" @click="onAdd">Add</el-button>
                <el-button size="mini" icon="fa fa-times fa-fw" @click="onRemove">Remove</el-button>
                <el-button size="mini" @click="routeDialogVisible = true">Route</el-button>
                <el-button size="mini" v-model="preview" :type="preview ? 'primary' : 'plain'" @click="onSwitchPreview">
                    Preview
                </el-button>
                <!-- 路由设置对话框TODO:移至外部 -->
                <el-dialog title="Route" width="500px" :visible.sync="routeDialogVisible">
                    <el-form label-width="120px">
                        <el-form-item>
                            <el-checkbox v-model="routeEnable" :disabled="readOnly">List in route</el-checkbox>
                        </el-form-item>
                        <el-form-item label="Route Parent:">
                            <!--TODO:考虑用选择器直接选择，目前输入-->
                            <el-input v-model="routeParent" :disabled="readOnly" placeholder="eg: sys.Home"></el-input>
                        </el-form-item>
                        <el-form-item label="Custom Path:">
                            <el-input v-model="routePath" :disabled="readOnly" placeholder="eg: customers"></el-input>
                        </el-form-item>
                        <!-- <el-form-item label="Bind Permission:">
                            <el-select :disabled="readOnly" v-model="permissionValue" clearable placeholder="权限">
                                <el-option label="管理员1" value="1">
                                </el-option>
                            </el-select>
                        </el-form-item> -->
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="routeDialogVisible = false">Cancel</el-button>
                        <el-button :disabled="readOnly" type="primary" @click="changeRouteSetting">OK</el-button>
                    </span>
                </el-dialog>
            </div>
            <!-- 设计区域 -->
            <div class="editorPanel">
                <grid-layout class="editorCanvas" :layout.sync="layout" :col-num="24" :row-height="32"
                             :is-draggable="!preview" :is-resizable="!preview">
                    <grid-item class="widgetPanel" v-for="item in layout" :x="item.x" :y="item.y" :w="item.w"
                               :h="item.h" :i="item.i" :key="item.i">
                        <div v-if="!preview" class="widgetOverlay" @click="onSelectWidget(item)"></div>
                        <!-- 动态widget -->
                        <component v-if="item.c.VText" :is="makeWidget(item)"
                                   :style="{zIndex: preview ? 'auto' : -1, width: '100%'}"
                                   v-bind="item.p" v-text="item.t"></component>
                        <component v-else :is="makeWidget(item)" :style="{zIndex: preview ? 'auto' : -1}"
                                   v-model="runState[item.b]" v-bind="item.p"></component>
                    </grid-item>
                </grid-layout>
            </div>
        </div>
        <!-- 右边属性区域 -->
        <property-panel slot="panel2" :owner="selectedWidget" :state="state"></property-panel>
    </ex-splitter>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator';
import DesignStore from '@/design/DesignStore';
import VuePropertyPanel from '@/components/Designers/View/VuePropertyPanel.vue';
import VueToolbox, {IVueComponent, IVueState} from '@/components/Designers/View/VueToolbox';
import ILayoutItem from '@/components/Designers/View/ILayoutItem';

@Component({
    components: {PropertyPanel: VuePropertyPanel}
})
export default class VueVisualDesigner extends Vue {
    @Prop({type: Object, required: true}) target;

    readOnly = true; // 是否只读模式，对应模型的签出状态
    preview = false; // 是否预览模式
    routeEnable = false; // 是否启用路由
    routeParent = ''; // 自定义路由的上级
    routePath = ''; // 自定义路由的路径
    routeDialogVisible = false;
    selectedWidget: ILayoutItem = null; //当前选择的Widget

    state: IVueState[] = [{Name: 'keyword', Type: 'string', Value: 'hello'}];
    layout: ILayoutItem[] = [
        {
            x: 0, y: 0, w: 6, h: 4, i: '0', n: 'Input', b: 'keyword',
            p: {size: 'small'}, c: VueToolbox.GetComponent('Input')
        },
        {
            x: 0, y: 6, w: 12, h: 4, i: '1', n: 'Button', t: 'Button',
            p: {size: 'small'}, c: VueToolbox.GetComponent('Button')
        },
        {
            x: 6, y: 0, w: 6, h: 4, i: '2', n: 'Button', t: 'Button',
            p: {size: 'small'}, c: VueToolbox.GetComponent('Button')
        }
    ];

    runState = {};

    /** 生成新的标识号 */
    private makeWidgetId(): string {
        let id = 0;
        do {
            if (this.layout.find(t => t.i == id.toString())) {
                id++;
            } else {
                break;
            }
        } while (true);
        return id.toString();
    }

    /** 添加工具箱选择的Widget */
    onAdd() {
        if (!DesignStore.toolBoxTree) {
            this.$message.error('Please select a widget from toolbox');
            return;
        }
        let toolboxItem: IVueComponent = DesignStore.toolBoxTree.getSelected();
        if (!toolboxItem) {
            this.$message.error('Please select a widget from toolbox');
            return;
        }

        let id = this.makeWidgetId();
        let layoutItem: ILayoutItem = {
            i: id, x: 0, y: 100, //TODO:排到最后
            w: toolboxItem.DWidth,
            h: toolboxItem.DHeight,
            n: toolboxItem.Name,
            p: VueToolbox.MakeDefaultProps(toolboxItem),
            c: toolboxItem
        };
        if (toolboxItem.VText) {
            layoutItem.t = toolboxItem.VText;
        }
        this.layout.push(layoutItem);
    }

    /** 删除选择的Widget */
    onRemove() {
        if (!this.selectedWidget) {
            this.$message.error('Please select a widget first');
            return;
        }
        let index = this.layout.findIndex(t => t === this.selectedWidget);
        if (index >= 0) {
            this.layout.splice(index, 1);
            this.selectedWidget = null;
        }
    }

    onSelectWidget(item: ILayoutItem) {
        this.selectedWidget = item;
    }

    makeWidget(item: ILayoutItem) {
        //先判断是否全局注册的组件
        let isGlobal = item.c.Component.indexOf('.') < 0; //TODO:暂简单判断
        if (isGlobal) {
            return Vue.component(item.c.Component);
        }
        return null;
    }

    onSwitchPreview() {
        this.preview = !this.preview;
        //TODO:重新生成运行时state
        if (!this.runState['keyword']) {
            this.$set(this.runState, 'keyword', 'Hello Future!');
        }
    }

    /** 改变路由设置 */
    changeRouteSetting() {
        let args = [this.target.ID, this.routeEnable, this.routeParent, this.routePath];
        $runtime.channel.invoke('sys.DesignService.ChangeRouteSetting', args).then(res => {
            this.routeDialogVisible = false;
        }).catch(err => {
            this.$message.error(err);
        });
    }
}
</script>

<style scoped>
.editorPanel {
    background-color: #a2a2a2;
    height: calc(100% - 40px);
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 10px;
    overflow: auto;
}

.editorTool {
    box-sizing: border-box;
    padding: 6px 10px;
    height: 40px;
    overflow: hidden;
    background-color: #3c3c3c;
}

.editorCanvas {
    background-color: #fff;
    box-shadow: 0 0 10px #000000;
}

.widgetPanel {
    touch-action: none;
    box-sizing: border-box;
}

.widgetOverlay {
    position: absolute;
    top: 0;
    left: 0;
    filter: alpha(opacity=60);
    background-color: #777;
    opacity: 0.1;
    -moz-opacity: 0.1;
    width: 100%;
    height: 100%;
}

</style>
