import TextBoxEditor from './TextBoxEditor'
import CheckBoxEditor from './CheckBoxEditor'
import SelectEditor from './SelectEditor'

let editors = {
    TextBox: TextBoxEditor,
    CheckBox: CheckBoxEditor,
    Select: SelectEditor
}

export function registerEditor(type, component) {
    editors[type] = component
}

export function getEditor(/* String */ type) {
    return editors[type]
}