<template>
    <el-dialog title="Add Enum Item" :visible.sync="visible" :close-on-click-modal="false" @close="onClose">
        <el-form :model="viewModel" ref="viewModel" :rules="rules" label-width="120px" label-position="right">
            <el-form-item prop="Name" :required="true" label="Name">
                <el-input v-model="viewModel.Name" ></el-input>
            </el-form-item>
            <el-form-item prop="Value" :required="true" label="Value">
                <el-input-number v-model="viewModel.Value" :min="0" :disabled="!canEditValue"></el-input-number>
            </el-form-item>
            <el-form-item prop="Comment" label="Comment">
                <el-input v-model="viewModel.Comment" ></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :disabled="caDisabled" @click="visible = false">Cancel</el-button>
            <el-button :disabled="okDisabled" type="primary" @click="submit('viewModel')">Ok</el-button>
        </div>
    </el-dialog>
</template>

<script>
import store from '@/design/DesignStore'

export default {
    data() {
        return {
            visible: true,
            caDisabled: false,
            okDisabled: false,
            canEditValue: true,
            viewModel: {
                Name: '',
                Value: 0,
                Comment: ''
            },
            rules: {
                Name: [
                    { validator: this.validateName, trigger: 'change' }
                ]
            }
        }
    },
    methods: {
        onClose(e) {
            this.$emit('close')
        },
        submit(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) {
                    return false
                }
                this.okDisabled = true
                this.caDisabled = true

                var node = store.designers.getActiveDesigner()
                var _this = this
                var args = [
                    node.target.ID,
                    _this.viewModel.Name,
                    _this.viewModel.Value,
                    _this.viewModel.Comment
                ]
                // 获取实体属性
                $runtime.channel.invoke('sys.DesignService.NewEnumItem', args).then(res => {
                    // 根据返回结果添加新节点
                    node.addMember(res)
                    _this.$message.success('Add enum item succeed')
                    _this.visible = false
                    _this.caDisabled = false
                }).catch(err => {
                    _this.okDisabled = false
                    _this.caDisabled = false
                    _this.$message.error(err)
                })
            })
        },
        validateName(rule, value, callback) {
            if (!value) {
                return callback(new Error('Name cannot be null'))
            }
            // TODO 验证名称的合法性
            callback()
        }
    }
}
</script>

<style scoped>
.el-input-number {
    width: 100%;
    overflow: initial;
}
</style>
