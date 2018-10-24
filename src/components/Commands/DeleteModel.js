// 删除模型

import { Message, MessageBox } from 'easeui'
import store from '../DesignStore'

module.exports = function () {
    var selectNode = store.tree.currentNode
    if (!selectNode) {
        Message.warning('请选择要删除的节点')
        return false
    }
    var nodeType = selectNode.Type
    // FolderNode = 6
    if ((nodeType < 6 && nodeType !== 3) || (nodeType === 6 && selectNode.Nodes.length > 0)) {
        Message.warning('不允许删除此节点')
        return false
    }
    MessageBox.confirm('确定删除选中的节点吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        // 获取实体属性
        store.channel.invoke('sys.DesignService.Delete', [selectNode.Type, selectNode.ID]).then(res => {
            // 移除选中节点
            store.tree.onDeleteNode(selectNode, res)
            // 移除选中节点对应的tab
            store.designers.removeTabByNode(selectNode)
            Message.success('删除成功')
        }).catch(err => {
            Message.error(err)
        })
    }).catch(() => {
        // 此处为点击了取消按钮
    })
}
