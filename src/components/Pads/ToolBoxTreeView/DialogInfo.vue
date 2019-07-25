<template>
    <div>
        <h3>{{info.Label}}</h3>
        <el-table v-if="info.Type === 'attributes'" :data="info.Options" fit>
            <el-table-column prop="Name" label="参数"></el-table-column>
            <el-table-column prop="Explanation" label="说明"></el-table-column>
            <el-table-column prop="Type" label="类型"></el-table-column>
            <el-table-column prop="OptionalValue" label="可选值"></el-table-column>
            <el-table-column prop="Defaults" label="默认值"></el-table-column>
        </el-table>
        <el-table v-if="info.Type === 'objectInfo'" :data="info.Options" fit>
            <el-table-column prop="Name" label="参数"></el-table-column>
            <el-table-column prop="Explanation" label="说明"></el-table-column>
            <el-table-column prop="Type" label="类型"></el-table-column>
            <el-table-column prop="OptionalValue" label="可选值"></el-table-column>
            <el-table-column prop="Defaults" label="默认值"></el-table-column>
        </el-table>
        <el-table v-if="info.Type === 'events'" :data="info.Options" fit>
            <el-table-column prop="Name" label="事件名"></el-table-column>
            <el-table-column prop="Explanation" label="说明"></el-table-column>
            <el-table-column prop="CallBackArg" label="回调参数"></el-table-column>
        </el-table>
        <el-table v-if="info.Type === 'methods'" :data="info.Options" fit>
            <el-table-column prop="Name" label="方法名"></el-table-column>
            <el-table-column prop="Explanation" label="说明"></el-table-column>
            <el-table-column prop="CallBackArg" label="参数"></el-table-column>
        </el-table>
        <el-table v-if="info.Type === 'slot'" :data="info.Options" fit>
            <el-table-column prop="Name" label="名称"></el-table-column>
            <el-table-column prop="Explanation" label="说明"></el-table-column>
        </el-table>
        <el-table v-if="info.Type === 'options'" :data="info.Options" fit>
            <el-table-column prop="Name" label="参数"></el-table-column>
            <el-table-column prop="Explanation" label="说明"></el-table-column>
            <el-table-column prop="Type" label="类型"></el-table-column>
            <el-table-column prop="OptionalValue" label="可选值"></el-table-column>
            <el-table-column prop="Defaults" label="默认值"></el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
        }
    },
    props: {
        info: { type: Object, required: true }
    },
    methods: {
    },
    mounted() {
        console.log(this.info)
    }
}
</script>
