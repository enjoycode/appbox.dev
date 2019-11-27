<template>
    <el-dialog title="新建枚举成员" :visible.sync="visible" :close-on-click-modal="false" @close="onClose">
        <el-form :model="viewModel" ref="viewModel" :rules="rules" label-width="120px" label-position="right">
            <el-form-item prop="Name" :required="true" label="成员名称">
                <el-input v-model="viewModel.Name" ></el-input>
            </el-form-item>
            <el-form-item prop="Value" :required="true" label="值">
                <el-input-number v-model="viewModel.Value" :min="0" :disabled="!canEditValue"></el-input-number>
            </el-form-item>
            <el-form-item prop="LocalizedName" label="本地化名称">
                <el-input v-model="viewModel.LocalizedName" ></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :disabled="caDisabled" @click="visible = false">取 消</el-button>
            <el-button :disabled="okDisabled" type="primary" @click="submit('viewModel')">确 定</el-button>
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
                LocalizedName: '',
                Value: 0
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
                    _this.viewModel.LocalizedName
                ]
                // 获取实体属性
                $runtime.channel.invoke('sys.DesignService.NewEnumItem', args).then(res => {
                    // 根据返回结果添加新节点
                    node.addMember(res)
                    _this.$message.success('添加成功')
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
                return callback(new Error('名称不能为空！'))
            }
            // TODO 验证名称的合法性
            callback()
        }
    },
    mounted() {
        // 获取所有引用指定模型标识的EntityRef Member集合
        // var modelId = store.designers.getActiveDesigner().target.ID
    }
}
</script>

<style scoped>
.el-input-number {
    width: 100%;
    overflow: initial;
}
</style>
