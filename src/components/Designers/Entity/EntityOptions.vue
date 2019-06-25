<template>
    <div class="view">
        <!-- Partions -->
        <h3>Partitions:</h3>
        <e-button-group>
            <e-button @click="addPKDlgVisible=true" type="primary" icon="el-icon-circle-plus" size="small">Add</e-button>
            <e-button @click="removePartitionKey" type="primary" icon="el-icon-remove" size="small">Remove</e-button>
        </e-button-group>
        <e-table :data="options.PartitionKeys" @current-change="onCurrentPKChanged" highlight-current-row border empty-text=" ">
            <e-table-column prop="MemberId" label="Name" width="300" :formatter="pkNameFormat"></e-table-column>
            <e-table-column prop="Rule" label="Rule" :formatter="pkRuleFormat"></e-table-column>
            <e-table-column prop="OrderByDesc" label="OrderByDesc" width="180" align="center">
                <template slot-scope="scope">
                    <e-checkbox v-model="scope.row.OrderByDesc" disabled></e-checkbox>
                </template>
            </e-table-column>
        </e-table>

        <!-- Indexes -->
        <h3>Indexs:</h3>
        <e-button-group>
            <e-button type="primary" icon="el-icon-circle-plus" size="small">Add</e-button>
            <e-button type="primary" icon="el-icon-remove" size="small">Remove</e-button>
        </e-button-group>
        <e-table :data="options.Indexes" @current-change="onCurrentIndexChanged"
            highlight-current-row border empty-text=" ">
            <e-table-column prop="Name" label="Name" width="300"></e-table-column>
            <e-table-column prop="Fields" label="Fields" :formatter="indexFieldsFormat"></e-table-column>
            <e-table-column prop="Unique" label="Unique" width="180" align="center">
                <template slot-scope="scope">
                    <e-checkbox v-model="scope.row.Unique" disabled></e-checkbox>
                </template>
            </e-table-column>
        </e-table>

        <!-- 对话框 -->
        <e-dialog title="Add PartitionKey" :visible.sync="addPKDlgVisible">
            <e-form v-model="newPartitionKey" label-width="200px" size="small">
                <e-form-item label="Member:">
                    <e-select v-model="newPartitionKey.MemberId">
                        <e-option v-for="item in allPartitionKeys" :key="item.MemberId" :value="item.MemberId" :label="item.Name"
                            :disabled="disabledMember(options, item.Name)"></e-option>
                    </e-select>
                </e-form-item>
                <e-form-item label="Rule:">
                    <e-select v-model="newPartitionKey.Rule" @change="onRuleChanged">
                        <e-option v-for="item in allPKRules" :key="item.Id" :value="item.Id" :label="item.Name"
                            :disabled="disableRule(item)"></e-option>
                    </e-select>
                </e-form-item>
                <e-form-item v-if="newPartitionKey.Rule===1" label="Hash Num:">
                    <e-select v-model="newPartitionKey.RuleArg" key="s-hashnums">
                        <e-option v-for="item in hashNums" :key="item" :value="item"></e-option>
                    </e-select>
                </e-form-item>
                <e-form-item v-if="newPartitionKey.Rule===2" label="Range:">
                    <e-select v-model="newPartitionKey.RuleArg" key="s-periods">
                        <e-option v-for="item in allDatePeriods" :key="item.Id" :value="item.Id" :label="item.Name"></e-option>
                    </e-select>
                </e-form-item>
                <e-form-item label="OrderByDesc:">
                    <e-switch v-model="newPartitionKey.OrderByDesc" active-text="DESC" inactive-text="ASC"></e-switch>
                </e-form-item>
            </e-form>
            <span slot="footer" class="dialog-footer">
                <e-button @click="addPKDlgVisible = false">Cancel</e-button>
                <e-button type="primary" @click="addPartitionKey">OK</e-button>
            </span>
        </e-dialog>
    </div>
</template>

<script>
import PartitionKeyRule from '@/design/PartitionKeyRule'
import { Pagination } from 'element-ui';

