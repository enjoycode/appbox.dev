<template>
    <e-form :model="target" label-position="right" size="mini" label-width="120px">
        <e-form-item prop="Name" label="Name">
            <e-input :disabled="true" :value="target.Name"></e-input>
        </e-form-item>
        <e-form-item label="LocalizedName">
            <e-input v-model="target.LocalizedName" @change="onLocalizedNameChanged"></e-input>
        </e-form-item>
        <e-form-item prop="DataType" :required="true" label="DataType">
            <e-select v-model="target.DataType" @change="onDataTypeChanged" placeholder="请选择">
                <e-option v-for="item in DataFieldTypes" :key="item.value" :label="item.text" :value="item.value">
                </e-option>
            </e-select>
        </e-form-item>
        <e-form-item prop="EnumModelID" v-if="target.DataType === 8" :required="true" label="EnumModelID">
            <e-select v-model="target.EnumModelID" @change="onEnumModelIDChanged" placeholder="请选择">
                <e-option v-for="item in enums" :key="item.ID" :label="item.ID" :value="item.ID">
                </e-option>
            </e-select>
        </e-form-item>
        <e-form-item prop="Length" v-if="canEditLength" :required="true" label="Length">
            <e-input v-model="target.Length" @change="onLengthChanged"></e-input>
        </e-form-item>
        <e-form-item label="Scale" v-if="canEditScale">
            <e-input v-model="target.Scale" @change="onScaleChanged"></e-input>
        </e-form-item>
        <e-form-item label="AllowNull" v-if="canEditAllowNull">
            <e-checkbox v-model="target.AllowNull" @change="onAllowNullChanged"></e-checkbox>
        </e-form-item>
    </e-form>
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
            storeType: { type: String, required: true }, // Sql | Table
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
            canEditLength() {
                if (this.storeType !== 'Sql') {
                    return false
                }
                switch (this.target.DataType) {
                    case 1:// DateTime
                    case 4: // bool
                    case 5:// Guid
                    case 6:// Byte
                    case 8:// Enum
                        return false
                    default:
                        return true
                }
            },
            canEditScale() {
                if (this.storeType !== 'Sql') {
                    return false
                }
                switch (this.target.DataType) {
                    case 3:// Decimal
                    case 9:// Float
                    case 10:// Double
                        return true
                    default:
                        return false
                }
            },
            canEditAllowNull() {
                return this.storeType === 'Sql'
            }
        },
        methods: {
            loadEnums() {
                if (this.target.DataType === 8 && this.enums.length === 0) {
                    var _that = this
                    // todo:***** 改从设计树中获取所有枚举节点
                    this.$channel.invoke('sys.DesignHub.GetAllEnumModels', []).then(res => {
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
                this.$channel.invoke('sys.DesignHub.ChangeEntityMember', [this.modelId, this.target.Name, name, value]).catch(err => {
                    _that.$message.error(err)
                })
            }
        },
        mounted() {
            this.loadEnums()
        }
    }
</script>