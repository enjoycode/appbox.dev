import Rectangle from '../Drawing/Rectangle'
import Point from '../Drawing/Point'
import Size from '../Drawing/Size'
import IShape from '../Interfaces/IShape'
import BoundsSpecified from '../Enums/BoundsSpecified'
import ItemDesigner from '../Designers/ItemDesigner'
import IConnection from '../Interfaces/IConnection'
import IConnector from '../Interfaces/IConnector'
import ConnectorPosition from '../Core/Declaratives/ConnectorPosition'
import Utils from '../Extensions/Utils'
import BridgeType from '../Core/Declaratives/BridgeType'
import ShapeUtilities from '../Extensions/ShapeUtilities'
import { IGeometry, IPathSegment } from '../Core/Legacy'
import { LineSegment, BezierSegment, PolyLineSegment, ArcSegment } from '../Core/Segments'
import { PathGeometry } from '../Core/Geometries/PathGeometry'
import PathFigure from '../Core/Segments'
import ConnectionType from '../Core/Declaratives/ConnectionType'
import ConnectionRoute from '../Core/Declaratives/ConnectionRoute'
import ISelectionAdorner from '../Interfaces/ISelectionAdorner'
import DesignAdorners from '../Adorners/DesignAdorners'
import DesignAdorner from '../Adorners/DesignAdorner'
import ConnectionSelectionAdorner from '../Adorners/ConnectionSelectionAdorner'
import CapType from '../Core/Declaratives/CapType'
import RectExtensions from '../Extensions/RectExtensions'

export default class ConnectionDesigner extends ItemDesigner implements IConnection {
    public ConnectionBridge: BridgeType;
    ConnectionPoints: Array<Point> = new Array<Point>();
    private isInnerChange: boolean;
    private isSuppressingConnectionUpdate: boolean;
    private source: IShape | null;
    private isDirty: boolean = false;
    private sourceCap: PathFigure | null;
    private targetCap: PathFigure | null;

    public get Source(): IShape | null {
        return this.source;
    }

    public set Source(value: IShape | null) {
        if (this.source != value) {
            var oldSource = this.source;
            this.source = value;
            this.OnSourceChanged(oldSource);
        }
    }

    /// <summary>
    /// Gets or sets the editing point of the connection. This points indicates the position of the editing element.
    /// </summary>
    private edittingPoint: Point = new Point(0, 0);
    public get EdittingPoint(): Point {
        return this.edittingPoint;
    }

    public set EdittingPoint(value: Point) {
        if (this.edittingPoint.X != value.X || this.edittingPoint.Y != value.Y) {
            this.edittingPoint.X = value.X;
            this.edittingPoint.Y = value.Y;
            //this.OnEdittingPointPropertyChanged();
        }
    }

    private target: IShape | null;
    public get Target(): IShape | null {
        return this.target;
    }

    public set Target(value: IShape | null) {
        if (this.target != value) {
            var oldTarget = this.target;
            this.target = value;
            this.OnTargetChanged(oldTarget);
        }
    }

    private sourceConnectorPosition: string;
    public get SourceConnectorPosition(): string {
        return this.sourceConnectorPosition;
    }

    public set SourceConnectorPosition(value: string) {
        if (this.sourceConnectorPosition != value) {
            var oldValue = this.sourceConnectorPosition;
            this.sourceConnectorPosition = value;
            this.OnSourceConnectorPositionChanged(value, oldValue);
        }
    }

    private sourceConnectorResult: IConnector | null;
    public get SourceConnectorResult(): IConnector | null {
        return this.sourceConnectorResult;
    }

    public set SourceConnectorResult(value: IConnector | null) {
        this.sourceConnectorResult = value;
    }

    public get Bounds(): Rectangle {
        //todo: 暂简单处理        
        return RectExtensions.CreateByTwoPoint(this.startPoint, this.endPoint);
    }

    private position: Point;
    public get Position(): Point {
        return this.position;
    }

    public set Position(value: Point) {
        this.position = value;
    }

    private _cachedPath: Path2D | null;
    private geometry: IGeometry;
    public get Geometry(): IGeometry {
        return this.geometry;
    }
    public set Geometry(value: IGeometry) {
        if (this.geometry != value) {
            this.geometry = value;
            this._cachedPath = null;
        }
    }

