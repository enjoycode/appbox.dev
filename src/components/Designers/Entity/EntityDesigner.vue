<template>
    <div style="height:100%">
        <!-- 头部区域 -->
        <div class="header">
            <span>{{storeTitle}}</span>
            <e-radio-group fill="#0994ff" v-model="activeView" size="small" style="margin-left: 40px;">
                <e-radio-button v-for="item in views" :key="item.label" :label="item.label">{{item.title}}</e-radio-button>
            </e-radio-group>
        </div>
        <!-- 内容区域 -->
        <div class="content">
            <!-- 实体成员列表视图 -->
            <e-splitter v-show="activeView==='members'" :minSize="300" handlerColor="#f1f1f1" :size="300">
                <e-table slot="panel1" class="members" ref="memberTable" :data="members" height="100%" @current-change="currentRowChange"
                    stripe highlight-current-row border>
                    <e-table-column prop="Name" label="Name" width="180" align="center">
                    </e-table-column>
                    <e-table-column prop="Type" :formatter="entityMemberTypeFormat" label="Type" width="180" align="center">
                    </e-table-column>
                    <e-table-column prop="AllowNull" label="AllowNull" width="180" align="center">
                        <template slot-scope="scope">
                            <e-checkbox v-model="scope.row.AllowNull" disabled></e-checkbox>
                        </template>
                    </e-table-column>
                    <e-table-column prop="LocalizedName" label="LocalizeName" align="center">
                    </e-table-column>
                </e-table>
                <div slot="panel2" class="ide-property-panel">
                    <e-collapse class="ide-property-collapse" :value="collapseValue">
                        <e-collapse-item title="Entity Properties" name="1">
                            <e-form label-position="right" size="mini" label-width="120px">
                                <e-form-item label="ID">
                                    <e-input v-model="target.ID" :disabled="true"></e-input>
                                </e-form-item>
                                <e-form-item label="LocalizedName">
                                    <e-input v-model="target.LocalizedName" :disabled="true"></e-input>
                                </e-form-item>
                                <e-form-item label="AppID">
                                    <e-input v-model="target.AppID" :disabled="true"></e-input>
                                </e-form-item>
                                <e-form-item label="Model Name">
                                    <e-input v-model="target.Text" :disabled="true"></e-input>
                                </e-form-item>
                                <e-form-item label="SortNo">
                                    <e-input v-model="target.SortNo" :disabled="true"></e-input>
                                </e-form-item>
                                <e-form-item label="ToString">
                                    <e-button @click="onOpenExpressionEditor" style="width:100%;">Edit Expression</e-button>
                                </e-form-item>
                            </e-form>
                        </e-collapse-item>
                        <e-collapse-item v-if="currentMemberTitle !== null" :title="currentMemberTitle" name="2">
                            <component :is="currentMemberDesigner" :target.sync="currentMember" :model-id="target.ID"></component>
                        </e-collapse-item>
                    </e-collapse>
                </div>
            </e-splitter>
            <!-- 实体选项视图 -->
            <entity-options ref="optionsView" :target="target" :members="members" :options="options" v-if="activeView==='options'"></entity-options>
        </div>
        <!--表达式编辑器对话框占位-->
        <component v-if="expressionDialog" :is="expressionDialog" ownerType="EntityModel" :ownerID="target.ID" propertyName="ToStringExpression"
            @close="onCloseExpressionEditor"></component>
    </div>
</template>

<script>
import Vue from 'vue'
import EntityRefDesigner from './EntityRefDesigner'
import DataFieldDesigner from './DataFieldDesigner'
import EntitySetDesigner from './EntitySetDesigner'
import AutoNumberDesigner from './AutoNumberDesigner'
import FieldSetDesigner from './FieldSetDesigner'
import EntityMemberTypes from './EntityMemberTypes'
import EntityOptions from './EntityOptions'
import ExpressionDialog from '../../CodeEditor/ExpressionEditorDialog'

