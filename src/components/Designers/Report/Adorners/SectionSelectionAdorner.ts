import Rectangle from '../../../Canvas/Drawing/Rectangle'
import Point from '../../../Canvas/Drawing/Point'
import DesignAdorner from '../../../Canvas/Adorners/DesignAdorner'
import MouseEventArgs from '../../../Canvas/EventArgs/MouseEventArgs'
import ResizeAnchorLocation from '../../../Canvas/Enums/ResizeAnchorLocation'


export default class SectionSelectionAdorner extends DesignAdorner {
    private readonly anchorSize = 6;
    private anchorLocation: ResizeAnchorLocation = ResizeAnchorLocation.None;
    protected get BottomCenter(): Rectangle {
        return new Rectangle((this.Target.Bounds.Width - this.anchorSize) / 2, this.Target.Bounds.Height, this.anchorSize, this.anchorSize);
    }    

    public OnRender(g: CanvasRenderingContext2D) {
        //画外边框
        g.strokeStyle = "darkgray";
        g.lineWidth = 2;
        g.strokeRect(-3, -3, this.Target.Bounds.Width + 6, this.Target.Bounds.Height + 6);

        //画锚点
        this.DrawAnchor(g, this.BottomCenter);
    } 

    private DrawAnchor(g: CanvasRenderingContext2D, rect: Rectangle) {
        g.fillStyle = "white";
        g.fillRect(rect.X, rect.Y, rect.Width, rect.Height);
        g.strokeStyle = "black";
        g.lineWidth = 1;
        g.strokeRect(rect.X, rect.Y, rect.Width, rect.Height);
    }   

    public HitTest(pt: Point): [boolean, string] {
        var cursor: string = "";
        if (this.BottomCenter.Contains(pt.X, pt.Y)) {
            this.anchorLocation = ResizeAnchorLocation.BottomCenter;
            cursor = "s-resize";
        } else {
            this.anchorLocation = ResizeAnchorLocation.None;
        }

        if (this.anchorLocation != ResizeAnchorLocation.None)
            return [true, cursor];
        else
            return [false, cursor];
    }

    public OnMouseMove(e: MouseEventArgs) {
         this.Target.Resize(this.anchorLocation, e.DeltaX, e.DeltaY);
    }

    public OnMouseUp(e: MouseEventArgs) {
        this.Target.OnEndResize();
    }        
}