    private title: string | null;
    public get Title(): string | null {
        return this.title;
    }

    public set Title(value: string | null) {
        if (this.title != value) {
            this.title = value;
        }
    }

    // 绘制样式相关属性
    /// Gets or sets the type of the connection.
    public ConnectionType: ConnectionType;

    /// Gets or sets the type of the source cap.
    // public SourceCapType: CapType;

    /// Gets or sets the type of the target cap.
    // public TargetCapType: CapType;

    /// Gets or sets the size of the source cap.
    // public SourceCapSize: Size = new Size();

    /// Gets or sets the size of the target cap.
    // public TargetCapSize: Size = new Size();

    public get SelectionAdorner(): DesignAdorner | null {
        if (!this._selectionAdorner && this.Surface) {
            this._selectionAdorner = new ConnectionSelectionAdorner(this.Surface.Adorners, this);
        }
        return this._selectionAdorner;
    }

    constructor() {
        super();
        // this.SourceCapSize.Height = 12;
        // this.SourceCapSize.Width = 12;
        // this.TargetCapSize.Height = 12;
        // this.TargetCapSize.Width = 12;
    }

    public OnSourceChanged(oldSource: IShape | null): void {
        if (!this.isSuppressingConnectionUpdate)
            this.ResolveSourceConnector();
        //if (this.Source != null && this.Source.ParentContainer != null)
        //    this.EnsureZIndex(this.Source.ParentContainer);

        //this.OnPropertyChanged(DiagramPropertyName.Source);
    }

    // ====Overrides Methods====
    public Invalidate(): void {
        if (this.Surface)
            this.Surface.Invalidate();
    }

    public HitTest(x: number, y: number, ctx: CanvasRenderingContext2D): boolean {
        if (this.Surface) {
            ctx.lineWidth = 4;
            let path = this.EnsureGeometryPath();
            if (path) {
                return ctx.isPointInStroke(path, x * this.Surface.PixelRatio, y * this.Surface.PixelRatio);
            }
        }

        return false;
    }

    private targetConnectorPosition: string;
    /// <summary>
    /// Gets or sets the target connector position.
    /// </summary>
    /// <value>
    /// The target connector position.
    /// </value>
    public get TargetConnectorPosition(): string {
        return this.targetConnectorPosition;
    }

    public set TargetConnectorPosition(value: string) {
        if (this.targetConnectorPosition != value) {
            var oldValue = this.targetConnectorPosition;
            this.targetConnectorPosition = value;
            this.OnTargetConnectorPositionChanged(value, oldValue);
        }
    }

    private targetConnectorResult: IConnector | null;
    public get TargetConnectorResult(): IConnector | null {
        return this.targetConnectorResult;
    }

    public set TargetConnectorResult(value: IConnector | null) {
        this.targetConnectorResult = value;
    }

    private EnsureGeometryPath(): Path2D | null {
        if (!this._cachedPath) {
            if (this.geometry) {
                this._cachedPath = this.geometry.CreatePath();
            }
        }
        return this._cachedPath;
    }

    public UpdateGeometryPoint(index: number, newPoint: Point): void {
        //暂简单更新
        if (index == 0)
            this.StartPoint = newPoint; //new PointF(this.StartPoint.X + offsetX, this.StartPoint.Y + offsetY);
        else if (index == this.ConnectionPoints.length + 1)
            this.EndPoint = newPoint; //new PointF(this.EndPoint.X + offsetX, this.EndPoint.Y + offsetY);
        else {
            var pt = this.ConnectionPoints[index - 1];
            this.ConnectionPoints[index - 1] = newPoint; //new PointF(pt.X + offsetX, pt.Y + offsetY);
        }
        this.Update(false);
    }

