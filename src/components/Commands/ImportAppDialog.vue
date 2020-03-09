<template>
    <el-dialog title="Import Application" :visible.sync="visible" :close-on-click-modal="false" @close="onClose" width="400px">
        <el-upload drag action="/api/design/import" on-success="onDone" :multiple="false">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">Drag package file here ，or <em>click to upload</em></div>
        </el-upload>
    </el-dialog>
</template>

<script>
import store from '@/design/DesignStore'

export default {
    data() {
        return { visible: true }
    },
    methods: {
        onDone: function (response, file, fileList) {
            store.tree.loadTree() //成功导入刷新设计树
        },
        onClose: function (e) {
            this.$emit('close')
        }
    }
}
</script>