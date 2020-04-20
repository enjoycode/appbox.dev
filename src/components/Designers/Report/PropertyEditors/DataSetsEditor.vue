<template>
    <div>
        <el-button @click="dlgVisible = true" style="width:100%">...</el-button>
        <el-dialog title="Report DataSets" :visible.sync="dlgVisible" width="600px">
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dlgVisible = false">Done</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        target: { type: Object } 
    },
    data() {
        return {
            value: null, // ReportRootDesigner
            dlgVisible: false,
        }
    },
    watch: {
        target(newTarget) {
            this.value = newTarget.getter()
        }
    },
    methods: {
        
    },
    mounted() {
        this.value = this.target.getter()
    }
}
</script>