<template>
    <div style="height:100%; width:100%">
        <design-view ref="designView" background="lightgray"></design-view>
    </div>
</template>

<script>
import DesignView from '../../Canvas/DesignView'
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
        save() {
            let node = this.target
            let _this = this
            $runtime.channel.invoke('sys.DesignService.SaveModel', [node.Type, node.ID]).then(res => {
                _this.$message.success('保存成功')
            }).catch(err => {
                _this.$message.error('保存失败: ' + err)
            })
        },
        MergeCells() {
           this.designService.TableOperation('MergeCells')
        },
        SplitCells() {
            this.designService.TableOperation('SplitCells')
        },
        InsertRow() {
            this.designService.TableOperation('InsertRow')
        },
        InsertColumn() {
            this.designService.TableOperation('InsertColumn')
        }
    },
    mounted() {
        // 开始加载RootDesigner
        var _this = this
        // 先初始化DesignSurface.DesignService实例
        this.$nextTick(() => {
            this.designService = new ReportDesignService(this.$refs.designView.designSurface, $runtime.channel, this.target.ID)
            $runtime.channel.invoke('sys.DesignService.OpenReportModel', [this.target.ID]).then(res => {
                // 开始转换服务端返回的报表项
                this.designService.LoadDesignersFromServer(res)
            }).catch(err => {
                _this.$message.error(err.toString())
            })
        })
    }
}

</script>