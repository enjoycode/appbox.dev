<template>
    <div class="view">
        <h3>Primary Key:</h3>
        <el-form label-width="200px" size="small">
            <el-form-item label="Partition Keys:">
                <el-select v-model="options.PartitionKeys" multiple @change="onPartitionKeysChanged">
                    <el-option v-for="item in members" :key="item.Name" :label="item.Name" :value="item.ID" :disabled="disabledMember(options, item.ID)">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="Clustering Columns:">
                <el-select value-key="MemberId" v-model="options.ClusteringColumns" multiple @change="onClusteringColumnsChanged">
                    <el-option v-for="item in members" :key="item.Name" :label="item.Name" :value="{MemberId: item.ID, OrderByDesc: false}" :disabled="disabledMember(options, item.ID)">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="Clustering Orders:">
                <span v-for="item in options.ClusteringColumns" :key="item.MemberId">{{ getMemberName(item.MemberId) }}:
                    <el-switch v-model="item.OrderByDesc" @change="onClusteringColumnsChanged" active-text="DESC" inactive-text="ASC"></el-switch>
                    &nbsp;
                </span>
            </el-form-item>
        </el-form>
        <h3>Secondary Index:</h3>
        <el-form label-width="200px" size="small">
            <el-form-item label="Native Indexs:">
                <el-select v-model="options.ContainsIndexs" multiple>
                    <el-option v-for="item in members" :key="item.Name" :label="item.Name" :value="item.Name">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="Contains Indexs:">
                <el-select v-model="options.ContainsIndexs" multiple>
                    <el-option v-for="item in members" :key="item.Name" :label="item.Name" :value="item.Name">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="Prefix Indexs:">
                <el-select v-model="options.ContainsIndexs" multiple>
                    <el-option v-for="item in members" :key="item.Name" :label="item.Name" :value="item.Name">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <h3>Materialized View:</h3>
        <el-tabs v-model="curMV" type="border-card" editable @edit="onMVTabsEdit">
            <el-tab-pane v-for="(mv, index) in options.MaterializedViews" :key="mv.Name" :label="mv.Name" :name="mv.Name">
                <el-form label-width="200px" size="small">
                    <el-form-item label="Partition Keys:">
                        <el-select v-model="mv.PartitionKeys" multiple @change="onMVPartitionKeysChanged(mv)">
                            <el-option v-for="item in members" :key="item.Name" :label="item.Name" :value="item.ID" :disabled="disabledMember(mv, item.ID)">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Clustering Columns:">
                        <el-select value-key="Name" v-model="mv.ClusteringColumns" multiple @change="onMVClusteringColumnsChanged(mv)">
                            <el-option v-for="item in members" :key="item.Name" :label="item.Name" :value="{MemberId: item.ID, OrderByDesc: false}" :disabled="disabledMember(mv, item.ID)">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Clustering Orders:">
                        <span v-for="item in mv.ClusteringColumns" :key="item.MemberId">{{ item.Name }}:
                            <el-switch v-model="item.OrderDESC" @change="onMVClusteringColumnsChanged(mv)" active-text="DESC" inactive-text="ASC"></el-switch>
                            &nbsp;
                        </span>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
        <h3>Others:</h3>
        <el-form label-width="200px" size="small">
            <el-form-item label="Default TTL(毫秒):">
                <el-input-number v-model="options.DefaultTTL" controls-position="right" :min="0">
                </el-input-number>
            </el-form-item>
        </el-form>
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
            /** 根据成员标识获取名称 */
            getMemberName(memberId) {
                return this.members.find(t => t.ID === memberId).Name
            },
            /** 用于判断该成员是否可选 */
            disabledMember(target, memberId) {
                if (target.PartitionKeys.find(t => t === memberId)) {
                    return true
                }
                if (target.ClusteringColumns.find(t => t.MemberId === memberId)) {
                    return true
                }
                return false
            },
            /** 添加或删除物化视图 */
            onMVTabsEdit(targetName, action) {
                let _this = this
                if (action === 'add') {
                    var mvName = ''
                    this.$prompt('MV Name:', 'Create Materialized View', {
                        confirmButtonText: 'Ok',
                        cancelButtonText: 'Cancel',
                        inputPattern: /[a-zA-Z_0-9]+/,
                        inputErrorMessage: 'Name error'
                    }).then(res => {
                        mvName = res.value
                        let args = [_this.target.ID, 'AddMV', mvName]
                        return _this.$channel.invoke('sys.DesignHub.ChangeTableOptions', args)
                    }).then(res => { // 同步前端
                        _this.options.MaterializedViews.push({
                            Name: mvName,
                            PartitionKeys: [],
                            ClusteringColumns: []
                        })
                        _this.curMV = mvName
                    }).catch(err => { _this.$message.error('Create MV error: ' + err) })
                } else if (action === 'remove') {
                    this.$confirm('Confirm to drop MV', 'Delete MV', {
                        confirmButtonText: 'Ok',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(res => {
                        let args = [this.target.ID, 'RemoveMV', targetName]
                        return _this.$channel.invoke('sys.DesignHub.ChangeTableOptions', args)
                    }).then(res => { // 同步前端
                        _this.options.MaterializedViews = _this.options.MaterializedViews.filter(v => v.Name !== targetName)
                        _this.curMV = _this.options.MaterializedViews.length > 0 ? _this.options.MaterializedViews[0].Name : ''
                    }).catch(err => { _this.$message.error('Drop MV error: ' + err) })
                }
            },
            onPartitionKeysChanged(e) {
                let args = [this.target.ID, 'PartitionKeys', this.options.PartitionKeys]
                let _this = this
                $runtime.channel.invoke('sys.DesignHub.ChangeTableOptions', args).then(res => {
                    this.onPrimaryKeyChanged()
                }).catch(err => {
                    _this.$message.error('Change PK PartitionKeys error: ' + err)
                })
            },
            onClusteringColumnsChanged(e) {
                let args = [this.target.ID, 'ClusteringColumns', JSON.stringify(this.options.ClusteringColumns)]
                let _this = this
                $runtime.channel.invoke('sys.DesignHub.ChangeTableOptions', args).then(res => {
                    this.onPrimaryKeyChanged()
                }).catch(err => {
                    _this.$message.error('Change PK ClusteringColumns error: ' + err)
                })
            },
            /** 主键改变后同步刷新前端所有成员的AllowNull属性，后端已处理 */
            onPrimaryKeyChanged() {
                this.members.forEach(m => {
                    if (this.options.PartitionKeys.find(t => t === m.ID) ||
                        this.options.ClusteringColumns.find(t => t.MemberId === m.ID)) {
                        m.AllowNull = false
                    } else {
                        m.AllowNull = true
                    }
                })
            },
            onMVPartitionKeysChanged(mv) {
                let args = [this.target.ID, 'MVPartitionKeys', mv.PartitionKeys, mv.Name]
                let _this = this
                $runtime.channel.invoke('sys.DesignHub.ChangeTableOptions', args).catch(err => {
                    _this.$message.error('Change MV PartitionKeys error: ' + err)
                })
            },
            onMVClusteringColumnsChanged(mv) {
                let args = [this.target.ID, 'MVClusteringColumns', JSON.stringify(mv.ClusteringColumns), mv.Name]
                let _this = this
                $runtime.channel.invoke('sys.DesignHub.ChangeTableOptions', args).catch(err => {
                    _this.$message.error('Change MV ClusteringColumns error: ' + err)
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