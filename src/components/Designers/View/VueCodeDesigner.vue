<template>
    <ex-splitter :pin-second="false" :minSize="640" :visible="panelVisible" handlerColor="#a2a2a2" :size="640">
        <!-- 左边编辑区域 -->
        <div slot="panel1" style="height: 100%">
            <div class="editorTool">
                <el-radio-group fill="#3982b6" v-model="editMode" size="mini">
                    <el-radio-button label="template">Template</el-radio-button>
                    <el-radio-button label="script">Script</el-radio-button>
                    <el-radio-button label="style">Style</el-radio-button>
                </el-radio-group>
                <el-button size="mini" @click="route.DlgVisible = true">Route</el-button>
                <el-button size="mini" :type="designButton" @click="switchPreviewPanel">Preview</el-button>
                <el-select v-if="panelVisible === 'both'" style="width: 120px" size="mini" v-model="deviceValue"
                           placeholder="尺寸">
                    <el-option label="Responsive" value="Responsive">
                    </el-option>
                    <el-option label="iphone5" value="iphone5">
                    </el-option>
                    <el-option label="ipad" value="ipad">
                    </el-option>
                </el-select>
                <el-select v-if="panelVisible === 'both'" style="width:80px" size="mini" v-model="deviceZoom"
                           placeholder="缩放">
                    <el-option label="100%" value="100%">
                    </el-option>
                    <el-option label="75%" value="75%">
                    </el-option>
                    <el-option label="50%" value="50%">
                    </el-option>
                </el-select>

                <!-- 路由设置对话框 -->
                <route-dialog :visible.sync="route.DlgVisible" :route="route" :readonly="readOnly"
                              @change="changeRouteSetting"></route-dialog>
            </div>
            <div class="editorPanel" ref="editorPanel">
                <code-editor ref="editor" height="100%" language="html" theme="tm" :fileName="fileName"
                             @mounted="onEditorMounted" :options="{readOnly: true}"></code-editor>
            </div>
        </div>
        <!-- 右边预览区域 -->
        <div slot="panel2" class="previewPanel">
            <iframe ref="previewFrame" class="previewFrame"
                    sandbox="allow-modals allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts"
                    :width="domWidth" :height="domHeight" frameborder="0" :src="previewUrl"></iframe>
        </div>
    </ex-splitter>
</template>

<script>
import CodeEditor from '../../CodeEditor/CodeEditor'
import {monaco, ts, modelLibs} from '../../CodeEditor/EditorService'
import compiler from './Compiler'
import embedSourceMap from './EmbedSourceMap'
import scopeStyle from './ScopeStyle'
import debounce from 'lodash.debounce'
import UglifyJS from './UglifyJS'
import store from '@/design/DesignStore'
import RouteDialog from "@/components/Designers/View/RouteDialog";

// 缩放参考https://collaboration133.com/how-to-scale-iframe-content-in-ie-chrome-firefox-and-safari/2717/

function hash(str) {
    let hash = 0;
    let char;
    if (str.length === 0) return hash
    for (let i = 0; i < str.length; i++) {
        char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32bit integer
    }
    return hash
}

