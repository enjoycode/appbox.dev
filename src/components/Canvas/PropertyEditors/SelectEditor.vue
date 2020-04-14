<template>
    <el-select :readonly="target.readonly" v-model="value" @change="onChange">
        <el-option v-for="item in target.options" :key="item" :value="item"></el-option>
    </el-select>
</template>

<script>
export default {
    props: {
        target: { type: Object }
    },
    data() {
        return {
            value: ''
        }
    },
    watch: {
        target(newTarget) {
            this.value = newTarget.getter()
        }
    },
    methods: {
        onChange() {
            if (!this.target.readonly) {
                this.target.setter(this.value)
            }
        },
        refresh() {
            this.$set(this, 'value', this.target.getter())
        }
    },
    mounted() {
        this.value = this.target.getter()
    }
}
</script>