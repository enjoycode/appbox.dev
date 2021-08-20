import {monaco} from "@/components/CodeEditor/EditorService";
import DesignStore from "@/design/DesignStore";
import ModelReferenceType from "@/design/ModelReferenceType";
import { Message } from 'element-ui'

export default {
    id: 'FindUsages',
    label: 'Find Usages',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.F11],
    contextMenuGroupId: 'navigation',
    run: function (/*ICodeEditor*/editor) {
        const model = editor.getModel()
        const position = editor.getPosition()
        const args = [ModelReferenceType.CodeEditor, model.fileName, position.lineNumber, position.column]
        $runtime.channel.invoke('sys.DesignService.FindUsages', args).then(res => {
            DesignStore.usages.update(res)
        }).catch(err => {
           Message.error(err)
        })
    }
}
