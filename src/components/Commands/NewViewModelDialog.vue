<template>
    <el-dialog title="New ViewModel" width="500px" :visible.sync="visible" @close="onClose" :before-close="onClosing">
        <span>Name:</span><el-input v-model="newname"></el-input>
        <div slot="footer" class="dialog-footer">
            <el-button :disabled="caDisabled" @click="visible = false">Cancel</el-button>
            <el-button :disabled="okDisabled" type="primary" @click="onOkClick">Ok</el-button>
        </div>
    </el-dialog>
</template>

<script>
import store from '@/design/DesignStore'
import { modelLibs } from '../CodeEditor/EditorService'

export default {
    data() {
        return {
            visible: true,
            okDisabled: false, // ok按钮是否禁用
            caDisabled: false, // cancel按钮是否禁用
            running: false,
            newname: ''
        }
    },
    methods: {
        onClosing(done) {
            if (!this.running) {
                done()
            }
        },
        onClose() {
            this.$emit('close')
        },
        onOkClick() {
            this.running = true
            this.okDisabled = true
            this.caDisabled = true

            var node = store.tree.currentNode
            var _this = this
            $runtime.channel.invoke('sys.DesignService.NewViewModel', [node.Type, node.ID, this.newname]).then(res => {
                store.tree.onNewNode(res)
                // 新建的添加ts声明代码
                modelLibs.addView(res.NewNode)
                _this.$message.success('New view succeed.')
                _this.running = false
                _this.visible = false
                _this.caDisabled = false
            }).catch(err => {
                _this.running = false
                _this.okDisabled = false
                _this.caDisabled = false
                _this.$message.error(err)
            })
        }
    }
}
</script>
