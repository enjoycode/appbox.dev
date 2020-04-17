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
            
            if (this.target.ID === 0) { // TODO: 仅测试用
                let xml = '<Report>'
                xml += '<PageWidth>200mm</PageWidth>'
                xml += '<PageHeight>140mm</PageHeight>'
                xml += '<PageHeader>'
                xml += '<Height>20mm</Height>'
                xml += '<ReportItems>'
                xml += '<Textbox Name="Textbox1">'
                xml += '<Left>50pt</Left>'
                xml += '<Top>10pt</Top>'
                xml += '<Width>100pt</Width>'
                xml += '<Height>30pt</Height>'
                xml += '<Value>测试报表 Hello Future! 1234567890</Value>'
                xml += '</Textbox>'
                xml += '</ReportItems>'
                xml += '</PageHeader>'
                xml += '<Body>'
                xml += '<Height>40mm</Height>'
                xml += '</Body>'
                xml += '<PageFooter>'
                xml += '<Height>15mm</Height>'
                xml += '</PageFooter>'
                xml += "</Report>";
                this.designService.LoadDesigners(xml)
                return
            }
            
            // 开始加载报表定义
            let _this = this;
            $$runtime.channel.invoke('sys.DesignService.OpenReportModel', [this.target.ID]).then(res => {
                _this.designService.LoadDesigners(res)
            }).catch(err => {
                _this.$message.error('Open Report error:' + err)
            })
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