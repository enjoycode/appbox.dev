import ReportItemDesigner from './ReportItemDesigner'
import Rectangle from '@/components/Canvas/Drawing/Rectangle';
import { Line, Area, Column, Pie } from "@antv/g2plot";
import { IPropertyCatalog, IPropertyItem } from '@/components/Canvas/Interfaces/IPropertyPanel';

type ChartType = "Pie" | "Column" | "Line" | "Area";

export default class ChartDesigner extends ReportItemDesigner {
    private _image?: HTMLImageElement;
    private _loadFlag: number = 0;
    private _chartOpts: any = {};

    public get Type(): ChartType { return this.GetPropertyString("Type", "Column") as ChartType; }

    constructor(node: any) {
        super(node);
        if (!node.Type) {
            node.Type = "Column";
        }
    }

    private ResetImageCache(): void {
        this._loadFlag = 0;
        this._image = null;
    }

    // override for redraw
    public OnEndResize(): void {
        super.OnEndResize();
        this.ResetImageCache();
        this.Invalidate();
    }

    public Paint(g: CanvasRenderingContext2D, clip?: Rectangle): void {
        let b = this.Bounds;
        //TODO: fill background
        g.fillStyle = "white";
        g.fillRect(b.X, b.Y, b.Width, b.Height);

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

            let div = document.createElement("div");
            let chart = this.MakeChart(div);
            chart.render();
            setTimeout(() => {
                const canvas = chart.getCanvas();
                const canvasDom = canvas.get('el');
                this._image.src = canvasDom.toDataURL("image/png");
                chart.destroy();
            }, 0);
        } else if (this._loadFlag === 2) {
            g.drawImage(this._image, b.X, b.Y, b.Width, b.Height);
        }
    }

    private MakeChart(dom: any): any {
        //TODO:根据数据源设置生成模拟数据
        const data = [
            {
                type: '分类一',
                value: 27,
            },
            {
                type: '分类二',
                value: 25,
            },
            {
                type: '分类三',
                value: 18,
            },
            {
                type: '分类四',
                value: 15,
            },
        ];

        this._chartOpts.data = data;
        this._chartOpts.width = this.Bounds.Width;
        this._chartOpts.height = this.Bounds.Height;
        this._chartOpts.animation = false;
        this._chartOpts.forceFit = false;
        this._chartOpts.pixelRatio = 1;

        delete this._chartOpts.angleField;
        delete this._chartOpts.colorField;
        delete this._chartOpts.xField;
        delete this._chartOpts.yField;

        let chart: any = null;
        switch (this.Type) {
            case "Column":
                this._chartOpts.xField = "type";
                this._chartOpts.yField = "value";
                chart = new Column(dom, this._chartOpts);
                break;
            case "Line":
                this._chartOpts.xField = "type";
                this._chartOpts.yField = "value";
                chart = new Line(dom, this._chartOpts);
                break;
            case "Area":
                this._chartOpts.xField = "type";
                this._chartOpts.yField = "value";
                chart = new Area(dom, this._chartOpts);
                break;
            case "Pie":
                this._chartOpts.angleField = "value";
                this._chartOpts.colorField = "type";
                chart = new Pie(dom, this._chartOpts);
                break;
        }
        return chart;
    }

    //============IPropertyOwner接口实现=====
    public getPropertyItems(): IPropertyCatalog[] | null {
        let cats: IPropertyCatalog[] = super.getPropertyItems();

        let items: IPropertyItem[] = [
            {
                title: "Type", readonly: false, editor: "Select",
                options: ["Column", "Line", "Pie", "Area"],
                getter: () => this.GetPropertyString("Type", "Column"),
                setter: v => {
                    this.SetPropertyString("Type", v, true);
                    this.ResetImageCache();
                    this.Invalidate();
                }
            },
        ];

        cats.splice(0, 0, {
            name: "Common",
            items: items
        });
        return cats;
    }

}