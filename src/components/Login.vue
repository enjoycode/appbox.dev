<template>
    <div class="align-center">
        <e-card>
            <div slot="header" style="text-align: center">AppBox Studio</div>
            <e-input v-model="user" placeholder="Account..." prefix-icon="fas fa-user"> </e-input>
            <br>
            <br>
            <e-input v-model="pwd" type="password" placeholder="Password..." prefix-icon="fas fa-lock"> </e-input>
            <br>
            <br>
            <e-button @click="onLoginClick" type="primary" :loading="loading" style="width:100%">Login</e-button>
        </e-card>
    </div>
</template>

<script>
    export default {
        name: 'login',
        data() {
            return {
                user: '',
                pwd: '',
                loading: false
            }
        },

        methods: {
            onLoginClick() {
                var _this = this
                _this.loading = true
                this.$channel.login(this.user, this.pwd).then(res => {
                    _this.$router.replace('IDE')
                }).catch(err => {
                    _this.loading = false
                    _this.$message.error('Login failed: ' + err)
                })
            }
        }
    }

</script>

<style scoped>
    .align-center {
        position: fixed;
        left: 40%;
        top: 20%;
        margin-left: width/2;
        margin-top: height/2;
    }
</style>