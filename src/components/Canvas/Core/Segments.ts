import Point from '../Drawing/Point'
import Size from '../Drawing/Size'
import { IPathSegment } from './Legacy'
import SweepDirection from './Legacy'

export class LineSegment implements IPathSegment {
    public Point: Point;

    public FillToPath(path: Path2D): void {
        path.lineTo(this.Point.X, this.Point.Y);
    }
}

export class BezierSegment implements IPathSegment {
    public Point1: Point;
    public Point2: Point;
    public Point3: Point;

    public FillToPath(path: Path2D): void {
        throw new Error("Not implemented.");
    }

    public Clone(): IPathSegment {
        var bezierSegment: BezierSegment = new BezierSegment();
        bezierSegment.Point1 = new Point(this.Point1.X, this.Point1.Y);
        bezierSegment.Point2 = new Point(this.Point2.X, this.Point2.Y);
        bezierSegment.Point3 = new Point(this.Point3.X, this.Point3.Y);
        return bezierSegment;
    }
}

export class PolyLineSegment implements IPathSegment {
    public readonly Points: Array<Point>;

    constructor() {
        this.Points = new Array<Point>();
    }

    public FillToPath(path: Path2D): void {
        for (var i = 0; i < this.Points.length; i++) {
            var element = this.Points[i];
            path.lineTo(element.X, element.Y);
        }
    }
}

export class ArcSegment implements IPathSegment {
    public point: Point;
    public size: Size;
    public RotationAngle: number;
    public IsLargeArc: boolean;
    public SweepDirection: SweepDirection;

    public FillToPath(path: Path2D): void {
        throw new Error("Not implemented.");
    }
}

export default class PathFigure {
    public readonly Segments: Array<IPathSegment>;
    public IsClosed: boolean = false;
    public IsFilled: boolean = true;
    public StartPoint: Point = new Point(0, 0);

    constructor() {
        this.Segments = new Array<IPathSegment>();
    }

    public FillToPath(path: Path2D): void {
        path.moveTo(this.StartPoint.X, this.StartPoint.Y);
        for (var i = 0; i < this.Segments.length; i++) {
            var element = this.Segments[i];
            element.FillToPath(path);
        }
    }

    public Fetch(data: any): void {
        this.StartPoint = data.StartPoint;
        for (var j = 0; j < data.Segments.length; j++) {
            var seg = data.Segments[j];
            if (seg.Type === 1) { //LineSegment
                var lineSegment = new LineSegment();
                lineSegment.Point = seg.Point;
                this.Segments.push(lineSegment);
            } else {
                throw new Error("Not implemented.");
            }
        }
    }
}
