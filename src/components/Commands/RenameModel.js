import store from "@/design/DesignStore";
import DesignNodeType from '@/design/DesignNodeType'
import ModelReferenceType from '@/design/ModelReferenceType'
import Vue from "vue";
import RenameDialog from "@/components/Commands/RenameDialog";

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

    const dlg = Vue.component('RenameDialog', RenameDialog);
    store.ide.showDialog(dlg, {
        target: node.Text,
        targetModel: node,
        targetType: refType,
        oldName: node.Text,
        renameModel: true
    })

}
