<template>
    <div class="ide-property-panel">
        <h4 class="panel-title">{{ name }}</h4>
        <el-collapse class="ide-property-collapse" :value="expands">
            <el-collapse-item key="Common" title="Common" name="Common">
                <el-form label-position="right" size="mini" :label-width="labelWidth">
                    <el-form-item key="id" label="Id:">
                        <el-input :value="id" disabled></el-input>
                    </el-form-item>

                    <el-form-item v-if="hasText" key="text" label="Text:">
                        <el-input v-model="text"></el-input>
                    </el-form-item>
                </el-form>
            </el-collapse-item>

            <el-collapse-item v-if="props" key="Props" title="Props" name="Props">
                <el-form label-position="right" size="mini" :label-width="labelWidth">
                    <el-form-item v-for="item in props" :key="item.Name" :label="item.Name + ':'">
                        <!--                        <component ref="editors" :is="item.editor" :target="item"></component>-->
                        <el-input></el-input>
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
import ILayoutItem from '@/components/Designers/View/ILayoutItem';

@Component
export default class VuePropertyPanel extends Vue {
    @Prop({type: Object}) owner: ILayoutItem;

    labelWidth = '100px';
    expands = ['Common', 'Props', 'Events']; // 展开所有分类

    get name() {
        return this.owner ? this.owner.n : '';
    }

    get id() {
        return this.owner ? this.owner.i : '';
    }

    get hasText(): boolean {
        if (!this.owner) {
            return false;
        }
        return !!this.owner.c.VText;
    }

    get text() {
        return this.owner ? this.owner.t : '';
    }

    set text(value: string) {
        if (this.owner) {
            this.owner.t = value;
        }
    }

    get props() {
        return this.owner ? this.owner.c.Props : [];
    }

}
</script>

<style scoped>
.panel-title {
    margin-top: 5px;
    margin-bottom: 5px;
}
</style>
