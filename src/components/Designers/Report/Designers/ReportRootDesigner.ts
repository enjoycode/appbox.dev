import ReportObjectDesigner from './ReportObjectDesigner';
import Rectangle from '@/components/Canvas/Drawing/Rectangle'
import BoundsSpecified from '@/components/Canvas/Enums/BoundsSpecified'
import ReportSectionDesigner from './ReportSectionDesigner';
import { IPropertyCatalog } from '@/components/Canvas/Interfaces/IPropertyPanel';
import RSizeUtil from './RSizeUtil';
import ReportDataSources from './ReportDataSources';
// import ReportEmbeddedImages from './ReportEmbeddedImages';
// import ReportParameters from './ReportParameters';

export default class ReportRootDesigner extends ReportObjectDesigner {

    private _bounds: Rectangle = new Rectangle(0, 0, 0, 0); // only for cache
    public get Bounds(): Rectangle {
        return this._bounds;
    }
    public set Bounds(value) { /*do nothing*/ }

    public get IsContainer(): boolean { return true; }

    private readonly _datasources: ReportDataSources;
    public get DataSources(): ReportDataSources { return this._datasources; }

    // private _parameters: ReportParameters | null;
    // public get Parameters(): ReportParameters {
    //     if (!this._parameters) { this._parameters = new ReportParameters(this); }
    //     return this._parameters;
    // }

    // private _embeddedImages: ReportEmbeddedImages | null;
    // public get EmbeddedImages(): ReportEmbeddedImages {
    //     if (!this._embeddedImages) { this._embeddedImages = new ReportEmbeddedImages(this); }
    //     return this._embeddedImages;
    // }

    constructor(node: any) {
        super(node);

        this._datasources = new ReportDataSources(this);
        
        // 开始加载Sections
        let height = 0;
        let pageWidth = this.GetSize("Width", 400);
        let header = this.GetChildByType("PageHeader");
        if (header) {
            let ph = new ReportSectionDesigner(header, pageWidth, height);
            this.AddItem(ph);
            height += ph.Bounds.Height;
        }
        let body = this.GetChildByType("Details");
        if (body) {
            let bd = new ReportSectionDesigner(body, pageWidth, height);
            this.AddItem(bd);
            height += bd.Bounds.Height;
        }
        let footer = this.GetChildByType("PageFooter");
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

    public Paint(g: CanvasRenderingContext2D, clip?: Rectangle): void {
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
        this._bounds.Width = RSizeUtil.SizeToPixel(width);
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
                    // {
                    //     title: "PageWidth", readonly: false, editor: "TextBox",
                    //     getter: () => this.GetPropertyRSize("PageWidth", "200mm"),
                    //     setter: v => { this.SetPropertyRSize("PageWidth", v); this.OnChangePageWidth(v); }
                    // },
                    // {
                    //     title: "PageHeight", readonly: false, editor: "TextBox",
                    //     getter: () => this.GetPropertyRSize("PageHeight", "150mm"),
                    //     setter: v => { this.SetPropertyRSize("PageHeight", v); this.OnChangePageHeight(v); }
                    // },
                    // {
                    //     title: "Parameters", readonly: true, editor: "ReportParameters",
                    //     getter: () => this,
                    //     setter: v => { /* not supported */ }
                    // },
                    {
                        title: "DataSources", readonly: true, editor: "ReportDataSources",
                        getter: () => this,
                        setter: v => { /* not supported */ }
                    },
                    // {
                    //     title: "EmbeddedImages", readonly: true, editor: "ReportEmbeddedImages",
                    //     getter: () => this,
                    //     setter: v => { /* not supported */ }
                    // },
                ]
            }
        ];

        return cats;
    }

}