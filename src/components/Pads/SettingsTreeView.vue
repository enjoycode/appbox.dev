<template>
    <div class="ide-left-pane">
        <div class="ide-left-search-pane">
            <div class="ide-left-tree-title">Settings</div>
            <div class="ide-left-tree-search">
                <el-input v-model="filterText" suffix-icon="fas fa-search" size="small"></el-input>
            </div>
        </div>
        <div class="ide-left-tree-warp">
            <el-tree class="ide-left-tree" ref="toolBoxTree" :data="settings" node-key="Name" @node-click="onNodeClick"
                     :render-content="onRenderContent"
                     :props="treeOption" :filter-node-method="filterNode" highlight-current>
            </el-tree>
        </div>
        <!--编辑对话框-->
        <el-dialog :title="'Settings: ' + editorTitle" :visible.sync="editorVisible" width="800px">
            <!--TODO:根据类型动态编辑器，暂仅Json-->
            <code-editor ref="editor" v-bind="editorOptions"></code-editor>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="onSave">Save</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="tsx">
import Vue from 'vue';
import Component from 'vue-class-component';
import CodeEditor from '@/components/CodeEditor/CodeEditor.vue';
import DesignStore from '@/design/DesignStore';

@Component({
    components: {CodeEditor}
})
export default class SettingsTreeView extends Vue {
    editorVisible = false;
    editorOptions = {};
    editorTitle = '';

    filterText = '';
    settings = [
        {Name: 'VueWidgets', Icon: 'cog', Type: 'json'},
        {Name: 'TSExtraLib', Icon: 'cog', Type: 'ts'}
    ];
    currentSetting = null;

    treeHeight = 0;
    treeOption = {
        label: 'Name',
        children: 'Item'
    };

    onRenderContent(h, node) {
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
        this.currentSetting = data;
        this.editorTitle = data.Name;
        this.$set(this.editorOptions, 'fileName', data.Name + '.' + data.Type);
        //加载配置值
        $runtime.channel.invoke('sys.DesignService.GetAppSettings', [null, data.Name]).then(res => {
            if (data.Type == 'json') {
                this.$set(this.editorOptions, 'language', 'json');
                this.$set(this.editorOptions, 'code', JSON.stringify(res, null, 4));
            } else if (data.Type == 'ts') {
                this.$set(this.editorOptions, 'language', 'javascript');
                this.$set(this.editorOptions, 'code', res);
            }
            this.editorVisible = true;
        }).catch(err => this.$message.error('Can\'t load settings: ' + data.Name));
    }

    onSave() {
        let e: any = this.$refs.editor;
        let args = [null, this.currentSetting.Name, this.currentSetting.Type, e.getValue()];
        $runtime.channel.invoke('sys.DesignService.SaveAppSettings', args).then(() => {
            //激发设计时事件通知需要刷新的对象
            DesignStore.emitEvent('SettingsChanged', this.currentSetting.Name);
            this.$message.success('Save settings ok.');
        }).catch(err => this.$message.error('Save error: ' + err));
    }
}
</script>
