<template>
    <el-input v-model="tempValue" @change="onChanged($event)"></el-input>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator';

@Component
export default class TextEditor extends Vue {
    @Prop() value: any;

    tempValue: any = ''; //临时值

    onChanged(val: any) {
        this.$emit('change', val);
    }

    mounted() {
        this.tempValue = this.value;
    }
}
</script>
