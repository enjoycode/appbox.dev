<template>
    <div style="height:100%">
        <!-- 头部区域 -->
        <div class="header">
            <span>{{ storeTitle }}</span>
            <el-radio-group fill="#0994ff" v-model="activeView" size="small" style="margin-left: 40px;">
                <el-radio-button v-for="item in views" :key="item.label" :label="item.label">{{ item.title }}
                </el-radio-button>
            </el-radio-group>
            &nbsp;
            <el-button-group v-show="activeView==='members'">
                <el-button @click="onAddMember" size="small" icon="el-icon-circle-plus">Add</el-button>
                <el-button @click="onRemoveMember" :disabled="currentMember==null" size="small" icon="el-icon-remove">
                    Remove
                </el-button>
                <el-button @click="onRenameMember" :disabled="currentMember==null" size="small" icon="fas fa-edit">
                    Rename
                </el-button>
                <el-button @click="onFindUsages" :disabled="currentMember==null" size="small" icon="fas fa-link">
                    Usages
                </el-button>
            </el-button-group>
        </div>
        <!-- 内容区域 -->
        <div class="content">
            <!-- 实体成员列表视图 -->
            <ex-splitter v-show="activeView==='members'" :minSize="300" handlerColor="#f1f1f1" :size="300">
                <el-table slot="panel1" class="members" ref="memberTable" :data="members" height="100%"
                          @current-change="currentRowChange"
                          stripe highlight-current-row border>
                    <el-table-column prop="Name" label="Name" width="180" align="center">
                    </el-table-column>
                    <el-table-column prop="Type" :formatter="entityMemberTypeFormat" label="Type" width="180"
                                     align="center">
                    </el-table-column>
                    <el-table-column prop="AllowNull" label="AllowNull" width="180" align="center">
                        <template slot-scope="scope">
                            <el-checkbox v-model="scope.row.AllowNull" disabled></el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column prop="Comment" label="Comment" align="center">
                    </el-table-column>
                </el-table>
                <div slot="panel2" class="ide-property-panel">
                    <el-collapse class="ide-property-collapse" :value="collapseValue">
                        <el-collapse-item title="Entity Properties" name="1">
                            <el-form label-position="right" size="mini" label-width="120px">
                                <el-form-item label="ID">
                                    <el-input v-model="target.ID" :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="Comment">
                                    <el-input v-model="target.Comment" :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="AppID">
                                    <el-input v-model="target.AppID" :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="Model Name">
                                    <el-input v-model="target.Text" :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="SortNo">
                                    <el-input v-model="target.SortNo" :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="ToString">
                                    <el-button @click="onOpenExpressionEditor" style="width:100%;">Edit Expression
                                    </el-button>
                                </el-form-item>
                            </el-form>
                        </el-collapse-item>
                        <el-collapse-item v-if="currentMemberTitle !== null" :title="currentMemberTitle" name="2">
                            <component :is="currentMemberDesigner" :member.sync="currentMember"
                                       :owner="target"></component>
                        </el-collapse-item>
                    </el-collapse>
                </div>
            </ex-splitter>
            <!-- 实体选项视图 -->
            <sys-store-options ref="sysoptsView" :target="target" :members="members" :options="options"
                               v-if="activeView==='sysopts'"></sys-store-options>
            <sql-store-options ref="sqloptsView" :target="target" :members="members" :options="options"
                               v-if="activeView==='sqlopts'"></sql-store-options>
            <cql-store-options ref="cqloptsView" :target="target" :members="members" :options="options"
                               v-if="activeView==='cqlopts'"></cql-store-options>
            <entity-data-view ref="dataView" :target="target" :members="members"
                              v-if="activeView==='data'"></entity-data-view>
        </div>
        <!--表达式编辑器对话框占位-->
        <component v-if="expressionDialog" :is="expressionDialog" ownerType="EntityModel" :ownerID="target.ID"
                   propertyName="ToStringExpression"
                   @close="onCloseExpressionEditor"></component>
    </div>
</template>

<script>
import Vue from 'vue'
import DesignStore from '@/design/DesignStore'
import DataFieldDesigner from './DataFieldDesigner'
import EntityRefDesigner from './EntityRefDesigner'
import EntitySetDesigner from './EntitySetDesigner'

import EntityMemberTypes from './EntityMemberTypes'
import DataFieldTypes from './DataFieldTypes'
import ModelReferenceType from '@/design/ModelReferenceType'
import ModelType from '@/design/ModelType'
import {modelLibs} from '../../CodeEditor/EditorService'

import DataStoreKind from '@/design/DataStoreKind'
import SysStoreOptions from './SysStoreOptions'
import SqlStoreOptions from './SqlStoreOptions'
import CqlStoreOptions from './CqlStoreOptions'
import EntityDataView from './EntityDataView'

import RenameDialog from '@/components/Commands/RenameDialog'
import NewMemberDialog from './NewEntityMemberDialog'
import ExpressionDialog from '../../CodeEditor/ExpressionEditorDialog'

