<template>
    <el-select :value="value" @change="$emit('change', $event)">
        <el-option v-for="item in options" :key="item" :value="item"></el-option>
    </el-select>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator';

@Component
export default class SelectEditor extends Vue {
    @Prop() value: any;
    @Prop({required: true}) options: Array<any>;
}
</script>
