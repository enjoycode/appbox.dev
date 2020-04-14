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

    private GetStyle(prop: string, defaultValue: string): string | null {
        if (this._styleNode) {
            let node = XmlUtil.GetNamedChildNode(this._styleNode, prop);
            if (node) { return node.textContent; }
        }
        return defaultValue;
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
        let v = this.GetStyle("FontSize", null /*注意未找到返回null*/);
        return v === null ? 10 : XmlUtil.SizeToPixel(v);
    }

    public set FontSize(value) {
        this.SetStyle("FontSize", value.toString() + "pt");
        this._paintFont = null;
    }

    public get FontWeight(): string {
        return this.GetStyle("FontWeight", "Normal");
    }
    public set FontWeight(value) {
        this.SetStyle("FontWeight", value);
        this._paintFont = null;
    }

    public get TextAlign(): TextAlignEnum {
        return TextAlignEnum[this.GetStyle("TextAlign", "General")];
    }
    public get VerticalAlign(): VerticalAlignEnum {
        return VerticalAlignEnum[this.GetStyle("VerticalAlign", "Top")];
    }

    //====用于绘图的辅助方法====
    private _paintFont: string | null;
    public get PaintFont(): string {
        if (!this._paintFont) {
            this._paintFont = this.FontSize + "px sans-serif";
            if (this.FontWeight === "Bold" || this.FontWeight === "Bolder") {
                this._paintFont = "bold " + this._paintFont;
            }
        }
        return this._paintFont;
    }

    //====用于PropertyPanel的方法====
    private static GetEnumNames(e: any): string[] {
        return Object.keys(e).filter(key => isNaN(+key))
    }

    public GetPropertyItems(): IPropertyCatalog[] {
        let cats: IPropertyCatalog[] = [
            {
                name: "Style",
                items: [
                    {
                        title: "FontSize", readonly: false, editor: "TextBox",
                        getter: () => this.FontSize,
                        setter: v => { this.FontSize = v; this._owner.Invalidate(); }
                    },
                    {
                        title: "FontWeight", readonly: false, editor: "Select",
                        options: ReportStyle.GetEnumNames(FontWeightEnum),
                        getter: () => this.FontWeight,
                        setter: v => { this.FontWeight = v; this._owner.Invalidate(); }
                    },
                    {
                        title: "TextAlign", readonly: false, editor: "Select",
                        options: ReportStyle.GetEnumNames(TextAlignEnum),
                        getter: () => this.GetStyle("TextAlign", "General"),
                        setter: v => { this.SetStyle("TextAlign", v); this._owner.Invalidate(); }
                    },
                    {
                        title: "VerticalAlign", readonly: false, editor: "Select",
                        options: ReportStyle.GetEnumNames(VerticalAlignEnum),
                        getter: () => this.GetStyle("VerticalAlign", "Top"),
                        setter: v => { this.SetStyle("VerticalAlign", v); this._owner.Invalidate(); }
                    }
                ]
            }
        ]
        return cats;
    }

}

//====Enums====
enum FontStyleEnum {
    Normal,
    Italic
}

enum FontWeightEnum {
    Lighter,
    Normal,
    Bold,
    Bolder
}

export enum TextAlignEnum {
    Left,
    Center,
    Right,
    General,
    Justified
}

export enum VerticalAlignEnum {
    Top,
    Middle,
    Bottom
}