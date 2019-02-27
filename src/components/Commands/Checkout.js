// 签出设计节点以准备编辑

import store from '@/design/DesignStore'
import DesignNodeType from '@/design/DesignNodeType'

export default function () {
    var node = store.tree.currentNode
    if (node) {
        // 已经签出或被其他人签出处理
        if (node.CheckoutBy) {
            if (node.CheckoutBy !== 'Me') {
                store.ide.$message.error('签出节点失败：已被他人签出，请刷新重试')
            }
            return
        }

        if (node.Type >= DesignNodeType.EntityModelNode ||
            node.Type === DesignNodeType.DataStoreNode ||
            node.Type === DesignNodeType.ModelRootNode) { // 模型根节点、模型节点或存储节点
            $runtime.channel.invoke('sys.DesignService.Checkout', [node.Type, node.ID]).then(res => {
                // 通知store激发NodeCheckout事件
                store.emitEvent('NodeCheckout', node, res)
                store.ide.$message.success('签出节点: ' + node.Text + '成功')
            }).catch(err => {
                store.ide.$message.error('签出节点失败: ' + err)
            })
        } else {
            store.ide.$message.warning('无法签出该类型节点')
        }
    }
}
