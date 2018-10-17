<template>
    <e-input :readonly="target.readonly" v-model.lazy="value"></e-input>
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
            },
            value(newValue) {
                if (!this.target.readonly) {
                    this.target.setter(newValue)
                }
            }
        },
        mounted() {
            this.value = this.target.getter()
        }
    }

</script>