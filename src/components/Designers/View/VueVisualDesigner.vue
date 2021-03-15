<template>
    <ex-splitter :pin-second="true" :minSize="300" handlerColor="#a2a2a2" :size="300">
        <!-- 左边编辑区域 -->
        <div slot="panel1" style="height: 100%">
            <!-- 顶部工具栏 -->
            <div class="editorTool">
                <el-button size="mini" icon="fa fa-plus fa-fw" @click="onAdd">Add</el-button>
                <el-button size="mini" icon="fa fa-times fa-fw" @click="onRemove">Remove</el-button>
                <el-button size="mini" @click="routeDialogVisible = true">Route</el-button>

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
                <grid-layout class="editorCanvas" :layout.sync="layout" :col-num="24" :row-height="32" is-draggable
                             is-resizable>
                    <grid-item class="widgetPanel" v-for="item in layout" :x="item.x" :y="item.y" :w="item.w"
                               :h="item.h" :i="item.i" :key="item.i">
                        <div class="widgetOverlay" @click="onSelectWidget(item)"></div>
                        <!-- 动态widget -->
                        <component v-if="item.t.VText" :is="makeWidget(item)" style="z-index: -1;width: 100%"
                                   v-bind="getWidgetProps(item)" v-text="getWidgetText(item)"></component>
                        <component v-else :is="makeWidget(item)" style="z-index: -1"
                                   v-bind="getWidgetProps(item)"></component>
                    </grid-item>
                </grid-layout>
            </div>
        </div>
        <!-- 右边属性区域 -->
        <div slot="panel2" class="ide-property-panel">
            <el-collapse class="ide-property-collapse" :value="collapseValue">
                <el-collapse-item title="Widget Properties" name="1">
                    <el-form label-position="right" size="mini" label-width="120px">
                        <el-form-item label="ID">
                            <el-input v-model="target.ID" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="Comment">
                            <el-input v-model="target.Comment" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="AppID">
                            <el-input v-model="target.AppID" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="Model Name">
                            <el-input v-model="target.Text" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="SortNo">
                            <el-input v-model="target.SortNo" :disabled="true"></el-input>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <!--                <el-collapse-item v-if="currentMemberTitle !== null" :title="currentMemberTitle" name="2">-->
                <!--                    <component :is="currentMemberDesigner" :member.sync="currentMember" :owner="target"></component>-->
                <!--                </el-collapse-item>-->
            </el-collapse>
        </div>
    </ex-splitter>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator';
import DesignStore from '@/design/DesignStore';
import VueToolbox, {IVueComponent} from '@/components/Designers/View/VueToolbox';

interface ILayoutItem {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    c: string;
    o: any;
    t?: IVueComponent;
}

@Component
export default class VueVisualDesigner extends Vue {
    @Prop({type: Object, required: true}) target;

    readOnly = true; // 是否只读模式，对应模型的签出状态
    collapseValue = ['1'];
    routeEnable = false; // 是否启用路由
    routeParent = ''; // 自定义路由的上级
    routePath = ''; // 自定义路由的路径
    routeDialogVisible = false;

    hoverWidget: number = -1;
    selectedWidget: ILayoutItem = null; //当前选择的Widget

    temp_input: string = '';

    layout: ILayoutItem[] = [
        {x: 0, y: 0, w: 6, h: 4, i: '0', c: 'Input', o: {}, t: VueToolbox.GetComponent('Input')},
        {x: 0, y: 6, w: 12, h: 4, i: '1', c: 'Button', o: {}, t: VueToolbox.GetComponent('Button')},
        {x: 6, y: 0, w: 6, h: 4, i: '2', c: 'Button', o: {}, t: VueToolbox.GetComponent('Button')}
    ];

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
        let toolboxItem: IVueComponent = DesignStore.toolBoxTree.getSelected();
        if (!toolboxItem) {
            this.$message.error('Please select a widget from toolbox');
            return;
        }

        let id = this.makeWidgetId();
        let layoutItem: ILayoutItem = {
            i: id, x: 0, y: 0, //TODO:排到最后
            w: toolboxItem.DefaultWidth,
            h: toolboxItem.DefaultHeight,
            c: toolboxItem.Name,
            o: {},
            t: toolboxItem
        };
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
        let isGlobal = item.t.Component.indexOf('.') < 0; //TODO:暂简单判断
        if (isGlobal) {
            return Vue.component(item.t.Component);
        }
        return null;
    }

    getWidgetText(item: ILayoutItem) {
        if (item.t.VText) {
            return item.t.VText;
        }
        return null;
    }

    getWidgetBind(item: ILayoutItem) {
        if (item.c == 'Input') {
            return 'temp_input';
        }
        return undefined;
    }

    getWidgetProps(layoutItem: ILayoutItem) {
        return {
            type: 'primary',
            size: 'small',
            placeholder: 'Please Input'
        };
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
    opacity: 0.2;
    -moz-opacity: 0.2;
    width: 100%;
    height: 100%;
}

</style>
