<template>
    <e-dialog title="新建实体模型" :visible.sync="visible" :close-on-click-modal="false" @close="onClose">
        <e-form :model="entityModel" ref="entityModel" :rules="rules" label-width="120px" label-position="right">
            <e-form-item prop="Name" :required="true" label="名称:">
                <e-input v-model="entityModel.Name"></e-input>
            </e-form-item>
            <e-form-item prop="LocalizedName" label="本地化名称:">
                <e-input v-model="entityModel.LocalizedName"></e-input>
            </e-form-item>
            <e-form-item prop="StoreName" label="存储:">
                <e-select v-model="entityModel.StoreName">
                    <e-option v-for="item in storeNodes" :key="item.ID" :value="item.ID">{{item.ID}}</e-option>
                </e-select>
            </e-form-item>
            <e-form-item v-if="storeType === 0" prop="EntityModelType" label="类型:">
                <e-radio class="radio" v-model="entityModel.EntityModelType" :label="0">普通类</e-radio>
                <e-radio class="radio" v-model="entityModel.EntityModelType" :label="1">继承类</e-radio>
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
                InheritNodes: [],
                storeNodes: [], // 所有SqlStore及TableStore节点
                entityModel: {
                    Name: '',
                    LocalizedName: '',
                    StoreName: 'Default',
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
            },
            storeType() { // 当前选择的存储类型
                var storeName = this.entityModel.StoreName
                if (storeName) {
                    var storeNode = this.storeNodes.find(t => { return t.ID === storeName })
                    if (storeNode) {
                        return storeNode.StoreType
                    }
                }
                return -1
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
                        this.storeType,
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