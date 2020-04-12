<template>
    <el-checkbox :readonly="target.readonly" v-model="value" @change="onChange"></el-checkbox>
</template>

<script>
export default {
    props: {
        target: { type: Object }
    },
    data() {
        return {
            value: false
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