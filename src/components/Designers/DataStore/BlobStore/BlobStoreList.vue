<template>
    <div>
        <div class="toolbar">
            <e-breadcrumb class="sep-path">
                <e-breadcrumb-item v-for="path in sepPaths" :key="path.Path">
                  <a @click="onSepPathClick(path.Path)">{{ path.Name }}</a>  
                </e-breadcrumb-item>
            </e-breadcrumb>
            <div class="toolbar-right">
                <e-input class="searchInput" v-model="keyWords" size="small" placeholder="输入路径前缀匹配">
                    <e-button @click="onSearch" slot="append" icon="fas fa-search"></e-button>
                </e-input>
                <e-button-group>
                    <e-button @click="onPrePage" :disabled="preBtnVisible" type="primary" size="small" icon="arrow-left">上一页</e-button>
                    <e-button @click="onNextPage" :disabled="nextBtnVisible" type="primary" size="small">下一页
                        <i class="el-icon-arrow-right el-icon--right"></i>
                    </e-button>
                </e-button-group>
            </div>
            <div style="clear:both"></div>
        </div>
        <e-table border :data="resultData" :stripe="true" @row-click="onRowClick">
            <e-table-column prop="Name" label="Name">
                <template slot-scope="scope">
                    <i :class="objectIcon(scope.row)"></i>
                    <span style="margin-left: 10px">{{ scope.row.Name }}</span>
                </template>
            </e-table-column>
            <e-table-column prop="Size" :formatter="formatSize" label="Size">
            </e-table-column>
            <e-table-column prop="ModifiedTime" :formatter="formatDate" label="LastModified">
            </e-table-column>
            <e-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <e-button @click="onDownload(scope.row)" type="text" size="small">下载</e-button>
                    <e-button @click="onDelete(scope.row)" type="text" size="small">删除</e-button>
                </template>
            </e-table-column>
        </e-table>
    </div>
</template>
<script>
// import axios from 'axios'
export default {
    data() {
        return {
            resultData: [],
            keyWords: '',
            curPath: '/', // 当前路径
            preBtnVisible: false,
            nextBtnVisible: false
        }
    },

    props: {
        storeName: { type: String, required: true }
    },
    computed: {
        sepPaths() {
            var paths = [{Name: 'Home', Path: '/'}]
            if (this.curPath === '/') {
                return paths
            }
            var sr = this.curPath.split('/')
            for (var i = 1; i < sr.length; ++i) {
                var p = sr.slice(0, i + 1).join('/')
                paths.push({Name: sr[i], Path: p})
            }
            return paths
        }
    },

    methods: {
        listObjects() {
            var _this = this
            this.$channel.invoke('sys.DesignService.GetBlobObjects', [this.storeName, this.curPath]).then(res => {
                // _this.preBtnVisible = true
                // _this.nextBtnVisible = true
                _this.resultData = res
                // if (_this.currentPage === 0) {
                //     _this.preBtnVisible = true
                // } else {
                //     _this.preBtnVisible = false
                // }
                // if (!_this.nextMarker) {
                //     _this.nextBtnVisible = true
                // } else {
                //     _this.nextBtnVisible = false
                // }
            }).catch(err => {
                _this.$message.error(err)
            })
        },
        onSearch() {
            // if (!this.nextMarker) {
            //     this.nextBtnVisible = false
            // }
            // this.page = [null]
            // this.currentPage = 0
            this.listObjects()
        },
        onSepPathClick(path) {
            this.curPath = path
            this.listObjects()
        },
        onDownload(row) {
            window.location.href = '/api/Blob/Download?storeName=' + this.storeName + '&path=' + this.curPath + row.Name
        },
        onDelete(row) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var _this = this
                this.$channel.invoke('sys.DesignService.DeleteBlobObject', [this.storeName, this.curPath + row.Name]).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    _this.listObjects()
                }).catch(err => {
                    _this.$message.error(err)
                })
            }).catch(() => {
            })
        },
        onPrePage() {
            // this.currentPage = this.currentPage - 1
            // this.listObjects()
        },
        onNextPage() {
            // this.page.push(this.nextMarker)
            // this.currentPage = this.currentPage + 1
            // this.listObjects()
        },
        onRowClick(row, event, column) {
            if (row.IsFile) {
                return
            }
            if (this.curPath === '/') {
                this.curPath += row.Name
            } else {
                this.curPath += '/' + row.Name
            }
            this.listObjects()
        },
        formatDate(row, column, cellValue) {
            if (cellValue && !(row.Name.charAt(row.Name.length - 1) === '/')) {
                var date = new Date(+new Date(cellValue) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
                return date
            } else {
                return null
            }
        },
        formatSize(row, column, cellValue) {
            if (cellValue) {
                var size = cellValue / 1024
                return size.toFixed(3) + 'KB'
            } else {
                return null
            }
        },
        objectIcon(row) {
            return row.IsFile ? 'fas fa-file' : 'fas fa-folder'
        }
    },

    mounted() {
        this.listObjects()
    }
}
</script>
<style scoped>
.toolbar {
    margin-bottom: 10px;
}

.sep-path {
    float: left;
    margin-top: 6px;
}

.searchInput {
    width: 200px;
    float: left;
    margin-right: 5px;
}

.toolbar-right {
    float: right
}
</style>