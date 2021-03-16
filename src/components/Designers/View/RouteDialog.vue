<template>
    <el-dialog title="Route" width="500px" :visible="visible" @close="onClose">
        <el-form label-width="120px">
            <el-form-item>
                <el-checkbox v-model="route.Enable" :disabled="readonly">List in route</el-checkbox>
            </el-form-item>
            <el-form-item label="Route Parent:">
                <!--TODO:考虑用选择器直接选择，目前输入-->
                <el-input v-model="route.Parent" :disabled="readonly" placeholder="eg: sys.Home"></el-input>
            </el-form-item>
            <el-form-item label="Custom Path:">
                <el-input v-model="route.Path" :disabled="readonly" placeholder="eg: customers"></el-input>
            </el-form-item>
            <!-- <el-form-item label="Bind Permission:">
                <el-select :disabled="readOnly" v-model="permissionValue" clearable placeholder="权限">
                    <el-option label="管理员1" value="1">
                    </el-option>
                </el-select>
            </el-form-item> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="onClose">Cancel</el-button>
            <el-button :disabled="readonly" type="primary" @click="onChange">OK</el-button>
        </span>
    </el-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop} from 'vue-property-decorator';

@Component
export default class RouteDialog extends Vue {
    @Prop({type: Boolean, required: true}) readonly: boolean;
    @Prop({type: Boolean, required: true}) visible: boolean;
    @Prop({type: Object, required: true}) route: object;

    onClose() {
        this.$emit('update:visible', false);
    }

    onChange() {
        this.$emit('change');
    }
}
</script>
