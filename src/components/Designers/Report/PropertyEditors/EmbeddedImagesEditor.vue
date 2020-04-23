<template>
    <div>
        <el-button @click="openEditor" style="width:100%">...</el-button>
        <el-dialog :before-close="closingEditor" title="Report Embedded Images" :visible.sync="dlgVisible" width="600px">
            <div class="rows">
               <el-row :gutter="5">
                    <el-col :span="8" v-for="img in images" :key="img.Name">
                        <el-card :body-style="{ padding: '0px' }">
                            <el-image style="height: 120px" :src="img.ImageData" fit="contain">
                            </el-image>
                            <div style="padding: 14px;">
                                <el-input v-model="img.Name"></el-input>
                                <el-button @click="onDel(img)" type="text">Remove</el-button>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <input ref="input" @change="onFileChange" :multiple="false" accept=".png,.jpg,.webp" 
                    style="width:0px; visibility: hidden;" type="file">
                <el-button type="primary" @click="onAdd">Add</el-button>
                <el-button type="primary" @click="dlgVisible = false">Done</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import PropertyPanel from "@/components/Canvas/PropertyPanel"
import store from '@/design/DesignStore'

export default {
    components: { PropertyPanel: PropertyPanel },
    props: { target: { type: Object } },
    data() {
        return {
            value: null, // ReportRootDesigner
            dlgVisible: false,
            images: []
        }
    },
    watch: {
        target(newTarget) {
            this.value = newTarget.getter()
        }
    },
    methods: {
        openEditor() {
            this.dlgVisible = true
            this.$set(this, 'images', this.value.EmbeddedImages.Items)
        },
        closingEditor(done) {
            // TODO:验证名称惟一性
            done()
        },
        onAdd() {
            this.$refs.input.value = null
            this.$refs.input.click()
        },
        onFileChange(ev) {
            let tgt = ev.target || window.event.srcElement
            let files = tgt.files;

            if (FileReader && files && files.length) {
                let fileName = files[0].name.split('.').slice(0, -1).join('.') // 不需要扩展名
                var fr = new FileReader();
                let _this = this;
                fr.onload = () => {
                    _this.value.EmbeddedImages.Add(fileName, fr.result);
                }
                fr.readAsDataURL(files[0]);
            } else {
                this.$message.warning("Can't read image file.")
            }
        },
        onDel(img) {
            this.value.EmbeddedImages.Remove(img)
        }
    },
    mounted() {
        this.value = this.target.getter()
    }
}
</script>

<style scoped>
.rows {
    border: none;
}
.rows >>> .el-col {
    border: none;
}
</style>