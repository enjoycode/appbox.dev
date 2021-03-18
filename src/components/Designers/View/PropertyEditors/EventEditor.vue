<template>
    <div>
        <el-button @click="dlgVisible = true" style="width:100%">{{ buttonText }}</el-button>
        <el-dialog title="Event Action" :visible.sync="dlgVisible" width="450px">
            <el-form label-position="right" size="mini" label-width="80px">
                <el-form-item key="action" label="Action:">
                    <el-select v-model="type" @change="onTypeChanged" style="width: 100%">
                        <el-option v-for="item in actions" :key="item.Name" :label="item.Name" :value="item.Name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!--LoadData-->
                <el-form-item v-if="hasState" key="state" label="State:">
                    <el-input v-model="action.State"></el-input>
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
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {Prop, Watch} from 'vue-property-decorator';
import {IVueEventAction, IVueLoadDataAction} from '@/design/IVueWidget';

@Component
export default class EventEditor extends Vue {
    @Prop({type: Object}) value: IVueEventAction | undefined;

    dlgVisible = false;
    type = 'LoadData';
    actions = [{Name: 'LoadData'}, {Name: 'PostData'}, {Name: 'RunScript'}];

    action: IVueLoadDataAction = {Type: 'LoadData', State: '', Service: '', ServiceArgs: []};

    get buttonText(): string {
        return this.value ? this.value.Type : '...';
    }

    get hasState(): boolean {
        return this.type == 'LoadData';
    }

    get hasService(): boolean {
        return this.type == 'LoadData';
    }

    @Watch('dlgVisible')
    onVisibleChanged() {
        if (this.dlgVisible && this.value) {
            this.action = JSON.parse(JSON.stringify(this.value)); //deep clone
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

    onDone() {
        this.$emit('change', this.action);
        this.dlgVisible = false;
    }
}
</script>
