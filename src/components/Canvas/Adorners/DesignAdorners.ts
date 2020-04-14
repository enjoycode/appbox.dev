import DesignAdorner from './DesignAdorner'
import DesignSurface from '../DesignSurface'
import Point from '../Drawing/Point'
import Rectangle from '../Drawing/Rectangle'
import MouseEventArgs from '../EventArgs/MouseEventArgs'
import IShape from '../Interfaces/IShape'
import IConnector from '../Interfaces/IConnector'
import ConnectionSelectionAdorner from './ConnectionSelectionAdorner'
import ConnectionDesigner from '../Designers/ConnectionDesigner'
import EditPointType from '../Enums/EditPointType'

export default class DesignAdorners {
    private readonly _canvas: HTMLCanvasElement;
    private readonly _adorners: Array<DesignAdorner>;
    private readonly _surface: DesignSurface;

    public get Canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    private _hitTestItem: DesignAdorner | null;
    public get HitTestItem(): DesignAdorner | null {
        return this._hitTestItem;
    }

    constructor(surface: DesignSurface, canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this._surface = surface;
        this._adorners = new Array<DesignAdorner>();
    }

    //===================Methods===============
    /**
     * 清除所有选择项装饰对象
     */
    public ClearSelected() {
        for (var i = this._adorners.length - 1; i >= 0; i--) {
            if (this._adorners[i].IsSelectionAdorner) {
                this._adorners.splice(i, 1);
            }
        }
    }

    public Add(adorner: DesignAdorner) {
        //避免CellSelectionAdorner重复添加
        for (var i = 0; i < this._adorners.length; i++) {
            if (this._adorners[i] === adorner)
                return;
        }
        this._adorners.push(adorner);
    }

    /**
     * Mouse移动时测试点是否需要被装饰层处理
     * @param p 画布坐标系
     */
    public HitTest(p: Point): boolean { //todo: 待验证
        var item: DesignAdorner;
        var ptItemClient: Point = new Point(0, 0);
        var hitItem: DesignAdorner | null = null;
        var hitTestCursor = "";

        for (var i = 0; i < this._adorners.length; i++) {
            item = this._adorners[i];
            ptItemClient.X = item.Target.Bounds.X;
            ptItemClient.Y = item.Target.Bounds.Y;
            if (item.Target.Parent) {
                ptItemClient = item.Target.Parent.PointToSurface(ptItemClient);
            }
            ptItemClient.X = p.X - ptItemClient.X;
            ptItemClient.Y = p.Y - ptItemClient.Y;

            let res: [boolean, string] = item.HitTest(ptItemClient);
            if (res[0] === true) {
                hitItem = item;
                hitTestCursor = res[1];
            }
        }

        this._hitTestItem = hitItem;
        if (hitItem) {
            this._canvas.style.cursor = hitTestCursor; // 改变当前画布Cursor
        } else {
            this._canvas.style.cursor = "default";
        }

        return hitItem != null;
    }

    /**
     * 重新绘制整个装饰层
     */
    public Invalidate() { //todo: 暂全部重画
        let ctx = this._canvas.getContext("2d") as CanvasRenderingContext2D;
        //先清空画布
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        if (this._creationMode == CreationMode.None && this._adorners.length == 0)
            return;

        let ptCanvas: Point = new Point(0, 0);
        for (const item of this._adorners) {
            ptCanvas = item.Target.PointToSurface(new Point(0, 0));

            ctx.translate(ptCanvas.X, ptCanvas.Y);
            item.OnRender(ctx);
            ctx.translate(-ptCanvas.X, -ptCanvas.Y);
        }

        //画新建框或新建连接线
        if (this._creationMode == CreationMode.Item) {
            let x1 = Math.min(this._x1, this._x2);
            let y1 = Math.min(this._y1, this._y2);
            let x2 = Math.max(this._x1, this._x2);
            let y2 = Math.max(this._y1, this._y2);
            ctx.lineWidth = 1;
            ctx.strokeStyle = "black";
            ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
        }
        else if (this._creationMode == CreationMode.Connection) {
            //graphics.DrawLine(Color.DarkGray, 2f, X1, Y1, X2, Y2);
            this.DrawShapeConnectors(ctx); //突出画需要连接至的附件的IShape
        }
    }

