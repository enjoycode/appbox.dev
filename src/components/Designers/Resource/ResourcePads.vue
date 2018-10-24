<template>
    <div class="resourcePads">
        <e-card>
            <div slot="header">
                <e-row type="flex" align="middle" :gutter="10">
                    <e-col :span="3">
                        <e-button type="primary" size="small" icon="plus" @click="onOpenNewResourceDlg">添加资源</e-button>
                    </e-col>
                    <e-col :span="3">
                        <e-button type="danger" size="small" icon="delete" @click="onDeleteResource">删除资源</e-button>
                    </e-col>
                </e-row>
            </div>
            <e-table ref="resourceTable" :data="ResourceNode" :stripe="true" highlight-current-row border @current-change="onCurentChange">
                <e-table-column prop="Name" label="Name" align="center">
                </e-table-column>
                <e-table-column label="ImageValue" align="center">
                    <template slot-scope="scope">
                        <img class="resourceImage" :src="imgFormatter(scope.row)">
                    </template>
                </e-table-column>
                <e-table-column prop="ImageSize" label="Size" align="center">
                </e-table-column>
            </e-table>
        </e-card>
    </div>
</template>

<script>
    import axios from 'axios'
    import store from '../../DesignStore'
    import newResourceDialog from './NewResourceDialog'
    export default {
        data() {
            return {
                ResourceNode: null,
                currentRow: null
            }
        },
        props: {
            // 实体模型节点
            target: { type: Object, required: true }
        },
        methods: {
            onCurentChange(currentRow, oldCurrentRow) {
                this.currentRow = currentRow
            },
            onOpenNewResourceDlg() {
                store.ide.showDialog(newResourceDialog)
            },
            onDeleteResource() {
                this.$channel.invoke('sys.DesignService.DeleteResource', [this.currentRow.ID]).then(res => {
                    let index = this.ResourceNode.findIndex(t => t.ID === this.currentRow.ID)
                    this.ResourceNode.splice(index, 1)
                }).catch(err => {
                    this.$message.error(err)
                })
            },
            imgFormatter(row) {
                var scheme = document.location.protocol
                var port = document.location.port ? (':' + document.location.port) : ''
                var connectionUrl = scheme + '//' + document.location.hostname + port + '/api/Resource/GetResourceValue?appID=' + this.target.AppID + '&name=' + row.Name + '&type=1'
                return connectionUrl
            },
            getResourceValue(appID, name, valueType) {
                var promise = new Promise((resolve, reject) => {
                    axios.post('/api/Resource/GetResourceValue', { appID: appID, name: name, type: valueType }, {}).then(res => {
                        if (!res) {
                            reject('获取图标资源失败') // eslint-disable-line
                        } else {
                            console.log(res)
                            resolve(res)
                        }
                    }).catch(err => {
                        reject(err)
                    })
                })

                return promise
            },
            onResourceUploadSuccess(res) {
                this.ResourceNode.push(res)
            }
        },
        mounted() {
            store.onEvent('resourceUploadSuccess', this.onResourceUploadSuccess)
            this.$channel.invoke('sys.DesignService.GetResourceInfos', [this.target.AppID, 1]).then(res => {
                this.ResourceNode = res
                console.log(res)
            }).catch(err => {
                this.$message.error(err)
            })
        },
        destroyed() {
            store.offEvent('resourceUploadSuccess', this.onResourceUploadSuccess)
        }
    }

</script>

<style>
    .resourceImage {
        height: 50px;
    }

    .resourcePads {
        height: 100%;
        overflow: auto;
    }

    .resourcePads>.el-card>.el-card__header {
        padding: 10px 12px;
        border-bottom: none;
        padding-bottom: 0;
    }

    .resourcePads>.el-card>.el-card__body {
        padding: 10px;
    }

    .resourcePads>.el-card {
        border: none;
    }
</style>