export default {
    components: {
        DataFieldDesigner: DataFieldDesigner,
        EntityRefDesigner: EntityRefDesigner,
        EntitySetDesigner: EntitySetDesigner,
        SysStoreOptions: SysStoreOptions,
        SqlStoreOptions: SqlStoreOptions,
        CqlStoreOptions: CqlStoreOptions,
        EntityDataView: EntityDataView
    },
    props: {
        // 实体模型节点
        target: {type: Object, required: true}
    },
    data() {
        return {
            activeView: 'members', // 当前视图 members | options | data
            views: [{label: 'members', title: 'Members'}],
            designerType: 'EntityDesigner', // 用于外部判断当前设计视图的类型，此属性一直保持不变
            isNew: false,
            members: [], // 成员列表
            collapseValue: ['1'],
            currentMember: null,
            currentMemberDesigner: null,
            currentMemberTitle: null, // 属性面板中成员的标题,
            expressionDialog: null, // ToString表达式编辑器对话框
            options: null             // 存储选项
        }
    },
    computed: {
        storeTitle() {
            if (!this.options) {
                return 'DTO'
            } else if (this.options.StoreName) {
                if (this.options.StoreKind === DataStoreKind.Sql) {
                    return 'SqlStore - ' + this.options.StoreName
                } else {
                    return 'CqlStore - ' + this.options.StoreName
                }
            } else { //map to system store
                if (this.options.PartitionKeys && this.options.PartitionKeys.length > 0) {
                    return 'Default - Partitioned'
                }
                return 'Default - NonPartitioned'
            }
        },
        memberTypes() { // 当前存储类型下可使用的成员类型列表
            return EntityMemberTypes(this.isDTO)
        }
    },

    methods: {
        /** ----成员操作---- */
        onAddMember() {
            const dlg = Vue.component('NewEntityMemberDialog', NewMemberDialog);
            DesignStore.ide.showDialog(dlg)
        },
        onRemoveMember() {
            var modelId = this.target.ID
            var memberName = this.currentMember.Name
            // if (memberName === 'ID' && designer.storeType === 'Sql') {
            //     Message.warning('此成员不允许删除')
            //     return false
            // }
            let _this = this
            this.$msgbox.confirm('Are you sure to delete member: ' + memberName, 'Confirm', {
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                type: 'warning'
            }).then(() => {
                // 获取实体属性
                $runtime.channel.invoke('sys.DesignService.DeleteEntityMember', [modelId, memberName]).then(res => {
                    // 判断结果是否是引用列表
                    if (res && res.length) {
                        DesignStore.usages.update(res)
                        _this.$message.error('Member has references, can not delete')
                    } else {
                        // 移除选中成员
                        _this.removeCurrentMember()
                        _this.$message.success('Delete member succeed')
                    }
                }).catch(err => {
                    _this.$message.error(err)
                })
            }).catch(() => {}) // 此处为点击了取消按钮
        },
        entityMemberTypeFormat(row, column) {
            var found = this.memberTypes.find(t => t.value === row.Type)
            var res = found ? found.text : 'Unknown'
            if (row.DataType) {
                res += ' - ' + DataFieldTypes.find(t => t.value === row.DataType).text
            }
            return res
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
            const index = this.members.indexOf(this.currentMember);
            this.members.splice(index, 1)
        },
        /** 重命名实体成员 */
        onRenameMember() {
            const memberName = this.currentMember.Name;
            const dlg = Vue.component('RenameDialog', RenameDialog);
            DesignStore.ide.showDialog(dlg, {
                target: this.target.Text + '.' + memberName,
                targetModel: this.target,
                targetType: ModelReferenceType.EntityMemberName,
                oldName: memberName,
                renameModel: false
            })
        },
        /** 查找实体成员的引用 */
        onFindUsages() {
            const modelId = this.target.ID;
            const memberName = this.currentMember.Name;

            let _this = this
            let args = [ModelReferenceType.EntityMemberName, modelId, memberName]
            $runtime.channel.invoke('sys.DesignService.FindUsages', args).then(res => {
                DesignStore.usages.update(res)
            }).catch(err => {
                _this.$message.error(err)
            })
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
            $runtime.channel.invoke('sys.DesignService.SaveModel', [this.target.Type, this.target.ID]).then(res => {
                _that.$message.success('保存成功')
                modelLibs.update(ModelType.Entity, this.target.ID)
            }).catch(err => {
                _that.$message.error('保存失败: ' + err)
            })
        },
        refresh() {
            var _this = this
            $runtime.channel.invoke('sys.DesignService.GetEntityModel', [this.target.ID]).then(res => {
                _this.isNew = res.IsNew
                _this.members = res.Members
                //根据不同存储选项加入不同视图
                if (res.StoreOptions && _this.views.length === 1 /* 防止刷新时重复加载 */) {
                    if (res.StoreOptions.StoreKind === DataStoreKind.Sql) {
                        _this.views.push({label: 'sqlopts', title: 'Options'})
                    } else if (res.StoreOptions.StoreKind === DataStoreKind.Cql) {
                        _this.views.push({label: 'cqlopts', title: 'Options'})
                    } else {
                        _this.views.push({label: 'sysopts', title: 'Options'})
                    }
                    _this.views.push({label: 'data', title: 'Data'})
                }
                _this.options = res.StoreOptions
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
