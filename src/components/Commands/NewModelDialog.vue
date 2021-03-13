<template>
    <el-dialog :title="title" width="500px" :visible.sync="visible" :close-on-click-modal="false" @close="onClose">
        <el-form :model="model" ref="model" :rules="rules" label-width="120px" label-position="right">
            <el-form-item prop="Name" :required="true" label="Name">
                <el-input v-model="model.Name"></el-input>
            </el-form-item>
            <!--<el-form-item prop="LocalizedName" label="本地化名称">
                <el-input v-model="model.LocalizedName" ></el-input>
            </el-form-item>-->
            <el-form-item prop="Type" label="Type" v-if="dlgProps === 'View'">
                <el-radio v-model="model.Type" :label="0">Vue Code</el-radio>
                <el-radio v-model="model.Type" :label="1">Vue Visual</el-radio>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :disabled="caDisabled" @click="visible = false">Cancel</el-button>
            <el-button :disabled="okDisabled" type="primary" @click="submit('model')">Ok</el-button>
        </div>
    </el-dialog>
</template>

<script>
import store from '@/design/DesignStore'
import {modelLibs} from '../CodeEditor/EditorService'

export default {
    props: ['dlgProps'], // modelType: string
    computed: {
        title() {
            return 'New ' + this.dlgProps
        },
        service() {
            if (this.dlgProps === 'Folder' || this.dlgProps === 'Application') {
                return 'sys.DesignService.New' + this.dlgProps
            } else {
                return 'sys.DesignService.New' + this.dlgProps + 'Model'
            }
        }
    },
    data() {
        return {
            visible: true,
            okDisabled: false, // ok按钮是否禁用
            caDisabled: false, // cancel按钮是否禁用
            model: {Name: '', Type: 0}, //Type暂仅用于ViewModel
            rules: {
                Name: [
                    {validator: this.validateName, trigger: 'change'}
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

                const node = store.tree.currentNode;
                const _this = this;
                let args = [];
                if (this.dlgProps === 'Application') {
                    args = [this.model.Name]
                } else if (this.dlgProps === 'View') {
                    args = [node.Type, node.ID, this.model.Name, this.model.Type]
                } else {
                    args = [node.Type, node.ID, this.model.Name]
                }
                // 获取实体属性
                $runtime.channel.invoke(this.service, args).then(res => {
                    // 根据返回结果添加新节点
                    store.tree.onNewNode(res)
                    if (this.dlgProps === 'View') { // 如果新建视图添加ts声明代码
                        modelLibs.addView(res.NewNode)
                    }
                    _this.$message.success('Create ' + this.dlgProps + 'succeed.')
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
            // TODO 验证名称的合法性
            callback()
        }
    }
}
</script>
