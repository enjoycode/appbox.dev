import RSizeUtil from "./RSizeUtil";
import { IPropertyCatalog } from '@/components/Canvas/Interfaces/IPropertyPanel';
import ReportObjectDesigner from './ReportObjectDesigner';

export default class ReportStyle { //TODO: 目前实现暂直接读xml，另需要处理样式继承

    private readonly _owner: ReportObjectDesigner;
    private _styleNode: any;

    constructor(owner: ReportObjectDesigner) {
        this._owner = owner;
        this._styleNode = owner.Node["Style"];
    }

    public GetStyle(prop: string, defaultValue: string): string | null {
        if (this._styleNode && this._styleNode[prop]) {
            return this._styleNode[prop];
        }
        return defaultValue;
    }

    private SetStyle(prop: string, value: string) {
        this.EnsureStyleNode();
        this._styleNode[prop] = value;
        //TODO:删除子级所有相同的样式，即让子级继承样式
    }

    public get FontSize(): number {
        if (this._styleNode && this._styleNode["Font"]) {
            let font = this._styleNode["Font"];
            if (font["Size"]) {
                return RSizeUtil.SizeToPixel(font["Size"]);
            }
        }
        return 10;
    }

    public set FontSize(value) {
        this.EnsureStyleNode();
        if (!this._styleNode["Font"]) {
            this._styleNode["Font"] = {};
        }
        this._styleNode["Font"]["Size"] = value.toString() + "pt";
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
        return TextAlignEnum[this.GetStyle("TextAlign", "Left")];
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

            if (!this._styleNode) { return this._borderStyles; }

            let bs = this._styleNode["BorderStyle"];
            if (bs) {
                for (const i of this._borderStyles) {
                    if (bs[i.pos]) {
                        for (const j of this._borderStyles) {
                            if (i.pos === "Default" || j.pos === i.pos) {
                                j.style = bs[i.pos];
                            }
                        }
                    }
                }
            }
            let bw = this._styleNode["BorderWidth"];
            if (bw) {
                for (const i of this._borderStyles) {
                    if (bw[i.pos]) {
                        for (const j of this._borderStyles) {
                            if (i.pos === "Default" || j.pos === i.pos) {
                                j.width = RSizeUtil.SizeToPixel(bw[i.pos], false /* 不需要取整 */);
                            }
                        }
                    }
                }
            }
            let bc = this._styleNode["BorderColor"];
            if (bc) {
                for (const i of this._borderStyles) {
                    if (bc[i.pos]) {
                        for (const j of this._borderStyles) {
                            if (i.pos === "Default" || j.pos === i.pos) {
                                j.color = bc[i.pos];
                            }
                        }
                    }
                }
            }
        }
        return this._borderStyles;
    }

    public SetBorderStyle(type: BorderStyleType, target: IBorderStyleInfo): void {
        this.EnsureStyleNode();
        let bs = this._styleNode[type];
        let isDefaultValue = false;
        if (type === "BorderStyle") {
            isDefaultValue = target.style === "None";
        } else if (type === "BorderWidth") {
            isDefaultValue = target.width === 1;
        } else {
            isDefaultValue = target.color === "#000000";
        }

        let pos = target.pos;
        if (target.pos === "Default") {
            // 级联更新非默认节点的缓存值
            for (let i = 1; i < this._borderStyles.length; i++) {
                if (type === "BorderStyle") {
                    this._borderStyles[i].style = this._borderStyles[0].style;
                } else if (type === "BorderWidth") {
                    this._borderStyles[i].width = this._borderStyles[0].width;
                } else {
                    this._borderStyles[i].color = this._borderStyles[0].color;
                }
            }

            //TODO:如果跟继承值相同则删除所有
            for (const i of this._borderStyles) {
                if (bs && bs[i.pos] && (isDefaultValue || i.pos !== target.pos)) {
                    delete bs[i.pos];
                }
            }
        } else {
            // 级联更新默认节点的缓存值
            if (type === "BorderStyle") {
                this._borderStyles[0].style = "";
            } else if (type === "BorderWidth") {
                this._borderStyles[0].width = 0;
            } else {
                this._borderStyles[0].color = "rgba(255,255,255,255)";
            }
            // 先删除Default子节点(如果存在)
            if (bs && bs["Default"]) {
                delete bs["Default"];
            }
            // 如果4个子节点且值相同，则删除所有添加Default子节点
            if (bs && Object.keys(bs).length === 4) {
                let allValueSame = true;
                for (let i = 1; i < this._borderStyles.length; i++) {
                    if (bs[this._borderStyles[i].pos] !== bs[this._borderStyles[0].pos]) {
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
            if (!bs) {
                this._styleNode[type] = {};
                bs = this._styleNode[type];
            }
            if (type === "BorderStyle") {
                bs[pos] = target.style;
            } else if (type === "BorderWidth") {
                bs[pos] = target.width.toString() + "pt";
            } else {
                bs[pos] = target.color;
            }
        } else {
            if (bs && Object.keys(bs).length === 0) {
                delete this._styleNode[type];
            }
            this.CheckStyleEmpty();
        }
        //需要重画
        this._owner.Invalidate();
    }

    //====样式节点辅助方法====
    /**
     * 确认Style节点是否存在，不存在则创建
     */
    private EnsureStyleNode() {
        if (!this._styleNode) {
            this._owner.Node["Style"] = {};
            this._styleNode = this._owner.Node["Style"];
        }
    }

    private CheckStyleEmpty() {
        if (this._styleNode && Object.keys(this._styleNode).length === 0) {
            delete this._owner["Style"];
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
                        title: "Color", readonly: false, editor: "Color",
                        getter: () => this.GetStyle("Color", "#000000"),
                        setter: v => { this.SetStyle("Color", v); this._owner.Invalidate(); }
                    },
                    {
                        title: "BackgroundColor", readonly: false, editor: "Color",
                        getter: () => this.GetStyle("BackgroundColor", "#FFFFFF" /* TODO:应为透明 */),
                        setter: v => { this.SetStyle("BackgroundColor", v); this._owner.Invalidate(); }
                    },
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
                        getter: () => this.GetStyle("TextAlign", "Left"),
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
    Justified
}

export enum VerticalAlignEnum {
    Top,
    Middle,
    Bottom
}

export type BorderStyleType = "BorderStyle" | "BorderWidth" | "BorderColor";
export type BorderStyleEnum = "" | "None" | "Dotted" | "Dashed" | "Solid";
export type BorderPosition = "Default" | "Left" | "Top" | "Right" | "Bottom";
export interface IBorderStyleInfo {
    pos: BorderPosition;
    style: BorderStyleEnum;
    width: number;
    color: string;
}