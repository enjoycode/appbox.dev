<template>
    <e-dialog title="新建枚举模型" :visible.sync="visible" :close-on-click-modal="false" @close="onClose">
        <e-form :model="viewModel" ref="enumModel" :rules="rules" label-width="120px" label-position="right">
            <e-form-item prop="Name" :required="true" label="名称">
                <e-input v-model="viewModel.Name" ></e-input>
            </e-form-item>
            <e-form-item prop="LocalizedName" label="本地化名称">
                <e-input v-model="viewModel.LocalizedName" ></e-input>
            </e-form-item>
            <e-form-item prop="IsFlag" label="启用Flag标记">
                <e-checkbox v-model="viewModel.IsFlag"></e-checkbox>
            </e-form-item>
        </e-form>
        <div slot="footer" class="dialog-footer">
            <e-button :disabled="caDisabled" @click="visible = false">取 消</e-button>
            <e-button :disabled="okDisabled" type="primary" @click="submit('enumModel')">确 定</e-button>
        </div>
    </e-dialog>
</template>

<<script>
import store from '../DesignStore'

export default {
  data() {
      return {
        visible: true,
        okDisabled: false, // ok按钮是否禁用
        caDisabled: false, // cancel按钮是否禁用
        viewModel: {
            Name: '',
            LocalizedName: '',
            IsFlag: false
        },
        rules: {
            Name: [
                { validator: this.validateName, trigger: 'change' }
            ]
        }
      }
  },
  computed: {
      treeOption () {
          return { label: 'Text', children: 'Nodes' }
      }
  },
  methods: {
      onClose: function (e) {
          this.$emit('close')
      },
      submit: function (formName) {
          this.$refs[formName].validate((valid) => {
              if (!valid) {
                  return false
              }
              this.okDisabled = true
              this.caDisabled = true

              var node = store.tree.currentNode
              var _this = this
              var args = [
                  node.Type,
                  node.ID,
                  this.viewModel.Name,
                  this.viewModel.LocalizedName,
                  this.viewModel.IsFlag
                  ]
              // 获取实体属性
              this.$channel.invoke('sys.DesignHub.NewEnumModel', args).then(res => {
                  // 根据返回结果添加新节点
                  store.tree.onNewNode(res)
                  _this.$message.success('添加成功')
                  _this.visible = false
                  _this.caDisabled = false
              }).catch(err => {
                  _this.okDisabled = false
                  _this.caDisabled = false
                  _this.$message.error(err)
              })
          })
      },
      validateName: function (rule, value, callback) {
          if (!value) {
            return callback(new Error('名称不能为空！'))
          }
          // TODO 验证名称的合法性
          callback()
      }
  },
  mounted: function () {
  }
}
</script>