    public Update(isManipulating: boolean): void {
        //先清空adorner的缓存 todo!!!!!!!!!!!!!
        // var adorner = this._selectionAdorner as ConnectionSelectionAdorner;
        // if (adorner != null)
        //     adorner.ResetCache();

        if (this.isSuppressingConnectionUpdate)
            return;
        //if (GetIsAutoUpdateSuppressed(this))
        //    return;
        var updatedPending = isManipulating
            //&& (this.Source != null && this.Source.IsSelected) 
            //&& (this.Target != null && this.Target.IsSelected) 
            && this.Source != this.Target;

        if (this.isDirty || !updatedPending) {
            // cache start and end points:
            if (!updatedPending) {
                this.CalculateAutoConnectors(true, true);
                //this.UpdateAutoBezierHandles();
            }

            // this.UpdateGeometryOverride(); //todo: 通知服务端??
            //if (this.IsSelectedInGroup)
            //    this.UpdateSelectedGeometryOverride();
            //this.UpdateDeferredGeometryOverride(null);

            //if (!string.IsNullOrWhiteSpace(this.Title))
            // if (this.Title != null) {
                // var str = this.Title.replace(/(^\s*)|(\s*$)/g, ""); //去掉两侧空格
                // if (str != '')
                //     this.CalculateEdittingPoint();
            // }
            this.isDirty = false;
        } else if (updatedPending) {
            this.isDirty = true;
        }

        if (this.Parent != null) //todo:更有效率的重绘
        {
            //this.InvalidateMeasure();
            this.Parent.Invalidate();
        } else {
            if (this.Surface != null) this.Surface.Invalidate();
        }
        //this.isDirty = true;
    }

    private GetNearestConnector2(shapes: Array<IShape>, point: Point, delta: number): IConnector | null {
        // var resolvedConnector: IConnector;
        // var minDistance = Number.MAX_VALUE

        // foreach (var connector in shapes.SelectMany(shape => shape.Connectors.Where(c => c.Name != ConnectorPosition.Auto)))
        // {
        //     var currentDistance = connector.AbsolutePosition.Distance(point);
        //     if (currentDistance < minDistance && currentDistance < delta)
        //     {
        //         minDistance = currentDistance;
        //         resolvedConnector = connector;
        //     }
        // }
        // return resolvedConnector;
        //todo:!!!!!
        return null;
    }

    private GetNearestConnector(shape: IShape, point: Point): IConnector | null {
        if (shape != null) {
            var shapArray: Array<IShape> = new Array<IShape>();
            shapArray.push(shape);
            return this.GetNearestConnector2(shapArray, point, Number.MAX_VALUE);
        }
        return null;
    }

    /// <summary>
    /// Calculates the connector to which this connection is attached if the <see cref="ConnectorPosition.Auto"/> connector is used.
    /// </summary>
    private CalculateAutoConnectors(calculateStart: boolean, calculateEnd: boolean): void {
        if (calculateStart && this.Source != null && this.SourceConnectorPosition == ConnectorPosition.Auto) {
            // if there are intermediate points we need to use the almost last point, except for Bezier where the handles are actually defined through the connector's position
            var target: Point
            if (this.ConnectionPoints.length > 0 && this.ConnectionType != ConnectionType.Bezier)
                target = this.ConnectionPoints[0];
            else
                target = this.Target == null ? this.endPoint : new Point(this.Target.Bounds.X + this.Target.Bounds.Width / 2, this.Target.Bounds.Y + this.Target.Bounds.Height / 2);
            this.SourceConnectorResult = this.GetNearestConnector(this.Source, target);
            if (this.SourceConnectorResult == null) {
                // this.SourceConnectorResult = this.Source.Connectors[ConnectorPosition.Auto]; 
                for (var i: number = 0; i < this.Source.Connectors.length; i++) {
                    if (this.Source.Connectors[i].Name == ConnectorPosition.Auto) {
                        this.SourceConnectorResult = this.Source.Connectors[i];
                        break;
                    }
                }
            }
        }
        if (calculateEnd && this.Target != null && this.TargetConnectorPosition == ConnectorPosition.Auto) {
            var source: Point;
            if (this.ConnectionPoints.length > 0 && this.ConnectionType != ConnectionType.Bezier)
                source = this.ConnectionPoints[this.ConnectionPoints.length - 1];
            else
                source = this.Source == null ? this.endPoint : new Point(this.Source.Bounds.X + this.Source.Bounds.Width / 2, this.Source.Bounds.Y + this.Source.Bounds.Height / 2);

            this.TargetConnectorResult = this.GetNearestConnector(this.Target, source);
            if (this.TargetConnectorResult == null) {
                // this.Target.Connectors[ConnectorPosition.Auto];
                for (var i: number = 0; i < this.Target.Connectors.length; i++) {
                    if (this.Target.Connectors[i].Name == ConnectorPosition.Auto) {
                        this.SourceConnectorResult = this.Target.Connectors[i];
                        break;
                    }
                }
            }
        }
    }

