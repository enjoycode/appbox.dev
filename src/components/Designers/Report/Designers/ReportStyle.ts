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
        this.EnsureStyleNode();
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

    //=====边框样式====
    private _borderStyles: IBorderStyleInfo[] | null; // for cache
    /** 用于BorderStyleEditor绑定或绘制 */
    public get BorderStyles(): IBorderStyleInfo[] {
        if (!this._borderStyles) {
            this._borderStyles = [
                { pos: "Default", style: "None", width: 1, color: "#000000" },
                { pos: "Left", style: "None", width: 1, color: "#000000" },
                { pos: "Top", style: "None", width: 1, color: "#000000" },
                { pos: "Right", style: "None", width: 1, color: "#000000" },
                { pos: "Bottom", style: "None", width: 1, color: "#000000" },
            ]

            let bs = XmlUtil.GetNamedChildNode(this._styleNode, "BorderStyle");
            if (bs) {
                for (const cnode of bs.childNodes) {
                    let all = cnode.nodeName === "Default";
                    for (const item of this._borderStyles) {
                        if (all || item.pos === cnode.nodeName) {
                            item.style = cnode.textContent as BorderStyleEnum;
                        }
                    }
                }
            }
            //TODO:
        }
        return this._borderStyles;
    }

    public SetBorderStyle(pos: BorderPosition, value: string): void {
        this.EnsureStyleNode();
        let bs = XmlUtil.GetOrCreateChildNode(this._styleNode, "BorderStyle");
        let isDefaultValue = value === "None";
        if (pos === "Default") {
            // 级联更新非默认节点的缓存值
            for (let i = 1; i < this._borderStyles.length; i++) {
                this._borderStyles[i].style = this._borderStyles[0].style
            }

            //TODO:如果跟继承值相同则删除所有
            for (const cnode of bs.childNodes) {
                if (isDefaultValue || cnode.nodeName !== pos) {
                    bs.removeChild(cnode);
                }
            }
        } else {
            // 级联更新默认节点的缓存值
            this._borderStyles[0].style = "";
            // 先删除Default子节点(如果存在)
            if (bs.childNodes.length === 1 && bs.childNodes[0].nodeName === "Default") {
                bs.removeChild(bs.childNodes[0]);
            }
            // 如果4个子节点且值相同，则删除所有添加Default子节点
            if (bs.childNodes.length === 4) {
                let allValueSame = true;
                for (const cnode of bs.childNodes) {
                    if (cnode.textContent != value) {
                        allValueSame = false;
                        break;
                    }
                }
                if (allValueSame) {
                    pos = "Default"; //所有值相同，改为添加Default子节点
                }
            }
        }

        if (!isDefaultValue) {
            let n = XmlUtil.GetOrCreateChildNode(bs, pos);
            n.textContent = value;
        } else {
            if (bs.childNodes.length === 0) {
                bs.parentNode.removeChild(bs);
            }
            this.CheckStyleEmpty();
        }
        //需要重画
        this._owner.Invalidate();
    }

    //====样式节点辅助方法====
    /**
     * 确认<Style>节点是否存在，不存在则创建
     */
    private EnsureStyleNode() {
        if (!this._styleNode) {
            this._styleNode = this._owner.XmlNode.appendChild(this._owner.XmlNode.ownerDocument.createElement("Style"));
        }
    }

    /**
     * 确信<Style>节点下无子节点，是则删除<Style>节点
     */
    private CheckStyleEmpty() {
        if (this._styleNode && this._styleNode.childNodes.length === 0) {
            this._styleNode.parentNode.removeChild(this._styleNode);
        }
    }

    //====用于绘图的辅助方法====
    private _paintFont: string | null; // for cache
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
                    },
                    {
                        title: "Borders", readonly: false, editor: "BorderStyle",
                        getter: () => this,
                        setter: v => { /* 不需要重画，由SetBorderStyle调用Invalidate */ }
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

export type BorderStyleEnum = "" | "None" | "Dotted" | "Dashed" | "Solid";
export type BorderPosition = "Default" | "Left" | "Top" | "Right" | "Bottom";
export interface IBorderStyleInfo {
    pos: BorderPosition;
    style: BorderStyleEnum;
    width: number;
    color: string;
}