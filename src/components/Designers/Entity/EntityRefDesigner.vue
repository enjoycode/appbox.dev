<template>
    <el-form :model="member" size="mini" label-position="right" label-width="120px">
        <el-form-item prop="Name" label="Name">
            <el-input :disabled="true" v-model="Name"></el-input>
        </el-form-item>
        <el-form-item label="Comment">
            <el-input v-model="Comment"></el-input>
        </el-form-item>
        <el-form-item label="RefModelIds">
            <el-select :multiple="true" :disabled="true" v-model="RefModelIds">
                <el-option v-for="item in RefModelIds" :key="item" :label="item" :value="item">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="Delete Action">
            <el-select :disabled="member.IsAggregationRef" v-model="DeleteRule">
                <el-option v-for="item in DeleteRules" :key="item.value" :label="item.text" :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="AllowNull">
            <el-checkbox v-model="AllowNull" disabled></el-checkbox>
        </el-form-item>
    </el-form>
</template>

<script>
    import DeleteRules from './EntityRefMemberDeleteRules'

    export default {
        data() {
            return {
                DeleteRules: DeleteRules,
                Name: this.member.Name,
                Comment: this.member.Comment,
                RefModelIds: this.member.RefModelIds,
                DeleteRule: this.member.DeleteRule,
                AllowNull: this.member.AllowNull
            }
        },
        watch: {
            member(value) {
                this.Name = value.Name
                this.Comment = value.Comment
                this.RefModelIDs = value.RefModelIDs
            },
            Comment(val, oldVal) {
                this.propertyChanged('Comment', val)
            },
            DeleteRule(val, oldVal) {
                this.propertyChanged('DeleteRule', val)
            },
            AllowNull(val, oldVal) {
                this.propertyChanged('AllowNull', val)
            }
        },
        props: {
            member: { type: Object, required: true }, // EntityMemberModel
            owner: { type: Object, required: true } // EntityModelNode
        },
        methods: {
            propertyChanged(name, value) {
                var _that = this
                // 传入服务更改
                let args = [this.owner.ID, this.Name, name, value]
                $runtime.channel.invoke('sys.DesignService.ChangeEntityMember', args).then(res => {
                    this.$emit('PropertyChanged', name, value)
                }).catch(err => {
                    _that.$message.error(err)
                })
            }
        }
    }
</script>