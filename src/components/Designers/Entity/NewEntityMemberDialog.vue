<template>
    <el-dialog title="New Entity Member" width="500px" :visible.sync="visible" :close-on-click-modal="false" @close="onClose">
        <el-form :model="viewModel" ref="viewModel" :rules="rules" label-width="120px" label-position="right">
            <el-form-item prop="Name" :required="true" label="Name:">
                <el-input v-model="viewModel.Name"></el-input>
            </el-form-item>
            <el-form-item prop="EntityMemberType" label="MemberType:">
                <el-select v-model="viewModel.EntityMemberType" style="width:100%">
                    <el-option v-for="item in memberTypes" :key="item.value" :label="item.text" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <!--DataField属性-->
            <template v-if="viewModel.EntityMemberType === 0"> 
                <el-form-item prop="EntityFieldType" label="FieldType:">
                    <el-select v-model="viewModel.EntityFieldType" key="s-fieldtype" style="width:100%">
                        <el-option v-for="item in fieldTypes" :key="item.value" :label="item.text" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </template>
            <!--EntityRef属性-->
            <template v-if="viewModel.EntityMemberType === 2"> 
                <el-form-item prop="RefIds" label="Ref Target:">
                    <el-select v-model="viewModel.RefIds" multiple filterable key="s-refids" style="width:100%">
                        <el-option-group v-for="group in RefTreeData" :key="group.ID" :label="group.Text" :value="group.ID">
                            <el-option v-for="item in group.Nodes" :key="item.ID" :label="item.Text" :value="item.ID">
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item prop="IsReverse" label="IsReverse:">
                    <el-checkbox v-model="viewModel.IsReverse"></el-checkbox>
                </el-form-item> -->
            </template>
            <!--EntitySet属性-->
            <template v-if="viewModel.EntityMemberType === 3">
                <el-form-item prop="SetId" :required="true" label="Ref Target:">
                    <el-select v-model="viewModel.SetId" filterable key="s-setid">
                        <el-option v-for="item in SetTreeData" :key="item.Path" :label="item.Path" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </template>
            <el-form-item prop="AllowNull" label="AllowNull:" v-if="viewModel.EntityMemberType !== 3" >
                <el-switch v-model="viewModel.AllowNull"></el-switch>
            </el-form-item>
            <el-form-item prop="DefaultValue" label="DefaultValue:" v-if="!viewModel.AllowNull">
                <el-input v-model="viewModel.DefaultValue"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :disabled="caDisabled" @click="visible = false">Cancel</el-button>
            <el-button :disabled="okDisabled" type="primary" @click="submit('viewModel')">OK</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import store from '@/design/DesignStore'
    import DataFieldTypes from './DataFieldTypes'

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
                    AllowNull: true,
                    DefaultValue: ''
                },
                rules: {
                    Name: [
                        { validator: this.validateName, trigger: 'change' }
                    ],
                    // RefIds: [
                    //     { validator: this.validateRefIds, trigger: 'change' }
                    // ],
                    // SetId: [
                    //     { validator: this.validateSetId, trigger: 'change' }
                    // ]
                },
                onRenderContent: (h, node) => {
                    // return h('span', {staticClass: 'el-tree-node__label'}, node.data.Text)
                    var checkbox
                    if (node.data.Type === 20) {
                        checkbox = <el-checkbox checked="{node.node.checked}"></el-checkbox>
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
                        if (!this.viewModel.AllowNull) {
                            args.push(this.viewModel.DefaultValue)
                        }
                    } else if (this.viewModel.EntityMemberType === 2) { // EntityRef
                        args.push(this.viewModel.AllowNull)
                        var refIdStr = this.viewModel.RefIds.join(',')
                        args.push(refIdStr)
                        args.push(this.viewModel.IsReverse)
                    } else if (this.viewModel.EntityMemberType === 3) { // EntitySet
                        args.push(this.viewModel.SetId.EntityID)
                        args.push(this.viewModel.SetId.MemberID)
                    }

                    // 获取实体属性
                    let _this = this
                    $runtime.channel.invoke('sys.DesignService.NewEntityMember', args).then(res => {
                        // 根据返回结果添加新节点
                        _this.designer.addMember(res)
                        _this.$message.success('Add member succeed')
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
                    return callback(new Error('Name can not be empty'))
                }
                // TODO 验证名称的合法性
                callback()
            },
            // validateRefIds(rule, value, callback) {
            //     if (!value || value.length === 0) {
            //         return callback(new Error('Please choose a EntityRef'))
            //     }
            //     callback()
            // },
            // validateSetId(rule, value, callback) {
            //     if (!value) {
            //         return callback(new Error('请选择引用实体类'))
            //     }
            //     callback()
            // }
        },
        mounted() {
            this.designer = store.designers.getActiveDesigner()

            if (!this.designer.isDTO) {
                store.tree.getAllEntityNodes(this.RefTreeData, this.designer.target.StoreId)
                // 获取所有引用指定模型标识的EntityRef Member集合
                const modelId = this.designer.target.ID;
                $runtime.channel.invoke('sys.DesignService.GetEntityRefModels', [modelId]).then(res => {
                    this.SetTreeData = res
                }).catch(err => {
                    this.$message.error(err)
                })
            }
        }
    }
</script>
