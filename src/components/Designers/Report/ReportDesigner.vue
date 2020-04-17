<template>
    <div style="height:100%">
        <!-- 头部区域 -->
        <div class="header">
            <el-radio-group fill="#0994ff" v-model="activeView" size="small" style="margin-left: 40px;">
                <el-radio-button v-for="item in views" :key="item.label" :label="item.label">{{item.title}}</el-radio-button>
            </el-radio-group>
            &nbsp;
            <!-- <el-button-group v-show="activeView==='members'">
                <el-button @click="onAddMember" size="small" icon="el-icon-circle-plus">Add</el-button>
                <el-button @click="onRemoveMember" :disabled="currentMember==null" size="small" icon="el-icon-remove">Remove</el-button>
                <el-button @click="onRenameMember" :disabled="currentMember==null" size="small" icon="fas fa-edit"> Rename</el-button>
                <el-button @click="onFindUsages" :disabled="currentMember==null" size="small" icon="fas fa-link"> Usages</el-button>
            </el-button-group> -->
        </div>
        <!-- 内容区域 -->
        <div class="content">
            <design-view ref="designView" @ready="onDesignViewReady" background="lightgray"></design-view>
        </div>
    </div>
</template>

<script>
import DesignView from '@/components/Canvas/DesignView'
import ReportDesignService from './Designers/ReportDesignService'
import ReportToolbox from "./ReportToolbox";

export default {
    components: { DesignView: DesignView },
    props: { target: { type: Object, required: true } },
    data() {
        return {
            activeView: 'design', // 当前视图 design | preview
            views: [{ label: 'design', title: 'Design' }, { label: 'preview', title: 'Preview' }],
            designerType: 'ReportDesigner', // 用于外部判断当前设计视图的类型，此属性一直保持不变
            designService: null
        }
    },
    methods: {
        /** 设计视图已准备好 */
        onDesignViewReady() {
            // 先初始化DesignSurface.DesignService实例，并设备相应的工具箱
            this.designService = new ReportDesignService(this.$refs.designView.designSurface, $runtime.channel, this.target.ID)
            this.designService.SetToolbox(new ReportToolbox());

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
            $runtime.channel.invoke('sys.DesignService.OpenReportModel', [this.target.ID]).then(res => {
                _this.designService.LoadDesigners(res)
            }).catch(err => {
                _this.$message.error('Open Report error:' + err)
            })
        },

        save() {
            console.log(this.designService.RootDesigner.XmlNode.ownerDocument) //TODO: for debug
            let node = this.target
            let args = [node.Type, node.ID, this.designService.GetXmlString()]
            let _this = this
            $runtime.channel.invoke('sys.DesignService.SaveModel', args).then(res => {
                _this.$message.success('Save Report succeed.')
            }).catch(err => {
                _this.$message.error('Save error: ' + err)
            })
        },
    }
}
</script>

<style scoped>
.header {
    line-height: 45px;
    font-weight: bold;
    padding: 0 10px;
    height: 45px;
    box-shadow: 0 3px 3px #ccc;
}

.content {
    margin-top: 2px;
    height: calc(100% - 47px);
}
</style>