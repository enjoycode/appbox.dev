<template>
    <el-dialog title="New Entity Model" :visible.sync="visible" :close-on-click-modal="false" @close="onClose" width="500px">
        <el-form :model="entityModel" ref="entityModel" :rules="rules" label-width="120px" label-position="right">
            <el-form-item prop="Name" :required="true" label="Name:">
                <el-input v-model="entityModel.Name"></el-input>
            </el-form-item>
            <el-form-item prop="LocalizedName" label="Comment:">
                <el-input v-model="entityModel.LocalizedName"></el-input>
            </el-form-item>
            <el-form-item prop="StoreName" label="Store:">
                <el-select v-model="entityModel.StoreName" style="width:100%">
                    <el-option v-for="item in storeNodes" :key="item.ID" :value="item.Text">{{item.Text}}</el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="entityModel.StoreName==='Default'" prop="OrderByDesc" label="OrderByDesc:">
                <el-switch v-model="entityModel.OrderByDesc"></el-switch>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :disabled="caDisabled" @click="visible = false">Cancel</el-button>
            <el-button :disabled="okDisabled" type="primary" @click="submit('entityModel')">OK</el-button>
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
                storeNodes: [],    // 所有SqlStore节点
                entityModel: {
                    Name: '',
                    LocalizedName: '',
                    StoreName: 'Default',
                    OrderByDesc: false //时间戳排序
                },
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
                    var args = [
                        node.Type,
                        node.ID,
                        this.entityModel.Name,
                        this.entityModel.LocalizedName,
                        this.entityModel.StoreName,
                        this.entityModel.OrderByDesc
                    ]
                    // 获取实体属性
                    $runtime.channel.invoke('sys.DesignService.NewEntityModel', args).then(res => {
                        // 根据返回结果添加新节点
                        store.tree.onNewNode(res)
                        _this.$message.success('Create entity succeed')
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
                    return callback(new Error('Name is empty！'))
                }
                // TODO 验证名称的合法性
                callback()
            }
        },
        mounted() {
            this.storeNodes.push({ID: '', Text:''})
            this.storeNodes = this.storeNodes.concat(store.tree.getAllStoreNodes())
        }
    }
</script>