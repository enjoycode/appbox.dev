// 删除实体成员

import store from '../DesignStore'
import { Message, MessageBox } from 'easeui'

module.exports = function () {
    var activeDesigner = store.designers.getActiveDesigner()
    if (!activeDesigner || !activeDesigner.currentMember) {
        Message.warning('请选择要删除的成员')
        return false
    }
    var modelId = activeDesigner.target.ID
    var memberName = activeDesigner.currentMember.Name

    MessageBox.confirm('确定删除选中的枚举成员吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            // 获取实体属性
            store.channel.invoke('sys.DesignService.DeleteEnumItem', [modelId, memberName]).then(res => {
                // 移除选中成员
                activeDesigner.removeCurrentMember()
                Message.success('删除成功')
            }).catch(err => {
                Message.error(err)
            })
        }).catch(() => {
            // 此处为点击了取消按钮
            // console.dir(err)
            // Message.error(err)
        })
}
