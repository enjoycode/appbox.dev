<template>
    <div style="height:500px;margin:20px">
        <el-button @click="onAdd">Add</el-button>
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

@Component({
    components: { /*DesignView: DesignView*/ ReportDesigner: ReportDesigner }
})
export default class TestView extends Vue {
    private target = { ID: 123456 }

    // onConnection() {
    //     this.testConnection()
    // }
    // public get designView(): any /*DesignView*/ {
    //     return this.$refs.designView
    // }
    onAdd() {
        // var shape = new TestShape()
        // this.designView.designSurface.AddItem(shape)
        // this.designView.designSurface.Invalidate()
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

    loadXMLDoc(dname) {
        try //Internet Explorer
        {
            var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        }
        catch (e) {
            try //Firefox, Mozilla, Opera, etc.
            {
                xmlDoc = document.implementation.createDocument("", "", null);
            }
            catch (e) { alert(e.message) }
        }
        try {
            xmlDoc.async = false;
            xmlDoc.load(dname);
            return (xmlDoc);
        }
        catch (e) { alert(e.message) }
        return (null);
    }

    loadXMLString(txt): XMLDocument {
        try //Internet Explorer
        {
            var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(txt);
            return (xmlDoc);
        }
        catch (e) {
            try //Firefox, Mozilla, Opera, etc.
            {
                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(txt, "text/xml");
                return (xmlDoc);
            }
            catch (e) { alert(e.message) }
        }
        return (null);
    }

    mounted() {
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
    margin-bottom: 10px;
}
</style>