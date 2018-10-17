<template>
    <div>
        <div class="search">
            <div>
                <e-input class="searchInput" v-model="keyWords" size="small" placeholder="输入Object名前缀匹配">
                    <e-button @click="onSearch" slot="append" icon="search"></e-button>
                </e-input>
            </div>
            <div class="pagination">
                <e-button-group>
                    <e-button @click="onPrePage" :disabled="preBtnVisible" type="primary" size="small" icon="arrow-left">上一页</e-button>
                    <e-button @click="onNextPage" :disabled="nextBtnVisible" type="primary" size="small">下一页
                        <i class="el-icon-arrow-right el-icon--right"></i>
                    </e-button>
                </e-button-group>
            </div>
            <div style="clear:both"></div>
        </div>
        <e-table class="objectsTable" :data="resultData" :stripe="true" @row-click="onRowClick">
            <e-table-column prop="Name" label="Name">
                <template slot-scope="scope">
                    <e-icon :name="objectIcon(scope.row)"></e-icon>
                    <span style="margin-left: 10px">{{ objectName(scope.row) }}</span>
                </template>
            </e-table-column>
            <e-table-column prop="Size" :formatter="formatSize" label="Size">
            </e-table-column>
            <e-table-column prop="LastModified" :formatter="formatDate" label="LastModified">
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
            nextMarker: null,
            pageSize: 10,
            filter: null,
            keyWords: '',
            folder: '',
            page: [null],
            currentPage: 0,
            preBtnVisible: true,
            nextBtnVisible: false
        }
    },

    props: {
        storeName: { type: String, required: true }
    },

    methods: {
        GetList() {
            // 清空当前填充的数据
            this.resultData = []
            var _this = this
            this.filter = this.folder ? (this.folder + this.keyWords) : this.keyWords
            console.log(this.filter)
            this.$channel.invoke('sys.DesignHub.GetBlobObjects', [this.storeName, this.page[this.currentPage], this.pageSize, this.filter]).then(res => {
                _this.preBtnVisible = true
                _this.nextBtnVisible = true
                _this.nextMarker = res.NextMarker
                // 如果folder不为空则说明有上页，则在列表的前面添加返回上一级，type==999
                if (_this.folder) {
                    var preFolder = { Name: '#', Size: 0, LastModified: null }
                    _this.resultData.push(preFolder)
                }
                res.BlobObjectInfo.forEach(function (element) {
                    // 如果Name是以/结尾，且LastModified不为空则说明这个object是不存在的那个object，不添加入数组
                    if (!(element.Name.charAt(element.Name.length - 1) === '/' && element.LastModified)) {
                        var startPosition = element.Name.indexOf(_this.folder) + (_this.folder ? _this.folder.length : 0)
                        var endPosition = element.Name.length
                        element.Name = element.Name.substring(startPosition, endPosition)
                        _this.resultData.push(element)
                    }
                })
                if (_this.currentPage === 0) {
                    _this.preBtnVisible = true
                } else {
                    _this.preBtnVisible = false
                }
                if (!_this.nextMarker) {
                    _this.nextBtnVisible = true
                } else {
                    _this.nextBtnVisible = false
                }
            }).catch(err => {
                _this.$message.error(err)
            })
        },
        onSearch() {
            if (!this.nextMarker) {
                this.nextBtnVisible = false
            }
            this.page = [null]
            this.currentPage = 0
            this.GetList()
        },
        onDownload(row) {
            window.location.href = '/api/Blob/Download?storeName=' + this.storeName + '&path=' + this.folder + row.Name
        },
        onDelete(row) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var _this = this
                this.$channel.invoke('sys.DesignHub.DeleteBlobObject', [this.storeName, this.folder + row.Name]).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    _this.GetList()
                }).catch(err => {
                    _this.$message.error(err)
                })
            }).catch(() => {
            })
        },
        onPrePage() {
            this.currentPage = this.currentPage - 1
            this.GetList()
        },
        onNextPage() {
            this.page.push(this.nextMarker)
            this.currentPage = this.currentPage + 1
            this.GetList()
        },
        onRowClick(row, event, column) {
            console.log(this.folder)
            if (row.Name.charAt(row.Name.length - 1) === '/') {
                this.folder += row.Name
                this.page = [null]
                this.currentPage = 0
                this.keyWords = ''
            } else if (row.Name === '#') {
                var arr = this.folder.split('/')
                var l = (arr[arr.length - 2]).length + 1
                this.folder = this.folder.substring(0, this.folder.length - l)
                this.page = [null]
                this.currentPage = 0
                this.keyWords = ''
                console.log(this.folder)
            } else {
                return
            }
            this.GetList()
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
            if (row.Name.charAt(row.Name.length - 1) === '/') {
                return 'folder'
            }
            return 'file-o'
        },
        objectName(row) {
            if (row.Name === '#') {
                return '返回上一级'
            }
            return row.Name
        }
    },

    mounted() {
        this.GetList()
    }
}
</script>
<style scoped>
.search {
    margin-bottom: 10px;
}

.search .searchInput {
    width: 200px;
    float: left
}

.pagination {
    float: right
}
</style>

<style>
.objectsTable>.el-table__body-wrapper>.el-table__body>tbody>tr {
    cursor: pointer
}
</style>