<template>
    <div>
        <e-radio-group v-if="type==='radio'" v-model="currentValue" @change="onChange">
            <e-radio class="radio" v-for="item in enumItems" :key="item.Value" :label="item.Value">{{item.Name}}</e-radio>
        </e-radio-group>
        <e-select v-if="type==='select'" v-model="currentValue" clearable placeholder="请选择" @change="onChange">
            <e-option
            v-for="item in enumItems"
            :key="item.Value"
            :label="item.Name"
            :value="item.Value">
            </e-option>
        </e-select>
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
                    this.$channel.invoke('sys.DesignHub.GetEnumItems', [this.enumModel]).then(res => {
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
