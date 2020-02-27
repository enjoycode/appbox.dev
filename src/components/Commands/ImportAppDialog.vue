<template>
    <el-dialog title="Import Application" :visible.sync="visible" :close-on-click-modal="false" @close="onClose" width="400px">
        <el-upload class="upload-demo" drag action="api/design/import">
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
        onClose: function (e) {
            this.$emit('close')
        }
    }
}
</script>