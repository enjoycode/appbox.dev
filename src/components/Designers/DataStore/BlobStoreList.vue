<template>
    <div>
        <div class="toolbar">
            <el-breadcrumb class="sep-path">
                <el-breadcrumb-item v-for="path in sepPaths" :key="path.Path">
                    <a @click="onSepPathClick(path.Path)">{{ path.Name }}</a>
                </el-breadcrumb-item>
            </el-breadcrumb>
            <div class="toolbar-right">
                <el-input class="searchInput" v-model="keyWords" size="small" placeholder="输入路径前缀匹配">
                    <el-button @click="onSearch" slot="append" icon="fas fa-search"></el-button>
                </el-input>
                <el-button-group>
                    <el-button @click="uploadDlgVisible = true" type="primary" size="small" icon="fas fa-upload"> 上传
                    </el-button>
                    <el-button @click="onPrePage" :disabled="preBtnVisible" type="primary" size="small"
                               icon="fas fa-angle-left">上一页
                    </el-button>
                    <el-button @click="onNextPage" :disabled="nextBtnVisible" type="primary" size="small">下一页<i
                        class="fas fa-angle-right"></i></el-button>
                </el-button-group>
            </div>
            <div style="clear:both"></div>
        </div>
        <el-table border :data="resultData" :stripe="true" @row-click="onRowClick">
            <el-table-column prop="Name" label="Name">
                <template slot-scope="scope">
                    <i :class="objectIcon(scope.row)"></i>
                    <span style="margin-left: 10px">{{ scope.row.Name }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="Size" :formatter="formatSize" label="Size">
            </el-table-column>
            <el-table-column prop="ModifiedTime" :formatter="formatDate" label="LastModified">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button @click="onDownload(scope.row)" type="text" size="small">下载</el-button>
                    <el-button @click="onDelete(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 上传对话框 -->
        <el-dialog title="上传文件" :visible.sync="uploadDlgVisible" width="400px">
            <span>目标路径: <el-input v-model="uploadPath" size="small" placeholder="空上传至当前路径"></el-input></span>
            <el-upload drag :action="uploadUrl" :multiple="false" :http-request="uploadFile">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">不超过64Mb</div>
            </el-upload>
            <span slot="footer">
                <el-button type="primary" @click="uploadDlgVisible = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    props: {
        storeName: {type: String, required: true}
    },
    data() {
        return {
            resultData: [],
            keyWords: '',
            curPath: '/', // 当前路径
            preBtnVisible: false,
            nextBtnVisible: false,
            uploadDlgVisible: false, // 上传文件对话框是否打开
            uploadPath: '' // 上传对话框内是否指定目录
        }
    },
    computed: {
        sepPaths() {
            const paths = [{Name: 'Home', Path: '/'}];
            if (this.curPath === '/') {
                return paths
            }
            const sr = this.curPath.split('/');
            for (let i = 1; i < sr.length; ++i) {
                const p = sr.slice(0, i + 1).join('/');
                paths.push({Name: sr[i], Path: p})
            }
            return paths
        },
        // 组装上传url
        uploadUrl() {
            let url = '/blob/' + this.storeName;
            if (this.uploadPath === '') {
                if (this.curPath !== '/') {
                    url += this.curPath
                }
            } else {
                if (this.uploadPath !== '/') {
                    url += this.uploadPath
                }
            }
            return url
        }
    },

    methods: {
        listObjects() {
            const _this = this;
            $runtime.channel.invoke('sys.DesignService.GetBlobObjects', [this.storeName, this.curPath]).then(res => {
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
            let url = '/blob/' + this.storeName + this.curPath
            if (!this.curPath.endsWith('/'))
                url += '/'
            url += row.Name + '?v=sys.DesignService.CanDownload'
            window.open(url)
        },
        onDelete(row) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var _this = this
                $runtime.channel.invoke('sys.DesignService.DeleteBlobObject', [this.storeName, this.curPath + row.Name]).then(res => {
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
            // if (cellValue && !(row.Name.charAt(row.Name.length - 1) === '/')) {
            //     const date = new Date(+new Date(cellValue) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
            //     return date
            // } else {
            //     return null
            // }
            return cellValue
        },
        formatSize(row, column, cellValue) {
            if (cellValue) {
                const size = cellValue / 1024;
                return size.toFixed(3) + 'KB'
            } else {
                return null
            }
        },
        objectIcon(row) {
            return row.IsFile ? 'fas fa-file' : 'fas fa-folder'
        },
        /** 自定义上传文件至BlobStore */
        uploadFile(params) {
            let url = params.action;
            const file = params.file;
            url += '/' + file.name + '?v=sys.DesignService.CanUpload'
            return axios.post(url, file, {headers: {'Content-Type': file.type}})
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
