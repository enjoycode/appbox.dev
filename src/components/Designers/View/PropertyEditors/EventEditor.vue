<template>
    <div>
        <el-button @click="dlgVisible = true" style="width:100%">...</el-button>
        <el-dialog title="Event Action" :visible.sync="dlgVisible" width="400px">
            <div>Event</div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dlgVisible = false">Done</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator';

@Component
export default class EventEditor extends Vue {
    dlgVisible = false;
}
</script>
