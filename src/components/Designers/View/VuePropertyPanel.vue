<template>
    <div class="ide-property-panel">
        <el-collapse class="ide-property-collapse" :value="expands">
            <!--State-->
            <el-collapse-item key="State" title="State" name="State">
                <el-button-group>
                    <el-button @click="onAddState" size="mini" type="plain" icon="fa fa-plus"></el-button>
                    <el-button size="mini" type="plain" icon="fa fa-minus"></el-button>
                </el-button-group>
                <c-grid :data="state" :theme="gridTheme" :default-row-height="28"
                        style="height:180px;border: solid silver 1px;background-color: white">
                    <c-grid-input-column field="Name" caption="Name" :width="80"></c-grid-input-column>
                    <c-grid-input-column field="Type" caption="Type" :width="100"></c-grid-input-column>
                    <c-grid-button-column field="Value" caption="..." @click="onSetState" width="auto">Value
                    </c-grid-button-column>
                </c-grid>
            </el-collapse-item>
            <!--Widget-->
            <el-collapse-item v-if="owner" key="Widget" title="Widget" name="Widget">
                <el-form label-position="right" size="mini" :label-width="labelWidth">
                    <el-form-item key="name" label="Name:">
                        <el-input :value="name" disabled></el-input>
                    </el-form-item>
                    <el-form-item key="id" label="Id:">
                        <el-input :value="id" disabled></el-input>
                    </el-form-item>
                    <el-form-item v-if="owner && owner.Widget.Text" key="text" label="Text:">
                        <el-input v-model="text"></el-input>
                    </el-form-item>
                    <el-form-item v-if="owner && owner.Widget.Model" key="model" label="Model:">
                        <el-input v-model="model"></el-input> <!--TODO:专用编辑器-->
                    </el-form-item>
                </el-form>
            </el-collapse-item>
            <!--Props-->
            <el-collapse-item v-if="owner && props" key="Props" title="Props" name="Props">
                <el-form label-position="right" size="mini" :label-width="labelWidth">
                    <el-form-item v-for="item in props" :key="item.Name" :label="item.Name + ':'">
                        <component :is="getPropEditor(item)"
                                   :value="getPropValue(item.Name)"
                                   :options="item.EditorOptions"
                                   @change="setPropValue(item, $event)"></component>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
            <!--Events-->
            <el-collapse-item v-if="owner && events" key="Events" title="Events" name="Events">
                <el-form label-position="right" size="mini" :label-width="labelWidth">
                    <el-form-item v-for="item in events" :key="item.Name" :label="item.Name + ':'">
                        <event-editor :value="getEventAction(item.Name)"
                                      @change="setEventAction(item.Name, $event)"></event-editor>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
        </el-collapse>

        <!--设置状态值对话框-->
        <event-action-dialog :visible.sync="stateDlgVisible"
                             :state="currentState" @change="onStateValueChanged"></event-action-dialog>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator';
import VueToolbox from '@/components/Designers/View/VueToolbox';
import EventEditor from '@/components/Designers/View/PropertyEditors/EventEditor.vue';
import {IDesignLayoutItem, IVueProp} from '@/design/IVueWidget';
import {IVueEventAction, IVueState} from '@/runtime/IVueVisual';
import EventActionDialog from '@/components/Designers/View/PropertyEditors/EventActionDialog.vue';

@Component({
    components: {EventActionDialog, EventEditor}
})
export default class VuePropertyPanel extends Vue {
    @Prop({type: Array}) state: IVueState[];
    @Prop({type: Object}) owner: IDesignLayoutItem;

    gridTheme = {
        frozenRowsBgColor: '#f3f3f3',
        borderColor: 'silver',
        highlightBorderColor: '#409EFF',
        underlayBackgroundColor: 'white',
        font: '12px sans-serif',
    };

    labelWidth = '100px';
    expands = ['State', 'Widget', 'Props', 'Events']; // 展开所有分类

    /** 当前选择的State */
    currentState: IVueState | null = null;
    stateDlgVisible = false;

    get name() {
        return this.owner ? this.owner.n : '';
    }

    get id() {
        return this.owner ? this.owner.i : '';
    }

    get text() {
        return this.owner ? this.owner.t : '';
    }

    set text(value: string) {
        if (this.owner) {
            this.owner.t = value;
        }
    }

    get model(): string {
        return this.owner ? this.owner.m : '';
    }

    set model(value: string) {
        if (this.owner) {
            this.owner.m = value;
        }
    }

    get props() {
        return this.owner ? this.owner.Widget.Props : [];
    }

    get events() {
        return this.owner ? this.owner.Widget.Events : null;
    }

    getPropValue(name: string): any {
        if (!this.owner) {
            return null;
        }

        if (this.owner.b && this.owner.b[name]) {
            return this.owner.b[name];
        }
        if (this.owner.p && this.owner.p[name]) {
            return this.owner.p[name];
        }

        return null;
    }

    setPropValue(prop: IVueProp, newValue: any) {
        if (!newValue) {
            this.$delete(this.owner.p, prop.Name);
            if (this.owner.b && this.owner.b[prop.Name]) {
                this.$delete(this.owner.b, prop.Name);
            }
            return;
        }

        if (typeof newValue === 'string' && newValue.startsWith(':')) {
            if (!this.owner.b) {
                this.owner.b = {};
            }
            this.$set(this.owner.b, prop.Name, newValue);
            //不用在这里同步绑定,预览时处理
        } else {
            //TODO:判断等于默认值删除属性
            if (this.owner.b && this.owner.b[prop.Name]) {
                this.$delete(this.owner.b, prop.Name);
            }
            this.$set(this.owner.p, prop.Name, newValue);
        }
    }

    getPropEditor(prop: IVueProp): any {
        if (!prop.e) {
            console.log('设置属性编辑器: ' + prop.Editor);
            prop.e = VueToolbox.GetPropEditor(prop, this.$root);
        }

        return prop.e;
    }

    getEventAction(name: string): IVueEventAction | undefined {
        if (!this.owner || !this.owner.e || !this.owner.e[name]) {
            return undefined;
        }
        return this.owner.e[name];
    }

    setEventAction(name: string, newValue: IVueEventAction) {
        if (!this.owner.e) {
            this.$set(this.owner, 'e', {});
        }
        this.$set(this.owner.e, name, newValue);
    }

    onAddState() {
        this.state.push({Name: 'name', Type: 'string', Value: null});
    }

    onSetState(val: IVueState) {
        this.currentState = val;
        this.stateDlgVisible = true;
    }

    onStateValueChanged(val: IVueEventAction | undefined) {
        this.currentState.Value = val;
    }

}
</script>
