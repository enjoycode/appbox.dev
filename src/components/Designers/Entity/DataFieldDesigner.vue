<template>
    <el-form :model="member" label-position="right" size="mini" label-width="120px">
        <el-form-item prop="Name" label="Name">
            <el-input :disabled="true" :value="member.Name"></el-input>
        </el-form-item>
        <el-form-item label="Comment">
            <el-input v-model="member.Comment" @change="changeProp('Comment')"></el-input>
        </el-form-item>
        <el-form-item prop="DataType" :required="true" label="DataType">
            <el-select v-model="member.DataType" @change="changeProp('DataType')" :disabled="!canEditType">
                <el-option v-for="item in DataFieldTypes" :key="item.value" :label="item.text" :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="EnumModelId" v-if="member.DataType===14" :required="true" label="EnumModelId">
            <el-select v-model="member.EnumModelId" @change="changeProp('EnumModelId')" placeholder="Enums">
                <el-option v-for="item in enums" :key="item.ID" :label="item.Name" :value="item.ID">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="Length" v-if="canEditLength" :required="true" label="Length">
            <el-input v-model="member.Length" @change="changeProp('Length')"></el-input>
        </el-form-item>
        <el-form-item label="Scale" v-if="canEditDecimals">
            <el-input v-model="member.Decimals" @change="changeProp('Decimals')"></el-input>
        </el-form-item>
        <el-form-item label="AllowNull" v-if="canEditAllowNull">
            <el-checkbox v-model="member.AllowNull" @change="changeProp('AllowNull')"></el-checkbox>
        </el-form-item>
    </el-form>
</template>

<script>
import DataFieldTypes from './DataFieldTypes'
import store from '@/design/DesignStore'
import DesignNodeType from '@/design/DesignNodeType'
import ModelType from '@/design/ModelType'

export default {
    data() {
        return {
            DataFieldTypes: DataFieldTypes,
            enums: [],
            suspendChanges: false // 防止重用设计器实例激发不必要的改变事件
        }
    },
    props: {
        member: { type: Object, required: true }, // EntityMemberModel
        owner: { type: Object, required: true }   // EntityModelNode
    },
    watch: {
        member(val, oldVal) {
            this.suspendChanges = true
            let _this = this
            this.$nextTick(() => {
                _this.suspendChanges = false
            })
        }
    },
    computed: {
        canEditType() {
            return this.owner.StoreId && this.owner.StoreId != 0
                && this.member.DataType != 1
        },
        canEditLength() {
            return this.owner.StoreId && this.owner.StoreId != 0
                && (this.member.DataType == 1 || this.member.DataType == 9) //String or Decimal
        },
        canEditDecimals() {
            return this.owner.StoreId && this.owner.StoreId != 0
                && this.member.DataType == 9
        },
        canEditAllowNull() {
            return this.owner.StoreId && this.owner.StoreId != 0
        }
    },
    methods: {
        loadEnums() {
            this.enums = store.tree.getAllModelNodes(DesignNodeType.EnumModelNode, ModelType.Enum)
        },
        changeProp(name) {
            if (this.suspendChanges) {
                return
            }
			var _that = this
			// 传入服务更改
            let args = [this.owner.ID, this.member.Name, name, this.member[name] + '']
            $runtime.channel.invoke('sys.DesignService.ChangeEntityMember', args).catch(err => {
                _that.$message.error(err)
            })
        }
    },
    mounted() {
        this.loadEnums()
    }
}
</script>