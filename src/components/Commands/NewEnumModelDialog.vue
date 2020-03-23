<template>
    <el-dialog title="New Enum" :visible.sync="visible" :close-on-click-modal="false" @close="onClose">
        <el-form :model="viewModel" ref="enumModel" :rules="rules" label-width="120px" label-position="right">
            <el-form-item prop="Name" :required="true" label="Name">
                <el-input v-model="viewModel.Name" ></el-input>
            </el-form-item>
            <el-form-item prop="Comment" label="Comment">
                <el-input v-model="viewModel.Comment" ></el-input>
            </el-form-item>
            <el-form-item prop="IsFlag" label="IsFlag">
                <el-checkbox v-model="viewModel.IsFlag"></el-checkbox>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :disabled="caDisabled" @click="visible = false">Cancel</el-button>
            <el-button :disabled="okDisabled" type="primary" @click="submit('enumModel')">Ok</el-button>
        </div>
    </el-dialog>
</template>

<<script>
import store from '@/design/DesignStore'

export default {
  data() {
      return {
        visible: true,
        okDisabled: false, // ok按钮是否禁用
        caDisabled: false, // cancel按钮是否禁用
        viewModel: {
            Name: '',
            Comment: '',
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
                  this.viewModel.Comment,
                  this.viewModel.IsFlag
                  ]
              // 获取实体属性
              $runtime.channel.invoke('sys.DesignService.NewEnumModel', args).then(res => {
                  // 根据返回结果添加新节点
                  store.tree.onNewNode(res)
                  _this.$message.success('New enum succeed')
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
            return callback(new Error('Name can not be null！'))
          }
          // TODO 验证名称的合法性
          callback()
      }
  }
}
</script>
