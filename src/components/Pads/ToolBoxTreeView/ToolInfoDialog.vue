<template>
    <el-dialog title="Api" size="large" top="10%" :visible.sync="visible" :close-on-click-modal="true" @close="onClose">
        <div class="dialogDiv">
            <DialogInfo v-for="item in apiModel" :key="item.Label" :info="item"></DialogInfo>
        </div>
    </el-dialog>
</template>

<script>
import store from '@/design/DesignStore'
import DialogInfo from './DialogInfo'

export default {
    data() {
        return {
            visible: true,
            apiModel: ''
        }
    },
    props: {
    },
    methods: {
        onClose: function (e) {
            this.$emit('close')
        }
    },
    components: {
        DialogInfo
    },
    mounted() {
        this.apiModel = store.toolBoxTree.assignDialogData()
        console.log(this.apiModel[0])
    }
}
</script>

<style scoped>
.dialogDiv{
    max-height: 680px;
    overflow-y: auto;
}
</style>

