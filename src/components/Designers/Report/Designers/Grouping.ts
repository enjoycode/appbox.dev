import XmlUtil from './XmlUtil';

export default class Grouping {
    private readonly _node: Element;
    public get Node(): Node { return this._node; }

    public get Name(): string { return this._node.getAttribute("Name"); }
    public set Name(value) { this._node.setAttribute("Name", value); }

    //TODO: 暂只支持一个表达式
    public get Expression(): string {
        let expsNode = XmlUtil.GetNamedChildNode(this._node, "GroupExpressions");
        if (!expsNode || !expsNode.hasChildNodes()) { return ""; }
        return expsNode.childNodes[0].textContent;
    }
    public set Expression(value) {
        let expsNode = XmlUtil.GetOrCreateChildNode(this._node, "GroupExpressions");
        if (!expsNode.hasChildNodes()) {
           XmlUtil.CreateChildNode(expsNode, "GroupExpression")
        } 
        expsNode.childNodes[0].textContent = value;
    }

    constructor(node: Node) {
        this._node = node as Element;
    }
}