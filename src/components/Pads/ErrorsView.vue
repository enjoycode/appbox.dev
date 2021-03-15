<template>
    <el-table height="100%" :data="errors" size="mini" class="errorpad" border empty-text=" ">
        <el-table-column prop="Model" label="Model" :width="200">
        </el-table-column>
        <el-table-column prop="Location" label="Position" :width="200">
        </el-table-column>
        <el-table-column prop="Info" label="Info">
        </el-table-column>
    </el-table>
</template>

<script>
    import DesignStore from '@/design/DesignStore'

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