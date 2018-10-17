<template>
    <e-dialog title="添加资源" size="small" :visible.sync="visible" :close-on-click-modal="true" @close="onClose">
        <e-form :model="form" label-width="100px" label-position="right">
            <e-form-item label="资源名称" porp="name">
                <e-input v-model="form.name"></e-input>
            </e-form-item>
            <e-form-item label="资源类型" porp="type">
                <e-select v-model="form.type" placeholder="请资源类型">
                    <e-option label="图片" value="1"></e-option>
                </e-select>
            </e-form-item>
            <e-form-item>
                <e-upload class="upload-demo" :data="form" ref="upload" :multiple="false" :on-success="handleSuccess" :on-error="handleError" :on-change="handleChange" :action="action" :on-remove="handleRemove" :auto-upload="false" list-type="picture">
                    <e-button slot="trigger" size="small" type="primary">选取文件</e-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </e-upload>
            </e-form-item>
        </e-form>
        <div slot="footer">
            <e-button type="primary" @click="submitUpload">保存</e-button>
        </div>
    </e-dialog>
</template>

<script>
import store from '../../DesignStore'
export default {
    data() {
        return {
            visible: true,
            form: {
                appID: store.tree.currentNode.AppID,
                name: '',
                type: ''
            },
            fileList: []
        }
    },
    props: {
    },
    computed: {
        action() {
            var scheme = document.location.protocol
            var port = document.location.port ? (':' + document.location.port) : ''
            var connectionUrl = scheme + '//' + document.location.hostname + port + '/api/Resource/Upload'
            return connectionUrl
        }
    },
    methods: {
        onClose: function (e) {
            this.$emit('close')
        },
        submitUpload() {
            this.$refs.upload.submit()
        },
        handleRemove(file, fileList) {
        },
        handleSuccess(response, file, fileList) {
            this.$message.success('上传成功')
            store.emitEvent('resourceUploadSuccess', response)
            this.visible = false
        },
        handleError(e, file, fileList) {
            this.$message.error(e.message)
        },
        // handlePreview(file) {
        // },
        handleChange(file, fileList) {
            if (fileList.length > 1) {
                fileList.splice(0, 1)
            }
        }
    },
    components: {
    },
    mounted() {
    }
}
</script>

<style scoped>

</style>

