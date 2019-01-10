<template>
    <e-table height="100%" :data="errors" size="small" class="errorpad" border empty-text=" ">
        <e-table-column prop="Model" label="Model" :width="200">
        </e-table-column>
        <e-table-column prop="Location" label="Position" :width="200">
        </e-table-column>
        <e-table-column prop="Info" label="Info">
        </e-table-column>
    </e-table>
</template>

<script>
    import DesignStore from '../../DesignStore'

    export default {
        data() {
            return {
                errors: []
            }
        },

        methods: {
            update(modelId, errs) {
                this.clear(modelId) // 先移除所有旧的

                for (var i = 0; i < errs.length; i++) {
                    this.errors.push(errs[i])
                }
            },
            clear(modelId) {
                for (var i = this.errors.length - 1; i >= 0; i--) {
                    var element = this.errors[i]
                    if (element.Model === modelId) {
                        this.errors.splice(i, 1)
                    }
                }
            }
        },

        mounted() {
            DesignStore.errors = this
        }
    }
</script>

<style scoped>
    .errorpad {
        height: 100%;
    }
</style>