<template>
    <e-dialog title="New Entity Model" :visible.sync="visible" :close-on-click-modal="false" @close="onClose">
        <e-form :model="entityModel" ref="entityModel" :rules="rules" label-width="120px" label-position="right">
            <e-form-item prop="Name" :required="true" label="Name:">
                <e-input v-model="entityModel.Name"></e-input>
            </e-form-item>
            <e-form-item prop="LocalizedName" label="Comment:">
                <e-input v-model="entityModel.LocalizedName"></e-input>
            </e-form-item>
            <e-form-item prop="DTO" label="DTO:">
                <e-switch v-model="entityModel.DTO"></e-switch>
            </e-form-item>
            <e-form-item v-if="entityModel.DTO===false" prop="EntityModelType" label="Inherits:">
                <e-radio class="radio" v-model="entityModel.EntityModelType" :label="0">NonInherits</e-radio>
                <e-radio class="radio" v-model="entityModel.EntityModelType" :label="1">Inherits</e-radio>
            </e-form-item>
            <e-form-item v-if="entityModel.EntityModelType === 1" prop="Inherit" label="继承类">
                <!--<e-tree ref="inheritTree" @filter-node-method="filterNodeMethod" :data="InheritNodes" :props="treeOption" highlight-current></e-tree>-->
                <e-select v-model="entityModel.Inherit" filterable>
                    <e-option-group v-for="group in InheritNodes" :key="group.ID" :label="group.Text" :value="group.ID">
                        <e-option v-for="item in group.Nodes" :key="item.ID" :label="item.Name" :value="item.ID">
                        </e-option>
                    </e-option-group>
                </e-select>
            </e-form-item>
        </e-form>
        <div slot="footer" class="dialog-footer">
            <e-button :disabled="caDisabled" @click="visible = false">取 消</e-button>
            <e-button :disabled="okDisabled" type="primary" @click="submit('entityModel')">确 定</e-button>
        </div>
    </e-dialog>
</template>

<script>
    import store from '../DesignStore'

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
                    EntityModelType: 0,
                    Inherit: null
                },
                rules: {
                    Name: [
                        { validator: this.validateName, trigger: 'change' }
                    ]
                }
            }
        },
        computed: {
            treeOption() {
                return { label: 'Text', children: 'Nodes' }
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
                    this.$channel.invoke('sys.DesignService.NewEntityModel', args).then(res => {
                        // 根据返回结果添加新节点
                        store.tree.onNewNode(res)
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
            // filterNodeMethod: function (value, data, node) {
            //     // 筛选出只有类的节点
            //     return true
            // },
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
            this.storeNodes = store.tree.getAllSqlAndTableNodes()
            this.storeNodes.push({ ID: 'None', StoreType: -1 }) // -1表示没有映射
        }
    }
</script>