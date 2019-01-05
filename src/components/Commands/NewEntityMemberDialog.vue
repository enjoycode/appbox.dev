<template>
    <e-dialog title="New Entity Member" width="600px" :visible.sync="visible" :close-on-click-modal="false" @close="onClose">
        <e-form :model="viewModel" ref="viewModel" :rules="rules" label-width="120px" label-position="right">
            <e-form-item prop="Name" :required="true" label="Name:">
                <e-input v-model="viewModel.Name"></e-input>
            </e-form-item>
            <e-form-item prop="EntityMemberType" label="MemberType:">
                <e-select v-model="viewModel.EntityMemberType">
                    <e-option v-for="item in memberTypes" :key="item.value" :label="item.text" :value="item.value"></e-option>
                </e-select>
            </e-form-item>
            <template v-if="viewModel.EntityMemberType === 0"> <!--DataField属性-->
                <e-form-item prop="EntityFieldType" label="FieldType:">
                    <e-select v-model="viewModel.EntityFieldType">
                        <e-option v-for="item in fieldTypes" :key="item.value" :label="item.text" :value="item.value"></e-option>
                    </e-select>
                </e-form-item>
            </template>
            <template v-if="viewModel.EntityMemberType === 2">
                <e-form-item prop="IsReverse" label="IsReverse">
                    <e-checkbox v-model="viewModel.IsReverse"></e-checkbox>
                </e-form-item>
                <e-form-item prop="RefIds" :required="true" label="Ref Target">
                    <!--<e-tree ref="refTree"
                    :data="RefTreeData" :render-content="onRenderContent" @current-change="refTreeCurrentChange"
                    class="el-tree-lock-height" :props="treeOption" highlight-current></e-tree>-->
                    <e-select v-model="viewModel.RefIds" multiple filterable>
                        <e-option-group v-for="group in RefTreeData" :key="group.ID" :label="group.Text" :value="group.ID">
                            <e-option v-for="item in group.Nodes" :key="item.ID" :label="item.Name" :value="item.ID">
                            </e-option>
                        </e-option-group>
                    </e-select>
                </e-form-item>
            </template>
            <template v-if="viewModel.EntityMemberType === 3">
                <e-form-item prop="SetId" :required="true" label="Ref Target">
                    <e-select v-model="viewModel.SetId" :filterable="true">
                        <!--<e-option-group
                            v-for="group in RefTreeData"
                            :key="group.ID"
                            :label="group.Text"
                            :value="group.ID">
                            <e-option
                                v-for="item in group.Nodes"
                                :key="item.ID"
                                :label="item.Name"
                                :value="item.ID">
                            </e-option>
                        </e-option-group>-->
                        <e-option v-for="item in SetTreeData" :key="item.EntityID" :label="item.Name" :value="item">
                            <span style="float: left">{{ item.Name }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.EntityID }}</span>
                        </e-option>
                    </e-select>
                </e-form-item>
            </template>
            <e-form-item prop="AllowNull" label="AllowNull:">
                <e-switch v-model="viewModel.AllowNull"></e-switch>
            </e-form-item>
        </e-form>
        <div slot="footer" class="dialog-footer">
            <e-button :disabled="caDisabled" @click="visible = false">Cancel</e-button>
            <e-button :disabled="okDisabled" type="primary" @click="submit('viewModel')">OK</e-button>
        </div>
    </e-dialog>
</template>

<script>
    import store from '../DesignStore'
    import DataFieldTypes from '../Designers/Entity/DataFieldTypes'

    export default {
        data() {
            return {
                visible: true,
                caDisabled: false,
                okDisabled: false,
                designer: null, // 当前的实体模型设计器实例
                RefTreeData: [],
                SetTreeData: [],
                viewModel: {
                    Name: '',
                    EntityMemberType: 0,
                    EntityFieldType: 1,
                    IsReverse: false,
                    RefIds: [],
                    SetId: null,
                    AllowNull: true
                },
                rules: {
                    Name: [
                        { validator: this.validateName, trigger: 'change' }
                    ],
                    RefIds: [
                        { validator: this.validateRefIds, trigger: 'change' }
                    ],
                    SetId: [
                        { validator: this.validateSetId, trigger: 'change' }
                    ]
                },
                onRenderContent: (h, node) => {
                    // return h('span', {staticClass: 'el-tree-node__label'}, node.data.Text)
                    var checkbox
                    if (node.data.Type === 20) {
                        checkbox = <e-checkbox checked="{node.node.checked}"></e-checkbox>
                    }
                    return (<span class="el-tree-node__label">{checkbox} {node.data.Text}</span>)
                }
            }
        },
        computed: {
            treeOption() {
                return { label: 'Text', children: 'Nodes' }
            },
            memberTypes() {
                return this.designer ? this.designer.memberTypes : []
            },
            fieldTypes() {
                return DataFieldTypes
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

                    var args = [
                        this.designer.target.ID,
                        this.viewModel.Name,
                        this.viewModel.EntityMemberType
                    ]

                    if (this.viewModel.EntityMemberType === 0) { // DataField
                        args.push(this.viewModel.EntityFieldType)
                        args.push(this.viewModel.AllowNull)
                    } else if (this.viewModel.EntityMemberType === 2) { // EntityRef
                        var refIdStr = this.viewModel.RefIds.join(',')
                        args.push(refIdStr)
                        args.push(this.viewModel.IsReverse)
                    } else if (this.viewModel.EntityMemberType === 3) { // EntitySet
                        var setId = this.viewModel.SetId
                        args.push(setId.EntityID)
                        args.push(setId.Name)
                    }

                    // 获取实体属性
                    let _this = this
                    this.$channel.invoke('sys.DesignService.NewEntityMember', args).then(res => {
                        // 根据返回结果添加新节点
                        _this.designer.addMember(res)
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
            },
            validateRefIds(rule, value, callback) {
                if (!value || value.length === 0) {
                    return callback(new Error('请选择引用实体类'))
                }
                callback()
            },
            validateSetId(rule, value, callback) {
                if (!value) {
                    return callback(new Error('请选择引用实体类'))
                }
                callback()
            }
        },
        mounted() {
            this.designer = store.designers.getActiveDesigner()

            if (this.designer.storeType === 'Sql') {
                store.tree.getAllEntityNodes(this.RefTreeData)
                // 获取所有引用指定模型标识的EntityRef Member集合
                var modelId = this.designer.target.ID
                this.$channel.invoke('sys.DesignService.GetEntityRefModels', [modelId]).then(res => {
                    this.SetTreeData = res
                }).catch(err => {
                    this.$message.error(err)
                })
            }
        }
    }
</script>