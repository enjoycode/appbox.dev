<template>
    <div class="ide-left-pane">
        <div class="ide-left-search-pane">
            <div class="ide-left-tree-title">Settings</div>
            <div class="ide-left-tree-search">
                <el-input v-model="filterText" suffix-icon="fas fa-search" size="small"></el-input>
            </div>
        </div>
        <div class="ide-left-tree-warp">
            <el-tree class="ide-left-tree" ref="toolBoxTree" :data="node" node-key="Name" @node-click="onNodeClick"
                     :render-content="onRenderContent"
                     :props="treeOption" :filter-node-method="filterNode" highlight-current>
            </el-tree>
        </div>
    </div>
</template>

<script lang="tsx">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class SettingsTreeView extends Vue {
    filterText = '';
    node = [{
        Name: 'VueWidgets',
        Icon: 'cog',
        Type: 'Json'
    }];
    treeHeight = 0;
    treeOption = {
        label: 'Name',
        children: 'Item'
    };

    onRenderContent(h, node) {
        // return h('span', {staticClass: 'el-tree-node__label'}, node.data.Text)
        const iconClass = 'fa fa-' + node.data.Icon;
        return (<span class="el-tree-node__label"><i class={iconClass}></i> {node.data.Name}</span>);
    }

    filterNode(value, data) {
        if (!value) {
            return true;
        }
        return data.Name.indexOf(value) !== -1;
    }

    onNodeClick(data, node) {
        console.log(data, node);
    }
}
</script>
