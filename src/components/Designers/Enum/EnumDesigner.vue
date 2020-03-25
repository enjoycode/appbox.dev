<template>
    <div style="height:100%">
        <!-- 头部区域 -->
        <div class="header">
            <el-button-group>
                <el-button @click="onAddMember" size="small" icon="el-icon-circle-plus">Add</el-button>
                <el-button @click="onRemoveMember" :disabled="currentMember==null" size="small" icon="el-icon-remove">Remove</el-button>
                <el-button :disabled="currentMember==null" size="small" icon="fas fa-edit"> Rename</el-button>
                <el-button :disabled="currentMember==null" size="small" icon="fas fa-link"> Usages</el-button>
            </el-button-group>
        </div>
        <!-- 内容区域 -->
        <div class="content">
            <ex-splitter :minSize="300" handlerColor="#f1f1f1" :size="300">
                <div slot="panel1" style="height:100%">
                    <el-table ref="memberTable" :data="tableData" height="100%" 
                        @current-change="currentRowChange" :stripe="true" highlight-current-row border>
                        <el-table-column prop="Name" label="Name" width="180" align="center">
                        </el-table-column>
                        <el-table-column prop="Value" label="Value" width="180" align="center">
                        </el-table-column>
                        <el-table-column prop="Comment" label="Comment" align="center">
                        </el-table-column>
                    </el-table>
                </div>
                <div slot="panel2" class="ide-property-panel">
                    <el-collapse class="ide-property-collapse" :value="collapseValue">
                        <el-collapse-item title="Enum Properties" name="1">
                            <el-form label-position="right" size="mini" label-width="120px">
                                <el-form-item label="ID">
                                    <el-input v-model="target.ID" :disabled="true"></el-input>
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
                            </el-form>
                        </el-collapse-item>
                        <el-collapse-item title="Item Properties" v-if="currentMember" name="2">
                            <el-form label-position="right" size="mini" label-width="120px">
                                <el-form-item label="Name">
                                    <el-input v-model="currentMember.Name" :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="Value">
                                    <el-input-number :min="0" @change="onItemValueChange" v-model="currentMember.Value"></el-input-number>
                                </el-form-item>
                                <el-form-item label="Comment">
                                    <el-input @change="onItemCommentChange" v-model="currentMember.Comment"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-collapse-item>
                    </el-collapse>
                </div>
            </ex-splitter>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import DesignStore from '@/design/DesignStore'
import NewEnumItemDialog from './NewEnumItemDialog'

export default {
    data() {
        return {
            designerType: 'EnumDesigner', // 用于外部判断当前设计视图的类型，此属性一直保持不变
            isMouseDown: false,
            tableData: [],
            currentMember: null,
            collapseValue: ['1']
        }
    },
    props: {
        // 实体模型节点
        target: { type: Object, required: true }
    },
    methods: {
        onAddMember() {
            var dlg = Vue.component('NewEnumItemDialog', NewEnumItemDialog)
            DesignStore.ide.showDialog(dlg)
        },
        onRemoveMember() {
            var modelId = this.target.ID
            var memberName = this.currentMember.Name
            let _this = this
            this.$msgbox.confirm('Are you sure to delete member:' + memberName, 'Confirm', {
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                type: 'warning'
            }).then(() => {
                // 获取实体属性
                $runtime.channel.invoke('sys.DesignService.DeleteEnumItem', [modelId, memberName]).then(res => {
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
            }).catch(() => { }) // 此处为点击了取消按钮
        },

        currentRowChange(currentRow, oldCurrentRow) {
            this.currentMember = currentRow
            this.collapseValue = ['1', '2'] // 展开属性面板
            if (!currentRow) {
                this.collapseValue = ['1']
                return true
            }
        },
        addMember(memberData) {
            this.tableData.push(memberData)
            this.selectMember(this.tableData[this.tableData.length - 1])
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
            var index = this.tableData.indexOf(this.currentMember)
            this.tableData.splice(index, 1)
        },
        // 枚举项的值发生改变时
        onItemValueChange(val) {
            this.propertyChanged('Value', val)
        },
        // 枚举项的Comment发生改变时
        onItemCommentChange(val) {
            this.propertyChanged('LocalizedName', val)
        },
        propertyChanged(name, value) {
            var _that = this
            // 传入服务更改
            $runtime.channel.invoke('sys.DesignService.ChangeEnumMember', [this.target.ID, this.currentMember.Name, name, value]).then(res => {
                this.$emit('PropertyChanged', name, value)
            }).catch(err => {
                _that.$message.error(err)
            })
        },
        save() {
            let node = this.target
            var _that = this
            $runtime.channel.invoke('sys.DesignService.SaveModel', [node.Type, node.ID]).then(res => {
                _that.$message.success('Save succeed')
            }).catch(err => {
                _that.$message.error('Save error: ' + err)
            })
        }
    },

    mounted() {
        var _that = this
        // 获取实体属性
        $runtime.channel.invoke('sys.DesignService.GetEnumItems', [this.target.ID]).then(res => {
            _that.tableData = res
        }).catch(err => {
            alert(err)
        })
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

.el-input-number {
    width: 100%;
    overflow: initial;
}
</style>