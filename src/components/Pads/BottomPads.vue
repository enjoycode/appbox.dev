<template>
    <div class="bottomPads">
        <el-tabs v-model="activeName">
            <el-tab-pane label="Errors" name="errors">
                <errors-view></errors-view>
            </el-tab-pane>
            <el-tab-pane label="Usages" name="usages">
                <usages-view></usages-view>
            </el-tab-pane>
            <el-tab-pane label="Output" name="output">
                <!-- <ex-terminal @socketStateChanged="onSocketStateChanged"></ex-terminal> -->
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import ErrorsView from './ErrorsView'
    import UsagesView from './UsagesView'

    export default {
        components: { ErrorsView: ErrorsView, UsagesView: UsagesView },
        data() {
            return {
                activeName: 'errors'
            }
        }
    }
</script>

<style scoped>
    .bottomPads {
        height: 100%;
    }

    .bottomPads>>>.el-tabs {
        height: 100%;
    }

    .bottomPads>>>.el-tabs__content {
        height: calc(100% - 40px);
    }

    .bottomPads>>>.el-tab-pane {
        height: 100%;
    }

    .bottomPads>>>.el-tabs__header {
        margin: 0;
    }
</style>
