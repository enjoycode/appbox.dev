<template>
    <el-dialog title="Export Application" :visible.sync="visible" :close-on-click-modal="false" @close="onClose" width="450px">
        <span>Application: </span>
        <el-select v-model="appName" style="width:330px">
            <el-option v-for="item in options" :key="item" :label="item" :value="item">
            </el-option>
        </el-select>
        <div slot="footer" class="dialog-footer">
            <a :href="downloadUrl">
                <el-button :disabled="okDisabled" type="primary">Export & Download</el-button>
            </a>
        </div>
    </el-dialog>
</template>

<script>
import store from '@/design/DesignStore'

export default {
    data() {
        return {
            visible: true,
            appName: '',
            options: []
        }
    },
    computed: {
        downloadUrl: function() {
            return 'api/design/export/' + this.appName
        },
        okDisabled: function() {
            return !this.appName
        }
    },
    methods: {
        onClose: function (e) {
            this.$emit('close')
        }
    },
    mounted() {
        store.tree.designNodes[1].Nodes.forEach(appNode => {
            this.options.push(appNode.ID)
        })
    }
}
</script>