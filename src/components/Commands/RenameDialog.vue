<template>
    <e-dialog class="dialog" title="重命名对话框" :visible.sync="visible" @close="onClose" :before-close="onClosing">
        <table cellspacing="15px" style="font-size:14px;width:100%;">
            <tr>
                <td colspan="2">
                    <e-alert :title="warningInfo" type="warning" show-icon :closable="false"> </e-alert>
                </td>
            </tr>
            <tr>
                <td>目标:</td>
                <td>
                    <e-input readonly v-model="dlgProps.target" size="small"></e-input>
                </td>
            </tr>
            <tr>
                <td>旧名称:</td>
                <td>
                    <e-input readonly v-model="dlgProps.oldName" size="small"></e-input>
                </td>
            </tr>
            <tr>
                <td>新名称:</td>
                <td>
                    <e-input v-model="newName" autofocus size="small"></e-input>
                </td>
            </tr>
        </table>
        <div slot="footer">
            <e-button :disabled="caDisabled" @click="visible = false">取 消</e-button>
            <e-button :disabled="okDisabled" type="primary" @click="onOkClick">确 定</e-button>
        </div>
    </e-dialog>
</template>

<script>
    import store from '../DesignStore'

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
                this.$channel.invoke('sys.DesignService.Rename', args).then(res => {
                    _this.running = false
                    _this.caDisabled = false
                    _this.$message.success('重命名成功!')
                    _this.visible = false
                    // 根据返回结果刷新所有已打开的相应的设计器
                    res.push(_this.dlgProps.targetModel) // 后端可能没有加入
                    store.designers.refreshDesigners(res)
                }).catch(err => {
                    _this.running = false
                    _this.caDisabled = false
                    _this.$message.error('重命名错误: ' + err)
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