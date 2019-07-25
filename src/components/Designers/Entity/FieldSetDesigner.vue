<template>
    <el-form label-position="right" size="mini" label-width="120px">
        <el-form-item prop="Name" label="Name">
            <el-input :disabled="true" v-model="Name"></el-input>
        </el-form-item>
        <el-form-item label="LocalizedName">
            <el-input v-model="LocalizedName"></el-input>
        </el-form-item>
        <el-form-item prop="DataType" :required="true" label="DataType">
            <el-select v-model="DataType" placeholder="请选择">
                <el-option v-for="item in DataFieldTypes" :key="item.value" :label="item.text" :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <!-- <el-form-item label="AllowNull">
            <el-checkbox v-model="AllowNull"></el-checkbox>
        </el-form-item> -->
    </el-form>
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
                $runtime.channel.invoke('sys.DesignService.ChangeEntityMember', [this.modelId, this.Name, name, value]).then(res => {
                    this.$emit('PropertyChanged', name, value)
                }).catch(err => {
                    _that.$message.error(err)
                })
            }
        }
    }
</script>