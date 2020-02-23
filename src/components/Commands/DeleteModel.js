// 删除模型

import { Message, MessageBox } from 'element-ui'
import store from '@/design/DesignStore'
import DesignNodeType from '@/design/DesignNodeType'

export default function () {
    var selectNode = store.tree.currentNode
    if (!selectNode) {
        Message.warning('Please select node first.')
        return false
    }
    var nodeType = selectNode.Type
    if ((nodeType < DesignNodeType.FolderNode && nodeType !== DesignNodeType.ApplicationNode)
        || (nodeType === DesignNodeType.FolderNode && selectNode.Nodes.length > 0)) {
        Message.warning('Can not delete this node.')
        return false
    }
    MessageBox.confirm('Are you sure to delete this node', 'Confirm', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
    }).then(() => {
        // 获取实体属性
        $runtime.channel.invoke('sys.DesignService.DeleteNode', [selectNode.Type, selectNode.ID]).then(res => {
            // 移除选中节点对应的tab
            store.designers.removeTabByNode(selectNode)  
            // 移除选中节点
            store.tree.onDeleteNode(selectNode, res)
            Message.success('Delete succeed')
        }).catch(err => {
            Message.error(err)
        })
    }).catch(() => {
        // 此处为点击了取消按钮
    })
}
