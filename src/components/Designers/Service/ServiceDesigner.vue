<template>
    <div style="height:100%" ref="serviceEditor">
        <div class="editorTool">
            <el-button @click="showRefsDlg" size="mini" icon="fas fa-project-diagram"> References</el-button>
            &nbsp;
            <el-button-group>
                <el-button @click="startInvoke" size="mini" icon="fas fa-play-circle"> Invoke</el-button>
                <el-button @click="startDebug" size="mini" icon="fas fa-bug"> Start</el-button>
                <el-button @click="continueBreakpoint" :disabled="debugState !== 2" size="mini" icon="fas fa-play">
                    Continue
                </el-button>
                <el-button :disabled="debugState !== 2" size="mini" icon="fas fa-forward"> Step</el-button>
                <el-button :disabled="debugState === 0" size="mini" icon="fas fa-stop"> Stop</el-button>
            </el-button-group>
        </div>
        <code-editor height="100%" ref="editor" :language="language" theme="tm" :fileName="fileName"
                     @mounted="onEditorMounted" :options="{readOnly: true}">
        </code-editor>
    </div>
</template>

<script>
import Vue from 'vue'
import CodeEditor from '../../CodeEditor/CodeEditor'
import debounce from 'lodash.debounce'
import DesignStore from '@/design/DesignStore'
import ModelType from '@/design/ModelType'
import DebugService from './DebugService'
import ReferencesDialog from './ReferencesDialog'
import InvokeDialog from './InvokeDialog'
import DebugArgsDialog from './DebugArgsDialog'
import {modelLibs} from '../../CodeEditor/EditorService'

