<template>
    <div class="ide-property-panel">
        <el-collapse class="ide-property-collapse" :value="expands">
            <!--State-->
            <el-collapse-item key="State" title="State" name="State">
                <el-button-group>
                    <el-button size="mini" type="plain" icon="fa fa-plus"></el-button>
                    <el-button size="mini" type="plain" icon="fa fa-times"></el-button>
                </el-button-group>
                <el-table :data="state" size="mini" border>
                    <el-table-column prop="Name" label="Name"></el-table-column>
                    <el-table-column prop="Type" label="Type"></el-table-column>
                    <el-table-column prop="Value" label="Value"></el-table-column>
                </el-table>
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
                    <el-form-item v-if="owner && owner.Widget.VText" key="text" label="Text:">
                        <el-input v-model="text"></el-input>
                    </el-form-item>
                    <el-form-item v-if="owner && owner.Widget.VModel" key="model" label="Model:">
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
                                   @change="setPropValue(item.Name, $event)"></component>
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
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator';
import VueToolbox from '@/components/Designers/View/VueToolbox';
import EventEditor from '@/components/Designers/View/PropertyEditors/EventEditor.vue';
import {BuildActionScript, IDesignLayoutItem, IVueEventAction, IVueProp, IVueState} from '@/design/IVueWidget';

@Component({
    components: {EventEditor}
})
export default class VuePropertyPanel extends Vue {
    @Prop({type: Array}) state: IVueState[];
    @Prop({type: Object}) owner: IDesignLayoutItem;

    labelWidth = '100px';
    expands = ['State', 'Widget', 'Props', 'Events']; // 展开所有分类

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
        if (!this.owner || !this.owner.p[name]) {
            return null;
        }

        return this.owner.p[name];
    }

    setPropValue(name: string, newValue: any) {
        //TODO:判断等于默认值删除属性
        this.$set(this.owner.p, name, newValue);
    }

    getPropEditor(prop: IVueProp): any {
        return VueToolbox.GetPropEditor(prop);
    }

    getEventAction(name: string): IVueEventAction | undefined {
        if (!this.owner || !this.owner.Events || !this.owner.Events[name]) {
            return undefined;
        }
        return this.owner.Events[name];
    }

    setEventAction(name: string, newValue: IVueEventAction) {
        this.$set(this.owner.Events, name, newValue);
        //生成运行时脚本
        let actionScript = BuildActionScript(newValue);
        if (!this.owner.e) {
            this.$set(this.owner, 'e', []);
        }
        let index = this.owner.e.findIndex(i => i.n == name);
        if (index < 0) {
            this.owner.e.push({n: name, c: actionScript});
        } else {
            this.owner.e[index].c = actionScript; //已存在更新脚本
        }
        //触发事件通知设计器重新生成运行时事件处理器
        this.$emit('build-event', this.owner);
    }

}
</script>
