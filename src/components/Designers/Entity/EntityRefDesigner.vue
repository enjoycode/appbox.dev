<template>
    <el-form :model="target" size="mini" label-position="right" label-width="120px">
        <el-form-item prop="Name" label="Name">
            <el-input :disabled="true" v-model="Name"></el-input>
        </el-form-item>
        <el-form-item label="LocalizedName">
            <el-input v-model="LocalizedName"></el-input>
        </el-form-item>
        <el-form-item label="RefModelIDs">
            <el-select :multiple="true" :disabled="true" v-model="RefModelIDs">
                <el-option v-for="item in RefModelIDs" :key="item" :label="item" :value="item">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="Delete Action">
            <el-select :disabled="target.IsAggregationRef" v-model="DeleteRule">
                <el-option v-for="item in DeleteRules" :key="item.value" :label="item.text" :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="AllowNull">
            <el-checkbox v-model="AllowNull"></el-checkbox>
        </el-form-item>
    </el-form>
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
                $runtime.channel.invoke('sys.DesignService.ChangeEntityMember', [this.modelId, this.Name, name, value]).then(res => {
                    this.$emit('PropertyChanged', name, value)
                }).catch(err => {
                    _that.$message.error(err)
                })
            }
        }
    }
</script>