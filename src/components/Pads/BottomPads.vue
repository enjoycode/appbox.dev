<template>
    <div class="bottomPads">
        <e-tabs v-model="activeName">
            <e-tab-pane label="Problems" name="errors">
                <errors-view></errors-view>
            </e-tab-pane>
            <e-tab-pane label="References" name="usages">
                <usages-view></usages-view>
            </e-tab-pane>
            <e-tab-pane label="Output" name="output">
                <!-- <e-terminal @socketStateChanged="onSocketStateChanged"></e-terminal> -->
            </e-tab-pane>
        </e-tabs>
    </div>
</template>

<script>
    import ErrorsView from './ErrorsView/ErrorsView'
    import UsagesView from './UsagesView/UsagesView'

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
        margin: 0px;
    }
</style>