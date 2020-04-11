import ReportXmlNodeDesigner from "./ReportXmlNodeDesigner"
import Rectangle from '@/components/Canvas/Drawing/Rectangle'
import BoundsSpecified from '@/components/Canvas/Enums/BoundsSpecified'
import IServerReportItem from './IServerReportItem'
import ReportSectionDesigner from './ReportSectionDesigner';

export default class ReportRootDesigner extends ReportXmlNodeDesigner {

    private _bounds: Rectangle = new Rectangle(0, 0, 0, 0); // only for cache
    public get Bounds(): Rectangle {
        return this._bounds;
    }
    public set Bounds(value) { /*do nothing*/ }

    public get IsContainer(): boolean {
        return true;
    }

    constructor(xmlNode: Node) {
        super(xmlNode);

        let height = 0;

        // 开始加载Sections
        let pageWidth = this.TryGetSize("PageWidth", 400);
        let header = this.GetNamedChildNode("PageHeader");
        if (header) {
            let ph = new ReportSectionDesigner(header, pageWidth, height);
            this.AddItem(ph);
            height += ph.Bounds.Height;
        }
        let body = this.GetNamedChildNode("Body");
        if (body) {
            let bd = new ReportSectionDesigner(body, pageWidth, height);
            this.AddItem(bd);
            height += bd.Bounds.Height;
        }
        let footer = this.GetNamedChildNode("PageFooter");
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

    // private GetSectionHeight(sectionName: string): number {
    //     if (!this.xmlNode) return 0;
    //     let section = this.GetNamedChildNode(this.xmlNode, sectionName);
    //     if (!section) return 0;
    //     let height = this.GetNamedChildNode(section, "Height");
    //     if (!height) return 0;
    //     return this.GetSize(height);
    // }

    public Paint(g: CanvasRenderingContext2D): void {
        g.fillStyle = "white";
        g.fillRect(0, 0, this.Bounds.Width, this.Bounds.Height);

        g.strokeStyle = "rgb(173,219,241)";
        g.lineWidth = 1;
        g.strokeRect(0, 0, this.Bounds.Width, this.Bounds.Height);

        if (this.Items) {
            for (var i = 0; i < this.Items.length; i++) {
                this.Items[i].Paint(g);
            }
        }
    }

}