export default {
    components: {
        RouteDialog,
        CodeEditor
    },
    props: {
        target: {type: Object, required: true} // 视图模型节点
    },
    data() {
        return {
            readOnly: true, // 是否只读模式，对应模型的签出状态
            runtimeCode: '',
            runtimeStyle: '',
            sourceMap: null,
            hashID: '',
            debouncedBuild: null, // 用于延时编译并预览
            permissionValue: '',
            deviceValue: 'Responsive',
            domWidth: '100%',
            domHeight: '100%',
            editMode: 'template', // 当前的编辑模式
            editState: {}, // 包含monaco的Model，以及当前的行列信息
            designButton: 'primary',
            panelVisible: 'first',
            deviceZoom: '100%',

            route: {
                Enable: false, // 是否启用路由
                Parent: '',    // 自定义路由的上级
                Path: '',      // 自定义路由的路径
                DlgVisible: false
            },

            previewer: null // 指向预览窗口内的实例，由预览窗口加载时设置
        }
    },
    computed: {
        fileName() {
            return this.target.App + '.Views.' + this.target.Text + '.vue'
        },
        previewUrl() {
            return document.location.href.replace('/IDE', '/preview')
        }
    },
    watch: {
        editMode(newVal, oldVal) {
            this.switchEditMode(newVal, oldVal)
        },
        deviceValue(val) { // todo:改为数据驱动
            if (val === 'iphone5') {
                this.domHeight = '568px'
                this.domWidth = '320px'
            } else if (val === 'ipad') {
                this.domHeight = '1024px'
                this.domWidth = '768px'
            } else {
                this.domHeight = '100%'
                this.domWidth = '100%'
            }
            this.updateZoom() // 需要调用一次更新
        },
        deviceZoom(val) {
            this.updateZoom()
        },
        readOnly(value) {
            this.$refs.editor.setReadonly(value)
        }
    },
    mounted() {
        this.hashID = hash(this.target.ID).toString(16) // TODO: fix it
        this.debouncedBuild = debounce(this.build, 1000)
    },

    methods: {
        // 代码编辑器初始化后开始加载服务代码
        onEditorMounted() {
            this.initEditorCommands()   // 开始设置快捷键
            modelLibs.ensureLoad()      // 确认已加载模型声明
            this.loadModel(false)       // 开始加载模型
        },
        // 设置编辑器快捷键
        initEditorCommands() {
            const _this = this;
            // 切换编辑模式
            this.$refs.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_1, function () {
                _this.editMode = 'template'
            })
            this.$refs.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_2, function () {
                _this.editMode = 'script'
            })
            this.$refs.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_3, function () {
                _this.editMode = 'style'
            })
            this.$refs.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_4, function () {
                _this.switchPreviewPanel()
            })
            // 保存
            this.$refs.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, function () {
                _this.save()
            })
        },
        // 切换编辑模式
        switchEditMode(newMode, oldMode) {
            // 先保存旧状态
            let oldState = this.editState[oldMode]
            oldState.state = this.$refs.editor.saveViewState()
            // 切换至新的编辑模式
            let newState = this.editState[newMode]
            this.$refs.editor.setModel(newState.model, newState.state)
            // focus it
            this.$refs.editor.focus()
        },
        loadModel(byCheckout) {
            $runtime.channel.invoke('sys.DesignService.OpenViewModel', [this.target.ID]).then(res => {
                this.onModelLoaded(res, byCheckout)
            }).catch(err => this.$message.error('加载视图代码失败: ' + err))
        },
        // 视图模型加载成功
        onModelLoaded(model, byCheckout) {
            this.routeEnable = model.Route
            this.routeParent = model.RouteParent
            this.routePath = model.RoutePath

            this.$refs.editor.$off('codeChanged') // 解绑代码变更事件

            // 开始初始化editState
            const template = {model: this.$refs.editor.createModel(model.Template, 'html'), state: null};
            this.editState.template = template
            const script = {model: this.$refs.editor.createModel(model.Script, 'javascript'), state: null};
            this.editState.script = script
            const style = {model: this.$refs.editor.createModel(model.Style, 'css'), state: null};
            this.editState.style = style
            // 加载默认为模版编辑模式
            this.$refs.editor.setModel(template.model, template.line, template.col)

            this.$refs.editor.$on('codeChanged', this.onCodeChanged) // 绑定代码变更事件

            this.build() // 必须调用一次

            this.$refs.editor.focus() // focus code editor
            if (byCheckout || (this.target.CheckoutBy && this.target.CheckoutBy === 'Me')) {
                this.readOnly = false
            }
        },
        onCodeChanged(event) {
            this.debouncedBuild()
        },
        /** 改变路由设置 */
        changeRouteSetting() {
            let _this = this
            let args = [this.target.ID, this.route.Enable, this.route.Parent, this.route.Path]
            $runtime.channel.invoke('sys.DesignService.ChangeRouteSetting', args).then(res => {
                _this.route.DlgVisible = false
            }).catch(err => {
                alert(err)
            })
        },
        onDeviceClick(el) {
            function hasClass(elem, className) {
                var reg = new RegExp('(^|\\s+)' + className + '($|\\s+)')
                return reg.test(elem.className)
            }

            if (hasClass(el.parentElement, 'deviceSelect')) {
                el.parentElement.classList.remove('deviceSelect')
            } else {
                el.parentElement.classList.add('deviceSelect')
            }
        },
        /** 编译视图组件并更新预览 */
        build() {
            const template = this.editState['template'].model.getValue()
            const script = this.editState['script'].model.getValue()
            const styles = this.editState['style'].model.getValue()
            let scopedStyle = '';

            // 先转换编译模版及脚本
            const compiledCode = compiler(ts, template, script, this.hashID,
                this.target.App + '.' + this.target.Text, true) //暂强制输出sourceMap
            if (compiledCode.error) {
                console.log('编译错误: ' + compiledCode.error.message)
                return
            }

            // 再转换并设置预览的样式
            if (styles && styles.length > 0) {
                scopedStyle = scopeStyle(styles, this.hashID)
                // this.$refs.viewStyle.styles = scopedStyle
            }

            // 合并代码
            let normalized = 'var exports={};\n';
            normalized += compiledCode.code
            normalized += '\nexports.default.options.render=' + compiledCode.template.render
            normalized += '\nexports.default.options.staticRenderFns=' + compiledCode.template.staticRenderFns
            if (scopedStyle && scopedStyle.length > 0) {
                normalized += '\nexports.default.options._scopeId="data-v-' + this.hashID + '"'
            }
            normalized += '\nreturn exports.default;'

            // 没有错误最后设置
            this.runtimeStyle = scopedStyle
            this.runtimeCode = normalized
            this.sourceMap = compiledCode.sourceMap;
            if (this.panelVisible === 'both') {
                this.updatePreview(true)
            }
        },
        save() {
            if (this.debouncedBuild) {
                this.debouncedBuild.flush()
            }

            let node = this.target
            // 先压缩编译好的代码 TODO:待解决mangle组件名称至如i，vue运行时warn
            // https://github.com/mishoo/UglifyJS2
            let minifyRes = UglifyJS.minify(this.runtimeCode, {
                parse: {
                    bare_returns: true
                },
                mangle: {
                    toplevel: true
                }
            })
            let minifyCode = this.runtimeCode;
            if (!minifyRes.error) {
                minifyCode = minifyRes.code
            }

            // 设置递交的模型信息
            const template = this.editState['template'].model.getValue()
            const script = this.editState['script'].model.getValue()
            const styles = this.editState['style'].model.getValue()
            let runtimeCode = {
                Code: minifyCode,
                Style: this.runtimeStyle
            }

            const _this = this;
            let args = [node.Type, node.ID, template, script, styles, JSON.stringify(runtimeCode)]
            $runtime.channel.invoke('sys.DesignService.SaveModel', args).then(res => {
                _this.$message.success('Save view succeed.')
            }).catch(err => {
                _this.$message.error(err)
            })
        },
        /** 切换显示预览窗口 */
        switchPreviewPanel() {
            if (this.panelVisible === 'first') {
                this.panelVisible = 'both'
                this.designButton = 'primary'

                // 注入预览窗口所需要的全局变量
                this.$nextTick(() => {
                    this.$refs.previewFrame.contentWindow.$runtime = $runtime
                    this.$refs.previewFrame.contentWindow.$store = store
                    this.$refs.previewFrame.contentWindow.$designer = this
                })
            } else if (this.panelVisible === 'both') {
                this.panelVisible = 'first'
                this.designButton = 'text'
            }
        },
        /** 通知预览窗口更新 */
        updatePreview(hotpatch) {
            if (this.runtimeCode && this.previewer) {
                //转换sourceMap为嵌入
                let code = embedSourceMap(this.runtimeCode, this.editState['script'].model.getValue(), this.sourceMap);
                let styles = this.runtimeStyle;

                if (hotpatch) { // 热更新处理，暂简单处理
                    if (this.editMode !== 'style') {
                        styles = null
                    } else {
                        code = null
                    }
                }

                this.previewer.update(code, styles)
            }
        },
        /** 用于预览缩放系数或类型改变后更新 */
        updateZoom() {
            let z = 1
            if (this.deviceZoom === '75%') {
                z = 0.75
            } else if (this.deviceZoom === '50%') {
                z = 0.5
            }
            this.previewer.changeZoom(z)

            if (this.deviceValue !== 'Responsive') { // 非自适应模式缩放iframe
                let frame = this.$refs.previewFrame
                frame.style.zoom = z
            }
        },
        onCheckout(needUpdate) {
            if (needUpdate) {
                this.loadModel(true)
            } else {
                this.readOnly = false
            }
        }
    }
}
</script>

<!-- <style>
    @media screen and (-webkit-min-device-pixel-ratio:0) {
        .previewFrame {
            zoom: 1;
        }
    }
</style> -->

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

.previewPanel {
    background-color: #a2a2a2;
    height: 100%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 10px;
    overflow: auto;
}

.previewFrame {
    background-color: #fff;
    box-shadow: 0 0 10px #000000;

    /* -moz-transform: scale(0.71); */
    /* -moz-transform-origin: 0 0;
        -o-transform: scale(0.71);
        -o-transform-origin: 0 0;
        -webkit-transform: scale(0.71);
        -webkit-transform-origin: 0 0; */
}

.device {
    color: #bfcbd9;
}

.device i {
    cursor: pointer;
}

.deviceSelect {
    color: #000000;
}
</style>
