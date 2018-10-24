<template>
    <div class="view">
        <h3>Primary Key:</h3>
        <e-form label-width="200px" size="small">
            <e-form-item label="Partition Keys:">
                <e-select v-model="options.PartitionKeys" multiple @change="onPartitionKeysChanged">
                    <e-option v-for="item in members" :key="item.Name" :label="item.Name" :value="item.Name" :disabled="disabledMember(options, item.Name)">
                    </e-option>
                </e-select>
            </e-form-item>
            <e-form-item label="Clustering Columns:">
                <e-select value-key="Name" v-model="options.ClusteringColumns" multiple @change="onClusteringColumnsChanged">
                    <e-option v-for="item in members" :key="item.Name" :label="item.Name" :value="{Name: item.Name, OrderDESC: false}" :disabled="disabledMember(options, item.Name)">
                    </e-option>
                </e-select>
            </e-form-item>
            <e-form-item label="Clustering Orders:">
                <span v-for="item in options.ClusteringColumns">{{ item.Name }}:
                    <e-switch v-model="item.OrderDESC" @change="onClusteringColumnsChanged" active-text="DESC" inactive-text="ASC"></e-switch>
                    &nbsp;
                </span>
            </e-form-item>
        </e-form>
        <h3>Secondary Index:</h3>
        <e-form label-width="200px" size="small">
            <e-form-item label="Native Indexs:">
                <e-select v-model="options.ContainsIndexs" multiple>
                    <e-option v-for="item in members" :key="item.Name" :label="item.Name" :value="item.Name">
                    </e-option>
                </e-select>
            </e-form-item>
            <e-form-item label="Contains Indexs:">
                <e-select v-model="options.ContainsIndexs" multiple>
                    <e-option v-for="item in members" :key="item.Name" :label="item.Name" :value="item.Name">
                    </e-option>
                </e-select>
            </e-form-item>
            <e-form-item label="Prefix Indexs:">
                <e-select v-model="options.ContainsIndexs" multiple>
                    <e-option v-for="item in members" :key="item.Name" :label="item.Name" :value="item.Name">
                    </e-option>
                </e-select>
            </e-form-item>
            <!-- <e-form-item label="Lucene Indexs:">
                <e-select v-model="options.ContainsIndexs" multiple>
                    <e-option v-for="item in members" :key="item.Name" :label="item.Name" :value="item.Name">
                    </e-option>
                </e-select>
            </e-form-item> -->
        </e-form>
        <h3>Materialized View:</h3>
        <e-tabs v-model="curMV" type="border-card" editable @edit="onMVTabsEdit">
            <e-tab-pane v-for="(mv, index) in options.MaterializedViews" :key="mv.Name" :label="mv.Name" :name="mv.Name">
                <e-form label-width="200px" size="small">
                    <e-form-item label="Partition Keys:">
                        <e-select v-model="mv.PartitionKeys" multiple @change="onMVPartitionKeysChanged(mv)">
                            <e-option v-for="item in members" :key="item.Name" :label="item.Name" :value="item.Name" :disabled="disabledMember(mv, item.Name)">
                            </e-option>
                        </e-select>
                    </e-form-item>
                    <e-form-item label="Clustering Columns:">
                        <e-select value-key="Name" v-model="mv.ClusteringColumns" multiple @change="onMVClusteringColumnsChanged(mv)">
                            <e-option v-for="item in members" :key="item.Name" :label="item.Name" :value="{Name: item.Name, OrderDESC: false}" :disabled="disabledMember(mv, item.Name)">
                            </e-option>
                        </e-select>
                    </e-form-item>
                    <e-form-item label="Clustering Orders:">
                        <span v-for="item in mv.ClusteringColumns">{{ item.Name }}:
                            <e-switch v-model="item.OrderDESC" @change="onMVClusteringColumnsChanged(mv)" active-text="DESC" inactive-text="ASC"></e-switch>
                            &nbsp;
                        </span>
                    </e-form-item>
                </e-form>
            </e-tab-pane>
        </e-tabs>
        <h3>Others:</h3>
        <e-form label-width="200px" size="small">
            <e-form-item label="Default TTL(毫秒):">
                <e-input-number v-model="options.DefaultTTL" controls-position="right" :min="0">
                </e-input-number>
            </e-form-item>
        </e-form>
    </div>
</template>

