<template>
    <div :style="style"></div>
</template>

<script>
import { monaco } from './EditorService'

export default {
    props: {
        width: { type: [String, Number], default: '100%' },
        height: { type: [String, Number], default: '500' },
        code: { type: String, default: '// code \n' }, // todo:待移除
        language: { type: String, default: 'javascript' },
        theme: { type: String, default: 'vs-dark' }, // vs, vs-dark, hc-black
        options: { type: Object, default: () => { } },
        fileName: '' // 对应的虚拟文件名称
    },
    mounted() {
        this.createMonaco()
    },
    destroyed() {
        for (var i = 0; i < this.toDispose.length; i++) {
            this.toDispose[i].dispose()
        }
        if (this.editor) {
            this.editor.dispose()
        }
    },
    computed: {
        style() {
            const { width, height } = this
            const fixedWidth = width.toString().indexOf('%') !== -1 ? width : `${width}px`
            const fixedHeight = height.toString().indexOf('%') !== -1 ? height : `${height}px`
            return {
                width: fixedWidth,
                height: fixedHeight
            }
        },
        editorOptions() {
            return Object.assign({}, this.defaults, this.options, {
                value: this.code,
                language: this.language,
                theme: this.theme,
                model: this.model
            })
        }
    },
    data() {
        return {
            defaults: {
                selectOnLineNumbers: true,
                roundedSelection: false,
                readOnly: false,
                cursorStyle: 'line',
                automaticLayout: true,
                glyphMargin: true,
                folding: true,
                renderIndentGuides: true,
                minimap: { enabled: false }
            },
            toDispose: [],
            breakpoints: [],
            breakline: [] // 击中断点的高亮显示的行的GlyphID
        }
    },
    methods: {
        initValue(code) {
            this.editor.setValue(code)
        },
        createModel(code, language) {
            return monaco.editor.createModel(code, language)
        },
        setModel(model, state) {
            this.editor.setModel(model)
            if (state) {
                this.editor.restoreViewState(state)
            }
        },
        setReadonly(value) {
            this.editor.updateOptions({ readOnly: value })
        },
        saveViewState() {
            return this.editor.saveViewState()
        },
        getValue() {
            return this.editor.getValue()
        },
        getPosition() {
            return this.editor.getPosition()
        },
        setPosition(pos /* IPosition */) {
            this.editor.setPosition(pos)
        },
        getPositionAt(offset /* number */) {
            return this.editor.getModel().getPositionAt(offset)
        },
        addCommand(keys, handler) {
            this.editor.addCommand(keys, handler)
        },
        focus() {
            this.editor.focus()
        },
        createMonaco(isFirstTime) {
            this.editor = monaco.editor.create(this.$el, this.editorOptions)
            var model = this.editor.getModel()
            model.fileName = this.fileName // 给model设置虚拟文件名
            this.toDispose.push(this.editor.onDidChangeModelContent(event => {
                this.$emit('codeChanged', event)
            }))
            this.toDispose.push(this.editor.onMouseDown(this.onMouseDown))
            this.$emit('mounted', this.editor)
        },
        // ====以下事件处理====
        onMouseDown(e) {
            // this.editor.getTargetAtClientPoint(e.clientX, e.clientY)
            // 参考：debugEditorContribution.ts -> registerListeners()
            //TODO:判断当前编辑器是否支持调试
            if (e.target.type !== /* GUTTER_GLYPH_MARGIN */ 2 || /* after last line */ e.target.detail.isAfterLines) {
                return
            }

            var existed = this.getLineBreakpoint(e.target.position.lineNumber)
            if (existed !== -1) {
                var oldbp = this.breakpoints[existed]
                this.breakpoints.splice(existed, 1)
                this.editor.deltaDecorations([oldbp], [])
            } else {
                var newbps = this.editor.deltaDecorations([], [{
                    range: e.target.range,
                    options: {
                        isWholeLine: true,
                        glyphMarginClassName: 'breakpoint'
                    }
                }])
                this.breakpoints = this.breakpoints.concat(newbps)
            }
        },
        getLineBreakpoint(line) {
            for (var i = 0; i < this.breakpoints.length; i++) {
                var bp = this.breakpoints[i]
                var range = this.editor.getModel().getDecorationRange(bp)
                if (range.startLineNumber === line) {
                    return i
                }
            }
            return -1
        },
        /** 用于开始调试时获取 */
        getBreakpoints() {
            var bps = []
            for (var i = 0; i < this.breakpoints.length; i++) {
                var bp = this.breakpoints[i]
                var range = this.editor.getModel().getDecorationRange(bp)
                bps.push({ id: bp, line: range.startLineNumber })
            }
            return bps
        },
        /** 高亮显示或取消高亮断点行 */
        highlightBreakline(line) {
            if (line > 0) {
                this.breakline = this.editor.deltaDecorations(this.breakline, [{
                    range: new monaco.Range(line, 1, line, 1),
                    options: {
                        isWholeLine: true,
                        className: 'breakline'
                    }
                }])
            } else {
                this.breakline = this.editor.deltaDecorations(this.breakline, [])
            }
        }
    }
}
</script>

<style>
.breakpoint {
    background: url("data:image/svg+xml;charset=utf-8,%3Csvg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='8' cy='8' r='5' fill='%23c10' fill-rule='evenodd'/%3E%3C/svg%3E")
        50% no-repeat;
}

.breakline {
    background: rgb(138, 138, 2);
}
</style>