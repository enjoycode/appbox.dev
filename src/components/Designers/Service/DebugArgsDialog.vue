<template>
    <el-dialog class="dialog" title="Debug Service" :visible.sync="visible" :close-on-click-modal="false" @close="onClose">
        <span>Method: {{dlgProps.Service + "." + dlgProps.Method.Name}}</span>
        <el-table :data="dlgProps.Method.Args" border highlight-current-row>
            <el-table-column prop="Name" label="Parameter" width="120" align="center">
            </el-table-column>
            <el-table-column prop="Type" label="Type" width="180">
            </el-table-column>
            <el-table-column label="Value">
                <template slot-scope="scope">
                    <ex-textbox-cell v-model="scope.row.Value"></ex-textbox-cell>
                </template>
            </el-table-column>
        </el-table>
        <div slot="footer">
            <el-button @click="visible = false">Cancel</el-button>
            <el-button type="primary" @click="onOkClick">Start</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        props: [
            'dlgProps'
        ],
        data() {
            return {
                visible: true
            }
        },
        methods: {
            onClose: function (e) {
                this.$emit('close')
            },
            onOkClick() {
                // 先组装参数列表
                var args = []
                try {
                    for (var i = 0; i < this.dlgProps.Method.Args.length; i++) {
                        var arg = this.dlgProps.Method.Args[i]
                        args.push(JSON.parse(arg.Value))
                    }
                } catch (error) {
                    this.$message.error('参数值格式错误:' + error)
                    return
                }

                let _this = this
                let invokeArgs = [this.dlgProps.ModelID, this.dlgProps.Method.Name, JSON.stringify(args), JSON.stringify(this.dlgProps.Breakpoints)]
                $runtime.channel.invoke('sys.DesignService.StartDebugging', invokeArgs).then(res => {
                    _this.$message.success('开始调试成功')
                    _this.visible = false
                }).catch(err => {
                    _this.$message.error('开始调试失败: ' + err)
                    _this.visible = false
                })
            }
        }
    }
</script>

<style scoped>
    .dialog>>>.el-dialog--small {
        width: 500px;
    }
</style>