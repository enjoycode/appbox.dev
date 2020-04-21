<template>
    <div class="ide-property-panel">
        <h4 class="propertyPanel-title">{{ownerType}}</h4>
        <el-collapse class="ide-property-collapse" :value="expands">
            <el-collapse-item v-for="catalog in catalogs" :key="catalog.name" :title="catalog.name" :name="catalog.name">
                <el-form label-position="right" size="mini" label-width="120px">
                    <el-form-item v-for="item in catalog.items" :key="item.title" :label="item.title + ':'">
                        <component ref="editors" :is="item.editor" :target="item"></component>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
export default {
    data() {
        return {
            ownerType: '',
            expands: [], // 展开所有分类
            // catalogs: [ { name: '属性', items: [{ title: '属性1', name: 'X' }, { title: '属性2', name: 'Y' }] } ]
            catalogs: [],
            DesignService: null //创建DesignService时设置
        }
    },
    methods: {
        setPropertyOwner(owner) {
            if (!owner) {
                this.ownerType = ''
                this.expands = []
                this.catalogs = []
                return
            }

            this.ownerType = owner.getPropertyOwnerType()
            var cats = owner.getPropertyItems()
            if (cats) {
                this.expands.splice(0, this.expands.length)
                for (const cat of cats) {
                    this.expands.push(cat.name)
                    for (const item of cat.items) {
                        item.editor = this.DesignService.GetPropertyEditor(item.editor)
                    }
                }
                this.catalogs = cats
            } else {
                this.catalogs = []
            }
        },
        /** 刷新指定属性的值 */
        refreshProperty(propName) {
            for (const editor of this.$refs.editors) {
                if (editor.target.title === propName) {
                    editor.refresh()
                    return
                }
            }
            console.warn("Can't find Property: " + propName)
        }
    }
}
</script>

<style scoped>
.propertyPanel-title {
    margin-top: 5px;
    margin-bottom: 5px;
}
</style>