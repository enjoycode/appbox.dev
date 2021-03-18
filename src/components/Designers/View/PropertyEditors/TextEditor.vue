<template>
    <el-input :value="value" @input="$emit('change', $event)"
              @change="$emit('change', $event)"></el-input>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator';

@Component
export default class TextEditor extends Vue {
    @Prop() value: any;
}
</script>
