<template>
    <div class="view">
        <!-- PrimaryKeys -->
        <h3>PrimaryKeys:</h3>
        <el-button-group>
            <el-button @click="addPKDlgVisible=true" type="primary" icon="el-icon-circle-plus" size="small">Add</el-button>
            <el-button @click="removePrimaryKey" type="primary" icon="el-icon-remove" size="small">Remove</el-button>
        </el-button-group>
        <el-table :data="options.PrimaryKeys" @current-change="onCurrentPKChanged" highlight-current-row border empty-text=" ">
            <el-table-column prop="MemberId" label="Name" :formatter="pkNameFormat"></el-table-column>
            <el-table-column prop="OrderByDesc" label="OrderByDesc" align="center">
                <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.OrderByDesc" disabled></el-checkbox>
                </template>
            </el-table-column>
        </el-table>

        <!-- Indexes -->
        <h3>Indexs:</h3>
        <el-button-group>
            <el-button @click="addIndexDlgVisible=true" type="primary" icon="el-icon-circle-plus" size="small">Add</el-button>
            <el-button @click="removeIndex" type="primary" icon="el-icon-remove" size="small">Remove</el-button>
        </el-button-group>
        <el-table :data="options.Indexes" @current-change="onCurrentIndexChanged" highlight-current-row border
            empty-text=" ">
            <el-table-column prop="Name" label="Name" width="300" align="center">
            </el-table-column>
            <el-table-column prop="Fields" label="Fields" :formatter="indexFieldsFormat">
            </el-table-column>
            <el-table-column prop="Unique" label="Unique" width="180" align="center">
                <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.Unique" disabled></el-checkbox>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加主键字段对话框 -->
        <el-dialog title="Add PrimaryKeys" :visible.sync="addPKDlgVisible">
            <el-form v-model="newPrimaryKey" label-width="100px" size="small">
                <el-form-item label="Member:">
                    <el-select v-model="newPrimaryKey.ID">
                        <el-option v-for="item in members" :key="item.ID" :value="item.ID" :label="item.Name"
                            :disabled="disabledMember(item.ID)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="OrderByDesc:">
                    <el-switch v-model="newPrimaryKey.OrderByDesc" active-text="DESC" inactive-text="ASC"></el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addPKDlgVisible = false">Cancel</el-button>
                <el-button type="primary" @click="addPrimaryKey">OK</el-button>
            </span>
        </el-dialog>
        <!-- 添加索引对话框 -->
        <el-dialog title="Add Index" :visible.sync="addIndexDlgVisible" width="500px">
            <el-form :model="newIndex" label-width="100px" size="small">
                <el-form-item prop="Name" label="Name:">
                    <el-input v-model="newIndex.Name"></el-input>
                </el-form-item>
                <el-form-item label="Fields:">
                    <el-select v-model="newIndex.Fields" value-key="MID" multiple style="width:100%">
                        <el-option v-for="item in members" :key="item.ID" :label="item.Name" :value="{Name: item.Name, MID: item.ID, OrderByDesc: false}">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Orders:">
                    <span v-for="item in newIndex.Fields" :key="item.MID">{{ item.Name }}:
                        <el-switch v-model="item.OrderByDesc" active-text="DESC" inactive-text="ASC"></el-switch>
                        <br/>
                    </span>
                </el-form-item>
                <el-form-item label="">
                    <el-checkbox v-model="newIndex.Unique">Unique</el-checkbox>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addIndexDlgVisible = false">Cancel</el-button>
                <el-button type="primary" @click="addIndex">OK</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        target: { type: Object, required: true },
        members: { type: Array, required: true },
        options: { type: Object, required: true }
    },
    data() {
        return {
            addPKDlgVisible: false,     //添加主键对话框是否显示
            addIndexDlgVisible: false,  //添加索引对话框是否显示
            currentPrimaryKey: null,    //当前选择的主键
            currentIndex: null,         //当前选择的索引
            newPrimaryKey: { ID: 0, OrderByDesc: false }, //暂存新的主键字段
            newIndex: { Name: '', Unique: false, Fields: [] }, //暂存新的索引
            oldPrimaryKeys: [],         //暂存旧的主键，用于更改失败后恢复
        }
    },
    methods: {
        pkNameFormat(row, column, cellValue) {
            return this.members.find(t => t.ID === cellValue).Name
        },
        indexFieldsFormat(row, column, cellValue) {
            var s = ''
            for (let i = 0; i < cellValue.length; i++) {
                const element = cellValue[i]
                if (i !== 0) {
                    s += '; '
                }
                s += this.members.find(t => t.UID === element.MemberUID).Name + ' '
                s += element.OrderByDesc ? 'DESC' : 'ASC'
            }
            return s
        },
        /** 用于判断该成员是否可选作为主键字段 */
        disabledMember(memberId) {
            if (this.options.PrimaryKeys.find(t => t.MemberId === memberId)) {
                return true
            }
            return false
        },
        onCurrentPKChanged(newRow, oldRow) {
            this.currentPrimaryKey = newRow
        },
        onCurrentIndexChanged(newRow, oldRow) {
            this.currentIndex = newRow
        },
        addPrimaryKey() {
            this.addPKDlgVisible = false
            this.options.PrimaryKeys.push({ MemberId: this.newPrimaryKey.ID, OrderByDesc: this.newPrimaryKey.OrderByDesc })
            this.onPrimaryKeysChanged()
        },
        removePrimaryKey() {
            if (!this.currentPrimaryKey) {
                this.$message('Please select primary key first!')
            } else {
                let index = this.options.PrimaryKeys.findIndex(t => t.MemberId === this.currentPrimaryKey.MemberId)
                this.options.PrimaryKeys.splice(index, 1)
                this.onPrimaryKeysChanged()
            }
        },
        onPrimaryKeysChanged(e) {
            let args = [this.target.ID, 'PrimaryKeys', JSON.stringify(this.options.PrimaryKeys)]
            let _this = this
            $runtime.channel.invoke('sys.DesignService.ChangeEntity', args).then(res => {
                _this.oldPrimaryKeys = _this.options.PrimaryKeys.slice()
                // 主键改变后同步刷新前端所有成员的AllowNull属性，后端已处理
                _this.members.forEach(m => {
                    if (_this.options.PrimaryKeys.find(t => t.MemberId === m.ID)) {
                        m.AllowNull = false
                    }
                })
            }).catch(err => {
                _this.options.PrimaryKeys = _this.oldPrimaryKeys
                _this.$message.error('Change PrimaryKeys error: ' + err)
            })
        },
        addIndex() {
            this.addIndexDlgVisible = false

            //TODO: check name exists
            if (!this.newIndex.Name) {
                this.$message.error('Index has no name')
                return
            }
            if (this.newIndex.Fields.length === 0) {
                this.$message.error('Index has no fields')
                return
            }

            let args = [this.target.ID, 'AddIndex', JSON.stringify(this.newIndex)]
            let _this = this
            $runtime.channel.invoke('sys.DesignService.ChangeEntity', args).then(res => {
                _this.options.Indexes.push(res)
            }).catch(err => {
                _this.$message.error('Add index error: ' + err)
            })
        },
        removeIndex() {
            if (!this.currentIndex) {
                this.$message('Please select index first!')
                return;
            }
            let that = this
            this.$msgbox.confirm('Are you sure to drop selected index？', 'Confirm', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                let args = [that.target.ID, 'RemoveIndex', that.currentIndex.ID]
                let _this = that
                $runtime.channel.invoke('sys.DesignService.ChangeEntity', args).then(res => {
                    let index = _this.options.Indexes.findIndex(t => t.ID === _this.currentIndex.ID)
                    _this.options.Indexes.splice(index, 1)
                }).catch(err => {
                    _this.$message.error('Drop index error:' + err)
                })
            }).catch(() => {/*此处点击了取消按钮*/ })
        }
    },
    mounted() {
        this.oldPrimaryKeys = this.options.PrimaryKeys.slice()
        if (this.members.length > 0) {
            this.newPrimaryKey.ID = this.members[0].ID
        }
    }
}
</script>

<style scoped>
.view {
    box-sizing: border-box;
    height: 100%;
    padding: 10px;
    overflow: auto;
}
</style>