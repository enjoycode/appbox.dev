<template>
    <div style="height:100%">
        <!-- 头部区域 -->
        <div class="header">
            <el-radio-group fill="#0994ff" v-model="activeView" size="small" style="margin-left: 40px;">
                <el-radio-button v-for="item in views" :key="item.label" :label="item.label">{{item.title}}</el-radio-button>
            </el-radio-group>
            &nbsp;
            <!-- 报表设计相关命令 -->
            <el-dropdown @command="onTableCommand" v-show="activeView==='design'">
                <el-button size="small" icon="fas fa-table">
                    Insert<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="ICL">Column Left</el-dropdown-item>
                    <el-dropdown-item command="ICR">Column Right</el-dropdown-item>
                    <el-dropdown-item command="IRA" divided>Row Above</el-dropdown-item>
                    <el-dropdown-item command="IRB">Row Below</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown @command="onTableCommand" v-show="activeView==='design'">
                <el-button size="small" icon="fas fa-table">
                    Delete<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="DC">Column</el-dropdown-item>
                    <el-dropdown-item command="DR">Row</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown @command="onTableCommand" v-show="activeView==='design'">
                <el-button size="small" icon="fas fa-table">
                    Cells<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="CM">Merge</el-dropdown-item>
                    <el-dropdown-item command="CS">Split</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-button @click="onDeleteSelection" size="small" v-show="activeView==='design'" 
                icon="fas fa-times fa-fw">Delete Selection</el-button>
        </div>
        <!-- 内容区域 -->
        <div class="content">
            <design-view ref="designView" v-show="activeView==='design'" 
                @ready="onDesignViewReady" background="lightgray"></design-view>
            <pdf-viewer :file="'/api/design/report/'+ target.ID" v-if="activeView==='preview'"></pdf-viewer>
        </div>
    </div>
</template>

<script>
import DesignView from '@/components/Canvas/DesignView'
import ReportDesignService from './Designers/ReportDesignService'

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
            $runtime.channel.invoke('sys.DesignService.OpenReportModel', [this.target.ID]).then(res => {
                _this.designService.LoadDesigners(res)
            }).catch(err => {
                _this.$message.error('Open Report error:' + err)
            })
        },

        onTableCommand(cmd) {
            let error = null
            switch (cmd) {
                case "ICL": error = this.designService.InsertColumn(true); break;
                case "ICR": error = this.designService.InsertColumn(false); break;
                case "DC": error = this.designService.DeleteColumn(); break;
                default: break;
            }
            if (error) { this.$message.error(error) }
        },
        onDeleteSelection() {
            this.designService.DeleteSelection()
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