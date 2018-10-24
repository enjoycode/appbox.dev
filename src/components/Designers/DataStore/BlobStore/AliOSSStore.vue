<template>
    <div>
        <div class="ossStoreHeader">
            <span>BlobStore-阿里云OSS</span>
            <e-radio-group fill="#0994ff" v-model="storeView" size="small" style="margin-left:40px;">
                <e-radio-button label="settingView">基本配置</e-radio-button>
                <e-radio-button label="listView">存储列表</e-radio-button>
            </e-radio-group>
        </div>
        <div class="ossStoreContent">
            <table v-if="storeView==='settingView'" cellspacing="15px" style="font-size:14px;">
                <tr>
                    <td>访问标识(AccessKeyId):</td>
                    <td>
                        <e-input v-model="settings.AccessKeyId"></e-input>
                    </td>
                </tr>
                <tr>
                    <td>访问密钥(AccessKeySecret):</td>
                    <td>
                        <e-input v-model="settings.AccessKeySecret" type="password"></e-input>
                    </td>
                </tr>
                <tr>
                    <td>访问域名(Endpoint):</td>
                    <td>
                        <e-input v-model="settings.Endpoint" style="width:350px;"></e-input>
                    </td>
                </tr>
                <tr>
                    <td>安全连接(Https):</td>
                    <td>
                        <e-switch v-model="settings.Https" active-color="#13ce66"> </e-switch>
                    </td>
                </tr>
                <tr>
                    <td>存储空间(Bucket):</td>
                    <td>
                        <e-input v-model="settings.Bucket"></e-input>
                    </td>
                </tr>
            </table>
            <list-view v-if="storeView==='listView'" :storeName="target.ID" ref="storeView"></list-view>
        </div>
    </div>
</template>

<script>
    import ListView from './BlobStoreList'

    export default {
        props: {
            // width: { type: Number, required: true },
            // height: { type: Number, required: true },
            target: { type: Object, required: true } // DataStoreModel
        },

        data() {
            return {
                storeView: 'settingView',
                settings: {
                    AccessKeyId: '',
                    AccessKeySecret: '',
                    Https: false,
                    Endpoint: '',
                    Bucket: ''
                }
            }
        },

        components: {
            ListView: ListView
        },

        methods: {
            save() {
                let _this = this
                let settingsValue = JSON.stringify(this.settings)
                let args = [this.target.ID, settingsValue]
                this.$channel.invoke('sys.DesignService.SaveDataStore', args).then(res => {
                    _this.target.Settings = settingsValue // 更新模型的值
                    _this.$message.success('保存成功!')
                }).catch(err => {
                    _this.$message.error('保存失败: ' + err)
                })
            }
        },

        mounted() {
            if (this.target.Settings) {
                this.settings = JSON.parse(this.target.Settings)
                if (this.settings.Https === undefined) {
                    this.settings.Https = false
                }
            }
        }
    }

</script>
<style scoped>
    .ossStoreHeader {
        line-height: 45px;
        font-weight: bold;
        padding: 0 10px;
        height: 45px;
        box-shadow: 0 3px 3px #ccc
    }

    .ossStoreHeader>table td {
        padding: 0;
    }

    .ossStoreContent {
        padding: 20px 10px;
    }
</style>