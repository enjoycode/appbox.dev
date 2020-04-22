<template>
    <div>
        <el-button @click="dlgVisible = true" style="width:100%">...</el-button>
        <el-dialog title="Border Style" :visible.sync="dlgVisible" width="400px">
            <div class="rows">
                <el-row v-for="(item, index) in borders" :gutter="8" :key="item.pos">
                    <el-col :span="4" style="text-align:right">{{ item.pos }}:</el-col>
                    <el-col :span="8">
                        <el-select v-model="item.style" @change="changeStyle(index)">
                            <el-option v-for="item in borderStyles" :key="item" :value="item"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="10">
                        <el-input-number v-model="item.width" :min="0.25" :max="20"></el-input-number>
                    </el-col>
                    <el-col :span="2">
                        <el-color-picker v-model="item.color"></el-color-picker>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dlgVisible = false">Done</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: { target: { type: Object } },
    data() {
        return {
            value: null, // ReportStyle
            dlgVisible: false,
            borderStyles: ["None", "Dotted", "Dashed", "Solid"],
            borders: []
        }
    },
    watch: {
        target(newTarget) {
            this.refresh()
        }
    },
    methods: {
        refresh() {
            this.value = this.target.getter()
            this.$set(this, 'borders', this.value.BorderStyles);
        },
        changeStyle(pos) {
            this.value.SetBorderStyle(this.borders[pos].pos, this.borders[pos].style)
        }
    },
    mounted() {
        this.refresh()
    }
}
</script>

<style scoped>
.rows {
    border: none;
}
.rows >>> .el-col {
    border: none;
}
</style>