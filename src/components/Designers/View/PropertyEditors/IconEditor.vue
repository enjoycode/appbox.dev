<template>
    <div>
        <el-button @click="dlgVisible = true" :icon="value" style="width:100%">{{ buttonTitle }}</el-button>
        <el-dialog :visible.sync="dlgVisible">
            <div>
                <el-checkbox v-model="solid">Solid</el-checkbox>
                <div style="height: 500px;overflow: auto">
                    <div v-for="cat in icons">
                        {{ cat.label }}
                        <br/>
                        <i v-for="icon in cat.icons" class="fa-2x fa-fw" :class="getIconClass(icon)"
                           @click="onSelect(icon)" style="padding: 3px"></i>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator';
import axios from 'axios';
import * as yaml from 'js-yaml';

@Component
export default class IconEditor extends Vue {
    @Prop({type: String}) value: string | undefined;

    dlgVisible = false;
    icons = [];
    solid = true;

    private static allIcons: any = null;

    get buttonTitle() {
        return this.value ? '' : '...';
    }

    getIconClass(name: string): string {
        return this.solid ? 'fa fa-' + name : 'far fa-' + name;
    }

    onDone() {
        this.dlgVisible = false;
    }

    onSelect(name: string) {
        this.$emit('change', this.getIconClass(name));
        this.dlgVisible = false;
    }

    mounted() {
        if (!IconEditor.allIcons) {
            axios.get('/dev/categories.yml').then(res => {
                IconEditor.allIcons = yaml.load(res.data);
                this.icons = IconEditor.allIcons;
            });
        } else {
            this.icons = IconEditor.allIcons;
        }
    }
}
</script>
