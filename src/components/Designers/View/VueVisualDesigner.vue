<template>
    <ex-splitter :pin-second="true" :minSize="300" handlerColor="#a2a2a2" :size="300">
        <!-- 左边编辑区域 -->
        <div slot="panel1" style="height: 100%">
            <!-- 顶部工具栏 -->
            <div class="editorTool">
                <el-button size="mini" icon="fa fa-plus fa-fw" @click="onAdd">Add</el-button>
                <el-button size="mini" icon="fa fa-times fa-fw" @click="onRemove">Remove</el-button>
                <el-button size="mini" @click="route.DlgVisible = true">Route</el-button>
                <el-button size="mini" v-model="preview" :type="preview ? 'primary' : 'plain'" @click="onSwitchPreview">
                    Preview
                </el-button>
                <!-- 路由设置对话框 -->
                <route-dialog :visible.sync="route.DlgVisible" :route="route" :readonly="readOnly"></route-dialog>
            </div>
            <!-- 设计区域 -->
            <div class="editorPanel">
                <grid-layout class="editorCanvas" :layout.sync="layout" :col-num="24" :row-height="32"
                             :is-draggable="!preview" :is-resizable="!preview">
                    <grid-item class="widgetPanel" v-for="item in layout" :x="item.x" :y="item.y" :w="item.w"
                               :h="item.h" :i="item.i" :key="item.i">
                        <div v-if="!preview" class="widgetOverlay" @click="onSelectWidget(item)"></div>
                        <!-- 动态widget -->
                        <component v-if="item.c.VText" :is="makeWidget(item)" :style="getWidgetStyle(item)"
                                   v-bind="item.p">{{ item.t }}
                        </component>
                        <component v-else :is="makeWidget(item)" :style="getWidgetStyle(item)"
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
import RouteDialog from '@/components/Designers/View/RouteDialog.vue';

@Component({
    components: {RouteDialog, PropertyPanel: VuePropertyPanel}
})
export default class VueVisualDesigner extends Vue {
    @Prop({type: Object, required: true}) target;

    readOnly = true; // 是否只读模式，对应模型的签出状态
    preview = false; // 是否预览模式
    route = {
        Enable: false, // 是否启用路由
        Parent: '',    // 自定义路由的上级
        Path: '',      // 自定义路由的路径
        DlgVisible: false
    };
    selectedWidget: ILayoutItem = null; //当前选择的Widget

    state: IVueState[] = [{Name: 'keyword', Type: 'string', Value: 'hello'}];
    layout: ILayoutItem[] = [
        {
            x: 0, y: 0, w: 6, h: 4, i: '0', n: 'Input', b: ''/*需要初始化为空*/,
            p: {size: 'small', placeholder: 'abc'}, c: VueToolbox.GetComponent('Input')
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

    runState = {keyword: 'Hello Future!', keyword2: 'World'};

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

    getWidgetStyle(item: ILayoutItem): object {
        let s = item.c.Style ? item.c.Style : {};
        s['zIndex'] = this.preview ? 'auto' : -1;
        return s;
    }

    onSwitchPreview() {
        this.preview = !this.preview;
        //TODO:重新生成运行时state
    }

    /** 改变路由设置 */
    changeRouteSetting() {
        let args = [this.target.ID, this.route.Enable, this.route.Parent, this.route.Path];
        $runtime.channel.invoke('sys.DesignService.ChangeRouteSetting', args).then(res => {
            this.route.DlgVisible = false;
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