export default {
    components: {
        DataFieldDesigner: DataFieldDesigner,
        EntityRefDesigner: EntityRefDesigner,
        EntitySetDesigner: EntitySetDesigner,
        EntityOptions: EntityOptions
    },
    props: {
        // 实体模型节点
        target: { type: Object, required: true }
    },
    data() {
        return {
            activeView: 'members', // 当前视图 members | options | data
            views: [{ label: 'members', title: 'Members' }],
            designerType: 'EntityDesigner', // 用于外部判断当前设计视图的类型，此属性一直保持不变
            storeType: '', // 映射的存储类型
            members: [], // 成员列表
            collapseValue: ['1'],
            currentMember: null,
            currentMemberDesigner: null,
            currentMemberTitle: null, // 属性面板中成员的标题,
            expressionDialog: null, // ToString表达式编辑器对话框
            options: {
                PartitionKeys: [],
                Indexes: []
            }
        }
    },
    computed: {
        storeTitle() {
            return ''
            // return this.storeName ? this.storeType + 'Store - ' + this.storeName : 'DTO'
        },
        memberTypes() { // 当前存储类型下可使用的成员类型列表
            return EntityMemberTypes(this.storeType)
        }
    },

    methods: {
        /** ----成员操作---- */
        entityMemberTypeFormat(row, column) {
            var found = this.memberTypes.find(t => t.value === row.Type)
            return found ? found.text : 'Unknown'
        },
        currentRowChange(currentRow, oldCurrentRow) {
            this.currentMember = currentRow
            this.collapseValue = ['1', '2'] // 展开属性面板
            if (!currentRow) {
                this.collapseValue = ['1']
                this.currentMemberDesigner = null
                this.currentMemberTitle = null
                return true
            }

            switch (currentRow.Type) {
                case 0:
                    this.currentMemberDesigner = DataFieldDesigner
                    this.currentMemberTitle = 'DataField Properties'
                    break
                case 2:
                    this.currentMemberDesigner = EntityRefDesigner
                    this.currentMemberTitle = 'EntityRef Properties'
                    break
                case 3:
                    this.currentMemberDesigner = EntitySetDesigner
                    this.currentMemberTitle = 'EntitySet Properties'
                    break
                case 7:
                    this.currentMemberDesigner = AutoNumberDesigner
                    this.currentMemberTitle = 'AutoNumber Properties'
                    break
                case 11:
                    this.currentMemberDesigner = FieldSetDesigner
                    this.currentMemberTitle = 'FieldSet Properties'
                    break
                default:
                    break
            }
        },
        addMember(memberData) {
            this.members.push(memberData)
            this.selectMember(this.members[this.members.length - 1])
            this.currentMember = memberData
        },
        selectMember(row) {
            this.currentMember = row
            this.$refs.memberTable.setCurrentRow(row)
        },
        removeCurrentMember() {
            if (!this.currentMember) {
                return false
            }
            var index = this.members.indexOf(this.currentMember)
            this.members.splice(index, 1)
        },

        /** ----索引操作---- */
        addIndex(indexData) {
            this.sqlOptions.Indexes.push(indexData)
        },
        getCurrentIndex() {
            if (!this.$refs.sqlOptions) {
                return null
            }
            return this.$refs.sqlOptions.currentIndex
        },
        removeIndex(indexData) {
            let at = this.sqlOptions.Indexes.indexOf(indexData)
            if (at >= 0) {
                this.sqlOptions.Indexes.splice(at, 1)
            }
        },

        /** ----EntityModel.ToStringExpression表达式编辑器---- */
        onOpenExpressionEditor() {
            this.expressionDialog = Vue.component('ExpressionEditorDialog', ExpressionDialog)
        },
        onCloseExpressionEditor() {
            this.expressionDialog = null
        },
        save() {
            var _that = this
            this.$channel.invoke('sys.DesignService.SaveModel', [this.target.Type, this.target.ID]).then(res => {
                _that.$message.success('保存成功')
            }).catch(err => {
                _that.$message.error('保存失败: ' + err)
            })
        },
        refresh() {
            var _this = this
            this.$channel.invoke('sys.DesignService.GetEntityModel', [this.target.ID]).then(res => {
                _this.storeType = res.StoreType
                _this.members = res.Members

                _this.views.push({ label: 'options', title: 'Options' })
                _this.options.Indexes = res.Indexes
                _this.options.PartitionKeys = res.PartitionKeys
            }).catch(err => {
                _this.$message.error(err)
            })
        }
    },

    mounted() {
        this.refresh()
    }
}
</script>

<style scoped>
.header {
    line-height: 45px;
    font-weight: bold;
    padding: 0 10px;
    height: 45px;
    box-shadow: 0 3px 3px #ccc;
}

.content {
    margin-top: 4px;
    height: calc(100% - 49px);
}

.members {
    height: 100%;
}
</style>