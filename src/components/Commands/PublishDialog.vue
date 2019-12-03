<template>
    <el-dialog title="Publish Models" width="500px" :visible.sync="visible" @close="onClose" :before-close="onClosing">
        <el-table :data="pendingModels" border style="width: 100%">
            <el-table-column prop="ModelType" label="Type" width="180"></el-table-column>
            <el-table-column prop="ModelID" label="ModelID"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer" style="text-align:left">
            <el-input v-model="commitMessage" placeholder="message" style="width:55%;"></el-input>
            <div style="text-align:right;display:inline-block;width:44%;">
                <el-button :disabled="caDisabled" @click="visible = false">Cancel</el-button>
                <el-button :disabled="okDisabled" type="primary" @click="onOkClick">OK</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import store from '@/design/DesignStore'

    export default {
        data() {
            return {
                visible: true,
                commitMessage: '',
                okDisabled: true, // ok按钮是否禁用
                caDisabled: false, // cancel按钮是否禁用
                publishing: false, // 是否正在发布中
                pendingModels: []
            }
        },
        methods: {
            onClosing(done) {
                if (!this.publishing) {
                    done()
                }
            },
            onClose() {
                this.$emit('close')
            },
            onOkClick() {
                this.publishing = true
                this.okDisabled = true
                this.caDisabled = true

                var _this = this
                $runtime.channel.invoke('sys.DesignService.Publish', [this.commitMessage]).then(res => {
                    _this.publishing = false
                    _this.caDisabled = false
                    // 激发事件通知更新DesignTree的CheckoutByMe的节点的状态
                    store.emitEvent('Publish')
                    _this.$message.success('Publish succeed!')
                }).catch(err => {
                    _this.publishing = false
                    _this.okDisabled = false
                    _this.caDisabled = false
                    _this.$message.error('Publish failed: ' + err)
                })
            }
        },
        mounted() {
            var _this = this
            $runtime.channel.invoke('sys.DesignService.GetPendingChanges', []).then(res => {
                _this.pendingModels = res
                if (res && res.length > 0) {
                    _this.okDisabled = false
                }
            }).catch(err => {
                _this.$message.error('获取改变的模型失败: ' + err)
            })
        }
    }

</script>