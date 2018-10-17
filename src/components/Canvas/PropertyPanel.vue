<template>
    <div class="ide-property-panel">
        <h4 class="propertyPanel-title">{{ownerType}}</h4>
        <e-collapse class="ide-property-collapse" :value="expands">
            <e-collapse-item v-for="catalog in catalogs" :key="catalog.name" :title="catalog.name" :name="catalog.name">
                <e-form label-position="right" size="mini" label-width="100px">
                    <e-form-item v-for="item in catalog.items" :key="item.title" :label="item.title">
                        <component :is="item.editor" :target="item"></component>
                    </e-form-item>
                </e-form>
            </e-collapse-item>
        </e-collapse>
    </div>
</template>

<script>
    import { getEditor } from './PropertyEditors/PropertyEditorService'

    export default {
        data() {
            return {
                ownerType: '',
                expands: [], // 展开所有分类
                // catalogs: [ { name: '属性', items: [{ title: '属性1', name: 'X' }, { title: '属性2', name: 'Y' }] } ]
                catalogs: []
            }
        },
        methods: {
            setPropertyOwner(owner) {
                this.ownerType = owner.getPropertyOwnerType()
                var cats = owner.getPropertyItems()
                if (cats) {
                    this.expands.splice(0, this.expands.length)
                    for (var i = 0; i < cats.length; i++) {
                        var cat = cats[i]
                        this.expands.push(cat.name)
                        for (var j = 0; j < cat.items.length; j++) {
                            var item = cat.items[j]
                            item.editor = getEditor(item.editorType)
                        }
                    }
                    this.catalogs = cats
                } else {
                    this.catalogs = []
                }
            }
        }
    }

</script>

<style scoped>
    .propertyPanel-title {
        margin-left: 10px;
        margin-top: 5px;
        margin-bottom: 5px;
    }
</style>