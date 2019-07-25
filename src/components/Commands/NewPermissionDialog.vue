<template>
    <el-dialog title="New Permission" :visible.sync="visible" :close-on-click-modal="false" @close="onClose">
        <el-form :model="permissionModel" ref="frmModel" :rules="rules" label-width="120px" label-position="right">
            <el-form-item prop="Name" :required="true" label="Name:">
                <el-input v-model="permissionModel.Name"></el-input>
            </el-form-item>
            <el-form-item prop="Remark" label="Remark:">
                <el-input v-model="permissionModel.Remark" ></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :disabled="caDisabled" @click="visible = false">Cancel</el-button>
            <el-button :disabled="okDisabled" type="primary" @click="submit('frmModel')">OK</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import store from '@/design/DesignStore'

    export default {
        data() {
            return {
                visible: true,
                okDisabled: false, // ok按钮是否禁用
                caDisabled: false, // cancel按钮是否禁用
                permissionModel: { Name: '', Remark: '' },
                rules: {
                    Name: [
                        { validator: this.validateName, trigger: 'change' }
                    ]
                }
            }
        },
        methods: {
            onClose: function (e) {
                this.$emit('close')
            },
            submit: function (formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    this.okDisabled = true
                    this.caDisabled = true

                    var node = store.tree.currentNode
                    var _this = this
                    var args = [node.Type, node.ID, this.permissionModel.Name, this.permissionModel.Remark]
                    $runtime.channel.invoke('sys.DesignService.NewPermissionModel', args).then(res => {
                        store.tree.onNewNode(res) // 根据返回结果刷新或添加新节点
                        _this.$message.success('Create permission succeed')
                        _this.visible = false
                        _this.caDisabled = false
                    }).catch(err => {
                        _this.okDisabled = false
                        _this.caDisabled = false
                        _this.$message.error(err)
                    })
                })
            },
            validateName: function (rule, value, callback) {
                if (!value) {
                    return callback(new Error('Name can not be null！'))
                }
                // TODO: 验证名称的合法性
                callback()
            }
        }
    }
</script>