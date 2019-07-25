<template>
    <el-dialog title="New Entity Model" :visible.sync="visible" :close-on-click-modal="false" @close="onClose">
        <el-form :model="entityModel" ref="entityModel" :rules="rules" label-width="120px" label-position="right">
            <el-form-item prop="Name" :required="true" label="Name:">
                <el-input v-model="entityModel.Name"></el-input>
            </el-form-item>
            <el-form-item prop="LocalizedName" label="Comment:">
                <el-input v-model="entityModel.LocalizedName"></el-input>
            </el-form-item>
            <el-form-item prop="DTO" label="DTO:">
                <el-switch v-model="entityModel.DTO"></el-switch>
            </el-form-item>
            <el-form-item v-if="entityModel.DTO===false" prop="EntityModelType" label="Inherits:">
                <el-radio class="radio" v-model="entityModel.EntityModelType" :label="0">NonInherits</el-radio>
                <el-radio class="radio" v-model="entityModel.EntityModelType" :label="1">Inherits</el-radio>
            </el-form-item>
            <el-form-item v-if="entityModel.EntityModelType === 1" prop="Inherit" label="BaseEntity:">
                <el-select v-model="entityModel.Inherit" filterable>
                    <el-option-group v-for="group in InheritNodes" :key="group.ID" :label="group.Text" :value="group.ID">
                        <el-option v-for="item in group.Nodes" :key="item.ID" :label="item.Name" :value="item.ID">
                        </el-option>
                    </el-option-group>
                </el-select>
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
                InheritNodes: [], // 继承实体节点列表
                entityModel: {
                    Name: '',
                    LocalizedName: '',
                    DTO: false,
                    EntityModelType: 0, //继承与非继承的
                    Inherit: null
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
                        this.entityModel.DTO,
                        this.entityModel.EntityModelType,
                        this.entityModel.Inherit
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
                    return callback(new Error('名称不能为空！'))
                }
                // TODO 验证名称的合法性
                callback()
            }
        },
        mounted: function () {
            store.tree.getAllEntityNodes(this.InheritNodes)
        }
    }
</script>