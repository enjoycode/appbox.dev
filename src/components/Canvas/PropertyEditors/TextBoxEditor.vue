<template>
    <el-input :readonly="target.readonly" v-model="value" @change="onChange"></el-input>
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
        }
    },
    mounted() {
        this.value = this.target.getter()
    }
}
</script>