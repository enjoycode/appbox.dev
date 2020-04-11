import ReportXmlNodeDesigner from "./ReportXmlNodeDesigner"
import DesignAdorners from '@/components/Canvas/Adorners/DesignAdorners'
import DesignAdorner from '@/components/Canvas/Adorners/DesignAdorner'
import SectionSelectionAdorner from '../Adorners/SectionSelectionAdorner'
import Rectangle from '@/components/Canvas/Drawing/Rectangle'
import BoundsSpecified from '@/components/Canvas/Enums/BoundsSpecified'
import IServerReportItem from './IServerReportItem'
import ReportDesignService from './ReportDesignService'
import DesignBehavior from '@/components/Canvas/Enums/DesignBehavior'

export default class ReportSectionDesigner extends ReportXmlNodeDesigner {
    private _bounds: Rectangle = new Rectangle(0, 0, 0, 0); //only for cache
    public get Bounds(): Rectangle {
        return this._bounds;
    }
    public set Bounds(value) {
        this.SetBounds(value.X, value.Y, value.Width, value.Height, BoundsSpecified.All);
    }

    public get IsContainer(): boolean {
        return true;
    }

    public get Behavior(): DesignBehavior {
        return DesignBehavior.CanResize;
    }

    public get SelectionAdorner(): DesignAdorner | null {
        if (!this._selectionAdorner && this.Surface) {
            this._selectionAdorner = new SectionSelectionAdorner(this.Surface.Adorners, this);
        }
        return this._selectionAdorner;
    }

    constructor(xmlNode: Node, pageWidth: number, top: number) {
        super(xmlNode);

        let height = this.TryGetSize("Height", 200);
        this._bounds = new Rectangle(0, top, pageWidth, height);
    }

    protected SetBounds(x: number, y: number, width: number, height: number, specified: BoundsSpecified): void {
        if (specified !== BoundsSpecified.Height) { //注意：只支持设置高度
            return;
        }
        // ReportDesignService.ChangeProperty(this, "Height", null, height);

        // 开始重新布局，并重新绘制
        let diff = height - this._bounds.Height;
        if (this.Parent) {
            this._bounds.Height = height;
            var index = -1;
            for (var i = 0; i < this.Parent.Items.length; i++) {
                var element = this.Parent.Items[i];
                if (index === -1 && element === this) {
                    index = i;
                }
                if (index !== -1 && i > index) { //表示后面的Section，全部偏移位置
                    element.Bounds.Y += diff;
                }
            }
            this.Parent.Bounds.Height += diff;
        }
        if (this.Surface) {
            this.Surface.Invalidate();
        }
    }

    public Paint(g: CanvasRenderingContext2D): void {
        g.strokeStyle = "rgb(173,219,241)";
        g.lineWidth = 1;
        g.strokeRect(this.Bounds.X, this.Bounds.Y, this.Bounds.Width, this.Bounds.Height);

        if (this.Items) {
            g.translate(this.Bounds.X, this.Bounds.Y);
            for (var i = 0; i < this.Items.length; i++) {
                this.Items[i].Paint(g);
            }
            g.translate(-this.Bounds.X, -this.Bounds.Y);
        }
    }
}
