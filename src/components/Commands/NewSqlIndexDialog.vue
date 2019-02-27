<template>
    <e-dialog title="New Index" width="500px" :visible.sync="visible" :close-on-click-modal="false" @close="onClose">
        <e-form :model="indexInfo" ref="viewModel" label-width="80px" label-position="right">
            <e-form-item prop="Comment" label="Comment:">
                <e-input v-model="indexInfo.Comment"></e-input>
            </e-form-item>
            <e-form-item label="Fields:">
                <e-select value-key="Name" v-model="indexInfo.Fields" multiple style="width:100%">
                    <e-option v-for="item in members" :key="item.Name" :label="item.Name" :value="{Name: item.Name, OrderDesc: false}" :disabled="disabledMember(item)">
                    </e-option>
                </e-select>
            </e-form-item>
            <e-form-item label="Order:" v-show="indexInfo.Fields.length > 0">
                <span v-for="item in indexInfo.Fields">{{ item.Name }}:
                    <e-switch v-model="item.OrderDesc" active-text="DESC" inactive-text="ASC"></e-switch>
                    &nbsp;
                </span>
            </e-form-item>
            <e-form-item label="">
                <e-checkbox v-model="indexInfo.Unique">Unique</e-checkbox>
            </e-form-item>
        </e-form>
        <div slot="footer" class="dialog-footer">
            <e-button :disabled="caDisabled" @click="visible = false">Cancel</e-button>
            <e-button :disabled="okDisabled" type="primary" @click="addIndex">OK</e-button>
        </div>
    </e-dialog>
</template>

<script>
    import store from '@/design/DesignStore'

    export default {
        data() {
            return {
                visible: true,
                caDisabled: false,
                okDisabled: false,
                designer: null, // 当前的实体模型设计器实例
                members: [],
                indexInfo: {
                    Comment: '',
                    Unique: false,
                    Fields: []
                }
                // rules: {
                //     Name: [
                //         { validator: this.validateName, trigger: 'change' }
                //     ]
                // }
            }
        },

        methods: {
            onClose(e) {
                this.$emit('close')
            },
            /** 用于判断该成员是否可选 */
            disabledMember(member) {
                return member.Name === 'ID' || member.Type !== 0
            },
            addIndex() {
                if (this.indexInfo.Fields.length === 0) {
                    this.$message.error('未设置索引字段')
                    return
                }

                let args = [this.designer.target.ID, 'AddIndex', JSON.stringify(this.indexInfo)]
                let _this = this
                $runtime.channel.invoke('sys.DesignService.ChangeSqlOptions', args).then(res => {
                    _this.designer.addIndex(res)
                    _this.visible = false
                }).catch(err => {
                    _this.$message.error(err)
                })
            }
        },

        mounted() {
            this.designer = store.designers.getActiveDesigner()
            this.members = this.designer.members
        }
    }
</script>