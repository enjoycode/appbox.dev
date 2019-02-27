<template>
    <e-dialog title="New ViewModel" width="450px" :visible.sync="visible" @close="onClose" :before-close="onClosing">
        <span>Name:</span><e-input v-model="newname"></e-input>
        <div slot="footer" class="dialog-footer">
            <e-button :disabled="caDisabled" @click="visible = false">Cancel</e-button>
            <e-button :disabled="okDisabled" type="primary" @click="onOkClick">Ok</e-button>
        </div>
    </e-dialog>
</template>

<script>
import store from '@/design/DesignStore'

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
