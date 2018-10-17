import ConnectionDesigner from '../Canvas/Designers/ConnectionDesigner'
import Rectangle from '../Canvas/Drawing/Rectangle'
import Point from '../Canvas/Drawing/Point'
import BoundsSpecified from '../Canvas/Enums/BoundsSpecified'
import IShape from '../Canvas/Interfaces/IShape'
import { PathGeometry } from '../Canvas/Core/Geometries/PathGeometry'
import FillRule from '../Canvas/Core/Geometries/PathGeometry'
import PathFigure from '../Canvas/Core/Segments'
import { LineSegment } from '../Canvas/Core/Segments'

export default class TestConDesigner {

    public Conn1: ConnectionDesigner;
    public Conn2: ConnectionDesigner;
    private CreatePath(path: PathGeometry): void {
        path.FillRule = FillRule.EvenOdd;

        var lineSeg = new LineSegment();
        lineSeg.Point = new Point(40, 40);

        var pathFig = new PathFigure();
        pathFig.IsClosed = false;
        pathFig.IsFilled = false;
        pathFig.StartPoint = new Point(10, 10);
        pathFig.Segments.push(lineSeg);
        path.Figures.push(pathFig);

        // lineSeg = new LineSegment();
        // lineSeg.point = new Point(50,50);

        // var pathFig = new PathFigure();
        // pathFig.isClosed = false;
        // pathFig.isFilled = false;
        // pathFig.startPoint = new Point(20,20);
        // pathFig.pathSegments.push(lineSeg);
        // path.Figures.push(pathFig);               
    }

    public CreateConnectionDesigner(): void {
        // this.SetBounds(10,10,120,30);
        // this.Source(sourceShape);
        // this.destShape(destShape);
        this.Conn1 = new ConnectionDesigner();

        // var pathGeo = new PathGeometry();
        // this.CreatePath(pathGeo);
        // this.Conn1.Bounds = new Rectangle(0, 0, 50, 20);
        // this.Conn1.StartPoint = new Point(10,10);
        // this.Conn1.EndPoint = new Point(100,100);
        // this.Geometry = pathGeo;
        this.Conn1.Title = 'Conn1';
        // this.Conn1.EdittingPoint = new Point(2,2);

        this.Conn2 = new ConnectionDesigner();
        // this.Conn2.Bounds = new Rectangle(0, 0, 50, 20);
        this.Conn2.Title = 'Conn2';
    }
}
