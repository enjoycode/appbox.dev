<template>
    <div class="view">
        <!-- Partions -->
        <h3>Partions:</h3>
        <e-form label-width="200px" size="small">
            <e-form-item label="Partition Keys:">
                <e-select v-model="options.PartitionKeys" multiple @change="onPartitionKeysChanged">
                    <e-option v-for="item in members" :key="item.Name" :label="item.Name" :value="item.Name"
                        :disabled="disabledMember(options, item.Name)"></e-option>
                </e-select>
            </e-form-item>
            <e-form-item label="Partition Orders:">
                <span v-for="item in options.PartitionKeys" :key="item.Name" >{{ item.Name }}:
                    <e-switch v-model="item.OrderDESC" @change="onPartitionKeysChanged" active-text="DESC" inactive-text="ASC"></e-switch>
                    &nbsp;
                </span>
            </e-form-item>
        </e-form>

        <!-- Indexes -->
        <h3>Indexs:</h3>
        <e-table :data="options.Indexes" @current-change="onCurrentChanged"
            highlight-current-row border empty-text=" ">
            <e-table-column prop="Comment" label="Comment" width="300" align="center"></e-table-column>
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
                s += this.members.find(t => t.UID === element.MemberUID).Name + ' '
                s += element.OrderByDesc ? 'DESC' : 'ASC'
            }
            return s
        },
        onCurrentChanged(newRow, oldRow) {
            this.currentIndex = newRow
        },
        /** 用于判断该成员是否可选 */
        disabledMember(target, memberName) {
            // TODO:排除EntityRef等类型
            if (target.PartitionKeys.find(t => t === memberName)) {
                return true
            }
            return false
        },
        onPartitionKeysChanged(e) {
            let args = [this.target.ID, 'PartitionKeys', this.options.PartitionKeys]
            let _this = this
            this.$channel.invoke('sys.DesignService.ChangeTableOptions', args).then(res => {
                this.onPrimaryKeyChanged()
            }).catch(err => {
                _this.$message.error('改变PartitionKeys失败: ' + err)
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

/* .indexs {
    height: 100%;
} */
</style>
