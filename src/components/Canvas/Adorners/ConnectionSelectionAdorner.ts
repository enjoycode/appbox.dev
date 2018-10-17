import DesignAdorner from './DesignAdorner'
import Rectangle from '../Drawing/Rectangle'
import Point from '../Drawing/Point'
import DesignAdorners from './DesignAdorners'
import ConnectionDesigner from '../Designers/ConnectionDesigner'
import MouseEventArgs from '../EventArgs/MouseEventArgs'
import IConnection from '../Interfaces/IConnection'
import DesignSurface from '../DesignSurface'
import IShape from '../Interfaces/IShape'
import ConnectionUtilities from '../Extensions/ConnectionUtilities'
import EditPointType from '../Enums/EditPointType'

export class EditPoint {
    public Type: EditPointType;
    public Rect: Rectangle;
    public Index: number;
}

export default class ConnectionSelectionAdorner extends DesignAdorner {
    private readonly _pointSize: number = 6;
    private _pointsCache: Array<EditPoint> | null; //todo:需要监测目标更新，取消当前缓存
    private _hitPoint: EditPoint | null; //mouse移动时击中的编辑点
    private _moveDeltaX: number = 0;
    private _moveDeltaY: number = 0;

    public get ActiveEditPoint(): EditPoint | null {
        return this._hitPoint;
    }

    public constructor(owner: DesignAdorners, target: ConnectionDesigner) {
        super(owner, target);
    }

    public ResetCache(): void {
        this._pointsCache = null;
    }

    private GetEditPoints(): Array<EditPoint> {
        if (this._pointsCache != null)
            return this._pointsCache;

        //注意：画布已偏移坐标系
        var connection: ConnectionDesigner = this.Target as ConnectionDesigner;
        var offsetX = connection.Bounds.X; //connection.Position.X;
        var offsetY = connection.Bounds.Y; //connection.Position.Y;

        var list = new Array<EditPoint>();
        var startPt = connection.StartPoint;
        var rect: Rectangle = new Rectangle(startPt.X - offsetX - this._pointSize / 2, startPt.Y - offsetY - this._pointSize / 2, this._pointSize, this._pointSize)
        var edtPoint: EditPoint = new EditPoint();
        edtPoint.Type = EditPointType.First;
        edtPoint.Rect = rect;
        edtPoint.Index = 0;
        list.push(edtPoint);
        // list.Add(new EditPoint() { Type = EditPointType.First, Rect = rect, Index = 0 });

        //添加中间点
        // for (var i: number = 0; i < connection.ConnectionPoints.length; i++){
        //     // rect = new RectangleF(connection.ConnectionPoints[i].X - offsetX - pointSize / 2f
        //     //                         , connection.ConnectionPoints[i].Y - offsetY - pointSize / 2f
        //     //                         , pointSize, pointSize);
        //     // list.Add(new EditPoint() { Type = EditPointType.Intermediate, Rect = rect, Index = list.Count });
        //     rect = new Rectangle(connection.ConnectionPoints[i].X - offsetX - this.pointSize / 2
        //                             , connection.ConnectionPoints[i].Y - offsetY - this.pointSize / 2
        //                             , this.pointSize, this.pointSize);            
        //     var edtPoint: EditPoint = new EditPoint();
        //     edtPoint.Type = EditPointType.Intermediate;
        //     edtPoint.Rect = rect;
        //     edtPoint.Index = list.length;
        //     list.push(edtPoint);
        // }

        var endPt = connection.EndPoint;
        rect = new Rectangle(endPt.X - offsetX - this._pointSize / 2, endPt.Y - offsetY - this._pointSize / 2, this._pointSize, this._pointSize);
        edtPoint = new EditPoint();
        edtPoint.Type = EditPointType.Last;
        edtPoint.Rect = rect;
        edtPoint.Index = list.length;
        list.push(edtPoint);
        this._pointsCache = list;
        return list;
    }

    public HitTest(pt: Point): [boolean, string] {
        var list = this.GetEditPoints();
        for (var i = 0; i < list.length; i++) {
            if (list[i].Rect.Contains(pt.X, pt.Y)) {
                this._hitPoint = list[i];
                return [true, ""];
            }
        }
        this._hitPoint = null;
        return [false, ""];
    }

    public OnMouseMove(e: MouseEventArgs): void {
        if (!this._hitPoint)
            return;

        var connection: ConnectionDesigner = this.Target as ConnectionDesigner;
        // //如果已连接则暂时取消连接点
        // if (this.hitPoint.Type == EditPointType.First && connection.Source != null)
        //     connection.Source = null;
        // else if (this.hitPoint.Type == EditPointType.Last && connection.Target != null)
        //     connection.Target = null;

        // var clientPt = new Point(e.X, e.Y); //注意：需要转换至Connection所在的上级坐标系
        // if (connection.Parent != null)
        //     clientPt = connection.Parent.PointToClient(clientPt);
        // connection.UpdateGeometryPoint(this.hitPoint.Index, clientPt); //通知Connection更新Point
        // 注意：原实现用以上语句实时更新，现实现绘制StartPoint至EndPoint的虚线
        this._moveDeltaX += e.DeltaX;
        this._moveDeltaY += e.DeltaY;

        //只处理头尾点
        if (this._hitPoint.Type == EditPointType.First || this._hitPoint.Type == EditPointType.Last) {
            if (connection.Surface) {
                ConnectionUtilities.ActivateNearestConnector(connection.Surface, connection
                    , this._hitPoint.Type == EditPointType.First
                    , new Point(e.X, e.Y) /*e.TransformedPoint*/);
            }
        }

        this.Owner.Invalidate(); //需要重新绘制
    }

    public OnMouseUp(e: MouseEventArgs) {
        this._moveDeltaX = 0;
        this._moveDeltaY = 0;
    }

    public OnRender(ctx: CanvasRenderingContext2D): void {
        var points = this.GetEditPoints();
        for (var i: number = 0; i < points.length; i++) {
            this.DrawEditPoint(ctx, points[i].Rect);
        }

        //画移动中虚线
        if (this._hitPoint && (this._moveDeltaX !== 0 || this._moveDeltaY !== 0)) {
            let connection = this.Target as ConnectionDesigner;
            let ptCanvas = connection.PointToSurface(new Point(0, 0));
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = "blue";
            ctx.lineWidth = 1.5;
            if (this._hitPoint.Type === EditPointType.First) {
                ctx.beginPath();
                ctx.moveTo(connection.StartPoint.X - ptCanvas.X + this._moveDeltaX, connection.StartPoint.Y - ptCanvas.Y + this._moveDeltaY);
                ctx.lineTo(connection.EndPoint.X - ptCanvas.X, connection.EndPoint.Y - ptCanvas.Y);
                ctx.stroke();
            } else if (this._hitPoint.Type === EditPointType.Last) {
                ctx.beginPath();
                ctx.moveTo(connection.StartPoint.X - ptCanvas.X, connection.StartPoint.Y - ptCanvas.Y);
                ctx.lineTo(connection.EndPoint.X + this._moveDeltaX - ptCanvas.X, connection.EndPoint.Y + this._moveDeltaY - ptCanvas.Y);
                ctx.stroke();
            }
            ctx.setLineDash([]);
        }
    }

    private DrawEditPoint(ctx: CanvasRenderingContext2D, rect: Rectangle): void {
        ctx.fillStyle = 'white';
        ctx.fillRect(rect.X, rect.Y, rect.Width, rect.Height);

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeRect(rect.X, rect.Y, rect.Width, rect.Height);
    }

}

