import ItemDesigner from '../../../Canvas/Designers/ItemDesigner'
import Rectangle from '../../../Canvas/Drawing/Rectangle'
import BoundsSpecified from '../../../Canvas/Enums/BoundsSpecified'
import IServerReportItem from './IServerReportItem'
import ReportItemDesigner from './ReportItemDesigner'
import TableDesigner from './TableDesigner'

export default class GraphDesigner extends ReportItemDesigner {
    private _bitmap?: HTMLImageElement;

    public Fetch(serverItem: IServerReportItem) {
        super.Fetch(serverItem);

        var bitmap = new Image();
        bitmap.src = "data:image/png;base64," + serverItem.Bitmap;
        var _this = this;
        bitmap.onload = () => {
            _this._bitmap = bitmap;
            _this.Invalidate();
        }
    }

    public Paint(g: CanvasRenderingContext2D): void {
        // 绘制边框
        g.strokeStyle = "rgb(173,219,241)";
        g.lineWidth = 1;
        g.strokeRect(this.Bounds.X, this.Bounds.Y, this.Bounds.Width, this.Bounds.Height);

        // 绘制服务端渲染的结果
        if (this._bitmap) {
            g.drawImage(this._bitmap, 0, 0, this.Bounds.Width, this.Bounds.Height,
                this.Bounds.X, this.Bounds.Y, this.Bounds.Width, this.Bounds.Height);
        }
    }

}