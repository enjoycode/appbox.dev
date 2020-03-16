<template>
    <el-dialog class="dialog" width="800px" title="Service References" :visible.sync="visible" :close-on-click-modal="false" @close="onClose">
        <el-transfer filterable v-model="references" :data="source" :titles="['Available','Selected']">
        </el-transfer>
        <div slot="footer">
            <input ref="input" @change="onFileChange" :multiple="false" accept=".dll,.so,.dylib" style="width:0px; visibility: hidden;"
                type="file">
            <el-button type="primary" @click="onUpload">Upload Assembly</el-button>
            <el-button @click="visible = false">Cancel</el-button>
            <el-button type="primary" @click="onOkClick">OK</el-button>
        </div>
    </el-dialog>
</template>

<script>
import store from '@/design/DesignStore'
import axios from 'axios'

const sysDeps = [
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
                url: '/api/blob/sys.DesignService.Validate3rdLib/sys.DesignService.Upload3rdLib/' + this.targetNode.App,
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
            $runtime.channel.invoke('sys.DesignService.UpdateReferences', [this.targetNode.ID, this.references])
                .then(res => { _this.visible = false })
                .catch(err => {
                    _this.$message.error('Update reference error: ' + err)
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
        $runtime.channel.invoke('sys.DesignService.GetReferences', [this.targetNode.ID]).then(res => {
            if (res.AppDeps) {
                for (var i = 0; i < res.AppDeps.length; i++) {
                    var element = res.AppDeps[i]
                    _this.source.push({ key: element, label: element, ext: true }) // 加入ext表示外部组件
                }
            }
            if (res.ModelDeps) {
                for (i = 0; i < res.ModelDeps.length; i++) {
                    _this.references.push(res.ModelDeps[i])
                }
            }
        }).catch(err => {
            _this.$message.error('Load references error: ' + err)
        })
    }
}

</script>

<style scoped>
.dialog >>> .el-transfer-panel {
    width: 330px;
}
</style>