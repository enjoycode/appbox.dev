
export default class Grouping {
    private readonly _node: Element;
    public get Node(): Node { return this._node; }

    public get Name(): string { return this._node.getAttribute("Name"); }
    public set Name(value) { this._node.setAttribute("Name", value); }

    constructor(node: Node) {
        this._node = node as Element;
    }
}