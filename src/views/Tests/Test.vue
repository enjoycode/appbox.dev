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

}
</script>