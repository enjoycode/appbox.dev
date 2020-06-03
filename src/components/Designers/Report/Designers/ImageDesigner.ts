import ReportItemDesigner from './ReportItemDesigner'
import { IPropertyCatalog } from '@/components/Canvas/Interfaces/IPropertyPanel';
import Rectangle from '@/components/Canvas/Drawing/Rectangle';

export default class ImageDesigner extends ReportItemDesigner {

    private _image: HTMLImageElement | null;
    private _loadFlag: number = 0; //0=not load, 1=loading, 2=done

    constructor(node: any) {
        super(node);
    }

    public Paint(g: CanvasRenderingContext2D, clip?: Rectangle): void {
        let b = this.Bounds;
        g.save();
        g.beginPath();
        g.rect(b.X, b.Y, b.Width, b.Height);
        g.clip();

        // 绘制边框
        g.strokeStyle = "rgb(173,219,241)";
        g.lineWidth = 1;
        g.strokeRect(b.X, b.Y, b.Width, b.Height);

        // 画图像
        if (this._loadFlag === 0) {
            let imgData = this.GetPropertyString("Value", null);
            if (imgData) {
                this._loadFlag = 1;
                this._image = new Image();
                this._image.onload = () => {
                    this._loadFlag = 2;
                    this.Invalidate();
                };
                this._image.onerror = () => {
                    console.warn("Load image error");
                }
                this._image.src = "data:" + this.GetPropertyString("MimeType", "image/png") + ";base64," + imgData;
            }
        } else if (this._loadFlag === 2) {
            // TODO:根据模式调整宽高比
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
                    title: "Value", readonly: false, editor: "Image",
                    getter: () => this.GetPropertyString("Value", ""),
                    setter: v => {
                        //注意v是url编码, eg: data:image/png;base64,XXXXXX
                        let mimeStart = v.indexOf(':');
                        let mimeEnd = v.indexOf(';');
                        let mime = v.substring(mimeStart + 1, mimeEnd);
                        let dataStart = v.indexOf(',')
                        let imgData = v.substring(dataStart + 1);
                        this.SetPropertyString("Value", imgData);
                        this.SetPropertyString("MimeType", mime);
                        this.ResetImageCache();
                        this.Invalidate();
                    }
                },
                {
                    title: "Sizing", readonly: false, editor: "Select",
                    options: ["AutoSize", "Center", "Normal", "Stretch", "ScaleProportional"],
                    getter: () => this.GetPropertyString("Sizing", "AutoSize"),
                    setter: v => {
                        this.SetPropertyString("Sizing", v);
                        this.Invalidate();
                    }
                }
            ]
        });
        return cats;
    }

}