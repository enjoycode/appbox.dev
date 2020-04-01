<template>
    <el-dialog class="dialog" title="Rename" :visible.sync="visible" @close="onClose" :before-close="onClosing" width="450px">
        <div>
            <!-- TODO:待实现全局Workspace后移除此警告项 -->
            <el-alert :title="warningInfo" type="warning" show-icon :closable="false"> </el-alert>
            <br/>
            <el-form label-width="100px">
                <el-form-item label="Target">
                    <el-input readonly v-model="dlgProps.target" size="small"></el-input>
                </el-form-item>
                <el-form-item label="Old Name">
                    <el-input readonly v-model="dlgProps.oldName" size="small"></el-input>
                </el-form-item>
                <el-form-item label="New Name">
                    <el-input v-model="newName" autofocus size="small"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer">
            <el-button :disabled="caDisabled" @click="visible = false">Cancel</el-button>
            <el-button :disabled="okDisabled" type="primary" @click="onOkClick">Ok</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import store from '@/design/DesignStore'

    export default {
        props: ['dlgProps'], // {target, targetModel, targetType, oldName} 重命名的目标对象, 重命名对象的类型，参考枚举ModelReferenceType
        data() {
            return {
                visible: true,
                newName: '', // 新名称
                caDisabled: false, // cancel按钮是否禁用
                running: false, // 是否正在运行中
                warningInfo: '请尽可能在刷新或签出所有节点后再进行此项操作，否则可能无法重命名其他开发者刚签入的模型引用。'
            }
        },
        computed: {
            okDisabled() {
                return !(this.newName && !this.running && this.newName !== this.dlgProps.oldName)
            }
        },
        methods: {
            onClosing(done) {
                if (!this.running) {
                    done()
                }
            },
            onClose() {
                this.$emit('close')
            },
            onOkClick() {
                this.running = true
                this.caDisabled = true

                var _this = this
                let args = [this.dlgProps.targetType, this.dlgProps.targetModel, this.dlgProps.oldName, this.newName]
                $runtime.channel.invoke('sys.DesignService.Rename', args).then(res => {
                    _this.running = false
                    _this.caDisabled = false
                    _this.$message.success('Rename succeed')
                    _this.visible = false
                    // 根据返回结果刷新所有已打开的相应的设计器
                    res.push(_this.dlgProps.targetModel) // 后端可能没有加入
                    store.designers.refreshDesigners(res)
                }).catch(err => {
                    _this.running = false
                    _this.caDisabled = false
                    _this.$message.error('Rename error: ' + err)
                })
            }
        }
    }
</script>