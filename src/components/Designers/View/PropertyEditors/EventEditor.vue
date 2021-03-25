<template>
    <div>
        <el-button @click="dlgVisible = true" style="width:100%">{{ buttonText }}</el-button>
        <event-action-dialog :visible.sync="dlgVisible" :value="value" @change="onChanged"></event-action-dialog>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop, Watch} from 'vue-property-decorator';
import EventActionDialog from '@/components/Designers/View/PropertyEditors/EventActionDialog.vue';
import {IVueEventAction} from '@/runtime/IVueVisual';

@Component({
    components: {EventActionDialog}
})
export default class EventEditor extends Vue {
    @Prop({type: Object}) value: IVueEventAction | undefined;

    dlgVisible = false;

    get buttonText(): string {
        return this.value ? this.value.Type : '...';
    }

    onChanged(newVal: IVueEventAction | undefined) {
        this.$emit('change', newVal);
    }
}
</script>
