<template>
    <e-form :model="target" size="mini" label-position="right" label-width="120px">
        <e-form-item prop="Name" label="Name">
            <e-input :disabled="true" v-model="Name"></e-input>
        </e-form-item>
        <e-form-item label="LocalizedName">
            <e-input v-model="LocalizedName"></e-input>
        </e-form-item>
        <e-form-item label="RefModelIDs">
            <e-select :multiple="true" :disabled="true" v-model="RefModelIDs">
                <e-option v-for="item in RefModelIDs" :key="item" :label="item" :value="item">
                </e-option>
            </e-select>
        </e-form-item>
        <e-form-item label="Delete Action">
            <e-select :disabled="target.IsAggregationRef" v-model="DeleteRule">
                <e-option v-for="item in DeleteRules" :key="item.value" :label="item.text" :value="item.value">
                </e-option>
            </e-select>
        </e-form-item>
        <e-form-item label="AllowNull">
            <e-checkbox v-model="AllowNull"></e-checkbox>
        </e-form-item>
    </e-form>
</template>

<script>
    import DeleteRules from './EntityRefMemberDeleteRules'

    export default {
        data() {
            return {
                DeleteRules: DeleteRules,
                Name: this.target.Name,
                LocalizedName: this.target.LocalizedName,
                RefModelIDs: this.target.RefModelIDs,
                DeleteRule: this.target.DeleteRule,
                AllowNull: this.target.AllowNull
            }
        },
        watch: {
            target(value) {
                this.Name = value.Name
                this.LocalizedName = value.LocalizedName
                this.RefModelIDs = value.RefModelIDs
            },
            LocalizedName(val, oldVal) {
                this.propertyChanged('LocalizedName', val)
            },
            DeleteRule(val, oldVal) {
                this.propertyChanged('DeleteRule', val)
            },
            AllowNull(val, oldVal) {
                this.propertyChanged('AllowNull', val)
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
                this.$channel.invoke('sys.DesignService.ChangeEntityMember', [this.modelId, this.Name, name, value]).then(res => {
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