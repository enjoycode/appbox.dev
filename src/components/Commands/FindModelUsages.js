import store from "@/design/DesignStore";
import DesignNodeType from '@/design/DesignNodeType'
import ModelReferenceType from '@/design/ModelReferenceType'

export default function () {
    const node = store.tree.currentNode;
    if (!node) {
        store.ide.$message.warning('Please select a model node first')
        return
    }

    let refType;
    switch (node.Type) {
        case DesignNodeType.EntityModelNode:
            refType = ModelReferenceType.EntityModelID;
            break;
        case DesignNodeType.EnumModelNode:
            refType = ModelReferenceType.EnumModelID;
            break;
        case DesignNodeType.ServiceModelNode:
            refType = ModelReferenceType.ServiceModelID;
            break;
    }

    if (!refType) {
        store.ide.$message.warning('Not supported node')
        return;
    }

    let args = [refType, node.ID, null]
    $runtime.channel.invoke('sys.DesignService.FindUsages', args).then(res => {
        store.usages.update(res)
    }).catch(err => {
        store.ide.$message.error(err)
    })

}
