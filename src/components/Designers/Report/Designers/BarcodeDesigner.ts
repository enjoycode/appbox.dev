import ReportItemDesigner from './ReportItemDesigner';
import { IPropertyCatalog } from '@/components/Canvas/Interfaces/IPropertyPanel';
import Rectangle from '@/components/Canvas/Drawing/Rectangle';

export default class BarcodeDesigner extends ReportItemDesigner /* extends Rectangle */ {

    private _image: HTMLImageElement | null;
    private _loadFlag: number = 0; //0=not load, 1=loading, 2=done

    public get Format(): string { return this.GetPropertyString("Format", "CODE_128"); }
    public set Format(value) { this.SetPropertyString("Format", value); }

    public get Value(): string { return this.GetPropertyString("Value", "12345678"); }
    public set Value(value) { this.SetPropertyString("Value", value); }

    constructor(node: any) {
        super(node);
        if (!node.Value) {
            node.Value = "12345678";
            node.Format = "CODE_128";
        }
    }

    // override for redraw
    public OnEndResize(): void {
        super.OnEndResize();
        this.ResetImageCache();
        this.Invalidate();
    }

    private ResetImageCache(): void {
        this._loadFlag = 0;
        this._image = null;
    }

    public Paint(g: CanvasRenderingContext2D, clip?: Rectangle): void {
        let b = this.Bounds;
        g.save();
        g.beginPath();
        g.rect(b.X, b.Y, b.Width, b.Height);
        g.clip();

        if (this._loadFlag === 0) {
            this._loadFlag = 1;
            this._image = new Image();
            this._image.onload = () => {
                this._loadFlag = 2;
                this.Invalidate();
            };
            this._image.onerror = () => {
                console.warn("Load image error");
            }
            this._image.src = "/api/design/barcode/" +
                this.Format + "/" + encodeURIComponent(this.Value) + "/" +
                b.Width + "/" + b.Height + "/" + this.Surface.PixelRatio;
        } else if (this._loadFlag === 2) {
            g.drawImage(this._image, b.X, b.Y, b.Width, b.Height);
        }

        // 绘制边框
        g.strokeStyle = "rgb(173,219,241)";
        g.lineWidth = 1;
        g.strokeRect(b.X, b.Y, b.Width, b.Height);

        g.restore();
    }

    //============IPropertyOwner接口实现=====
    public getPropertyItems(): IPropertyCatalog[] | null {
        let cats: IPropertyCatalog[] = super.getPropertyItems();
        cats.splice(0, 0, {
            name: "Common",
            items: [
                {
                    title: "Format", readonly: false, editor: "Select",
                    options: ["CODE_128", "CODE_39", "QR_CODE"],
                    getter: () => this.Format,
                    setter: v => { this.Format = v; this.ResetImageCache(); this.Invalidate(); }
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