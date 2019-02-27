// 删除实体成员

import store from '@/design/DesignStore'
import { Message, MessageBox } from 'element-ui'

export default function () {
    var designer = store.designers.getActiveDesigner()
    if (!designer || designer.designerType !== 'EntityDesigner' || !designer.currentMember) {
        Message.warning('请在实体设计器内选择要删除的成员再进行此操作')
        return false
    }
    var modelId = designer.target.ID
    var memberName = designer.currentMember.Name

    // if (memberName === 'ID' && designer.storeType === 'Sql') {
    //     Message.warning('此成员不允许删除')
    //     return false
    // }

    MessageBox.confirm('Are you sure to delete member: ' + memberName, 'Confirm', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
    }).then(() => {
        // 获取实体属性
        $runtime.channel.invoke('sys.DesignService.DeleteEntityMember', [modelId, memberName]).then(res => {
            // 判断结果是否是引用列表
            if (res && res.length) {
                store.usages.update(res)
                Message.error('Member has references, can not delete')
            } else {
                // 移除选中成员
                designer.removeCurrentMember()
                Message.success('Delete member succeed')
            }
        }).catch(err => {
            Message.error(err)
        })
    }).catch(() => {
        // 此处为点击了取消按钮
    })
}
