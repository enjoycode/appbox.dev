import ReportXmlNodeDesigner from "./ReportXmlNodeDesigner"
import Rectangle from '@/components/Canvas/Drawing/Rectangle'
import BoundsSpecified from '@/components/Canvas/Enums/BoundsSpecified'
import ReportSectionDesigner from './ReportSectionDesigner';
import { IPropertyCatalog } from '@/components/Canvas/Interfaces/IPropertyPanel';
import XmlUtil from './XmlUtil';
import ReportDataSets from './ReportDataSet';
import ReportEmbeddedImages from './ReportEmbeddedImages';

export default class ReportRootDesigner extends ReportXmlNodeDesigner {

    private _bounds: Rectangle = new Rectangle(0, 0, 0, 0); // only for cache
    public get Bounds(): Rectangle {
        return this._bounds;
    }
    public set Bounds(value) { /*do nothing*/ }

    public get IsContainer(): boolean { return true; }

    private readonly _datasets: ReportDataSets;
    public get DataSets(): ReportDataSets { return this._datasets; }

    private _embeddedImages: ReportEmbeddedImages | null;
    public get EmbeddedImages(): ReportEmbeddedImages {
        if (!this._embeddedImages) { this._embeddedImages = new ReportEmbeddedImages(this); }
        return this._embeddedImages;
    }

    constructor(xmlNode: Node) {
        super(xmlNode);
        this._datasets = new ReportDataSets(this);
        // 开始加载Sections
        let height = 0;
        let pageWidth = XmlUtil.TryGetSize(this.xmlNode, "PageWidth", 400);
        let header = XmlUtil.GetNamedChildNode(this.xmlNode, "PageHeader");
        if (header) {
            let ph = new ReportSectionDesigner(header, pageWidth, height);
            this.AddItem(ph);
            height += ph.Bounds.Height;
        }
        let body = XmlUtil.GetNamedChildNode(this.xmlNode, "Body");
        if (body) {
            let bd = new ReportSectionDesigner(body, pageWidth, height);
            this.AddItem(bd);
            height += bd.Bounds.Height;
        }
        let footer = XmlUtil.GetNamedChildNode(this.xmlNode, "PageFooter");
        if (footer) {
            let ft = new ReportSectionDesigner(footer, pageWidth, height);
            this.AddItem(ft);
            height += ft.Bounds.Height;
        }

        this._bounds = new Rectangle(8, 8, pageWidth, height);
    }

    protected SetBounds(x: number, y: number, width: number, height: number, specified: BoundsSpecified): void {
        // do nothing
    }

    public Paint(g: CanvasRenderingContext2D): void {
        //不用画也不用转换坐标
        if (this.Items) {
            for (const item of this.Items) {
                item.Paint(g);
            }
        }
    }

    //============IPropertyOwner接口实现=====
    /**
     * 仅由PropertyPanel设置后重新布局并重画
     */
    private OnChangePageWidth(width: string) {
        this._bounds.Width = XmlUtil.SizeToPixel(width);
        for (const item of this.Items) {
            item.Bounds.Width = this._bounds.Width; //直接设置
        }
        this.Surface.Invalidate();
    }

    /**
     * 仅由PropertyPanel设置后重新布局并重画
     */
    private OnChangePageHeight(height: string) {
        // TODO:计算所有Section高度是否超出总高
    }

    public getPropertyItems(): IPropertyCatalog[] | null {
        let cats: IPropertyCatalog[] = [
            {
                name: "Common",
                items: [
                    {
                        title: "PageWidth", readonly: false, editor: "TextBox",
                        getter: () => this.GetPropertyRSize("PageWidth", "200mm"),
                        setter: v => { this.SetPropertyRSize("PageWidth", v); this.OnChangePageWidth(v); }
                    },
                    {
                        title: "PageHeight", readonly: false, editor: "TextBox",
                        getter: () => this.GetPropertyRSize("PageHeight", "150mm"),
                        setter: v => { this.SetPropertyRSize("PageHeight", v); this.OnChangePageHeight(v); }
                    },
                    {
                        title: "DataSets", readonly: true, editor: "ReportDataSets",
                        getter: () => this,
                        setter: v => { /* not supported */ }
                    },
                    {
                        title: "EmbeddedImages", readonly: true, editor: "ReportEmbeddedImages",
                        getter: () => this,
                        setter: v => { /* not supported */ }
                    },
                ]
            }
        ];

        return cats;
    }

}