    /// <summary>
    /// Shifts the <see cref="IConnection.ConnectionPoints"/> by adding or substracting the <see cref="IDiagramItem.Position"/> vector.
    /// </summary>
    /// <remarks>The start/end points are not taken into account here.</remarks>
    /// <param name="connection">The connection. to shift.</param>
    /// <param name="globalCoordinates">If set to <c>true</c> points will be transformed to global coordinates. If set to false, then the coordinates will be relative to the connection.</param>
    private TranslateConnectionPoints(globalCoordinates: boolean): Array<Point> {
        var transformedPoints: Array<Point> = new Array<Point>();

        for (var i = 0; i < this.ConnectionPoints.length; i++) {
            transformedPoints.push(
                globalCoordinates
                    ? new Point(this.ConnectionPoints[i].X + this.Position.X, this.ConnectionPoints[i].Y + this.Position.Y)
                    : new Point(this.ConnectionPoints[i].X - this.Position.X, this.ConnectionPoints[i].Y - this.Position.Y));
        }

        return transformedPoints;
    }

    private SetPosition(newPosition: Point): void {
        this.isInnerChange = true;
        this.Position = newPosition;
        this.isInnerChange = false;
    }

    protected SetBounds(x: number, y: number, width: number, height: number, specified: BoundsSpecified): void {
        //todo: or donothing
    }

    // <summary>
    // Returns all the points of this connection, i.e. the start and end points together with the intermediate connection points.
    // </summary>
    // <param name="connection">The connection.</param>
    // <returns></returns>
    private AllPoints(): Array<Point> {
        var points: Array<Point> = new Array<Point>();
        points.push(this.StartPoint);
        for (var i = 0; i < this.ConnectionPoints.length; i++) {
            points.push(this.ConnectionPoints[i]);
        }
        points.push(this.EndPoint);
        return points;
    }

    // private readonly ObservableCollection<PointF> connectionPoints = new ObservableCollection<PointF>();
    private connectionPoints: Array<Point> = new Array();
    protected startPoint: Point = new Point(0, 0);
    public get StartPoint(): Point {
        // if (this.SourceConnectorResult == null || this.SourceConnectorResult == undefined) {
        //     return this.startPoint;
        // }
        // if (this.SourceConnectorResult.Name == ConnectorPosition.Gliding) {
        //     // don't use the connector's absolute position but get the crossing point between the line (defined by the centers of the shapes) and the bounds   
        //     var endp: Point = new Point(0, 0);
        //     // if there are intermediate points we need to use the almost last point
        //     if (this.ConnectionPoints.length > 0)
        //         endp = this.ConnectionPoints[this.ConnectionPoints.length - 1];
        //     else {
        //         endp = this.Target == null ? this.endPoint : new Point(this.Target.Bounds.X / 2, this.Target.Bounds.Y / 2);
        //     }

        //     var r = this.SourceConnectorResult.AbsolutePosition;

        //     //var shape = this.Source as ShapeDesigner;
        //     //if (shape != null)
        //     //{
        //     //    // the center (=SourceConnectorResult.AbsolutePosition) will not do in the right triangle case 
        //     //    // since the center does not sit inside the shape and doesnt give intersections
        //     //    var startp = (shape.GlidingStyle == GlidingStyle.RightTriangle) ? 
        //     //        new Point(shape.Bounds.X + (shape.Bounds.Width / 5), shape.Bounds.Y + (2 * shape.Bounds.Height / 3)) 
        //     //        : this.SourceConnectorResult.AbsolutePosition;
        //     //    r = Utils.FindIntersectionPoint(shape.Bounds, shape.RotationAngle, startp, endp, shape.GlidingStyle);
        //     //}
        //     //else
        //     if (this.Source)
        //         Utils.IntersectionPointOnRectangle(this.Source.Bounds, this.SourceConnectorResult.AbsolutePosition, endp, r);
        //     return this.startPoint = r;
        // }
        // this.startPoint = this.SourceConnectorResult.AbsolutePosition;
        return this.startPoint;
    }

