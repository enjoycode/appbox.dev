<template>
    <div :style="{height: height + 'px'}" style="width:100%"></div>
</template>

<script>
    // https://xtermjs.org/docs/api/terminal/
    import 'xterm/lib/xterm.css'

    import { Terminal } from 'xterm'
    import * as fit from 'xterm/lib/addons/fit/fit'
    import * as attach from 'xterm/lib/addons/attach/attach'

    fit.apply(Terminal)
    attach.apply(Terminal)

    export default {
        props: {
            height: { type: Number, default: 468 },
        },
        data() {
            return {
                socket: {},
                terminal: {}
            }
        },

        methods: {
            // 连接至web socket并绑定
            connect(host, user, pass) {
                if (!this.terminal) {
                    return
                }

                var scheme = document.location.protocol === 'https:' ? 'wss' : 'ws'
                var port = document.location.port ? (':' + document.location.port) : ''
                var url = scheme + '://' + document.location.hostname + port +
                    '/ssh?cols=' + this.terminal.cols +
                    '&rows=' + this.terminal.rows +
                    '&width=' + this.terminal.renderer.dimensions.actualCellWidth * this.terminal.cols +
                    '&height=' + this.terminal.renderer.dimensions.actualCellHeight * this.terminal.rows +
                    '&user=' + user + '&host=' + host + '&pass=' + pass
                this.socket = new WebSocket(url)
                var _this = this
                this.socket.onopen = function (event) {
                    _this.terminal.attach(_this.socket)
                    _this.$emit('socketStateChanged', event)
                }
                this.socket.onclose = function (event) {
                    _this.terminal.detach(_this.socket)
                    _this.$emit('socketStateChanged', event)
                }
                this.socket.onerror = function (event) {
                    _this.$emit('socketStateChanged', event)
                }
            }
        },

        mounted() {
            this.terminal = new Terminal({
                cursorBlink: true, // optionElements.cursorBlink.checked,
                scrollback: 100, // parseInt(optionElements.scrollback.value, 10),
                tabStopWidth: 10 // parseInt(optionElements.tabstopwidth.value, 10)
            })
            // this.terminal.setOption('cursorStyle', 'underline')
            // term.on('title', function(title){
            //     console.log("on terminal title changed: ", title)
            // })

            this.terminal.open(this.$el)
            this.terminal.fit()
        },

        destroyed() {
            if (this.terminal) {
                this.terminal.destroy()
            }
        }
    }
</script>