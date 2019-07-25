<template>
    <el-dialog title="表达式编辑器" :visible.sync="visible" :close-on-click-modal="false" @close="onClose">
        <expression-editor ref="editor" :ownerType="ownerType" :ownerID="ownerID" :propertyName="propertyName"></expression-editor>
        <div slot="footer" class="dialog-footer">
            <el-button :disabled="caDisabled" @click="visible = false">取 消</el-button>
            <el-button :disabled="okDisabled" type="primary" @click="onOkClick">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import ExpressionEditor from './ExpressionEditor'

    export default {
        components: { ExpressionEditor: ExpressionEditor },
        props: {
            ownerType: { type: String, default: '' },
            ownerID: { type: String, default: '' },
            propertyName: { type: String, default: '' }
        },
        data() {
            return {
                visible: true,
                okDisabled: false, // ok按钮是否禁用
                caDisabled: false, // cancel按钮是否禁用
                isCancel: true
            }
        },
        methods: {
            onClose() {
                this.$refs.editor.close(this.isCancel)
                this.$emit('close')
            },
            onOkClick() {
                this.isCancel = false
                this.visible = false
            }
        }
    }

</script>