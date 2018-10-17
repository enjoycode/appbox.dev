import DesignAdorner from './DesignAdorner'
import ItemDesigner from '../Designers/ItemDesigner'
import DesignAdorners from './DesignAdorners'
import Rectangle from '../Drawing/Rectangle'
import Point from '../Drawing/Point'
import MouseEventArgs from '../EventArgs/MouseEventArgs'
import ResizeAnchorLocation from '../Enums/ResizeAnchorLocation'
import SelectionAdorner from './SelectionAdorner'

export default class LazySelectionAdorner extends SelectionAdorner {
    private _mode: Mode;
    private _bounds: Rectangle;

    public get Bounds(): Rectangle {
        return this._bounds;
    }

    constructor(owner: DesignAdorners, target: ItemDesigner) {
        super(owner, target);
        this._mode = Mode.None;
        this._bounds = new Rectangle(0, 0, target.Bounds.Width, target.Bounds.Height);
    }

    public OnRender(g: CanvasRenderingContext2D) {
        super.OnRender(g);

        //画实时虚线框
        if (this._mode !== Mode.None) {
            g.setLineDash([4, 4]);
            g.strokeStyle = "blue";
            g.lineWidth = 2;
            g.strokeRect(this._bounds.X, this._bounds.Y, this._bounds.Width, this._bounds.Height);
            g.setLineDash([]);
        }
    }

    public Move(deltaX: number, deltaY: number): void {
        if (this._mode !== Mode.Moving) {
            this._mode = Mode.Moving;
        }

        this._bounds.X += deltaX;
        this._bounds.Y += deltaY;
        this.Owner.Invalidate();
    }

    public OnEndMove() {
        if (this._mode === Mode.Moving) {
            this._mode = Mode.None;
            this._bounds.X = this._bounds.Y = 0;
            this.Owner.Invalidate();
        }
    }

}

enum Mode {
    None = 0,
    Moving = 1,
    Resizing = 2
}
