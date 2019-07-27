<template>
    <div style="height:500px">
        <splitter :size="400">
            <el-card slot="panel1" style="width:350px; margin: 10px;">
                <p slot="title">
                    <el-icon type="ios-refresh"></el-icon> Api调用测试 </p>
                <p>Service:</p>
                <el-input v-model="service" placeholder="eg:sys.AdminService.TestMethod"></el-input>
                <p>Arguments:</p>
                <el-input v-model="args" type="textarea" placeholder='eg:["Arg1","Arg2"]'></el-input>
                <br>
                <br>
                <el-button ref="btInvoke" type="primary" icon="ios-search" :loading="loading" @click="onClick">Invoke</el-button>
                <el-button ref="btInvoke" type="primary" icon="ios-search" :loading="loading" @click="onConnection">Connection</el-button>
                <p>Result:</p>
                <el-input v-model="result" type="textarea" placeholder='调用结果'></el-input>
            </el-card>
            <div slot="panel2" style="height:100%;">
            </div>
        </splitter>
    </div>
</template>

<script>
    import DesignView from '../Canvas/DesignView'
    import TestShape from './TestShape'
    import TestConDesigner from './TestConDesigner'
    import Splitter from '../../easeui/Splitter/Splitter'
    import TextBoxCell from '../../easeui/TableCells/TextBoxCell'

    export default {
        components: {
            DesignView: DesignView,
            Splitter: Splitter,
            TextboxCell: TextBoxCell
        },

        data() {
            return {
                loading: false,
                service: 'sys.AdminService.TestMethod',
                args: '["Rick","12345678-1234-1234-1234-123456789012"]',
                result: '',
                sales: [],
                chartData: {
                    columns: ['日期', '销售额'],
                    rows: []
                }
            }
        },

        methods: {
            onClick() {
                // this.testAdd()

                var _this = this
                // console.log(_this.$refs.btInvoke.type)
                _this.loading = true
                var _args = JSON.parse(this.args) // var _args = common.fromRefJson(this.args) //将Json字串转换为对象
                $runtime.channel.invoke(this.service, _args).then(res => {
                    _this.loading = false
                    _this.result = JSON.stringify(res) // _this.result = common.toRefJson(res, true)
                }).catch(err => {
                    _this.loading = false
                    _this.$message.error('调用失败: ' + err)
                })
            },
            onConnection() {
                this.testConnection()
            },
            testAdd() {
                var shape = new TestShape()
                this.$refs.designView.designSurface.AddItem(shape)
                this.$refs.designView.designSurface.Invalidate()
            },
            testConnection() {
                var connection = new TestConDesigner()
                connection.CreateConnectionDesigner()
                this.$refs.designView.designSurface.AddItem(connection.Conn1)
                this.$refs.designView.designSurface.AddItem(connection.Conn2)
                this.$refs.designView.designSurface.Invalidate()
            }
        }
    }
</script>