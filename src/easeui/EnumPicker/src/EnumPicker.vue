<template>
    <div>
        <el-radio-group v-if="type==='radio'" v-model="currentValue" @change="onChange">
            <el-radio class="radio" v-for="item in enumItems" :key="item.Value" :label="item.Value">{{item.Name}}</el-radio>
        </el-radio-group>
        <el-select v-if="type==='select'" v-model="currentValue" clearable placeholder="请选择" @change="onChange">
            <el-option
            v-for="item in enumItems"
            :key="item.Value"
            :label="item.Name"
            :value="item.Value">
            </el-option>
        </el-select>
    </div>
</template>

<script>
    export default {
            name: 'EnumPicker',
            data() {
                return {
                    currentValue: this.value,
                    enumItems: null
                }
            },
            props: {
                value: Number,
                enumModel: String,
                type: String,
            },
            computed: {
            },
            watch: {
                value(val) {
                    this.currentValue = val
                }
            },
            methods: {
                onChange(val) {
                    this.$emit('input', val)
                }
            },
            mounted() {
                if(this.enumModel){
                    var _this = this
                    $runtime.channel.invoke('sys.DesignService.GetEnumItems', [this.enumModel]).then(res => {
                        _this.enumItems = res
                        if(!_this.currentValue){
                            _this.currentValue = res[0].Value
                        }
                    }).catch(err => {
                        _this.$message.error(err)
                    })
                }
            }
        }
</script>
<style>
</style>
