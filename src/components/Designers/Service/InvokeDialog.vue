<template>
    <el-dialog class="dialog" title="Invoke Service" :visible.sync="visible" :close-on-click-modal="false"
               @close="onClose">
        <span>Method: {{ dlgProps.Service + "." + dlgProps.Method.Name }}</span>
        <br/><br/>
        <el-table :data="dlgProps.Method.Args" border highlight-current-row empty-text=" ">
            <el-table-column prop="Name" label="Parameter" width="120" align="center">
            </el-table-column>
            <el-table-column prop="Type" label="Type" width="180">
            </el-table-column>
            <el-table-column label="Value">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.Value" size="small"></el-input>
                </template>
            </el-table-column>
        </el-table>
        <br/>
        <p>Result:</p>
        <el-input v-model="result" type="textarea" placeholder='Invoke Result with Json format'></el-input>
        <div slot="footer">
            <el-button @click="visible = false">Close</el-button>
            <el-button type="primary" icon="ios-search" :loading="loading" @click="onInvoke">Invoke</el-button>
        </div>
    </el-dialog>
</template>

<script>
import {decycle} from "@/assets/js/JsonUtil";

export default {
    props: [
        'dlgProps'
    ],
    data() {
        return {
            visible: true,
            loading: false,
            result: ''
        }
    },
    methods: {
        onClose: function (e) {
            this.$emit('close')
        },
        onInvoke() {
            // 先组装参数列表
            const args = [];
            try {
                for (let i = 0; i < this.dlgProps.Method.Args.length; i++) {
                    const arg = this.dlgProps.Method.Args[i];
                    args.push(JSON.parse(arg.Value))
                }
            } catch (error) {
                this.$message.error('Parameter format error:' + error)
                return
            }

            const _this = this;
            this.loading = true
            let service = this.dlgProps.Service + '.' + this.dlgProps.Method.Name
            $runtime.channel.invoke(service, args).then(res => {
                _this.loading = false
                _this.result = JSON.stringify(decycle(res), null, 4) // 最简单格式化
            }).catch(err => {
                _this.loading = false
                _this.$message.error('Invoke error: ' + err)
            })
        }
    }
}
</script>

<style scoped>
.dialog >>> .el-dialog--small {
    width: 500px;
}
</style>
