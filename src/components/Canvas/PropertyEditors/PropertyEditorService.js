import TextBoxEditor from './TextBoxEditor'

let editors = {
    TextBox: TextBoxEditor
}

export function registerEditor(type, component) {
    editors[type] = component
}

export function getEditor(/* String */ type) {
    return editors[type]
}