    private DrawShapeConnectors(g: CanvasRenderingContext2D): void {
        if (this.nearestShapes) {
            var shape: IShape;
            var connector: IConnector;
            for (var i = 0; i < this.nearestShapes.length; i++) {
                shape = this.nearestShapes[i];

                let radius = 4;
                var x = 0;
                var y = 0;
                for (var j = 0; j < shape.Connectors.length; j++) {
                    connector = shape.Connectors[j];
                    x = connector.AbsolutePosition.X - radius;
                    y = connector.AbsolutePosition.Y - radius;

                    //判断IsActive，不同的绘制方法
                    var activeColor = connector === this.ActiveConnector ? "red" : "white";

                    g.beginPath();
                    g.arc(x + radius, y + radius, radius, 0, 360);
                    g.fillStyle = activeColor;
                    g.fill();
                    g.lineWidth = 1;
                    g.strokeStyle = "red";
                    g.stroke();
                }
            }
        }
    }

    public OnMouseUp(e: MouseEventArgs) {
        // 先通知HitTestItem
        if (this._hitTestItem) {
            this._hitTestItem.OnMouseUp(e);
        }

        //清空显示
        this.nearestShapes = null;
        this.Invalidate();

        if (this.ActiveConnector) {
            var connectionAdorner = this._hitTestItem as ConnectionSelectionAdorner;
            if (connectionAdorner != null) {
                var connection = connectionAdorner.Target as ConnectionDesigner;
                var editPoint = connectionAdorner.ActiveEditPoint;
                if (editPoint) {
                    // if (editPoint.Type === EditPointType.First)
                    //     connection.Attach(source: ActiveConnector);
                    // else if (editPoint.Type === EditPointType.Last)
                    //     connection.Attach(target: ActiveConnector);
                }
            }

            this.ActiveConnector = null;
        }
    }

    //===========新建相关==============
    private _creationMode: CreationMode = CreationMode.None;
    private _x1: number;
    private _y1: number;
    private _x2: number;
    private _y2: number;

    public get CreationStartPoint(): Point { return new Point(this._x1, this._y1); }
    public get CreationEndPoint(): Point { return new Point(this._x2, this._y2); }
    public get CreationRectangle(): Rectangle {
        let x1 = Math.min(this._x1, this._x2);
        let y1 = Math.min(this._y1, this._y2);
        let x2 = Math.max(this._x1, this._x2);
        let y2 = Math.max(this._y1, this._y2);
        return new Rectangle(x1, y1, x2 - x1, y2 - y1);
    }

    public BeginCreation(x: number, y: number, isConnection: boolean): void {
        this._creationMode = isConnection ? CreationMode.Connection : CreationMode.Item;
        this._x1 = this._x2 = x;
        this._y1 = this._y2 = y;
    }

    public UpdateCreationEndPoint(x: number, y: number): void {
        this._x2 = x;
        this._y2 = y;
        this.Invalidate();
    }

    public EndCreation(): void {
        this._creationMode = CreationMode.None;
    }

    //===========Connector相关==============
    private nearestShapes: Array<IShape> | null;
    public ActiveConnector: IConnector | null;

    public UpdateNearestShapes(nearest: Array<IShape> | null): void {
        var oldCount = this.nearestShapes == null ? 0 : this.nearestShapes.length;
        var newCount = nearest == null ? 0 : nearest.length;

        this.nearestShapes = nearest;
        if (newCount == 0)
            this.ActiveConnector = null;

        if (oldCount != newCount)
            this.Invalidate();
    }

}

enum CreationMode {
    None,
    Connection,
    Item //Shape or Item
}