<template>
    <div class="view">
        <el-table class="indexs" :data="options.Indexes" @current-change="onCurrentChanged" height="100%" highlight-current-row border
            empty-text=" ">
            <el-table-column prop="Comment" label="Comment" width="300" align="center">
            </el-table-column>
            <el-table-column prop="Fields" label="Fields" :formatter="indexFieldsFormat">
            </el-table-column>
            <el-table-column prop="Unique" label="Unique" width="180" align="center">
                <template slot-scope="scope">
                    <e-checkbox v-model="scope.row.Unique" disabled></e-checkbox>
                </template>
            </el-table-column>
        </el-table>
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
            }
        }
    }
</script>

<style scoped>
    .view {
        box-sizing: border-box;
        height: 100%;
        overflow: auto;
    }

    .indexs {
        height: 100%;
    }
</style>