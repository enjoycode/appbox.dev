import ReportRootDesigner from './ReportRootDesigner';
import XmlUtil from './XmlUtil';

export class ReportEmbeddedImage {
    private readonly _owner: ReportEmbeddedImages;
    private readonly _node: Element;
    public get Node(): Node { return this._node; }

    public get Name(): string { return this._node.getAttribute("Name"); }
    public set Name(value) { this._node.setAttribute("Name", value); }

    public get ImageData(): string {
        let n = XmlUtil.GetNamedChildNode(this._node, "ImageData");
        if (!n) { return ""; }
        return n.textContent;
    }
    public set ImageData(value) {
        let n = XmlUtil.GetOrCreateChildNode(this._node, "ImageData");
        n.textContent = value;
    }

    constructor(owner: ReportEmbeddedImages, node: Node) {
        this._owner = owner;
        this._node = node as Element;
    }
}

export default class ReportEmbeddedImages {

    private readonly _owner: ReportRootDesigner;
    private _node: Node; // EmbeddedImages node of Report
    private readonly _items: ReportEmbeddedImage[] = [];
    public get Items(): ReportEmbeddedImage[] { return this._items; }

    constructor(owner: ReportRootDesigner) {
        this._owner = owner;
        this._node = XmlUtil.GetNamedChildNode(owner.XmlNode, "EmbeddedImages");
        if (this._node) {
            for (const cnode of this._node.childNodes) {
                if (cnode.nodeType !== Node.ELEMENT_NODE) { continue; }
                this._items.push(new ReportEmbeddedImage(this, cnode));
            }
        }
    }

    public Add(name: string, data: string): void {
        //TODO: check name exists
        if (!this._node) {
            this._node = XmlUtil.CreateChildNode(this._owner.XmlNode, "EmbeddedImages");
        }
        let cnode = XmlUtil.CreateChildNode(this._node, "EmbeddedImage");
        let ds = new ReportEmbeddedImage(this, cnode);
        ds.Name = name;
        ds.ImageData = data;
        this._items.push(ds);
    }

    public Remove(img: ReportEmbeddedImage): void {
        //TODO: 检查是否有引用
        this._node.removeChild(img.Node);
        this._items.splice(this._items.indexOf(img), 1);
        if (this._items.length === 0) {
            this._owner.XmlNode.removeChild(this._node);
            this._node = null;
        }
    }

}