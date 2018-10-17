// 删除实体成员

import store from '../DesignStore'
import { Message, MessageBox } from 'easeui'

module.exports = function () {
    var designer = store.designers.getActiveDesigner()
    if (!designer || designer.designerType !== 'EntityDesigner' || !designer.currentMember) {
        Message.warning('请在实体设计器内选择要删除的成员再进行此操作')
        return false
    }
    var modelId = designer.target.ID
    var memberName = designer.currentMember.Name

    if (memberName === 'ID' && designer.storeType === 'Sql') {
        Message.warning('此成员不允许删除')
        return false
    }

    MessageBox.confirm('确定删除选中的实体成员吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        // 获取实体属性
        store.channel.invoke('sys.DesignHub.DeleteEntityMember', [modelId, memberName]).then(res => {
            // 判断结果是否是引用列表
            if (res.length) {
                store.usages.update(res)
                Message.error('存在引用项，无法删除')
            } else {
                // 移除选中成员
                designer.removeCurrentMember()
                Message.success('删除成功')
            }
        }).catch(err => {
            Message.error(err)
        })
    }).catch(() => {
        // 此处为点击了取消按钮
    })
}