export default {
    components: {CodeEditor: CodeEditor},
    props: {
        target: {type: Object, required: true}, // 服务模型节点
        goto: {type: Object} // 需要跳转的模型引用 IModelReference
    },
    data() {
        return {
            readOnly: true, // 是否只读模式，对应模型的签出状态
            designerType: 'ServiceDesigner', // 用于外部判断当前设计视图的类型，此属性一直保持不变
            debouncedCheckCode: null, // 延迟代码诊断
            debugState: 0, //0=未运行；1=运行中；2=暂停
            hitBreakpoint: null // 当前停止的断点
        }
    },
    computed: {
        language() {
            return this.target.Language === 1 ? 'java' : "csharp";
        },
        fileName() {
            let ext = this.target.Language === 1 ? '.java' : '.cs';
            return this.target.App + '.Services.' + this.target.Text + ext
        }
    },
    watch: {
        readOnly(value) {
            this.$refs.editor.setReadonly(value)
        },
        goto(value) {
            this.gotoReference()
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
            const _this = this;
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
            const _this = this;
            $runtime.channel.invoke('sys.DesignService.OpenServiceModel', [this.target.ID]).then(res => {
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
            this.gotoReference() //跳转至指定位置，仅适用于初次打开当前编辑器
        },

        /** 跳转到引用位置 */
        gotoReference() {
            if (!this.goto) {
                return
            }
            let pos = this.$refs.editor.getPositionAt(this.goto.Offset)
            this.$refs.editor.setPosition(pos) //暂简单设定位置
            this.$refs.editor.focus()
        },

        /** 代码变更通知服务端同步 */
        onCodeChanged(event) {
            let _this = this
            // TODO:** 排队处理，防止服务端乱序执行
            // todo:***** 临时修复monaco升级至0.9.0的问题，原本event.range，现在event.changes[].range
            for (var i = 0; i < event.changes.length; i++) {
                var change = event.changes[i]
                $runtime.channel.invoke('sys.DesignService.ChangeBuffer', [1, this.target.ID,
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
            $runtime.channel.invoke('sys.DesignService.CheckCode', [1, this.target.ID]).then(res => {
                if (res && res.length > 0) {
                    var errs = []
                    for (var i = 0; i < res.length; i++) {
                        var element = res[i]
                        errs.push({
                            Model: this.target.App + '.' + this.target.Text,
                            Location: '(' + element.Line + ',' + element.Column + ')',
                            Info: element.Text
                        })
                    }
                    DesignStore.errors.update(this.target.App + '.' + this.target.Text, errs)
                } else {
                    DesignStore.errors.clear(this.target.App + '.' + this.target.Text)
                }
            }).catch(err => {
                _this.$message.warning('检查代码错误: ' + err)
            })
        },

        save() {
            let node = this.target
            let _this = this
            $runtime.channel.invoke('sys.DesignService.SaveModel', [node.Type, node.ID]).then(res => {
                _this.$message.success('保存成功')
                modelLibs.update(ModelType.Service, this.target.ID)
            }).catch(err => {
                _this.$message.error('保存失败: ' + err)
            })
        },

        refresh() {
            this.loadModel(false)
        },

        onCheckout(needUpdate) {
            if (needUpdate) {
                this.loadModel(true) //签出时已变更，需要重新加载
            } else {
                this.readOnly = false
            }
        },

        /** 显示引用编辑对话框 */
        showRefsDlg() {
            const dlg = Vue.component('ReferencesDialog', ReferencesDialog);
            DesignStore.ide.showDialog(dlg)
        },

        // 开始调用服务方法
        startInvoke() {
            let _this = this
            // 先获取服务方法
            let position = this.$refs.editor.getPosition()
            let args = [this.target.ID, position.lineNumber, position.column]
            $runtime.channel.invoke('sys.DesignService.GetServiceMethod', args).then(res => {
                const method = JSON.parse(res);
                for (let i = 0; i < method.Args.length; i++) {
                    method.Args[i].Value = ''
                }
                const dlg = Vue.component('InvokeDialog', InvokeDialog);
                DesignStore.ide.showDialog(dlg, {Service: _this.target.App + '.' + _this.target.Text, Method: method})
            }).catch(() => {
                _this.$message.error('Cannot find target method')
            })
        },

        /** 开始调试服务方法 */
        startDebug() {
            let _this = this
            DebugService.designer = this
            // 先获取服务方法
            let position = this.$refs.editor.getPosition()
            var breakpoints = this.$refs.editor.getBreakpoints()
            let args = [this.target.ID, position.lineNumber, position.column]
            $runtime.channel.invoke('sys.DesignService.GetServiceMethod', args).then(res => {
                var method = JSON.parse(res)
                for (var i = 0; i < method.Args.length; i++) {
                    method.Args[i].Value = ''
                }
                // 显示输入参数对话框
                var dlg = Vue.component('DebugArgsDialog', DebugArgsDialog)
                DesignStore.ide.showDialog(dlg, {
                    ModelID: _this.target.ID, Service: _this.target.App + '.' + _this.target.Text,
                    Method: method,
                    Breakpoints: breakpoints,
                    Designer: _this
                })
            }).catch(() => {
                DebugService.designer = null
                _this.$message.error('Cannot find target method')
            })
        },

        onDebugStarted(ok) {
            if (!ok) {
                DebugService.designer = null
            } else {
                this.debugState = 1
            }
        },

        /** 收到调试结果或异常中断调试进程 */
        onDebugStopped(res) {
            this.debugState = 0
            DebugService.designer = null
            //TODO: 显示调试结果?
        },

        onHitBreakpoint(bp) {
            this.debugState = 2
            this.hitBreakpoint = bp
            this.$refs.editor.highlightBreakline(bp.Line) // 高亮击中的行
            this.$refs.editor.focus()
        },

        continueBreakpoint() {
            if (this.hitBreakpoint) {
                let _this = this
                let thread = this.hitBreakpoint.Thread
                this.hitBreakpoint = null
                this.$refs.editor.highlightBreakline(-1) // 取消当前高亮
                DebugService.variables.splice(0, DebugService.variables.length); //先清空变量列表
                $runtime.channel.invoke('sys.DesignService.ContinueBreakpoint', [thread]).then(res => {
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

<style scoped>
.editorPanel {
    height: calc(100% - 40px);
}

.editorTool {
    box-sizing: border-box;
    padding: 6px 10px;
    height: 40px;
    overflow: hidden;
    background-color: #3c3c3c;
}
</style>
