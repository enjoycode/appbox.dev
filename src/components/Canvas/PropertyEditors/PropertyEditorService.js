import TextBoxEditor from './TextBoxEditor'
import CheckBoxEditor from './CheckBoxEditor'

let editors = {
    TextBox: TextBoxEditor,
    CheckBox: CheckBoxEditor
}

export function registerEditor(type, component) {
    editors[type] = component
}

export function getEditor(/* String */ type) {
    return editors[type]
}