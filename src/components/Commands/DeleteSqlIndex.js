// 删除索引

import store from '@/design/DesignStore'
import { Message, MessageBox } from 'element-ui'

export default function () {
    var designer = store.designers.getActiveDesigner()
    if (!designer || designer.designerType !== 'EntityDesigner' || designer.storeType !== 'Sql') {
        Message.warning('请在映射至Sql存储的实体设计器内进行此操作')
        return false
    }
    var index = designer.getCurrentIndex()
    if (!index) {
        Message.warning('请切换至索引管理视图并选择某一索引后再进行此操作')
        return false
    }

    MessageBox.confirm('确定删除选中的索引吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        let args = [designer.target.ID, 'DeleteIndex', index.ID]
        $runtime.channel.invoke('sys.DesignService.ChangeSqlOptions', args).then(res => {
            designer.removeIndex(index)
        }).catch(err => {
            Message.error(err)
        })
    }).catch(() => {
        // 此处为点击了取消按钮
    })
}
