<template>
    <ex-splitter :pin-second="true" :minSize="300" handlerColor="#a2a2a2" :size="300">
        <!-- 左边编辑区域 -->
        <div slot="panel1" style="height: 100%">
            <!-- 顶部工具栏 -->
            <div class="editorTool">
                <el-button size="mini" icon="fa fa-plus fa-fw" @click="onAdd">Add</el-button>
                <el-button size="mini" icon="fa fa-minus fa-fw" @click="onRemove">Remove</el-button>
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
                        <component :is="makeWidget(item)" :style="makeWidgetStyle(item)"
                                   v-model="runState[item.m]" v-bind="item.p" v-on="item.a">
                            {{ item.t }}
                        </component>
                    </grid-item>
                </grid-layout>
            </div>
        </div>
        <!-- 右边属性区域 -->
        <property-panel slot="panel2" :owner="selectedWidget" :state="state"
                        @build-event="onBuildEvent"></property-panel>
    </ex-splitter>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator';
import DesignStore from '@/design/DesignStore';
import VuePropertyPanel from '@/components/Designers/View/VuePropertyPanel.vue';
import VueToolbox from '@/components/Designers/View/VueToolbox';
import RouteDialog from '@/components/Designers/View/RouteDialog.vue';
import {IDesignLayoutItem, IVueState, IVueWidget} from '@/design/IVueWidget';
import {IVueEvent, IVueLayoutItem} from '@/runtime/IVueVisual';
import {IDesignNode} from '@/design/IDesignNode';
import {BuildEventHandler} from '@/runtime/VueWidgetService';

@Component({
    components: {RouteDialog, PropertyPanel: VuePropertyPanel}
})
export default class VueVisualDesigner extends Vue {
    @Prop({type: Object, required: true}) target: IDesignNode;

    readOnly = true; // 是否只读模式，对应模型的签出状态
    preview = false; // 是否预览模式
    route = {
        Enable: false, // 是否启用路由
        Parent: '',    // 自定义路由的上级
        Path: '',      // 自定义路由的路径
        DlgVisible: false
    };
    selectedWidget: IDesignLayoutItem = null; //当前选择的Widget

    state: IVueState[] = [];            //设计时状态
    layout: IDesignLayoutItem[] = [];   //设计时布局
    runState = {};                      //运行时状态

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
        let toolboxItem: IVueWidget = DesignStore.toolBoxTree.getSelected();
        if (!toolboxItem) {
            this.$message.error('Please select a widget from toolbox');
            return;
        }

        let id = this.makeWidgetId();
        let layoutItem: IDesignLayoutItem = {
            i: id, x: 0, y: 100, //TODO:排到最后
            w: toolboxItem.Width,
            h: toolboxItem.Height,
            n: toolboxItem.Name,
            p: VueToolbox.MakeDefaultProps(toolboxItem),
            Widget: toolboxItem
        };
        if (toolboxItem.Text) {
            layoutItem.t = toolboxItem.Text;
        }
        if (toolboxItem.Model) {
            layoutItem.m = '';
        }
        if (toolboxItem.Events) {
            layoutItem.Events = {};
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

    onSelectWidget(item: IDesignLayoutItem) {
        this.selectedWidget = item;
    }

    /** 修改事件处理后重新生成运行时事件处理器 */
    onBuildEvent(item: IDesignLayoutItem) {
        BuildEventHandler(item, this.runState, $runtime);
    }

    makeWidget(item: IDesignLayoutItem) {
        //先判断是否全局注册的组件
        let isGlobal = item.Widget.Component.indexOf('.') < 0; //TODO:暂简单判断
        if (isGlobal) {
            return Vue.component(item.Widget.Component);
        }
        return null;
    }

    /** 仅用于设计时绑定设计及默认样式 */
    makeWidgetStyle(item: IDesignLayoutItem): object {
        let s = item.Widget.Style ? item.Widget.Style : {};
        s['zIndex'] = this.preview ? 'auto' : -1;
        return s;
    }

    onSwitchPreview() {
        this.preview = !this.preview;
        //TODO:重新生成运行时state
        console.log(this.runState, this.layout);
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

    save() {
        let template = JSON.stringify(this.layout, (k, v) => {
            if (k == 'Widget' || k == 'moved') { //忽略序列化
                return undefined;
            }
            return v;
        });
        let script = JSON.stringify(this.state);
        let styles = ''; //TODO:grid props
        let runtimeCode = JSON.stringify({
            V: 1, //保留版本号
            L: this.buildRunLayout(),
            S: this.buildRunState(),
        });

        //console.log(template);

        let node = this.target;
        let args = [node.Type, node.ID, template, script, styles, runtimeCode];
        $runtime.channel.invoke('sys.DesignService.SaveModel', args)
            .then(res => this.$message.success('Save view succeed.'))
            .catch(err => this.$message.error(err));
    }

    /** 生成运行时的布局 */
    private buildRunLayout(): IVueLayoutItem[] {
        let items: IVueLayoutItem[] = [];
        for (const item of this.layout) {
            items.push({
                i: item.i, n: item.n, x: item.x, y: item.y, w: item.w, h: item.h,
                t: item.t, m: item.m, p: item.p, e: item.e
            });
        }
        return items;
    }

    /** 生成运行时状态 */
    private buildRunState(): object {
        let rs = {};
        for (const s of this.state) {
            rs[s.Name] = JSON.parse(s.Value);
        }
        return rs;
    }

    mounted() {
        VueToolbox.EnsureLoaded().then(() => {
            return $runtime.channel.invoke('sys.DesignService.OpenViewModel', [this.target.ID]);
        }).then(res => {
            if (res.Script) {
                this.state = JSON.parse(res.Script);
                this.runState = this.buildRunState();
            }
            if (res.Template) {
                let designLayout: IDesignLayoutItem[] = JSON.parse(res.Template);
                for (const item of designLayout) {
                    item.Widget = VueToolbox.GetWidget(item.n);
                    if (item.Widget.Events && !item.Events) {
                        item.Events = {};
                    }
                    if (item.e) {
                        BuildEventHandler(item, this.runState, $runtime);
                    }
                }
                this.layout = designLayout;
            }
        }).catch(err => this.$message.error('OpenViewModel error: ' + err));
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
