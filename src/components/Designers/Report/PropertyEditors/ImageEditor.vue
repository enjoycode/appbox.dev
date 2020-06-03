<template>
    <div>
        <el-button @click="onAdd" style="width:100%">...</el-button>
        <input ref="input" @change="onFileChange" :multiple="false" accept=".png,.jpg,.webp" 
            style="width:0px; visibility: hidden;" type="file">
    </div>
</template>

<script>
import PropertyPanel from "@/components/Canvas/PropertyPanel"
import store from '@/design/DesignStore'

export default {
    components: { PropertyPanel: PropertyPanel },
    props: { target: { type: Object } },
    data() {
        return {}
    },
    methods: {
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
                    this.target.setter(fr.result)
                }
                fr.readAsDataURL(files[0])
            } else {
                this.$message.warning("Can't read image file.")
            }
        }
    }
}
</script>