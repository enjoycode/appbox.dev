<template>
    <el-dialog class="dialog" width="800px" title="Service References" :visible.sync="visible"
               :close-on-click-modal="false" @close="onClose">
        <el-transfer filterable v-model="references" :data="source" :titles="['Available','Selected']">
        </el-transfer>
        <div slot="footer">
            <input ref="input" @change="onFileChange" :multiple="false" :accept="uploadExts"
                   style="width:0; visibility: hidden;" type="file">
            <el-button type="primary" @click="onUpload">Upload Assembly</el-button>
            <el-button @click="visible = false">Cancel</el-button>
            <el-button type="primary" @click="onOkClick">OK</el-button>
        </div>
    </el-dialog>
</template>

<script>
import store from '@/design/DesignStore'
import axios from 'axios'

export default {
    data() {
        return {
            visible: true,
            source: [],
            references: [],
            targetNode: null
        }
    },
    computed: {
        /** 允许上传的第三方依赖文件的扩展名 */
        uploadExts: function () {
            return this.targetNode == null || this.targetNode.Language === 1 ? ".jar" : ".dll,.so"
        }
    },
    methods: {
        onClose: function (e) {
            this.$emit('close')
        },
        onFileChange(ev) {
            const files = ev.target.files
            if (!files) return
            let fileName = files[0].name
            let _this = this
            axios({
                url: '/upload?v=sys.DesignService.Validate3rdLib&p=sys.DesignService.Upload3rdLib&a='
                    + this.targetNode.App + '/' + fileName,
                method: 'post',
                data: files[0],
                //headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(res => {
                if (res.data) { // 返回true表示CLR组件
                    // 判断当前列表是否已存在，不存在则添加入列表内
                    if (_this.source.findIndex(t => t.key == fileName) < 0) {
                        _this.source.push({key: fileName, label: fileName, ext: true}) // 加入ext表示外部组件
                    }
                }
            }).catch(err => {
                _this.$message.error(err.response.data)
            })
        },
        onOkClick() {
            let _this = this
            $runtime.channel.invoke('sys.DesignService.UpdateReferences', [this.targetNode.ID, this.references])
                .then(res => {
                    _this.visible = false
                })
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
        // 加载Application的依赖项
        let designer = store.designers.getActiveDesigner()
        this.targetNode = designer.target
        const _this = this;
        $runtime.channel.invoke('sys.DesignService.GetReferences', [this.targetNode.ID]).then(res => {
            if (res.AppDeps) {
                for (let i = 0; i < res.AppDeps.length; i++) {
                    const element = res.AppDeps[i];
                    _this.source.push({key: element, label: element, ext: true}) // 加入ext表示外部组件
                }
            }
            if (res.ModelDeps) {
                for (let i = 0; i < res.ModelDeps.length; i++) {
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
