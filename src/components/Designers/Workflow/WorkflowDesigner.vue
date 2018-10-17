<template>
    <div style="height:100%; width:100%">
        <design-view ref="designView" background="lightgray"></design-view>
    </div>
</template>

<script>
import DesignView from '../../Canvas/DesignView'
import WorkflowDesignService from './WorkflowDesignService'

export default {
    components: {
        DesignView: DesignView
    },
    props: {
        target: { type: Object, required: true }
    },
    data() {
        return {}
    },
    methods: {
        save() {
            console.warn('尚未实现')
            // let node = this.target
            // let _this = this
            // this.$channel.invoke('sys.DesignHub.SaveModel', [node.Type, node.ID]).then(res => {
            //     _this.$message.success('保存成功')
            // }).catch(err => {
            //     _this.$message.error('保存失败: ' + err)
            // })
        }
    },
    mounted() {
        // 开始加载RootDesigner
        var _this = this
        this.$nextTick(() => {
            // 先初始化DesignSurface.DesignService实例
            var designService = new WorkflowDesignService(this.$refs.designView.designSurface, this.$channel, this.target.ID)
            this.$channel.invoke('sys.DesignHub.OpenWorkflowModel', [this.target.ID]).then(res => {
                designService.LoadDesignersFromServer(res)
            }).catch(err => {
                _this.$message.error(err.toString())
            })
        })
    }
}

</script>