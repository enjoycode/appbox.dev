import store from '@/design/DesignStore'
import DesignNodeType from '@/design/DesignNodeType'

export default function () {
    const node = store.tree.currentNode;
    if (node) {
        if (node.Type === DesignNodeType.ServiceModelNode ||
            node.Type === DesignNodeType.ViewModelNode) {
            $runtime.channel.invoke('sys.DesignService.GetAssembly', [node.Type, node.ID]).then(res => {
                store.ide.$message.success('Done')
            }).catch(err => {
                store.ide.$message.error('GetAssembly: ' + err)
            })
        } else {
            store.ide.$message.warning('Only Service or View node')
        }
    } else {
        store.ide.$message.warning('Please select Service or View node')
    }
}
