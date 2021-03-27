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
                <grid-layout ref="gridLayout" class="editorCanvas" :layout.sync="layout"
                             :col-num="layoutOption.colNum" :row-height="layoutOption.rowHeight"
                             :is-draggable="!preview" :is-resizable="!preview" @dragover.native="onDragOverGrid">
                    <grid-item class="widgetPanel" v-for="item in layout" :x="item.x" :y="item.y" :w="item.w"
                               :h="item.h" :i="item.i" :key="item.i"
                               @resize="onItemResize(item)" @container-resized="onItemResize(item)">
                        <div v-if="!preview" class="widgetOverlay" @click="onSelectWidget(item)"></div>
                        <!-- 动态widget -->
                        <component :ref="item.i" :is="item.c" :style="makeWidgetStyle(item)"
                                   v-model="runState[item.m]" v-bind="item.p" v-on="item.a">
                            {{ item.t }}
                        </component>
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
import VueToolbox from '@/components/Designers/View/VueToolbox';
import RouteDialog from '@/components/Designers/View/RouteDialog.vue';
import {IDesignLayoutItem, IVueWidget} from '@/design/IVueWidget';
import {IVueGridLayoutItem, IVueState, RuntimeVueState} from '@/runtime/IVueVisual';
import {IDesignNode} from '@/design/IDesignNode';
import {BuildEventsAndBindProps, BuildRunState} from '@/runtime/VueWidgetService';
import LoadView from '@/design/LoadView';

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

    state: IVueState[] = [];                    //设计时状态
    layout: IDesignLayoutItem[] = [];           //设计时布局
    layoutOption = {
        colNum: 24,
        rowHeight: 32
    };
    runState: RuntimeVueState = new RuntimeVueState(); //运行时状态

    draggingItem: IDesignLayoutItem | null = null;
    dragPreX = -99999;
    dragPreY = -99999;

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

    private createLayoutItem(toolboxItem: IVueWidget, byDrag: boolean): IDesignLayoutItem {
        let id = this.makeWidgetId();
        let item: IDesignLayoutItem = {
            n: toolboxItem.Name,
            i: id,
            x: (this.layout.length * 2) % 24, //(this.colNum || 12),
            y: this.layout.length + 24, //(this.colNum || 12), // puts it at the bottom
            w: toolboxItem.Width,
            h: toolboxItem.Height,
            p: VueToolbox.MakeDefaultProps(toolboxItem),
            Widget: toolboxItem
        };
        if (toolboxItem.Text) {
            item.t = toolboxItem.Text;
        }
        if (toolboxItem.Model) {
            item.m = '';
        }
        if (!byDrag) {
            item.c = this.makeWidget(toolboxItem.Component);
        }
        return item;
    }

    /** 用于某些基于Canvas的组件需要更新大小 */
    onItemResize(item: IDesignLayoutItem) {
        const ref: any = this.$refs[item.i];
        if (ref) {
            const c = ref[0];
            if (c && c.updateSize) {
                c.updateSize();
            }
        }
    }

    /** 工具箱拖动Widget至GridLayout之上 */
    onDragOverGrid(e: DragEvent) {
        e.preventDefault(); //TODO:判断是否允许

        const grid: any = this.$refs.gridLayout;
        if (!grid) {
            console.log('Can\'t find gridLayout component');
            return;
        }

        if (!this.draggingItem) {
            let toolboxItem: IVueWidget = DesignStore.toolbox.getSelected();
            this.draggingItem = this.createLayoutItem(toolboxItem, true);
            this.layout.push(this.draggingItem);
        }

        //注意:GridLayout.$children下有个placeholder
        if (grid.$children.length === this.layout.length) {
            return; //尚未挂载新建的
        }

        const parentRect = grid.$el.getBoundingClientRect();
        const offsetX = e.clientX - parentRect.left;
        const offsetY = e.clientY - parentRect.top;
        const dx = Math.abs(offsetX - this.dragPreX);
        const dy = Math.abs(offsetY - this.dragPreY);

        if (dx > 5 || dy > 5) { //TODO:根据布局参数计算最小diff
            let el = grid.$children[this.layout.length]; //注意placeholder
            el.dragging = {top: offsetY, left: offsetX};

            let newPos = el.calcXY(offsetY, offsetX);
            if (this.draggingItem.x != newPos.x || this.draggingItem.y != newPos.y) {
                grid.dragEvent('dragstart', this.draggingItem.i,
                    newPos.x, newPos.y, this.draggingItem.h, this.draggingItem.w);
            }

            this.dragPreX = offsetX;
            this.dragPreY = offsetY;
        }
    }

    onDragEnd(e: DragEvent) {
        if (!this.draggingItem) {
            return;
        }

        const grid: any = this.$refs.gridLayout;
        if (grid) {
            let parentRect = grid.$el.getBoundingClientRect();
            const offsetX = e.clientX - parentRect.left;
            const offsetY = e.clientY - parentRect.top;
            let el = grid.$children[this.layout.length];
            let newPos = el.calcXY(offsetY, offsetX);
            grid.dragEvent('dragend', this.draggingItem.i, newPos.x, newPos.y,
                this.draggingItem.h, this.draggingItem.w);

            this.draggingItem.c = this.makeWidget(this.draggingItem.Widget.Component);
        }

        this.draggingItem = null;
        this.dragPreX = this.dragPreY = -99999;
    }

    /** 添加工具箱选择的Widget */
    onAdd() {
        if (!DesignStore.toolbox) {
            this.$message.error('Please select a widget from toolbox');
            return;
        }
        let toolboxItem: IVueWidget = DesignStore.toolbox.getSelected();
        if (!toolboxItem) {
            this.$message.error('Please select a widget from toolbox');
            return;
        }

        let layoutItem = this.createLayoutItem(toolboxItem, false);
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

    /** 仅用于设计时绑定设计及默认样式 */
    makeWidgetStyle(item: IDesignLayoutItem): object {
        let s = item.Widget && item.Widget.Style ? item.Widget.Style : {};
        s['zIndex'] = this.preview ? 'auto' : -1;
        return s;
    }

    makeWidget(name: string) {
        //先判断是否全局注册的组件
        let isGlobal = name.indexOf('.') < 0; //TODO:暂简单判断
        if (isGlobal) {
            return Vue.component(name);
        } else {
            return LoadView(name, this.$root);
        }
    }

    onSwitchPreview() {
        this.preview = !this.preview;
        if (this.preview) {
            //重新生成运行时state及相关事件处理
            this.runState = BuildRunState(this.state);
            BuildEventsAndBindProps(this, this.layout, this.runState);
            //刷新运行时状态
            this.runState.Refresh();
        }
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

    toolbox() {
        return VueToolbox.widgets;
    }

    save() {
        let template = JSON.stringify(this.layout, (k, v) => {
            if (k == 'Widget' || k == 'moved' || k == 'a' || k == 'c' || v === this.runState) { //忽略序列化
                return undefined;
            }
            return v;
        });
        let script = JSON.stringify(this.state);
        let styles = ''; //TODO:grid props
        let runtimeCode = JSON.stringify({
            V: 1, //保留版本号
            L: this.buildRunLayout(),
            S: this.state
        });

        console.log('Template:', template);
        console.log('Script:', script);

        let node = this.target;
        let args = [node.Type, node.ID, template, script, styles, runtimeCode];
        $runtime.channel.invoke('sys.DesignService.SaveModel', args)
            .then(res => this.$message.success('Save view succeed.'))
            .catch(err => this.$message.error(err));
    }

    /** 生成运行时的布局 */
    private buildRunLayout(): IVueGridLayoutItem[] {
        let items: IVueGridLayoutItem[] = [];
        for (const item of this.layout) {
            items.push({
                i: item.i, n: item.n, x: item.x, y: item.y, w: item.w, h: item.h,
                t: item.t, m: item.m, p: item.p, e: item.e
            });
        }
        return items;
    }

    mounted() {
        VueToolbox.EnsureLoaded().then(() => {
            return $runtime.channel.invoke('sys.DesignService.OpenViewModel', [this.target.ID]);
        }).then(res => {
            if (res.Script) {
                this.state = JSON.parse(res.Script);
            }
            if (res.Template) {
                let designLayout: IDesignLayoutItem[] = JSON.parse(res.Template);
                for (const item of designLayout) {
                    item.Widget = VueToolbox.GetWidget(item.n);
                    item.c = this.makeWidget(item.Widget.Component);
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

.widgetPanel >>> .vue-resizable-handle {
    z-index: 9999;
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
    z-index: 9998;
}

</style>
