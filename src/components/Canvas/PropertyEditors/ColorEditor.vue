<template>
    <el-color-picker :readonly="target.readonly" v-model="value" @change="onChange"></el-color-picker>
</template>

<script>
export default {
    props: {
        target: { type: Object }
    },
    data() {
        return {
            value: "#000000"
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