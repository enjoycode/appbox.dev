<template>
    <el-form label-position="right" size="mini" label-width="120px">
        <el-form-item prop="Name" label="Name">
            <el-input :disabled="true" v-model="Name"></el-input>
        </el-form-item>
        <el-form-item label="LocalizedName">
            <el-input v-model="LocalizedName"></el-input>
        </el-form-item>
        <el-form-item label="AllowNull">
            <el-checkbox v-model="AllowNull"></el-checkbox>
        </el-form-item>
    </el-form>
</template>

<script>

export default {
    data() {
        return {
            Name: this.target.Name,
            LocalizedName: this.target.LocalizedName,
            AllowNull: this.target.AllowNull
        }
    },
    props: {
        target: { type: Object, required: true }
    },
    computed: {
    },
    watch: {
        target(value) {
            this.Name = value.Name
            this.LocalizedName = value.LocalizedName
            this.AllowNull = value.AllowNull
        }
    },
    methods: {
    }
}
</script>
