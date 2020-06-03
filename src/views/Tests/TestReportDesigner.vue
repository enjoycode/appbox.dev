<template>
    <div style="height:500px;margin:20px">
        <el-button @click="onAdd('textbox')">Add Textbox</el-button>
        <el-button @click="onAdd('table')">Add Table</el-button>
        <el-button @click="onAddCol">Add Column</el-button>
        <el-button @click="onDel">Remove</el-button>
        <el-button @click="onSave">Save</el-button>
        <br/><br/>
        <!-- <design-view ref="designView" background="lightgray"></design-view> -->
        <report-designer ref="designer" :target="target"></report-designer>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import DesignView from '@/components/Canvas/DesignView.vue'
import TestShape from './TestShape'
import TestConDesigner from './TestConDesigner'
import ReportDesigner from "@/components/Designers/Report/ReportDesigner.vue";
import ItemDesigner from "@/components/Canvas/Designers/ItemDesigner";
import TextBoxDesigner from "@/components/Designers/Report/Designers/TextBoxDesigner";
// import TableDesigner from "@/components/Designers/Report/Designers/TableDesigner";
import { IDesignToolbox, IDesignToolboxItem } from "@/components/Canvas/Services/ToolboxService";
import DesignSurface from '@/components/Canvas/DesignSurface';
// import ReportXmlNodeDesigner from '@/components/Designers/Report/Designers/ReportXmlNodeDesigner';
import RSizeUtil from '@/components/Designers/Report/Designers/RSizeUtil';
import ReportItemDesigner from '@/components/Designers/Report/Designers/ReportItemDesigner';
import ReportObjectDesigner from '@/components/Designers/Report/Designers/ReportObjectDesigner';

@Component({
    components: { /*DesignView: DesignView*/ ReportDesigner: ReportDesigner }
})
export default class TestView extends Vue {
    private target = { ID: 0 };
    private toolbox = new MockToolbox();

    // onConnection() {
    //     this.testConnection()
    // }
    // public get designView(): any /*DesignView*/ {
    //     return this.$refs.designView
    // }

    onAdd(type) {
        (<any>this.$refs.designer).$refs.designView.designSurface.ToolboxService.Toolbox = this.toolbox;
        if (type === 'textbox') {
            console.log("Begin Create Report Textbox")
            this.toolbox.SelectedItem = new ReportToolboxItem<TextBoxDesigner>(TextBoxDesigner);
        } else if (type === 'table') {
            console.log("Begin Create Report Table")
            // this.toolbox.SelectedItem = new ReportToolboxItem<TableDesigner>(TableDesigner);
        }

        // var shape = new TestShape()
        // this.designView.designSurface.AddItem(shape)
        // this.designView.designSurface.Invalidate()
    }

    onDel() {
        (<any>this.$refs.designer).designService.DeleteSelection();
    }

    onAddCol() {
        (<any>this.$refs.designer).designService.InsertColumn(false);
    }

    onSave() {
        (<any>this.$refs.designer).save();
    }

    // testConnection() {
    //     var connection = new TestConDesigner()
    //     connection.CreateConnectionDesigner()
    //     this.designView.designSurface.AddItem(connection.Conn1)
    //     this.designView.designSurface.AddItem(connection.Conn2)
    //     this.designView.designSurface.Invalidate()
    // }
    
}

/** 测试用工具箱 */
class MockToolbox implements IDesignToolbox {
    private item: IDesignToolboxItem | null;

    public get SelectedItem(): IDesignToolboxItem | null {
        return this.item;
    }
    public set SelectedItem(value) {
        this.item = value;
    }
}

class ReportToolboxItem<T extends ReportItemDesigner> implements IDesignToolboxItem {
    public get IsConnection(): boolean { return false; }
    private readonly factory: (node: any) => T;
    private readonly type: string;

    constructor(ctor: { new(node: any): T }) {
        this.factory = (n) => new ctor(n);

        let funcNameRegex = /function (.{1,})\(/;
        let results = (funcNameRegex).exec(ctor.toString());
        let name = (results && results.length > 1) ? results[1] : "";
        this.type = name.slice(0, name.length - 8 /* xxxDesigner */);
    }

    public Create(parent: DesignSurface | ItemDesigner): ItemDesigner {
        //parent不可能是DesignSurface
        let p = parent as ReportObjectDesigner;
        let ro = {$T: this.type};
        return this.factory(ro);
    }
}
</script>

<style>
.ide-property-panel {
    background-color: #f3f3f3;
    overflow-y: auto;
    height: 100%;
    width: 100%;
}

.ide-property-panel > .ide-property-collapse {
    min-width: 300px;
    border: none;
    border-top: 1px solid #dfe6ec;
}

.ide-property-panel .el-row > .el-col {
    border: 1px solid #dee6ec;
    background-color: #fff;
}

.ide-property-panel .el-collapse-item__header {
    background-color: #f3f3f3;
    border-bottom: none;
    height: 30px;
    line-height: 30px;
    font-weight: bold;
}

.ide-property-panel .el-collapse-item__wrap {
    border-bottom: none;
    background-color: #f3f3f3;
}

.ide-property-panel .el-collapse-item__content {
    padding: 0 15px;
}

.ide-property-panel .el-form > .el-form-item > .el-form-item__label {
    font-size: 12px;
}

.ide-property-panel .el-form > .el-form-item {
    margin-bottom: 5px; /* 属性间间隔 */
}
</style>