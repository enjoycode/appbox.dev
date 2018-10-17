let ToolBoxItems = []

const Set = function (name, Icon, Item = []) {
	let ToolBoxItem = {}
	ToolBoxItem.Name = name
	ToolBoxItem.ItemInfo = Item
	ToolBoxItem.Icon = Icon
	ToolBoxItem.Type = 1
	ToolBoxItems.push(ToolBoxItem)
}

const Get = function () {
	var item = ToolBoxItems
	ToolBoxItems = []
	return item
}

module.exports = {
	Get,
	Set
}
