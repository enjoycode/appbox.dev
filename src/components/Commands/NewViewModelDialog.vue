<template>
    <e-dialog title="新建视图模型" width="450px" :visible.sync="visible" @close="onClose" :before-close="onClosing">
        <span>视图名称:</span><e-input v-model="newname"></e-input>
        <div slot="footer" class="dialog-footer">
            <e-button :disabled="caDisabled" @click="visible = false">取 消</e-button>
            <e-button :disabled="okDisabled" type="primary" @click="onOkClick">确 定</e-button>
        </div>
    </e-dialog>
</template>

<script>
import store from '../DesignStore'

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
            store.channel.invoke('sys.DesignHub.NewViewModel', [node.Type, node.ID, this.newname]).then(res => {
                _this.running = false
                _this.caDisabled = false
                // 根据返回结果添加新节点
                store.tree.onNewNode(res)
            }).catch(err => {
                _this.running = false
                _this.okDisabled = false
                _this.caDisabled = false
                _this.$message.error('新建错误: ' + err)
            })
        }
    }
}
</script>
