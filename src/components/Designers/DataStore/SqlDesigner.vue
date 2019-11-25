<template>
    <div>
        <div class="storeHeader">
            <span>SqlStore Settings</span>
        </div>
        <div class="storeContent">
           <table cellspacing="15px" style="font-size:14px;">
               <tr>
                    <td>Host:</td>
                    <td>
                        <el-input v-model="settings.Host" style="width:350px;"></el-input>
                    </td>
                </tr>
                <tr>
                    <td>Port:</td>
                    <td>
                        <el-input v-model="settings.Port"></el-input>
                    </td>
                </tr>
                <tr>
                    <td>Database:</td>
                    <td>
                        <el-input v-model="settings.Database" style="width:350px;"></el-input>
                    </td>
                </tr>
                <tr>
                    <td>User:</td>
                    <td>
                        <el-input v-model="settings.User"></el-input>
                    </td>
                </tr>
                <tr>
                    <td>Password:</td>
                    <td>
                        <el-input v-model="settings.Password" type="password"></el-input>
                    </td>
                </tr>   
            </table>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            // width: { type: Number, required: true },
            // height: { type: Number, required: true },
            target: { type: Object, required: true } // DataStoreModel
        },

        data() {
            return {
                settings: {
                    Host: '',
                    Port: '',
                    Database: '',
                    User: '',
                    Password: ''
                }
            }
        },

        methods: {
            save() {
                let _this = this
                let settingsValue = JSON.stringify(this.settings) //json传输
                let args = [this.target.ID, settingsValue]
                $runtime.channel.invoke('sys.DesignService.SaveDataStore', args).then(res => {
                    _this.target.Settings = settingsValue // 更新模型的值
                    _this.$message.success('Save DataStore success!')
                }).catch(err => {
                    _this.$message.error('Save DataStore error: ' + err)
                })
            }
        }, 

        mounted() {
            if (this.target.Settings) {
                this.settings = JSON.parse(this.target.Settings)
            }
        }
    }

</script>
<style scoped>
    .storeHeader {
        line-height: 45px;
        font-weight: bold;
        padding: 0 10px;
        height: 45px;
        box-shadow: 0 3px 3px #ccc
    }

    .storeHeader>table td {
        padding: 0;
    }

    .storeContent {
        padding: 20px 10px;
    }
</style>