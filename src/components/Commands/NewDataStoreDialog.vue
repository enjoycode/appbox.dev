<template>
    <el-dialog title="New DataStore" class="dialog" width="590px" :visible.sync="visible" @close="onClose" :before-close="onClosing">
        <table cellspacing="15px" style="font-size:14px;width:100%">
            <tr>
                <td>Type:</td>
                <td>
                    <el-radio v-model="storeType" :label="0">SQL</el-radio>
                    <el-radio v-model="storeType" :label="1">CQL</el-radio>
                    <!--<el-radio v-model="storeType" :label="2">Blob</el-radio>
                    <el-radio v-model="storeType" :label="3">Cache</el-radio>
                    <el-radio v-model="storeType" :label="4">Search</el-radio> -->
                </td>
            </tr>
            <tr>
                <td>Provider:</td>
                <td>
                    <el-select v-model="storeProvider" style="width:100%">
                        <el-option v-for="item in storeProviders" :key="item.title" :label="item.title" :value="item.provider">
                        </el-option>
                    </el-select>
                </td>
            </tr>
            <tr>
                <td>Name:</td>
                <td>
                    <el-input v-model="storeName"></el-input>
                </td>
            </tr>
        </table>
        <div slot="footer">
            <el-button @click="visible = false">Cancel</el-button>
            <el-button type="primary" @click="onOkClick">OK</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import store from '@/design/DesignStore'
    import DataStoreProviders from '@/components/Designers/DataStore/DataStoreProviders'

    export default {
        data() {
            return {
                visible: true,
                storeType: 0,
                storeProvider: '',
                storeName: ''
            }
        },
        watch: {
            storeType(newval) {
                this.storeProvider = '' // this.storeProviders[newval][0].provider
            }
        },

        computed: {
            storeProviders() {
                return DataStoreProviders.providers[this.storeType]
            }
        },

        methods: {
            onClosing(done) {
                done()
            },
            onClose() {
                this.$emit('close')
            },
            onOkClick() {
                let _this = this
                var args = [this.storeType, this.storeProvider, this.storeName]
                // 获取实体属性
                $runtime.channel.invoke('sys.DesignService.NewDataStore', args).then(res => {
                    // 根据返回结果添加新节点
                    store.tree.onNewNode({ ParentNodeType: 1, ParentNodeID: '', NewNode: res })
                    _this.$message.success('Add store succeed')
                    _this.visible = false
                }).catch(err => {
                    _this.$message.error(err)
                })
            }
        }
    }

</script>