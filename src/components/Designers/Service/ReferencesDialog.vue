<template>
    <e-dialog class="dialog" width="800px" title="服务依赖管理" :visible.sync="visible" :close-on-click-modal="false" @close="onClose">
        <e-transfer filterable v-model="references" :data="source" :titles="['可选项','已选项']">
        </e-transfer>
        <div slot="footer">
            <input ref="input" @change="onFileChange" :multiple="false" accept=".dll,.so,.dylib" style="width:0px; visibility: hidden;"
                type="file"></input>
            <e-button type="primary" @click="onUpload">上传第三方组件</e-button>
            <e-button @click="visible = false">取 消</e-button>
            <e-button type="primary" @click="onOkClick">确 定</e-button>
        </div>
    </e-dialog>
</template>

<script>
    import store from '../../DesignStore'
    import axios from 'axios'

    const sysDeps = [
        'AppBox.Core',
        'AppBox.Drawing',
        'AppBox.Reporting',
        'Cassandra',
        'Newtonsoft.Json',
        'System',
        'System.Collections.NonGeneric',
        'System.Collections.Specialized',
        'System.ComponentModel',
        'System.ComponentModel.Primitives',
        'System.ComponentModel.TypeConverter',
        'System.IO',
        'System.Private.Xml',
        'System.Private.Xml.Linq',
        'System.Private.Uri',
        'System.Net.Primitives',
        'System.Net.Http',
        'System.Net.Requests',
        'System.Net.WebHeaderCollection',
        'System.ObjectModel',
        'System.Runtime.Extensions',
        'System.Runtime.InteropServices',
        'System.Security.Cryptography.Primitives',
        'System.Security.Cryptography.Algorithms',
        'System.Security.Cryptography.Csp',
        'System.Security.Cryptography.X509Certificates',
        'System.Threading.Timer',
        'System.Web',
        'System.Web.HttpUtility',
        'System.Xml.Linq',
        'System.Xml.ReaderWriter',
        'System.Xml.Serialization',
        'System.Xml.XmlSerializer'
    ]

    export default {
        data() {
            return {
                visible: true,
                source: [],
                references: [],
                targetNode: null
            }
        },
        methods: {
            onClose: function (e) {
                this.$emit('close')
            },
            onFileChange(ev) {
                const files = ev.target.files
                if (!files) return

                var formdata = new FormData()
                formdata.append('file', files[0])
                let _this = this
                axios({
                    url: '/api/blob/sys.DesignService.ValidateServiceDeps/sys.DesignService.UploadServiceDeps/' + this.targetNode.AppID,
                    method: 'post',
                    data: formdata,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).then(res => {
                    if (res.data) { // 返回true表示CLR组件
                        // todo:判断当前列表是否已存在，不存在则添加入列表内
                    }
                }).catch(err => {
                    _this.$message.error(err.response.data)
                })
            },
            onOkClick() {
                let _this = this
                this.$channel.invoke('sys.DesignService.UpdateReferences', [this.targetNode.ID, this.references]).catch(err => {
                    _this.$message.error('更新服务依赖失败: ' + err)
                })
            },
            onUpload() {
                this.$refs.input.value = null
                this.$refs.input.click()
            }
        },
        mounted() {
            for (var i = 0; i < sysDeps.length; i++) {
                this.source.push({ key: sysDeps[i], label: sysDeps[i] })
            }
            // 加载Application的依赖项
            let designer = store.designers.getActiveDesigner()
            this.targetNode = designer.target
            var _this = this
            this.$channel.invoke('sys.DesignService.GetReferences', [this.targetNode.ID]).then(res => {
                let d = JSON.parse(res)
                if (d.AppDeps) {
                    for (var i = 0; i < d.AppDeps.length; i++) {
                        var element = d.AppDeps[i]
                        _this.source.push({ key: element, label: element, ext: true }) // 加入ext表示外部组件
                    }
                }
                if (d.ModelDeps) {
                    for (i = 0; i < d.ModelDeps.length; i++) {
                        _this.references.push(d.ModelDeps[i])
                    }
                }
            }).catch(err => {
                _this.$message.error('加载服务依赖失败: ' + err)
            })
        }
    }

</script>

<style scoped>
    .dialog>>>.el-transfer-panel {
        width: 330px;
    }
</style>