<template>
    <el-form :model="target" label-position="right" size="mini" label-width="120px">
        <el-form-item prop="Name" label="Name">
            <el-input :disabled="true" :value="target.Name"></el-input>
        </el-form-item>
        <el-form-item label="LocalizedName">
            <el-input v-model="target.LocalizedName" @change="onLocalizedNameChanged"></el-input>
        </el-form-item>
        <el-form-item prop="DataType" :required="true" label="DataType">
            <el-select v-model="target.DataType" @change="onDataTypeChanged" :disabled="true">
                <el-option v-for="item in DataFieldTypes" :key="item.value" :label="item.text" :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="EnumModelID" v-if="target.DataType === 8" :required="true" label="EnumModelID">
            <el-select v-model="target.EnumModelID" @change="onEnumModelIDChanged" placeholder="请选择">
                <el-option v-for="item in enums" :key="item.ID" :label="item.ID" :value="item.ID">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="AllowNull" v-if="canEditAllowNull">
            <el-checkbox v-model="target.AllowNull" @change="onAllowNullChanged"></el-checkbox>
        </el-form-item>
    </el-form>
</template>

<script>
    import DataFieldTypes from './DataFieldTypes'

    export default {
        data() {
            return {
                DataFieldTypes: DataFieldTypes,
                enums: [],
                suspendChanges: false // 防止重用设计器实例激发不必要的改变事件
            }
        },
        props: {
            target: { type: Object, required: true }, // EntityMemberModel
            modelId: { type: String, required: true }
        },
        watch: {
            target(val, oldVal) {
                this.suspendChanges = true
                let _this = this
                this.$nextTick(() => {
                    _this.suspendChanges = false
                })
            }
        },
        computed: {
            canEditAllowNull() {
                return false // this.storeType === 'Sql'
            }
        },
        methods: {
            loadEnums() {
                if (this.target.DataType === 8 && this.enums.length === 0) {
                    var _that = this
                    // todo:***** 改从设计树中获取所有枚举节点
                    $runtime.channel.invoke('sys.DesignService.GetAllEnumModels', []).then(res => {
                        _that.enums = res
                    }).catch(() => {
                        _that.$message.error('加载所有枚举模型失败')
                    })
                }
            },
            onLocalizedNameChanged(e) {
                this.propertyChanged('LocalizedName', this.target.LocalizedName)
            },
            onDataTypeChanged(e) {
                this.loadEnums()
                this.propertyChanged('DataType', this.target.DataType)
            },
            onEnumModelIDChanged(e) {
                this.propertyChanged('EnumModelID', this.target.EnumModelID)
            },
            onLengthChanged(e) {
                this.propertyChanged('Length', this.target.Length)
            },
            onScaleChanged(e) {
                this.propertyChanged('Scale', this.target.Scale)
            },
            onAllowNullChanged(e) {
                this.propertyChanged('AllowNull', this.target.AllowNull)
            },
            propertyChanged(name, value) {
                if (this.suspendChanges) {
                    return
                }
                var _that = this
                // 传入服务更改
                $runtime.channel.invoke('sys.DesignService.ChangeEntityMember', [this.modelId, this.target.Name, name, value]).catch(err => {
                    _that.$message.error(err)
                })
            }
        },
        mounted() {
            this.loadEnums()
        }
    }
</script>