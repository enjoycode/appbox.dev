<template>
    <el-table height="100%" :data="usages" size="small" class="viewpad" border empty-text=" ">
        <el-table-column prop="Type" label="Type" :width="100">
        </el-table-column>
        <el-table-column prop="Model" label="Model" :width="200">
        </el-table-column>
        <el-table-column prop="Location" label="Position">
        </el-table-column>
        <el-table-column fixed="right" label="Action" width="230">
            <template slot-scope="scope">
                <el-button @click.native.prevent="checkout(scope.$index, scope.row)" type="text" size="small">
                    Checkout
                </el-button>
                <el-button @click.native.prevent="jumpto(scope.$index, scope.row)" type="text" size="small">
                    Jumpto
                </el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    import DesignStore from '@/design/DesignStore'

    export default {
        data() {
            return {
                usages: []
            }
        },

        methods: {
            update(usages) {
                this.usages = usages
                this.$parent.$parent.$parent.activeName = 'usages' // 切换至当前视图
            },
            checkout(index, row) {
                // todo:
            },
            jumpto(index, row) {
                // todo:
            }
        },

        mounted() {
            DesignStore.usages = this
        }
    }
</script>

<style scoped>
    .viewpad {
        height: 100%;
    }
</style>