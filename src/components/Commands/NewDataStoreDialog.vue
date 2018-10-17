<template>
    <e-dialog title="新建存储" class="dialog" width="590px" :visible.sync="visible" @close="onClose" :before-close="onClosing">
        <table cellspacing="15px" style="font-size:14px;">
            <tr>
                <td>存储类型:</td>
                <td>
                    <e-radio v-model="storeType" :label="0">SQL</e-radio>
                    <e-radio v-model="storeType" :label="1">Table</e-radio>
                    <e-radio v-model="storeType" :label="2">Blob</e-radio>
                    <e-radio v-model="storeType" :label="3">Cache</e-radio>
                    <e-radio v-model="storeType" :label="4">Search</e-radio>
                </td>
            </tr>
            <tr>
                <td>存储实现:</td>
                <td>
                    <e-select v-model="storeProvider" style="width:100%">
                        <e-option v-for="item in storeProviders" :key="item.title" :label="item.title" :value="item.provider">
                        </e-option>
                    </e-select>
                </td>
            </tr>
            <tr>
                <td>存储名称:</td>
                <td>
                    <e-input v-model="storeName"></e-input>
                </td>
            </tr>
        </table>
        <div slot="footer">
            <e-button @click="visible = false">取 消</e-button>
            <e-button type="primary" @click="onOkClick">确 定</e-button>
        </div>
    </e-dialog>
</template>

<script>
    import DesignStore from '../DesignStore'
    import DataStoreProviders from '../Designers/DataStore/DataStoreProviders'

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
                this.$channel.invoke('sys.DesignHub.NewDataStore', args).then(res => {
                    // 根据返回结果添加新节点
                    DesignStore.tree.onNewNode({ ParentNodeType: 1, ParentNodeID: '', NewNode: res })
                    _this.$message.success('新建存储成功')
                    _this.visible = false
                }).catch(err => {
                    _this.$message.error(err)
                })
            }
        }
    }

</script>