    public set StartPoint(value: Point) {
        // if (this.Source == null) {
        //     if (this.startPoint.X != value.X || this.startPoint.Y != value.Y) {
        //         // move the handle along with the endpoint
        //         if (this.ConnectionType == ConnectionType.Bezier) {
        //             this.ConnectionPoints[0] = new Point(this.ConnectionPoints[0].X + value.X - this.startPoint.X, this.ConnectionPoints[0].Y + value.Y - this.startPoint.Y);
        //         }
        //         this.startPoint.X = value.X;
        //         this.startPoint.Y = value.Y;
        //         this.SetPosition(Utils.GetTopLeftPoint(this.AllPoints()));
        //         //this.OnPropertyChanged(DiagramPropertyName.StartPoint);
        //     }
        // }
        //if (this.ElementTree != null)
        //    this.ElementTree.RootElement.Invalidate();
    }

    protected endPoint: Point = new Point(0, 0);
    public get EndPoint(): Point {
        // if (this.TargetConnectorResult == null)
        //     return this.endPoint;
        // if (this.TargetConnectorResult.Name == ConnectorPosition.Gliding) {
        //     var startp: Point;
        //     //if there are intermediate points we need to use the almost last point
        //     if (this.ConnectionPoints.length > 0)
        //         startp = this.connectionPoints[this.connectionPoints.length - 1];
        //     else {
        //         if (this.source) {
        //             startp = new Point(this.source.Bounds.X / 2, this.source.Bounds.Y / 2);
        //         } else {
        //             startp = this.startPoint;
        //         }
        //     }
        //     var r: Point = new Point(0, 0);
        //     //var shape = this.Target as ShapeDesigner;
        //     //if (shape != null)
        //     //{
        //     //    // the center (=TargetConnectorResult.AbsolutePosition) will not do in the right triangle case since the center does not sit inside the shape and doesnt give intersections
        //     //    var endp = (shape.GlidingStyle == GlidingStyle.RightTriangle) ? new Point(shape.Bounds.X + (shape.Bounds.Width / 5), shape.Bounds.Y + (2 * shape.Bounds.Height / 3)) : this.TargetConnectorResult.AbsolutePosition;
        //     //    r = Utils.FindIntersectionPoint(shape.Bounds, shape.RotationAngle, endp, startp, shape.GlidingStyle);
        //     //}
        //     //else
        //     if (this.Target)
        //         Utils.IntersectionPointOnRectangle(this.Target.Bounds, startp, this.TargetConnectorResult.AbsolutePosition, r);
        // }
        return this.endPoint;
    }
    public set EndPoint(value: Point) {
        // if (this.Target == null) {
        //     if (this.endPoint.X != value.X || this.endPoint.Y != value.Y) {
        //         if (this.ConnectionType == ConnectionType.Bezier) {
        //             this.ConnectionPoints[1] = new Point(this.ConnectionPoints[1].X + value.X - this.endPoint.X, this.ConnectionPoints[1].Y + value.Y - this.endPoint.Y);
        //         }
        //         this.endPoint.X = value.X;
        //         this.endPoint.Y = value.Y;
        //         this.SetPosition(Utils.GetTopLeftPoint(this.AllPoints()));
        //         //this.OnPropertyChanged(DiagramPropertyName.EndPoint);
        //     }
        // }
        //if (this.ElementTree != null)
        //    this.ElementTree.RootElement.Invalidate();
    }

    public Paint(ctx: CanvasRenderingContext2D): void {
        // if (this.isDirty) {
        //     this.Update(true);
        //     this.isDirty = false;
        // }

        //测试画bounds


        this.DrawConnectionLine(ctx, false);
        this.DrawConnectionCap(ctx, this.targetCap);
        this.DrawConnectionCap(ctx, this.sourceCap);
        //  //this.DrawDeferredConnectionLine(g);
        //  //this.DrawBezierConnectionHandles(g);
        this.DrawConnectionText(ctx);
    }

