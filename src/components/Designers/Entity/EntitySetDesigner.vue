<template>
    <el-form :model="member" size="mini" label-position="right" label-width="120px">
        <el-form-item prop="Name" label="Name">
            <el-input :disabled="true" v-model="Name"></el-input>
        </el-form-item>
        <el-form-item label="Comment">
            <el-input v-model="Comment"></el-input>
        </el-form-item>
        <el-form-item label="RefModelID">
            <el-input v-model="RefModelID" :disabled="true"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>

export default {
    data() {
        return {
            Name: this.member.Name,
            Comment: this.member.Comment,
            RefModelID: this.member.RefModelID
        }
    },
    watch: {
        member(value) {
            this.Name = value.Name
            this.Comment = value.Comment
            this.RefModelID = value.RefModelID
        },
        Comment(val, oldVal) {
            this.propertyChanged('Comment', val)
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
            $runtime.channel.invoke('sys.DesignService.ChangeEntityMember', [this.owner.ID, this.Name, name, value]).then(res => {
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
