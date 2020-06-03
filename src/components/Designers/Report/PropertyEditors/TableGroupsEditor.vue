<template>
    <div>
        <el-button @click="openEditor" style="width:100%">...</el-button>
        <el-dialog :before-close="closingEditor" :title="title" :visible.sync="dlgVisible" width="600px">
            <div>
                <el-popover placement="bottom" width="273" v-model="newVisible">
                    <el-form size="mini" label-width="100px">
                        <el-form-item label="GroupName:">
                            <el-input v-model="newGroupName"></el-input>
                        </el-form-item>
                        <el-form-item label="GroupBy:">
                            <el-select v-model="newGroupBy">
                                <el-option v-for="item in fields" :key="item" :value="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Add Header:">
                           <el-checkbox v-model="addHeader"></el-checkbox>
                        </el-form-item>
                         <el-form-item label="Add Footer:">
                           <el-checkbox v-model="addFooter"></el-checkbox>
                        </el-form-item>
                    </el-form>
                    
                    <div style="text-align: right; margin: 0">
                        <el-button type="text" size="mini" @click="newVisible = false">Cancel</el-button>
                        <el-button type="primary" size="mini" @click="onAdd(true)">Ok</el-button>
                    </div>
                    <el-button slot="reference" type="primary" :disabled="!canAddParent">Add Parent</el-button>
                </el-popover>
                &emsp;
                <el-button @click="onDel" type="primary" :disabled="!canDelete">Delete</el-button>
                <br/><br/>
                <el-row style="height:260px">
                    <el-col :span="12" style="height:100%">
                        <!-- 结构树 -->
                        <el-tree ref="tree" @current-change="onCurrentChange" :data="groups" :props="treeOpts"
                          node-key="Name" :expand-on-click-node="false" 
                          highlight-current default-expand-all style="height:100%"></el-tree>
                    </el-col>
                    <el-col :span="12" style="height:100%">
                        <!-- 属性面板 -->
                        <property-panel ref="props" :show-title="false" label-width="90px"></property-panel>
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
import { TableGroup } from '../Designers/IReportObject'

export default {
    components: { PropertyPanel: PropertyPanel },
    props: { target: { type: Object } },
    data() {
        return {
            value: null,            // TableDesigner
            dlgVisible: false,
            newVisible: false,
            newGroupName: "",       //新建的名称
            newGroupBy: "",
            addHeader: false,
            addFooter: false,
            currentNode: null,      //当前选择的树节点
            groups: [],
            treeOpts: {
                label: 'Name',
                children: 'NoneStaticChildGroups'
            }
        }
    },
    computed: {
        title() {
            return this.target.options ? "Table Row Groups" : "Table Column Groups"
        },
        fields() {
            if (!this.currentNode) { return []; }
            return this.currentNode.data.GetFields()
        },
        canAddParent() {
            return this.currentNode
        },
        canAddChild() {
            return this.currentNode && !this.currentNode.data.IsDetail()
        },
        canDelete() {
            return this.currentNode
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
            if (this.target.options) {
                this.$set(this, 'groups', this.value.RowGroups.Items)
            } else {
                this.$set(this, 'groups', this.value.ColumnGroups.Items)
            }

            this.trySelectFirst()
        },
        closingEditor(done) {
            // TODO:验证名称惟一性
            done()
        },
        trySelectFirst() {
            this.$nextTick(() => {
                if (this.groups.length > 0) {
                    let firstNode = this.$refs.tree.getNode(this.groups[0])
                    // this.$refs.tree.setCurrentNode(firstNode) //TODO:element bug
                    this.$refs.tree.setCurrentKey(this.groups[0].Name)
                    this.onCurrentChange(firstNode.data, firstNode)
                } else {
                    this.onCurrentChange(null, null)
                }
            })
        },
        onAdd(isParent) {
            this.newVisible = false
            // TODO: check exists
            if (this.target.options) {
                if (isParent) {
                    let rootGroup = TableGroup.GetRootGroup(this.currentNode.data)
                    let table = rootGroup.Table;
                    table.TableLayout.InsertOuterRowGroup(this.currentNode.data
                        , this.newGroupName, [{ Expression: this.newGroupBy }]
                        , this.addHeader, this.addFooter)
                    table.TableLayout.Owner.Invalidate();
                }
            }
        },
        onDel() {
            if (!this.currentNode) {
                this.$message.warning("Please select a TableGroup first")
                return
            }

            let rootGroup = TableGroup.GetRootGroup(this.currentNode.data)
            let table = rootGroup.Table
            let oldBounds = table.TableLayout.Owner.Bounds.Clone()
            if (this.target.options) {
                table.TableLayout.DeleteRowGroup(this.currentNode.data, true)
            } else {
                table.TableLayout.DeleteColumnGroup(this.currentNode.data, true)
            }
            table.TableLayout.Owner.InvalidateOnBoundsChanged(oldBounds)
            this.trySelectFirst()
        },
        onCurrentChange(data, node) {
            this.currentNode = node
            if (!this.$refs.props.DesignService) {
                this.$refs.props.DesignService = this.value.Surface.DesignService
            }
            this.$refs.props.setPropertyOwner(data)
        }
    },
    mounted() {
        this.value = this.target.getter()
    }
}
</script>