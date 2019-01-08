<template>
    <div class="view">
        <!-- Partions -->
        <h3>Partions:</h3>
        <e-form label-width="200px" size="small">
            <e-form-item label="Partition Keys:">
                <e-select v-model="options.PartitionKeys" value-key="Name" multiple @change="onPartitionKeysChanged">
                    <e-option v-for="item in allPartitionKeys" :key="item.Name" :label="item.Name" 
                        :value="{MemberId: item.MemberId, Name: item.Name, OrderByDesc: item.OrderByDesc}"
                        :disabled="disabledMember(options, item.Name)"></e-option>
                </e-select>
            </e-form-item>
            <e-form-item label="Partition Orders:">
                <span v-for="item in options.PartitionKeys" :key="item.Name" >{{ item.Name }}:
                    <e-switch v-model="item.OrderByDesc" @change="onPartitionKeysChanged" active-text="DESC" inactive-text="ASC"></e-switch>
                    &nbsp;
                </span>
            </e-form-item>
        </e-form>

        <!-- Indexes -->
        <h3>Indexs:</h3>
        <e-table :data="options.Indexes" @current-change="onCurrentChanged"
            highlight-current-row border empty-text=" ">
            <e-table-column prop="Name" label="Name" width="300" align="center"></e-table-column>
            <e-table-column prop="Fields" label="Fields" :formatter="indexFieldsFormat"></e-table-column>
            <e-table-column prop="Unique" label="Unique" width="180" align="center">
                <template slot-scope="scope">
                    <e-checkbox v-model="scope.row.Unique" disabled></e-checkbox>
                </template>
            </e-table-column>
        </e-table>
    </div>
</template>

<script>
export default {
    props: {
        target: { type: Object, required: true },
        members: { type: Array, required: true },
        options: { type: Object, required: true }
    },
    computed: {
        // 获取所有分区键，包括特殊分区键
        allPartitionKeys() {
            // TODO:排除EntityRef等类型
            var pks = []
            for (let i = 0; i < this.members.length; i++) {
                pks.push({ MemberId: this.members[i].ID, Name: this.members[i].Name, OrderByDesc: false })
            }
            return pks
        }
    },
    data() {
        return {
            currentIndex: null
        }
    },
    methods: {
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
        onCurrentChanged(newRow, oldRow) {
            this.currentIndex = newRow
        },
        /** 用于判断该成员是否可选 */
        disabledMember(target, memberName) {
            if (target.PartitionKeys.find(t => t.Name === memberName)) {
                return true
            }
            return false
        },
        onPartitionKeysChanged(e) {
            var oldPartitionKeys = this.options.PartitionKeys.slice()
            let args = [this.target.ID, 'PartitionKeys', JSON.stringify(this.options.PartitionKeys)]
            let _this = this
            this.$channel.invoke('sys.DesignService.ChangeTableOptions', args).then(res => {
                // 主键改变后同步刷新前端所有成员的AllowNull属性，后端已处理
                _this.members.forEach(m => {
                    if (_this.options.PartitionKeys.find(t => t.Name === m.Name)) {
                        m.AllowNull = false
                    }
                })
            }).catch(err => {
                _this.options.PartitionKeys = oldPartitionKeys
                _this.$message.error('Change PartitionKeys error: ' + err)
            })
        }
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
