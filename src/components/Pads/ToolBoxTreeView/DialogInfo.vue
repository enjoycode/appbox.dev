<template>
    <div>
        <h3>{{info.Label}}</h3>
        <e-table v-if="info.Type === 'attributes'" :data="info.Options" fit>
            <e-table-column prop="Name" label="参数"></e-table-column>
            <e-table-column prop="Explanation" label="说明"></e-table-column>
            <e-table-column prop="Type" label="类型"></e-table-column>
            <e-table-column prop="OptionalValue" label="可选值"></e-table-column>
            <e-table-column prop="Defaults" label="默认值"></e-table-column>
        </e-table>
        <e-table v-if="info.Type === 'objectInfo'" :data="info.Options" fit>
            <e-table-column prop="Name" label="参数"></e-table-column>
            <e-table-column prop="Explanation" label="说明"></e-table-column>
            <e-table-column prop="Type" label="类型"></e-table-column>
            <e-table-column prop="OptionalValue" label="可选值"></e-table-column>
            <e-table-column prop="Defaults" label="默认值"></e-table-column>
        </e-table>
        </e-table>
        <e-table v-if="info.Type === 'events'" :data="info.Options" fit>
            <e-table-column prop="Name" label="事件名"></e-table-column>
            <e-table-column prop="Explanation" label="说明"></e-table-column>
            <e-table-column prop="CallBackArg" label="回调参数"></e-table-column>
        </e-table>
        <e-table v-if="info.Type === 'methods'" :data="info.Options" fit>
            <e-table-column prop="Name" label="方法名"></e-table-column>
            <e-table-column prop="Explanation" label="说明"></e-table-column>
            <e-table-column prop="CallBackArg" label="参数"></e-table-column>
        </e-table>
        <e-table v-if="info.Type === 'slot'" :data="info.Options" fit>
            <e-table-column prop="Name" label="名称"></e-table-column>
            <e-table-column prop="Explanation" label="说明"></e-table-column>
        </e-table>
        <e-table v-if="info.Type === 'options'" :data="info.Options" fit>
            <e-table-column prop="Name" label="参数"></e-table-column>
            <e-table-column prop="Explanation" label="说明"></e-table-column>
            <e-table-column prop="Type" label="类型"></e-table-column>
            <e-table-column prop="OptionalValue" label="可选值"></e-table-column>
            <e-table-column prop="Defaults" label="默认值"></e-table-column>
        </e-table>
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
