<template>
    <el-dialog title="Event Action" :visible="visible" width="450px" @close="onClose">
        <el-form label-position="right" size="mini" label-width="80px">
            <el-form-item key="action" label="Action:">
                <el-select v-model="type" @change="onTypeChanged" style="width: 100%">
                    <el-option v-for="item in actions" :key="item" :label="item" :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <!--LoadData-->
            <el-form-item v-if="hasState" key="state" label="State:">
                <el-input :disabled="state != null" v-model="action.State"></el-input>
            </el-form-item>
            <el-form-item v-if="hasService" key="service" label="Service:">
                <el-input v-model="action.Service" placeholder="eg: sys.HelloService.sayHello"
                          @change="onServiceChanged"></el-input>
            </el-form-item>
            <el-form-item v-if="hasService" key="args" label="ServiceArgs:">
                <el-table :data="action.ServiceArgs" size="mini" border highlight-current-row>
                    <el-table-column prop="Name" label="Name" align="center">
                    </el-table-column>
                    <el-table-column prop="Type" label="Type">
                    </el-table-column>
                    <el-table-column label="Value" width="150px">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.Value"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="onDone">Done</el-button>
        </span>
    </el-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop, Watch} from 'vue-property-decorator';
import {EventAction, IVueEventAction, IVueLoadDataAction, IVueState} from '@/runtime/IVueVisual';

@Component
export default class EventActionDialog extends Vue {
    @Prop({type: Boolean, required: true}) visible: boolean;
    @Prop({type: Object}) value: IVueEventAction | undefined;
    /** 如果有值表示正在编辑State的设置值行为 */
    @Prop({type: Object}) state: IVueState | undefined;

    type: EventAction = 'LoadData';

    get actions(): EventAction[] {
        if (this.state) {
            return ['LoadData'];
        } else {
            return ['LoadData', 'PostData', 'RunScript'];
        }
    }

    /** 临时编辑的行为（从源复制的） */
    action: IVueLoadDataAction = {Type: 'LoadData', State: '', Service: '', ServiceArgs: []};

    get hasState(): boolean {
        return this.type == 'LoadData';
    }

    get hasService(): boolean {
        return this.type == 'LoadData';
    }

    @Watch('visible')
    onVisibleChanged() {
        if (this.visible) {
            if (this.state) {
                if (this.state.Value) {
                    this.action = JSON.parse(JSON.stringify(this.state.Value)); //TODO:deep clone
                }
                this.action.State = this.state.Name;
            } else if (this.value) {
                this.action = JSON.parse(JSON.stringify(this.value)); //TODO:deep clone
            }
        }
    }

    onTypeChanged() {
        //TODO:
    }

    onServiceChanged() {
        $runtime.channel.invoke('sys.DesignService.GetMethodInfo', [this.action.Service]).then(res => {
            for (const item of res.Args) {
                this.action.ServiceArgs.push({Name: item.Name, Type: item.Type, Value: ''});
            }
        }).catch(() => this.$message.error('Cannot find target method'));
    }

    onClose() {
        this.$emit('update:visible', false);
    }

    onDone() {
        this.$emit('change', this.action);
        this.onClose();
    }
}
</script>
