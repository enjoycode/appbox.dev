<template>
    <div style="height:500px;margin:20px">
        <el-button @click="onAdd">Add</el-button>
        <br/><br/>
        <design-view ref="designView" background="lightgray"></design-view>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import DesignView from '@/components/Canvas/DesignView.vue'
import TestShape from './TestShape'
import TestConDesigner from './TestConDesigner'
import Splitter from '@/easeui/Splitter/Splitter.vue'
import TextBoxCell from '@/easeui/TableCells/TextBoxCell.vue'

@Component({
    components: { DesignView: DesignView, Splitter: Splitter, TextBoxCell: TextBoxCell }
})
export default class TestView extends Vue {

    onConnection() {
        this.testConnection()
    }

    public get designView(): any /*DesignView*/ {
        return this.$refs.designView
    }

    onAdd() {
        var shape = new TestShape()
        this.designView.designSurface.AddItem(shape)
        this.designView.designSurface.Invalidate()
    }

    testConnection() {
        var connection = new TestConDesigner()
        connection.CreateConnectionDesigner()
        this.designView.designSurface.AddItem(connection.Conn1)
        this.designView.designSurface.AddItem(connection.Conn2)
        this.designView.designSurface.Invalidate()
    }

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
        var text = "<bookstore>"
        text = text + "<book>";
        text = text + "<title>Harry Potter</title>";
        text = text + "<author>J K. Rowling</author>";
        text = text + "<year>2005</year>";
        text = text + "</book>";
        text = text + "</bookstore>";

        let xmlDoc = this.loadXMLString(text);
        console.log(xmlDoc.getElementsByTagName("title")[0])
        xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue = "Hello Future"
        console.log(xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue)
        console.log(xmlDoc.getElementsByTagName("author")[0].childNodes[0].nodeValue)
        console.log(xmlDoc.getElementsByTagName("year")[0].childNodes[0].nodeValue)
        console.log(xmlDoc.textContent); // null
        
        var text = (new XMLSerializer()).serializeToString(xmlDoc)
        console.log(text);
    }

}
</script>