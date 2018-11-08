<template>
    <e-splitter handlerColor="#f1f1f1" :size="300">
        <div slot="panel1" style="height:100%" ref="serviceEditor">
            <code-editor height="100%" ref="editor" language="csharp" :fileName="fileName" @mounted="onEditorMounted" :options="{readOnly: true}"></code-editor>
        </div>
        <div slot="panel2" class="ide-property-panel" ref="serviceProperty">
            <e-collapse class="ide-property-collapse" value="1">
                <e-collapse-item title="Service Properties" name="1">
                    <e-form label-position="right" size="mini" label-width="120px">
                        <e-form-item label="ID">
                            <e-input v-model="target.ID" :disabled="true"></e-input>
                        </e-form-item>
                        <e-form-item label="AppID">
                            <e-input v-model="target.AppID" :disabled="true"></e-input>
                        </e-form-item>
                        <e-form-item label="Model Name">
                            <e-input v-model="target.Text" :disabled="true"></e-input>
                        </e-form-item>
                        <e-form-item label="SortNo">
                            <e-input v-model="target.SortNo" :disabled="true"></e-input>
                        </e-form-item>
                        <e-form-item label="References">
                            <e-button @click="showRefsDlg" style="width:100%" :disabled="readOnly">...</e-button>
                        </e-form-item>
                    </e-form>
                </e-collapse-item>
            </e-collapse>
        </div>
    </e-splitter>
</template>

