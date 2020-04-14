import XmlUtil from "./XmlUtil";
import { IPropertyCatalog } from '@/components/Canvas/Interfaces/IPropertyPanel';
import ReportXmlNodeDesigner from './ReportXmlNodeDesigner';

export default class ReportStyle { //TODO: 目前实现暂直接读xml，另需要处理样式继承

    private readonly _owner: ReportXmlNodeDesigner;
    private _styleNode: Node | null;

    constructor(owner: ReportXmlNodeDesigner) {
        this._owner = owner;
        this._styleNode = XmlUtil.GetNamedChildNode(owner.XmlNode, "Style");
    }

    private SetStyle(prop: string, value: string) {
        if (!this._styleNode) {
            this._styleNode = this._owner.XmlNode.appendChild(this._owner.XmlNode.ownerDocument.createElement("Style"));
        }
        let pnode = XmlUtil.GetNamedChildNode(this._styleNode, prop);
        if (!pnode) {
            pnode = this._styleNode.appendChild(this._styleNode.ownerDocument.createElement(prop));
        }
        pnode.textContent = value;
        //TODO:删除子级所有相同的样式，即让子级继承样式
    }

    public get FontSize(): number {
        if (this._styleNode) {
            let node = XmlUtil.GetNamedChildNode(this._styleNode, "FontSize");
            if (node) { return XmlUtil.SizeToPixel(node.textContent); }
        }
        return 10;
    }
    public set FontSize(value) {
        this.SetStyle("FontSize", value.toString() + "pt");
        this._paintFont = null;
    }

    //====用于绘图的辅助方法====
    private _paintFont: string | null;
    public get PaintFont(): string {
        if (!this._paintFont) {
            this._paintFont = this.FontSize + "px sans-serif"
        }
        return this._paintFont;
    }

    //====用于PropertyPanel的方法====
    public GetPropertyItems(): IPropertyCatalog[] {
        let cats: IPropertyCatalog[] = [
            {
                name: "Style",
                items: [
                    {
                        title: "FontSize", readonly: false, editorType: "TextBox",
                        getter: () => this.FontSize,
                        setter: v => { this.FontSize = v; this._owner.Invalidate(); }
                    }
                ]
            }
        ]
        return cats;
    }

}