export default {
    props: {
        target: { type: Object, required: true },
        members: { type: Array, required: true },
        options: { type: Object, required: true }
    },
    computed: {
        // 获取所有分区键，包括特殊分区键
        allPartitionKeys() {
            var pks = []
            // 添加默认的CreateTime
            pks.push({ MemberId: 0, Name: "CreateTime", OrderByDesc: false })
            // 添加其他成员
            for (let i = 0; i < this.members.length; i++) {
                if (this.members[i].Type === 0) { //暂只包含DataField
                    pks.push({ MemberId: this.members[i].ID, Name: this.members[i].Name, OrderByDesc: false })
                }
            }
            return pks
        },
        allPKRules() {
            var rules = []
            rules.push({ Id: PartitionKeyRule.None, Name: "None" })
            rules.push({ Id: PartitionKeyRule.Hash, Name: "Hash" })
            rules.push({ Id: PartitionKeyRule.RangeOfDate, Name: "RangeOfDate" })
            return rules
        },
        allDatePeriods() {
            var periods = []
            periods.push({ Id: 0, Name: "Year" })
            periods.push({ Id: 1, Name: "Month" })
            periods.push({ Id: 2, Name: "Day" })
            return periods
        }
    },
    data() {
        return {
            addPKDlgVisible: false, //添加分区键对话框是否显示
            newPartitionKey: { MemberId: 0, Rule: PartitionKeyRule.None, RuleArg: 0, OrderByDesc: false }, //新的分区键
            currentPartitionKey: null, //当前选择的分区键
            currentIndex: null,  //当前选择的索引
            oldPartitionKeys: [], //暂存旧的分区键，用于更改失败后恢复
            hashNums: [2, 4, 8, 16, 32, 64, 128]
        }
    },
    methods: {
        pkNameFormat(row, column, cellValue) {
            return cellValue === 0 ? 'CreateTime' : this.members.find(t => t.ID === cellValue).Name
        },
        pkRuleFormat(row, column, cellValue) {
            if (cellValue === PartitionKeyRule.None) {
                return "None"
            } else if (cellValue === PartitionKeyRule.Hash) {
                return "Hash(" + row.RuleArg + ")"
            } else {
                switch (row.RuleArg) {
                    case 0: return "Year()"
                    case 1: return "Month()"
                    default: return "Day()"
                }
            }
        },
        indexFieldsFormat(row, column, cellValue) {
            var s = ''
            for (let i = 0; i < cellValue.length; i++) {
                const element = cellValue[i]
                if (i !== 0) {
                    s += '; '
                }
                s += this.members.find(t => t.ID === element.MID).Name + ' '
                s += element.OrderByDesc ? 'DESC' : 'ASC'
            }
            return s
        },
        /** 分区规则变更 */
        onRuleChanged() {
            this.newPartitionKey.RuleArg = this.newPartitionKey.Rule === PartitionKeyRule.Hash ? 4 : 0
        },
        onCurrentPKChanged(newRow, oldRow) {
            this.currentPartitionKey = newRow
        },
        /** 当前选择的索引变更 */
        onCurrentIndexChanged(newRow, oldRow) {
            this.currentIndex = newRow
        },
        /** 用于判断该成员是否可选作为分区键 */
        disabledMember(target, memberName) {
            if (target.PartitionKeys.find(t => t.Name === memberName)) {
                return true
            }
            return false
        },
        /** 用于禁用非日期成员的RangeOfDate分区规则 */
        disableRule(rule) {
            if (rule.Id == PartitionKeyRule.RangeOfDate) {
                if (this.newPartitionKey.MemberId === 0) {
                    return false
                }
                var m = this.members.find(t => t.ID === this.newPartitionKey.MemberId)
                return !(m.Type === 0 && m.DataType === 2)
            }
            return false
        },
        addPartitionKey() {
            this.addPKDlgVisible = false
            this.options.PartitionKeys.push(Object.assign({}, this.newPartitionKey))
            this.onPartitionKeysChanged()
        },
        removePartitionKey() {
            if (!this.currentPartitionKey) {
                this.$message('Please select partition key first!')
            } else {
                let index = this.options.PartitionKeys.findIndex(t => t.MemberId === this.currentPartitionKey.MemberId)
                this.options.PartitionKeys.splice(index, 1)
                this.onPartitionKeysChanged()
            }
        },
        onPartitionKeysChanged(e) {
            let args = [this.target.ID, 'PartitionKeys', JSON.stringify(this.options.PartitionKeys)]
            let _this = this
            $runtime.channel.invoke('sys.DesignService.ChangeEntity', args).then(res => {
                _this.oldPartitionKeys = _this.options.PartitionKeys.slice()
                // 主键改变后同步刷新前端所有成员的AllowNull属性，后端已处理
                _this.members.forEach(m => {
                    if (_this.options.PartitionKeys.find(t => t.MemberId === m.MemberId)) {
                        m.AllowNull = false
                    }
                })
            }).catch(err => {
                _this.options.PartitionKeys = _this.oldPartitionKeys
                _this.$message.error('Change PartitionKeys error: ' + err)
            })
        }
    },
    mounted() {
        this.oldPartitionKeys = this.options.PartitionKeys.slice()
    }
}
</script>

<style scoped>
.view {
    box-sizing: border-box;
    padding: 10px;
    height: 100%;
    overflow: auto;
}

.view >>> .el-select {
    width: 95%;
}
</style>
