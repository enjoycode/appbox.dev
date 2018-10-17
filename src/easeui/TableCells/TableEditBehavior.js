
export default function (tableBody) {
    if (!tableBody._cellEditBehavior) {
        tableBody._cellEditBehavior = {
            currentIndex: -1,
            currentEditor: null,
            onCellClick(row, column, cell, event) {
                // 循环子集找到组件实例，从1开始忽略tableBody的第一个tooltip子组件
                var newEditor = null
                var newIndex = -1
                for (var i = 1; i < tableBody.$children.length; i++) {
                    var element = tableBody.$children[i]
                    if (element.$el.parentNode.parentNode === cell) {
                        newEditor = element
                        newIndex = i
                        break
                    }
                }
                let behavior = tableBody._cellEditBehavior
                // 取消之前的CellEditor
                let oldEditor = behavior.currentEditor
                if (oldEditor) {
                    oldEditor.editing = false
                    behavior.currentEditor = null
                }
                // 激活当前的CellEditor
                if (newEditor && newEditor.editing !== undefined) {
                    newEditor.editing = true
                    behavior.currentEditor = newEditor
                    behavior.currentIndex = newIndex
                }
                // 绑定或取消window的键盘事件
                if (oldEditor && newEditor === null) { // 取消
                    window.removeEventListener('keydown', behavior.onWindowKeydown, true)
                } else if (oldEditor === null && newEditor) { // 绑定
                    window.addEventListener('keydown', behavior.onWindowKeydown, true)
                }
            },
            onWindowKeydown(e) {
                if (e.keyCode === 27) { //Escape取消编辑模式
                    e.stopPropagation()
                    let behavior = tableBody._cellEditBehavior
                    behavior.currentEditor.editing = false
                    behavior.currentEditor = null
                    window.removeEventListener('keydown', behavior.onWindowKeydown, true)
                }
                // todo:处理其他导航键,eg:Tab
            }
        }
        // 绑定相关事件
        let table = tableBody.$parent
        table.$on('cell-click', tableBody._cellEditBehavior.onCellClick)
    }
}