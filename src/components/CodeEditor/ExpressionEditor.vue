<template>
    <code-editor :height="height" ref="editor" language="csharp" :fileName="fileName" @mounted="onEditorMounted"></code-editor>
</template>

<script>
    import CodeEditor from './CodeEditor'

    export default {
        components: { CodeEditor: CodeEditor },
        props: {
            ownerType: { type: String, default: '' },
            ownerID: { type: String, default: '' },
            propertyName: { type: String, default: '' }
        },
        data() {
            return {
                height: 500
            }
        },
        computed: {
            fileName() { // 注意：编辑器文件名必须与后端一致
                return this.ownerType + '_' + this.ownerID + '_' + this.propertyName + '.cs'
            }
        },
        methods: {
            // 代码编辑器初始化后开始加载表达式代码
            onEditorMounted() {
                var _this = this
                this.$channel.invoke('sys.DesignHub.OpenExpression', [this.ownerType, this.ownerID, this.propertyName]).then(res => {
                    _this.onCodeLoaded(res)
                }).catch(err => {
                    _this.$message.error('加载表达式错误: ' + err)
                })
            },
            onCodeLoaded(res) {
                this.$refs.editor.initValue(res.Source)
                this.$refs.editor.$on('codeChanged', this.onCodeChanged)
                // focus code editor
                this.$refs.editor.focus()
            },
            onCodeChanged(event) {
                let _this = this
                // todo:***** 临时修复monaco升级至0.9.0的问题，原本event.range，现在event.changes[].range
                for (var i = 0; i < event.changes.length; i++) {
                    var change = event.changes[i]
                    this.$channel.invoke('sys.DesignHub.ChangeBuffer', [2, this.fileName,
                        change.range.startLineNumber, change.range.startColumn,
                        change.range.endLineNumber, change.range.endColumn, change.text]).catch(err => {
                            _this.$message.warning('提交代码变更错误: ' + err)
                        })
                }
                // this.debouncedCheckCode()
            },
            close(isCancel) {
                var _this = this
                this.$channel.invoke('sys.DesignHub.CloseExpression', [this.fileName, isCancel]).catch(err => {
                    _this.$message.error('关闭表达式编辑器错误: ' + err)
                })
            }
        }
    }

</script>