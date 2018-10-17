import IActivityPainter from './IActivityPainter'
import Size from '../../../Canvas/Drawing/Size'
import Point from '../../../Canvas/Drawing/Point'
import Rectangle from '../../../Canvas/Drawing/Rectangle'
import ActivityDesigner from '../ActivityDesigner'

export default class StartActivityPainter implements IActivityPainter {
    private _designer: ActivityDesigner;
    constructor(designer: ActivityDesigner){
        this._designer = designer;
    }

    public Paint(ctx: CanvasRenderingContext2D,title: string): void{
        var rect: Rectangle = new Rectangle(0,0,this._designer.Bounds.Width,this._designer.Bounds.Height);
        ctx.beginPath();
        ctx.ellipse(this._designer.Bounds.Width/2,this._designer.Bounds.Height/2,this._designer.Bounds.Width/2,this._designer.Bounds.Height/2,0,0,2*Math.PI,true);
        ctx.closePath();
        ctx.fillStyle = 'Green';
        ctx.fill();

        ctx.beginPath();
        ctx.lineTo(10,5);
        ctx.lineTo(25,15);
        ctx.lineTo(10,25);
        ctx.closePath();
        ctx.fillStyle = 'White'; 
        ctx.fill();
        if(title){
            var dx =0;
            let ms = ctx.measureText(title);
            if(this._designer.Bounds.Width > ms.width){
                dx = (this._designer.Bounds.Width - ms.width)/2;
            }
            
            ctx.fillStyle = "black";
            ctx.textBaseline = "middle";
            ctx.fillText(title,dx, this._designer.Bounds.Height/2);     
        }
    }
}