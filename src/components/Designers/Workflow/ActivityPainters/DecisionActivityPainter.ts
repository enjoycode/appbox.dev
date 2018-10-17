import IActivityPainter from './IActivityPainter'
import Size from '../../../Canvas/Drawing/Size'
import Point from '../../../Canvas/Drawing/Point'
import Rectangle from '../../../Canvas/Drawing/Rectangle'
import ActivityDesigner from '../ActivityDesigner'

export default class DecisionActivityPainter implements IActivityPainter {

    private _designer: ActivityDesigner;
    constructor(designer: ActivityDesigner) {
        this._designer = designer;
    }

    private DrawDiamond(ctx: CanvasRenderingContext2D): void {
        var dx = this._designer.Bounds.Width / 2;
        var dy = this._designer.Bounds.Height / 2;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'DarkGreen';
        ctx.beginPath();
        ctx.moveTo(0, dy);
        ctx.lineTo(dx, 0);
        ctx.lineTo(this._designer.Bounds.Width, dy);
        ctx.lineTo(dx, this._designer.Bounds.Height);
        ctx.lineTo(0, dy);
        ctx.closePath();
        ctx.stroke();
    }

    public Paint(ctx: CanvasRenderingContext2D, title: string): void {
        this.DrawDiamond(ctx);
        if (title) {
            var dx = 0;
            let ms = ctx.measureText(title);
            if (this._designer.Bounds.Width > ms.width) {
                dx = (this._designer.Bounds.Width - ms.width) / 2;
            }

            ctx.fillStyle = "black";
            ctx.textBaseline = "middle";
            ctx.fillText(title, dx, this._designer.Bounds.Height / 2);
        }
    }
}