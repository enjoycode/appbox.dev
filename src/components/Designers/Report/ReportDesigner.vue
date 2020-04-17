<template>
    <div style="height:100%; width:100%">
        <design-view ref="designView" @ready="onDesignViewReady" background="lightgray"></design-view>
    </div>
</template>

<script>
import DesignView from '@/components/Canvas/DesignView'
import ReportDesignService from './Designers/ReportDesignService'

export default {
    components: {
        DesignView: DesignView
    },
    props: {
        target: { type: Object, required: true }
    },
    data() {
        return {
            designerType: 'ReportDesigner', // 用于外部判断当前设计视图的类型，此属性一直保持不变
            designService: null
        }
    },
    methods: {
        /** 设计视图已准备好 */
        onDesignViewReady() {
            // 先初始化DesignSurface.DesignService实例
            this.designService = new ReportDesignService(this.$refs.designView.designSurface, $runtime.channel, this.target.ID)
            // 开始加载报表定义
            this.designService.LoadDesignersFromServer(this.target.ID)
        },
        save() {
            //console.log(this.designService.GetXmlString());
            console.log(this.designService.RootDesigner.XmlNode.ownerDocument)
            // let node = this.target
            // let _this = this
            // $runtime.channel.invoke('sys.DesignService.SaveModel', [node.Type, node.ID]).then(res => {
            //     _this.$message.success('保存成功')
            // }).catch(err => {
            //     _this.$message.error('保存失败: ' + err)
            // })
        },
    }
}
</script>