<script>
    import Vue from 'vue'
    import CodeEditor from '../../CodeEditor/CodeEditor'
    import debounce from 'lodash.debounce'
    import DesignStore from '../../DesignStore'
    import DebugService from './DebugService'
    import ReferencesDialog from './ReferencesDialog'
    import DebugArgsDialog from './DebugArgsDialog'

    export default {
        components: { CodeEditor: CodeEditor },
        props: {
            target: { type: Object, required: true } // 服务模型节点
        },
        data() {
            return {
                readOnly: true, // 是否只读模式，对应模型的签出状态
                designerType: 'ServiceDesigner', // 用于外部判断当前设计视图的类型，此属性一直保持不变
                debouncedCheckCode: null, // 延迟代码诊断
                hitBreakpoint: null // 当前停止的断点
            }
        },
        computed: {
            fileName() {
                return this.target.App + '.Services.' + this.target.Text + '.cs'
            }
        },
        watch: {
            readOnly(value) {
                this.$refs.editor.setReadonly(value)
            }
        },

        methods: {
            /** 代码编辑器初始化后开始加载服务代码 */
            onEditorMounted() {
                this.initEditorCommands() // 开始设置快捷键
                this.loadModel(false) // 开始加载模型
            },

            /** 设置编辑器快捷键 */
            initEditorCommands() {
                var _this = this
                this.$refs.editor.addCommand(window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.KEY_S, function () {
                    _this.save()
                })
                this.$refs.editor.addCommand(window.monaco.KeyCode.F5, function () {
                    if (_this.hitBreakpoint) {
                        _this.continueBreakpoint()
                    } else {
                        _this.startDebug()
                    }
                })
            },

            loadModel(byCheckout) {
                var _this = this
                this.$channel.invoke('sys.DesignService.OpenServiceModel', [this.target.ID]).then(res => {
                    _this.onModelLoaded(res, byCheckout)
                }).catch(err => {
                    _this.$message.error('加载服务代码失败: ' + err)
                })
            },

            onModelLoaded(code, byCheckout) {
                this.$refs.editor.$off('codeChanged') // 注意：先关闭，用于签出时更新代码
                this.$refs.editor.initValue(code)
                this.$refs.editor.$on('codeChanged', this.onCodeChanged)
                // focus code editor
                this.$refs.editor.focus()
                if (byCheckout || (this.target.CheckoutBy && this.target.CheckoutBy === 'Me')) {
                    this.readOnly = false
                }
            },

            /** 代码变更通知服务端同步 */
            onCodeChanged(event) {
                let _this = this
                // TODO:** 排队处理，防止服务端乱序执行
                // todo:***** 临时修复monaco升级至0.9.0的问题，原本event.range，现在event.changes[].range
                for (var i = 0; i < event.changes.length; i++) {
                    var change = event.changes[i]
                    this.$channel.invoke('sys.DesignService.ChangeBuffer', [1, this.target.ID,
                        change.range.startLineNumber, change.range.startColumn,
                        change.range.endLineNumber, change.range.endColumn, change.text]).catch(err => {
                            _this.$message.warning('提交代码变更错误: ' + err)
                        })
                }
                this.debouncedCheckCode() // todo:考虑检测改变是否仅空白类字符，是则不需要检测代码
            },

            /** 延迟检查代码有效性 */
            checkCode() {
                let _this = this
                this.$channel.invoke('sys.DesignService.CheckCode', [1, this.target.ID]).then(res => {
                    if (res && res.length > 0) {
                        var errs = []
                        for (var i = 0; i < res.length; i++) {
                            var element = res[i]
                            errs.push({ Model: this.target.App + '.' + this.target.Name, Location: '(' + element.Line + ',' + element.Column + ')', Info: element.Text })
                        }
                        DesignStore.errors.update(this.target.App + '.' + this.target.Name, errs)
                    } else {
                        DesignStore.errors.clear(this.target.App + '.' + this.target.Name)
                    }
                }).catch(err => {
                    _this.$message.warning('检查代码错误: ' + err)
                })
            },

            save() {
                let node = this.target
                let _this = this
                this.$channel.invoke('sys.DesignService.SaveModel', [node.Type, node.ID]).then(res => {
                    _this.$message.success('保存成功')
                }).catch(err => {
                    _this.$message.error('保存失败: ' + err)
                })
            },
            refresh() {
                this.loadModel(false)
            },

            onCheckout(needUpdate) {
                if (needUpdate) {
                    this.loadModel(true)
                } else {
                    this.readOnly = false
                }
            },
            /** 显示引用编辑对话框 */
            showRefsDlg() {
                var dlg = Vue.component('ReferencesDialog', ReferencesDialog)
                DesignStore.ide.showDialog(dlg)
            },
            /** 开始调试 */
            startDebug() {
                let _this = this
                DebugService.designer = this
                // 先调用PrepareDebug服务定位入口
                let position = this.$refs.editor.getPosition()
                var breakpoints = this.$refs.editor.getBreakpoints()
                this.$channel.invoke('sys.DesignService.PrepareDebug', [this.target.ID, position.lineNumber, position.column]).then(res => {
                    var method = JSON.parse(res)
                    for (var i = 0; i < method.Args.length; i++) {
                        method.Args[i].Value = ''
                    }
                    // 显示输入参数对话框
                    var dlg = Vue.component('DebugArgsDialog', DebugArgsDialog)
                    DesignStore.ide.showDialog(dlg, { ModelID: _this.target.ID, Method: method, Breakpoints: breakpoints })
                }).catch(() => {
                    DebugService.designer = null
                    _this.$message.error('无法定位目标服务方法')
                })
            },
            onHitBreakpoint(bp) {
                this.hitBreakpoint = bp
                // 高亮击中的行
                this.$refs.editor.highlightBreakline(bp.Line)
                this.$refs.editor.focus()
            },
            continueBreakpoint() {
                if (this.hitBreakpoint) {
                    let _this = this
                    let thread = this.hitBreakpoint.Thread
                    this.hitBreakpoint = null
                    this.$refs.editor.highlightBreakline(-1) // 取消当前高亮
                    this.$channel.invoke('sys.DesignService.ContinueBreakpoint', [thread]).then(res => {
                        // do nothing
                    }).catch(err => {
                        _this.$message.error('继续执行错误: ' + err)
                    })
                }
            }
        },
        mounted() {
            this.debouncedCheckCode = debounce(this.checkCode, 1000)
        }
    }
</script>