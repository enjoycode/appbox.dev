import ReportItemDesigner from './ReportItemDesigner'
import { IPropertyCatalog } from '@/components/Canvas/Interfaces/IPropertyPanel';
import ReportRootDesigner from './ReportRootDesigner';
import { TableCell } from './TableLayout';
import XmlUtil from './XmlUtil';

export default class ImageDesigner extends ReportItemDesigner {

    private _image: HTMLImageElement | null;
    private _loadFlag: number = 0; //0=not load, 1=loading, 2=done

    constructor(xmlNode: Node, cell: TableCell | null = null) {
        super(xmlNode, cell);

        let snode = XmlUtil.GetNamedChildNode(this.xmlNode, "Source");
        if (!snode) {
            snode = XmlUtil.CreateChildNode(this.xmlNode, "Source");
            snode.textContent = "Embedded"; // TODO:暂只支持Embedded
        }
        let fnode = XmlUtil.GetNamedChildNode(this.xmlNode, "Sizing");
        if (!fnode) {
            fnode = XmlUtil.CreateChildNode(this.xmlNode, "Sizing");
            fnode.textContent = "Fit"; // TODO: 暂默认
        }
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

        // 画图像
        if (this._loadFlag === 0) {
            let embeddedImageName = this.GetPropertyString("Value", null);
            if (embeddedImageName) {
                this._loadFlag = 1;
                this._image = new Image();
                this._image.onload = () => {
                    this._loadFlag = 2;
                    this.Invalidate();
                };
                this._image.onerror = () => {
                    console.warn("Load image error");
                }
                let rootDesigner = this.Surface.DesignService.RootDesigner as ReportRootDesigner;
                this._image.src = rootDesigner.EmbeddedImages.GetImageData(embeddedImageName);
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
        //TODO: 暂简单实现，应根据ImageSource来处理
        let cats: IPropertyCatalog[] = super.getPropertyItems();
        cats.splice(0, 0, {
            name: "Common",
            items: [
                {
                    title: "Value", readonly: false, editor: "Select",
                    options: (this.Surface.DesignService.RootDesigner as ReportRootDesigner).EmbeddedImages.GetNames(),
                    getter: () => this.GetPropertyString("Value", ""),
                    setter: v => { this.SetPropertyString("Value", v); this.ResetImageCache(); this.Invalidate(); }
                }
            ]
        });
        return cats;
    }

}