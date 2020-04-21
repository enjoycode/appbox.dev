<template>
    <div>
        <el-button @click="openEditor" style="width:100%">...</el-button>
        <el-dialog title="Report DataSets" :visible.sync="dlgVisible" width="600px">
            <div>
                <!-- 新建DataSet的实体选择 -->
                <el-select v-model="entityModel" value-key="ID" filterable placeholder=" ">
                    <el-option-group v-for="group in allEntities" :key="group.ID" :label="group.Text" :value="group.ID">
                        <el-option v-for="item in group.Nodes" :key="item.ID" :label="item.Name" :value="item">
                        </el-option>
                    </el-option-group>
                </el-select>
                <el-button-group>
                    <el-button @click="onAddDS">Add</el-button>
                    <el-button @click="onDelDS">Remove</el-button>
                </el-button-group>
                &emsp;
                <el-button-group>
                    <el-button>Add Field</el-button>
                    <el-button>Remove Field</el-button>
                </el-button-group>
                <br/><br/>
                <el-row style="height:260px">
                    <el-col :span="12" style="height:100%">
                        <!-- 结构树 -->
                        <el-tree @current-change="onCurrentChange" :data="datasets" :props="treeOpts" style="height:100%"></el-tree>
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
            value: null, // ReportRootDesigner
            dlgVisible: false,
            allEntities: [], //所有实体，供选择绑定
            entityModel: null, //新建DataSet时指定的实体模型对应的树节点
            currentNode: null, //当前选择的树节点
            datasets: [],
            treeOpts: {
                label: 'Name',
                children: 'Fields'
            }
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
            this.$set(this, 'datasets', this.value.DataSets.Items)
        },
        onAddDS() {
            // 如果选择了实体模型查询成员，否则简单添加
            let _this = this
            if (this.entityModel) {
                // TODO:暂重用GetEntityModel获取成员列表
                $runtime.channel.invoke('sys.DesignService.GetEntityModel', [this.entityModel.ID]).then(res => {
                    _this.value.DataSets.Add(this.entityModel.Name, res.Members)
                }).catch(err => {
                    console.warn(err)
                    // _this.$message.error(err)
                })
            } else {
                // TODO:简单添加
            }
        },
        onDelDS() {
            if(!this.currentNode || this.currentNode.level !== 1) { return; }
            this.value.DataSets.Remove(this.currentNode.data)
            this.currentNode = null
            this.$refs.props.setPropertyOwner(null)
        },
        onCurrentChange(data, node) {
            this.currentNode = node //是节点非数据
            if (!this.$refs.props.DesignService) {
                this.$refs.props.DesignService = this.value.Surface.DesignService
            }
            this.$refs.props.setPropertyOwner(data)
        }
    },
    mounted() {
        this.value = this.target.getter()
        store.tree.getAllEntityNodes(this.allEntities, null)
    }
}
</script>