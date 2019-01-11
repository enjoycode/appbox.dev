<template>
    <e-table :data="rows" highlight-current-row border height="100%" empty-text=" ">
        <e-table-column v-for="item in columns" :prop="item" :label="item" :key="item" :formatter="formatCell">
        </e-table-column>
    </e-table>
</template>

<script>
export default {
    props: {
        target: { type: Object, required: true },
        members: { type: Array, required: true }
    },
    data() {
        return {
            rows: [],
            columns: []
        }
    },
    methods: {
        loadData() {
            var _this = this
            this.$channel.invoke('sys.DesignService.LoadEntityData', [this.target.ID]).then(res => {
                for (const prop in res[0]) {
                    if (res[0].hasOwnProperty(prop) && prop !== '$T') {
                        _this.columns.push(prop)
                    }
                }
                _this.rows = res
            }).catch(err => {
                _this.$message.error(err)
            })
        },
        formatCell(row, column, cellValue, index) {
            if (typeof cellValue === 'boolean') {
                return String(cellValue)
            }
            return cellValue
        }
    },
    mounted() {
        this.loadData()
    }
}
</script>
