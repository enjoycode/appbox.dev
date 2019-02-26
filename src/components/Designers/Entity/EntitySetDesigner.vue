<template>
    <e-form :model="target" size="mini" label-position="right" label-width="120px">
        <e-form-item prop="Name" label="Name">
            <e-input :disabled="true" v-model="Name"></e-input>
        </e-form-item>
        <e-form-item label="LocalizedName">
            <e-input v-model="LocalizedName"></e-input>
        </e-form-item>
        <e-form-item label="RefModelID">
            <e-input v-model="RefModelID" :disabled="true"></e-input>
        </e-form-item>
    </e-form>
</template>

<script>

export default {
    data() {
        return {
            Name: this.target.Name,
            LocalizedName: this.target.LocalizedName,
            RefModelID: this.target.RefModelID
        }
    },
    watch: {
        target(value) {
            this.Name = value.Name
            this.LocalizedName = value.LocalizedName
            this.RefModelID = value.RefModelID
        },
        LocalizedName(val, oldVal) {
            this.propertyChanged('LocalizedName', val)
        }
    },
    props: {
        target: { type: Object, required: true },
        modelId: { type: String, required: true }
    },
    methods: {
        propertyChanged(name, value) {
            var _that = this
            // 传入服务更改
            $runtime.channel.invoke('sys.DesignService.ChangeEntityMember', [this.modelId, this.Name, name, value]).then(res => {
                this.$emit('PropertyChanged', name, value)
            }).catch(err => {
                _that.$message.error(err)
            })
        }
    },
    mounted: function () {
    }
}
</script>
