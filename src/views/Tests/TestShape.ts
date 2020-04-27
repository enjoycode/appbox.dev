import Rectangle from '@/components/Canvas/Drawing/Rectangle'
import BoundsSpecified from '@/components/Canvas/Enums/BoundsSpecified'
import ItemDesigner from '@/components/Canvas/Designers/ItemDesigner'

export default class TestShape extends ItemDesigner {

    private _bounds: Rectangle = new Rectangle(10, 10, 120, 30);

    public get Bounds(): Rectangle {
        return this._bounds;
    }
    public set Bounds(value: Rectangle) {
        this.SetBounds(value.X, value.Y, value.Width, value.Height, BoundsSpecified.All);
    }

    protected SetBounds(x: number, y: number, width: number, height: number, specified: BoundsSpecified): void {
        let oldBounds = new Rectangle(this._bounds.X, this._bounds.Y, this._bounds.Width, this._bounds.Height);
        this._bounds.X = x;
        this._bounds.Y = y;
        this._bounds.Width = width;
        this._bounds.Height = height;
        this.InvalidateOnBoundsChanged(oldBounds); // this.Invalidate();
    }

    public Paint(ctx: CanvasRenderingContext2D, clip?: Rectangle): void {
        ctx.fillStyle = "green";
        ctx.fillRect(0, 0, this._bounds.Width, this._bounds.Height);
        ctx.strokeRect(0, 0, this._bounds.Width, this._bounds.Height);
        ctx.fillStyle = "white";
        ctx.textBaseline = "top";
        ctx.fillText("TestShape", 2, 2);
    }

}