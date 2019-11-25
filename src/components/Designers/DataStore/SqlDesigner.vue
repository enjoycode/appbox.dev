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
                        <el-input v-model="target.Settings.Host" style="width:350px;"></el-input>
                    </td>
                </tr>
                <tr>
                    <td>Port:</td>
                    <td>
                        <el-input v-model="target.Settings.Port"></el-input>
                    </td>
                </tr>
                <tr>
                    <td>Database:</td>
                    <td>
                        <el-input v-model="target.Settings.Database" style="width:350px;"></el-input>
                    </td>
                </tr>
                <tr>
                    <td>User:</td>
                    <td>
                        <el-input v-model="target.Settings.User"></el-input>
                    </td>
                </tr>
                <tr>
                    <td>Password:</td>
                    <td>
                        <el-input v-model="target.Settings.Password" type="password"></el-input>
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

        methods: {
            save() {
                let _this = this
                let settingsValue = JSON.stringify(this.target.Settings) //json传输
                let args = [this.target.ID, settingsValue]
                $runtime.channel.invoke('sys.DesignService.SaveDataStore', args).then(res => {
                    _this.$message.success('保存成功!')
                }).catch(err => {
                    _this.$message.error('保存失败: ' + err)
                })
            }
        }, 

        mounted() {
            if (!this.target.Settings) {
                this.target.Settings = {Host:'', Port: '', Database:'', User:'', Password: ''}
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