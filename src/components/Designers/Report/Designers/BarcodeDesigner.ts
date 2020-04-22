import ReportItemDesigner from './ReportItemDesigner';
import { TableCell } from './TableLayout';
import XmlUtil from './XmlUtil';
import { IPropertyCatalog } from '@/components/Canvas/Interfaces/IPropertyPanel';

export default class BarcodeDesigner extends ReportItemDesigner /* extends Rectangle */ {

    private readonly _typeNode: Node;
    private readonly _valueNode: Node;
    private _image: HTMLImageElement | null;
    private _loadFlag: number = 0; //0=not load, 1=loading, 2=done

    public get Type(): string { return this._typeNode.textContent; }
    public set Type(value) { this._typeNode.textContent = value; }

    public get Value(): string { return this._valueNode.textContent; }
    public set Value(value) { this._valueNode.textContent = value; }

    constructor(xmlNode: Node, cell: TableCell | null = null) {
        super(xmlNode, cell);

        this._typeNode = XmlUtil.GetNamedChildNode(this.xmlNode, "Type");
        if (!this._typeNode) {
            this._typeNode = XmlUtil.CreateChildNode(this.xmlNode, "Type");
            this._typeNode.textContent = "BarCode128";
        }
        let propsNode = XmlUtil.GetOrCreateChildNode(this.xmlNode, "CustomProperties");
        let propNode = XmlUtil.GetOrCreateChildNode(propsNode, "CustomProperty");
        let nameNode = XmlUtil.GetOrCreateChildNode(propNode, "Name");
        nameNode.textContent = "Code";
        this._valueNode = XmlUtil.GetNamedChildNode(propNode, "Value");
        if (!this._valueNode) {
            this._valueNode = XmlUtil.CreateChildNode(propNode, "Value");
            this._valueNode.textContent = "12345678";
        }
    }

    // override for redraw
    public OnEndResize(): void {
        this.ResetImageCache();
        this.Invalidate();
    }

    public Paint(g: CanvasRenderingContext2D): void {
        let b = this.Bounds; // 注意在表格内是计算出来的
        g.save();
        g.beginPath();
        g.rect(b.X, b.Y, b.Width, b.Height);
        g.clip();

        // 绘制边框
        g.strokeStyle = "rgb(173,219,241)";
        g.lineWidth = 1;
        g.strokeRect(b.X, b.Y, b.Width, b.Height);

        if (this._loadFlag === 0) {
            this._loadFlag = 1;
            this._image = new Image();
            this._image.onload = () => {
                this._loadFlag = 2;
                this.Invalidate();
            };
            this._image.src = "/api/design/barcode/" +
                this.Type + "/" + this.Value + "/" +
                b.Width + "/" + b.Height + "/" + this.Surface.PixelRatio;
        } else if (this._loadFlag === 2) {
            g.drawImage(this._image, b.X, b.Y, b.Width, b.Height);
        }

        g.restore();
    }

    //============IPropertyOwner接口实现=====
    private ResetImageCache(): void {
        this._loadFlag = 0;
        this._image = null;
    }

    public getPropertyItems(): IPropertyCatalog[] | null {
        let cats: IPropertyCatalog[] = super.getPropertyItems();
        cats.splice(0, 0, {
            name: "Common",
            items: [
                {
                    title: "Type", readonly: false, editor: "Select",
                    options: ["BarCode128"],
                    getter: () => this.Type,
                    setter: v => { this.Type = v; this.ResetImageCache(); this.Invalidate(); }
                },
                {
                    title: "Value", readonly: false, editor: "TextBox",
                    getter: () => this.Value,
                    setter: v => { this.Value = v; this.ResetImageCache(); this.Invalidate(); }
                }
            ]
        });
        return cats;
    }

}