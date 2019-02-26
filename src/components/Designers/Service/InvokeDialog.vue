<template>
    <e-dialog class="dialog" title="Invoke Service" :visible.sync="visible" :close-on-click-modal="false" @close="onClose">
        <span>Method: {{dlgProps.Service + "." + dlgProps.Method.Name}}</span>
        <br/><br/>
        <e-table :data="dlgProps.Method.Args" border highlight-current-row empty-text=" ">
            <e-table-column prop="Name" label="Parameter" width="120" align="center">
            </e-table-column>
            <e-table-column prop="Type" label="Type" width="180">
            </e-table-column>
            <e-table-column label="Value">
                <template slot-scope="scope">
                    <e-textbox-cell v-model="scope.row.Value"></e-textbox-cell>
                </template>
            </e-table-column>
        </e-table>
        <br/>
        <p>Result:</p>
        <e-input v-model="result" type="textarea" placeholder='Invoke Result with Json format'></e-input>
        <div slot="footer">
            <e-button @click="visible = false">Close</e-button>
            <e-button type="primary" icon="ios-search" :loading="loading" @click="onInvoke">Invoke</e-button>
        </div>
    </e-dialog>
</template>

<script>
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
                var args = []
                try {
                    for (var i = 0; i < this.dlgProps.Method.Args.length; i++) {
                        var arg = this.dlgProps.Method.Args[i]
                        args.push(JSON.parse(arg.Value))
                    }
                } catch (error) {
                    this.$message.error('Parameter format error:' + error)
                    return
                }

                var _this = this
                this.loading = true
                let service = this.dlgProps.Service + '.' + this.dlgProps.Method.Name
                $runtime.channel.invoke(service, args).then(res => {
                    _this.loading = false
                    _this.result = JSON.stringify(res)
                }).catch(err => {
                    _this.loading = false
                    _this.$message.error('Invoke error: ' + err)
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