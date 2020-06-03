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
                    Table<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="ICL">Insert Column Left</el-dropdown-item>
                    <el-dropdown-item command="ICR">Insert Column Right</el-dropdown-item>
                    <el-dropdown-item command="IRA" divided>Insert Row Above</el-dropdown-item>
                    <el-dropdown-item command="IRB">Insert Row Below</el-dropdown-item>
                     <el-dropdown-item command="DC" divided>Delete Column</el-dropdown-item>
                    <el-dropdown-item command="DR">Delete Row</el-dropdown-item>
                    <el-dropdown-item command="MC" divided>Merge Cells</el-dropdown-item>
                    <el-dropdown-item command="SC">Split Cells</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            
            <el-button @click="onDeleteSelection" size="small" v-show="activeView==='design'" 
                icon="fas fa-times fa-fw">Delete</el-button>
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
                let json = '{"Width":"20cm","Items":[{"$T":"Details","Height":"8cm"}]}'
                this.designService.LoadDesigners(json)
                return
            }

            // 开始加载报表定义
            let _this = this;
            $runtime.channel.invoke('sys.DesignService.OpenReportModel', [this.target.ID]).then(res => {
                _this.designService.LoadDesigners(res)
            }).catch(err => {
                console.warn(err)
                _this.$message.error('Open Report error:' + err)
            })
        },

        onTableCommand(cmd) {
            let error = null
            switch (cmd) {
                case "ICL": error = this.designService.InsertRowOrColumn(true, false); break;
                case "ICR": error = this.designService.InsertRowOrColumn(false, false); break;
                case "IRA": error = this.designService.InsertRowOrColumn(true, true); break;
                case "IRB": error = this.designService.InsertRowOrColumn(false, true); break;
                case "DR": error = this.designService.DeleteRowOrColumn(true); break;
                case "DC": error = this.designService.DeleteRowOrColumn(false); break;
                case "MC": error = this.designService.MergeSelectedCells(); break;
                case "SC": error = this.designService.SplitSelectedCells(); break;
                default: break;
            }
            if (error) { this.$message.error(error) }
        },
        onDeleteSelection() {
            this.designService.DeleteSelection()
        },

        save() {
            console.log(JSON.stringify(this.designService.RootDesigner.Node, null, 2)) //TODO: for debug
            let node = this.target
            let args = [node.Type, node.ID, JSON.stringify(this.designService.RootDesigner.Node)]
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