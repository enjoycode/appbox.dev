let ToolBoxGroups = []

const Set = function (name, Icon, Items = []) {
	let ToolBoxGroup = {}
	ToolBoxGroup.Name = name
	ToolBoxGroup.Item = Items
	ToolBoxGroup.Icon = Icon
	ToolBoxGroup.Type = 0
    ToolBoxGroups.push(ToolBoxGroup)
}

const Get = function () {
	let item = ToolBoxGroups
	ToolBoxGroups = []
	return item
}

module.exports = {
	Set,
	Get
}
