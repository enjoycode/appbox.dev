import DesignAdorner from './DesignAdorner'
import Rectangle from '../Drawing/Rectangle'
import Point from '../Drawing/Point'
import MouseEventArgs from '../EventArgs/MouseEventArgs'
import ResizeAnchorLocation from '../Enums/ResizeAnchorLocation'

/**
 * 通用选择装饰器
 */
export default class SelectionAdorner extends DesignAdorner {
    private readonly anchorSize = 6;
    private anchorLocation: ResizeAnchorLocation = ResizeAnchorLocation.None;

    protected get LeftTop(): Rectangle {
        return new Rectangle(-this.anchorSize, -this.anchorSize, this.anchorSize, this.anchorSize);
    }

    protected get LeftCenter(): Rectangle {
        return new Rectangle(-this.anchorSize, (this.Target.Bounds.Height - this.anchorSize) / 2, this.anchorSize, this.anchorSize);
    }

    protected get LeftBottom(): Rectangle {
        return new Rectangle(-this.anchorSize, this.Target.Bounds.Height, this.anchorSize, this.anchorSize);
    }

    protected get RightTop(): Rectangle {
        return new Rectangle(this.Target.Bounds.Width, -this.anchorSize, this.anchorSize, this.anchorSize);
    }

    protected get RightCenter(): Rectangle {
        return new Rectangle(this.Target.Bounds.Width, (this.Target.Bounds.Height - this.anchorSize) / 2, this.anchorSize, this.anchorSize);
    }

    protected get RightBottom(): Rectangle {
        return new Rectangle(this.Target.Bounds.Width, this.Target.Bounds.Height, this.anchorSize, this.anchorSize);
    }

    protected get TopCenter(): Rectangle {
        return new Rectangle((this.Target.Bounds.Width - this.anchorSize) / 2, -this.anchorSize, this.anchorSize, this.anchorSize);
    }

    protected get BottomCenter(): Rectangle {
        return new Rectangle((this.Target.Bounds.Width - this.anchorSize) / 2, this.Target.Bounds.Height, this.anchorSize, this.anchorSize);
    }

    public OnRender(g: CanvasRenderingContext2D) {
        //画外边框
        g.strokeStyle = "darkgray";
        g.lineWidth = 2;
        g.strokeRect(-3, -3, this.Target.Bounds.Width + 6, this.Target.Bounds.Height + 6);

        //画锚点
        this.DrawAnchor(g, this.LeftTop);
        this.DrawAnchor(g, this.LeftCenter);
        this.DrawAnchor(g, this.LeftBottom);

        this.DrawAnchor(g, this.RightTop);
        this.DrawAnchor(g, this.RightCenter);
        this.DrawAnchor(g, this.RightBottom);

        this.DrawAnchor(g, this.TopCenter);
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
        //todo: 优化判断
        var cursor: string = "";
        if (this.LeftTop.Contains(pt.X, pt.Y)) {
            this.anchorLocation = ResizeAnchorLocation.LeftTop;
            cursor = "nw-resize";
        } else if (this.LeftCenter.Contains(pt.X, pt.Y)) {
            this.anchorLocation = ResizeAnchorLocation.LeftCenter;
            cursor = "w-resize";
        } else if (this.LeftBottom.Contains(pt.X, pt.Y)) {
            this.anchorLocation = ResizeAnchorLocation.LeftBottom;
            cursor = "sw-resize";
        } else if (this.RightTop.Contains(pt.X, pt.Y)) {
            this.anchorLocation = ResizeAnchorLocation.RightTop;
            cursor = "ne-resize";
        } else if (this.RightCenter.Contains(pt.X, pt.Y)) {
            this.anchorLocation = ResizeAnchorLocation.RightCenter;
            cursor = "e-resize";
        } else if (this.RightBottom.Contains(pt.X, pt.Y)) {
            this.anchorLocation = ResizeAnchorLocation.RightBottom;
            cursor = "se-resize";
        } else if (this.TopCenter.Contains(pt.X, pt.Y)) {
            this.anchorLocation = ResizeAnchorLocation.TopCenter;
            cursor = "n-resize";
        } else if (this.BottomCenter.Contains(pt.X, pt.Y)) {
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