    private DrawConnectionCap(ctx: CanvasRenderingContext2D, figure: PathFigure | null): void {
        if (figure) {
            var path = new Path2D();
            figure.FillToPath(path);
            ctx.fillStyle = "black";
            ctx.fill(path);
        }
    }

    private DrawConnectionLine(ctx: CanvasRenderingContext2D, transforms: boolean): void {
        //todo: fix Dash style        
        let path = this.EnsureGeometryPath();
        if (path) {
            ctx.strokeStyle = "green";
            ctx.lineWidth = 1.5;
            ctx.stroke(path);
        }
    }

    private DrawConnectionText(ctx: CanvasRenderingContext2D) {
        if (this.title) {
            let ms = ctx.measureText(this.title);
            let rect = new Rectangle(this.edittingPoint.X + 0.5, this.edittingPoint.Y, ms.width, 12);
            ctx.fillStyle = "white";
            ctx.fillRect(rect.X, rect.Y, rect.Width, rect.Height);
            ctx.fillStyle = "black";
            ctx.textBaseline = "top";
            ctx.fillText(this.title, this.edittingPoint.X, this.edittingPoint.Y);
        }
    }

    public OnTargetChanged(oldTarget: IShape | null): void {
        if (!this.isSuppressingConnectionUpdate)
            this.ResolveTargetConnector();
    }

    /// <summary>
    /// Will attempt to resolves the target connector on the basis of the set <see cref="TargetConnectorPosition"/>.
    /// </summary>
    private ResolveTargetConnector(): void {
        if (this.Target != null) {
            if (this.Target.Connectors.length == 0) {
                console.log("Shape Has No Connectors");
                return;
            }
            if (this.TargetConnectorPosition != ConnectorPosition.Auto) {
                var i: number = 0;
                //this.TargetConnectorResult = this.Target.Connectors[this.TargetConnectorPosition];
                for (i = 0; i < this.Target.Connectors.length; i++) {
                    if (this.Target.Connectors[i].Name == this.TargetConnectorPosition) {
                        this.TargetConnectorResult = this.Target.Connectors[i];
                        break;
                    }
                }
                if (this.TargetConnectorResult == null)
                    console.log("Connector Doesnt Exist: " + this.TargetConnectorResult);
            }
        } else
            this.TargetConnectorResult = null;
    }

    public OnTargetConnectorPositionChanged(newPosition: string, oldPosition: string): void {
        this.ResolveTargetConnector();
        this.Update(false);
    }

    /// <summary>
    /// Will attempt to resolves the source connector on the basis of the set <see cref="SourceConnectorPosition"/>.
    /// </summary>
    private ResolveSourceConnector(): void {
        if (this.Source != null) {
            if (this.Source.Connectors.length == 0) {
                console.log("Shape Has No Connectors");
                return;
            }
            if (this.SourceConnectorPosition != ConnectorPosition.Auto) {
                var i;
                for (i = 0; i < this.Source.Connectors.length; i++) {
                    if (this.Source.Connectors[i].Name == this.SourceConnectorPosition) {
                        this.SourceConnectorResult = this.Source.Connectors[i];
                        break;
                    }
                }
                if (this.SourceConnectorResult == null)
                    console.log("Connector Doesnt Exist:" + this.SourceConnectorPosition);
            }
        }
        else
            this.SourceConnectorResult = null;
    }

    protected OnSourceConnectorPositionChanged(newPosition: string, oldPosition: string): void {
        this.ResolveSourceConnector();
        this.Update(false);
    }

