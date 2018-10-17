<template>
    <e-table height="100%" :data="usages" size="small" class="viewpad" border>
        <e-table-column prop="Type" label="Type" :width="100">
        </e-table-column>
        <e-table-column prop="Model" label="Model" :width="200">
        </e-table-column>
        <e-table-column prop="Location" label="Position">
        </e-table-column>
        <e-table-column fixed="right" label="Action" width="230">
            <template slot-scope="scope">
                <e-button @click.native.prevent="checkout(scope.$index, scope.row)" type="text" size="small">
                    Checkout
                </e-button>
                <e-button @click.native.prevent="jumpto(scope.$index, scope.row)" type="text" size="small">
                    Jumpto
                </e-button>
            </template>
        </e-table-column>
    </e-table>
</template>

<script>
    import DesignStore from '../../DesignStore'

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