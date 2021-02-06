<template>
    <div class="pane">
        <div calss="search-pane">
            <div class="pane-title">Variables</div>
            <div class="search-input">
                <el-input v-model="keyword" size="small" suffix-icon="fas fa-search"></el-input>
            </div>
        </div>
        <div class="list-pane">
            <el-table :data="variables" border size="mini" empty-text="no variables">
                <el-table-column prop="name" label="Name"></el-table-column>
                <el-table-column prop="value" label="Value"></el-table-column>
                <el-table-column prop="type" label="Type"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script lang="tsx">
import Vue from 'vue';
import DebugService from '@/components/Designers/Service/DebugService';

export default Vue.extend({
    name: 'DebugView',
    data() {
        return {
            keyword: '', //搜索关键词
            variables: DebugService.variables
        };
    }
});
</script>

<style scoped>
.pane {
    background-color: #f3f3f3;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}

.search-pane {
    height: 94px;
}

.list-pane {
    overflow: auto;
    height: calc(100% - 94px);
    padding: 0 10px 0px 10px;
}

.pane-title {
    height: 34px;
    padding-left: 18px;
    line-height: 34px;
    background-color: #f3f3f3;
    color: #838383;
    font-size: 10px;
}

.search-input {
    padding: 15px;
}
</style>
