import ItemDesigner from '../../../Canvas/Designers/ItemDesigner'
import Rectangle from '../../../Canvas/Drawing/Rectangle'
import BoundsSpecified from '../../../Canvas/Enums/BoundsSpecified'
import IServerReportItem from './IServerReportItem'

export default class ReportRootDesigner extends ItemDesigner {

    private _bounds: Rectangle = new Rectangle(0, 0, 0, 0);
    public get Bounds(): Rectangle {
        return this._bounds;
    }
    public set Bounds(value) {
        // do nothing
    }

    public get IsContainer(): boolean {
        return true;
    }

    public Fetch(serverItem: IServerReportItem) {
        this._id = serverItem.ID;
        this._bounds.X = serverItem.Bounds.X;
        this._bounds.Y = serverItem.Bounds.Y;
        this._bounds.Width = serverItem.Bounds.Width;
        this._bounds.Height = serverItem.Bounds.Height;
    }

    protected SetBounds(x: number, y: number, width: number, height: number, specified: BoundsSpecified): void {
        // do nothing
    }

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