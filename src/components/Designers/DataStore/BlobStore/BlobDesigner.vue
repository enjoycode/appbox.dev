<template>
    <div>
        <div class="ossStoreHeader">
            <e-radio-group fill="#0994ff" v-model="storeView" size="small" style="margin-left:40px;">
                <e-radio-button label="reportView">统计信息</e-radio-button>
                <e-radio-button label="listView">文件管理</e-radio-button>
            </e-radio-group>
        </div>
        <div class="ossStoreContent">
            <table v-if="storeView==='reportView'" cellspacing="15px" style="font-size:14px;">
                <tr>
                    <td>待实现</td>
                    <td></td>
                </tr>
            </table>
            <list-view v-if="storeView==='listView'" :storeName="target.App" ref="storeView"></list-view>
        </div>
    </div>
</template>

<script>
    import ListView from './BlobStoreList'

    export default {
        props: {
            target: { type: Object, required: true } // BlobStoreNode
        },
        components: {
            ListView: ListView
        },

        data() {
            return {
                storeView: 'listView'
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