    /// <summary>
    /// Gets the connection end points.
    /// </summary>
    /// <param name="connection">The connection.</param>
    /// <param name="useConnectionCoordinates">If set to <c>true</c> the points will be in global coordinates. 
    /// If set to false, then the coordinates will be relative to the connection.</param>
    /// <returns></returns>
    private GetConnectionEndPoints(useConnectionCoordinates: boolean): [Point, Point] {
        var startPoint = new Point(this.StartPoint.X, this.StartPoint.Y);
        var endPoint = new Point(this.EndPoint.X, this.EndPoint.Y);

        if (useConnectionCoordinates) {
            // startPoint = startPoint.Substract(this.Bounds.TopLeft());
            // endPoint = endPoint.Substract(this.Bounds.TopLeft());
            startPoint = new Point(startPoint.X - this.Bounds.X, startPoint.Y - this.Bounds.Y);
            endPoint = new Point(endPoint.X - this.Bounds.X, endPoint.Y - this.Bounds.Y);
        }
        return [startPoint, endPoint];
    }

    private Distance(startPoint: Point, endPoint: Point): number {
        return Math.sqrt(Math.pow(startPoint.X - endPoint.X, 2) + Math.pow(startPoint.Y - endPoint.Y, 2));
    }

    /// <summary>
    /// Calculates the middle point of line.
    /// </summary>
    /// <param name="connectionEnds">The connection end points.</param>
    /// <param name="connectionPoints">The points of interest (points where the line is curved/segmented).</param>
    /// <returns></returns>
    private CalculateMiddlePointOfLine(connectionEnds: [Point, Point], connectionPoints: Array<Point>): Point {
        var points = new Array<Point>();

        points.push(connectionEnds[0]);
        for (var i = 0; i < connectionPoints.length; i++) {
            points[1 + i] = connectionPoints[i];
        }
        points.push(connectionEnds[1]);

        var connectionLength: number = 0;
        for (var i = 0; i < points.length; i++) {
            var currentPoint = points[i];
            var nextPoint = points[i + (i + 1 < points.length ? 1 : 0)];
            connectionLength += this.Distance(currentPoint, nextPoint);
        }

        var currentLength: number = 0;

        for (var i = 0; i < points.length; i++) {
            var currentPoint = points[i];
            var nextPoint = points[i + (i + 1 < points.length ? 1 : 0)];
            var distance = this.Distance(currentPoint, nextPoint);
            currentLength += distance;
            if (currentLength >= connectionLength / 2) {
                var l = currentLength - (connectionLength / 2);
                var a = l * Math.abs(currentPoint.X - nextPoint.X) / distance;
                var b = l * Math.abs(currentPoint.Y - nextPoint.Y) / distance;

                // adjustment
                a = nextPoint.X - currentPoint.X > 0 ? -a : a;
                b = nextPoint.Y - currentPoint.Y > 0 ? -b : b;

                var newEdittinPoint = new Point((nextPoint.X + a), (nextPoint.Y + b));
                if (!(Number.NaN == newEdittinPoint.X) && !(Number.NaN == newEdittinPoint.Y))
                    return newEdittinPoint;
            }
        }
        return new Point(0, 0);
    }

    /**
     * 用于填充服务端返回的数据
     */
    public Fetch(data: any): void {
        this._id = data.ID;

        this.startPoint.X = data.StartPoint.X;
        this.startPoint.Y = data.StartPoint.Y;
        this.endPoint.X = data.EndPoint.X;
        this.endPoint.Y = data.EndPoint.Y;
        this.edittingPoint.X = data.EdittingPoint.X;
        this.edittingPoint.Y = data.EdittingPoint.Y;

        if (data.Title) {
            this.title = data.Title;
        }

        if (data.SourceCap) {
            this.sourceCap = new PathFigure();
            this.sourceCap.Fetch(data.SourceCap);
        }
        if (data.TargetCap) {
            this.targetCap = new PathFigure();
            this.targetCap.Fetch(data.TargetCap);
        }

        var geo = new PathGeometry();
        for (var i = 0; i < data.Geometry.Figures.length; i++) {
            var element = data.Geometry.Figures[i];
            var figure = new PathFigure();
            figure.Fetch(element);
            geo.Figures.push(figure);
        }
        this.Geometry = geo;

        //需要清除ConnectionSelectionAdorner的Points缓存
        if (this._selectionAdorner) {
            let adorner = this._selectionAdorner as ConnectionSelectionAdorner;
            adorner.ResetCache();
        }
    }

}

