<template>
    <ex-splitter :minSize="300" handlerColor="#f1f1f1" :size="300">
        <div slot="panel1" class="entityTable">
            <el-table ref="memberTable" :data="tableData" height="100%" @current-change="currentRowChange" :stripe="true" highlight-current-row border>
                <el-table-column prop="Name" label="Name" width="180" align="center">
                </el-table-column>
                <el-table-column prop="Value" label="Value" width="180" align="center">
                </el-table-column>
                <el-table-column width="180" prop="LocalizedName" label="LocalizeName" align="center">
                </el-table-column>
            </el-table>
        </div>
        <div slot="panel2" class="ide-property-panel">
            <el-collapse class="ide-property-collapse" :value="collapseValue">
                <el-collapse-item title="Enum Properties" name="1">
                    <el-form label-position="right" label-width="120px">
                        <el-form-item label="ID">
                            <el-input size="small" v-model="target.ID" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="AppID">
                            <el-input size="small" v-model="target.AppID" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="Model Name">
                            <el-input size="small" v-model="target.Text" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="SortNo">
                            <el-input size="small" v-model="target.SortNo" :disabled="true"></el-input>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item title="Enum Items 属性" v-if="currentMember" name="2">
                    <el-form label-position="right" label-width="120px">
                        <el-form-item label="Name">
                            <el-input size="small" v-model="currentMember.Name" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="Value">
                            <el-input-number size="small" :min="0" @change="onItemValueChange" v-model="currentMember.Value"></el-input-number>
                        </el-form-item>
                        <el-form-item label="LocalizedName">
                            <el-input size="small" @change="onItemLocalizedNameChange" v-model="currentMember.LocalizedName"></el-input>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
            </el-collapse>
        </div>
    </ex-splitter>
</template>

<script>
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
            // 枚举项的LocalizedName发生改变时
            onItemLocalizedNameChange(val) {
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
                    _that.$message.success('保存成功')
                }).catch(err => {
                    _that.$message.error('保存失败: ' + err)
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
    .el-input-number {
        width: 100%;
        overflow: initial;
    }
    .entityTable{
        height: 100%;
    }
</style>