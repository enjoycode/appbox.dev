<template>
    <e-form label-position="right" size="mini" label-width="120px">
        <e-form-item prop="Name" label="Name">
            <e-input :disabled="true" v-model="Name"></e-input>
        </e-form-item>
        <e-form-item label="LocalizedName">
            <e-input v-model="LocalizedName"></e-input>
        </e-form-item>
        <e-form-item prop="DataType" :required="true" label="DataType">
            <e-select v-model="DataType" placeholder="请选择">
                <e-option v-for="item in DataFieldTypes" :key="item.value" :label="item.text" :value="item.value">
                </e-option>
            </e-select>
        </e-form-item>
        <!-- <e-form-item label="AllowNull">
            <e-checkbox v-model="AllowNull"></e-checkbox>
        </e-form-item> -->
    </e-form>
</template>

<script>
    import DataFieldTypes from './DataFieldTypes'

    export default {
        data() {
            return {
                DataFieldTypes: DataFieldTypes,
                Name: this.target.Name,
                LocalizedName: this.target.LocalizedName,
                DataType: this.target.DataType
            }
        },
        props: {
            target: { type: Object, required: true },
            modelId: { type: String, required: true }
        },
        watch: {
            target(value) {
                this.Name = value.Name
                this.LocalizedName = value.LocalizedName
                this.DataType = value.DataType
            },
            LocalizedName(val, oldVal) {
                this.onPropertyChanged('LocalizedName', val)
            },
            DataType(val, oldVal) {
                this.onPropertyChanged('DataType', val)
            }
        },
        methods: {
            onPropertyChanged(name, value) {
                var _that = this
                // 传入服务更改
                this.$channel.invoke('sys.DesignService.ChangeEntityMember', [this.modelId, this.Name, name, value]).then(res => {
                    this.$emit('PropertyChanged', name, value)
                }).catch(err => {
                    _that.$message.error(err)
                })
            }
        }
    }
</script>