<script>
    export default {
        props: {
            target: { type: Object, required: true },
            members: { type: Array, required: true },
            options: { type: Object, required: true }
        },
        data() {
            return {
                curMV: '' // 当前的物化视图
            }
        },
        methods: {
            /** 用于判断该成员是否可选 */
            disabledMember(target, memberName) {
                if (target.PartitionKeys.find(t => t === memberName)) {
                    return true
                }
                if (target.ClusteringColumns.find(t => t.Name === memberName)) {
                    return true
                }
                return false
            },
            /** 添加或删除物化视图 */
            onMVTabsEdit(targetName, action) {
                let _this = this
                if (action === 'add') {
                    var mvName = ''
                    this.$prompt('请输入物化视图名称:', '新建物化视图', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        inputPattern: /[a-zA-Z_0-9]+/,
                        inputErrorMessage: '名称不正确'
                    }).then(res => {
                        mvName = res.value
                        let args = [_this.target.ID, 'AddMV', mvName]
                        return _this.$channel.invoke('sys.DesignService.ChangeTableOptions', args)
                    }).then(res => { // 同步前端
                        _this.options.MaterializedViews.push({
                            Name: mvName,
                            PartitionKeys: [],
                            ClusteringColumns: []
                        })
                        _this.curMV = mvName
                    }).catch(err => { _this.$message.error('新建物化视图失败: ' + err) })
                } else if (action === 'remove') {
                    this.$confirm('请确认删除此物化视图', '删除物化视图', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(res => {
                        let args = [this.target.ID, 'RemoveMV', targetName]
                        return _this.$channel.invoke('sys.DesignService.ChangeTableOptions', args)
                    }).then(res => { // 同步前端
                        _this.options.MaterializedViews = _this.options.MaterializedViews.filter(v => v.Name !== targetName)
                        _this.curMV = _this.options.MaterializedViews.length > 0 ? _this.options.MaterializedViews[0].Name : ''
                    }).catch(err => { _this.$message.error('删除物化视图失败: ' + err) })
                }
            },
            onPartitionKeysChanged(e) {
                let args = [this.target.ID, 'PartitionKeys', this.options.PartitionKeys]
                let _this = this
                this.$channel.invoke('sys.DesignService.ChangeTableOptions', args).then(res => {
                    this.onPrimaryKeyChanged()
                }).catch(err => {
                    _this.$message.error('改变表存储PartitionKeys失败: ' + err)
                })
            },
            onClusteringColumnsChanged(e) {
                let args = [this.target.ID, 'ClusteringColumns', JSON.stringify(this.options.ClusteringColumns)]
                let _this = this
                this.$channel.invoke('sys.DesignService.ChangeTableOptions', args).then(res => {
                    this.onPrimaryKeyChanged()
                }).catch(err => {
                    _this.$message.error('改变表存储ClusteringColumns失败: ' + err)
                })
            },
            /** 主键改变后同步刷新前端所有成员的AllowNull属性，后端已处理 */
            onPrimaryKeyChanged() {
                this.members.forEach(m => {
                    if (this.options.PartitionKeys.find(t => t === m.Name) ||
                        this.options.ClusteringColumns.find(t => t.Name === m.Name)) {
                        m.AllowNull = false
                    } else {
                        m.AllowNull = true
                    }
                })
            },
            onMVPartitionKeysChanged(mv) {
                let args = [this.target.ID, 'MVPartitionKeys', mv.PartitionKeys, mv.Name]
                let _this = this
                this.$channel.invoke('sys.DesignService.ChangeTableOptions', args).catch(err => {
                    _this.$message.error('改变物化视图PartitionKeys失败: ' + err)
                })
            },
            onMVClusteringColumnsChanged(mv) {
                let args = [this.target.ID, 'MVClusteringColumns', JSON.stringify(mv.ClusteringColumns), mv.Name]
                let _this = this
                this.$channel.invoke('sys.DesignService.ChangeTableOptions', args).catch(err => {
                    _this.$message.error('改变物化视图ClusteringColumns失败: ' + err)
                })
            }
        },
        mounted() {
            if (this.options.MaterializedViews.length > 0) { // 用于激活当前的物化视图
                this.curMV = this.options.MaterializedViews[0].Name
            }
        }
    }
</script>

<style scoped>
    .view {
        box-sizing: border-box;
        padding: 10px;
        height: 100%;
        overflow: auto;
    }

    .view>>>.el-select {
        width: 95%;
    }
</style>