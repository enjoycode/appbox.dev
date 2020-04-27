<template>
    <div>
        <el-button @click="openEditor" style="width:100%">...</el-button>
        <el-dialog :before-close="closingEditor" title="Table Groups" :visible.sync="dlgVisible" width="600px">
            <div>
                <el-input v-model="newGroupName" placeholder="New Group Name" style="width:180px"></el-input>
                <el-button-group>
                    <el-button @click="onAdd">Add</el-button>
                    <el-button @click="onDel">Remove</el-button>
                </el-button-group>
                &emsp;
                <br/><br/>
                <el-row style="height:260px">
                    <el-col :span="12" style="height:100%">
                        <!-- 列表 -->
                        <el-table :data="groups" @current-change="onCurrentChange" 
                            highlight-current-row border size="mini" empty-text=" " height="100%">
                            <el-table-column prop="Name" label="Name"></el-table-column>
                            <!-- <el-table-column prop="DataType" label="DataType"></el-table-column> -->
                        </el-table>
                    </el-col>
                    <el-col :span="12" style="height:100%">
                        <!-- 属性面板 -->
                        <property-panel ref="props"></property-panel>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dlgVisible = false">Done</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import PropertyPanel from "@/components/Canvas/PropertyPanel"
import store from '@/design/DesignStore'

export default {
    components: { PropertyPanel: PropertyPanel },
    props: { target: { type: Object } },
    data() {
        return {
            value: null,            // TableDesigner
            dlgVisible: false,
            newGroupName: "",       //新建的名称
            currentRow: null,       //当前选择的
            groups: []
        }
    },
    watch: {
        target(newTarget) {
            this.value = newTarget.getter()
        }
    },
    methods: {
        openEditor() {
            this.dlgVisible = true
            this.$set(this, 'groups', this.value.Groups.Items)
        },
        closingEditor(done) {
            // TODO:验证名称惟一性
            done()
        },
        onAdd() {
            // TODO: check exists
            this.value.Groups.Add(this.newGroupName);
            this.newGroupName = ""; //reset it
        },
        onDel() {
            if (!this.currentRow) {
                this.$message.warning("Please select a TableGroup first")
                return
            }
            this.value.Groups.Remove(this.currentRow)
            this.currentRow = null
            this.$refs.props.setPropertyOwner(null)
        },
        onCurrentChange(row) {
            this.currentRow = row
            if (!this.$refs.props.DesignService) {
                this.$refs.props.DesignService = this.value.Surface.DesignService
            }
            this.$refs.props.setPropertyOwner(row)
        }
    },
    mounted() {
        this.value = this.target.getter()
    }
}
</script>