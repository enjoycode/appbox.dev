import Point from '../../Drawing/Point'
import Size from '../../Drawing/Size'
import IConnector from '../../Interfaces/IConnector'
import IShape from '../../Interfaces/IShape'

export default class Connector implements IConnector {
    private name: string = "";
    public get Name(): string {
        return this.name;
    }
    public set Name(value: string) {
        this.name = value;
    }

    /// <summary>
    /// Gets or sets the offset of the top-left corner of the shape.
    ///  A value of zero corresponds to the upper-left corner, 
    /// while a value of one corresponds to the right side of the shape.
    /// Values outside the <c>[0,1]</c> range will position the connector outside the shape.
    /// </summary>
    /// <value>
    /// The connector's offset.
    /// </value>
    private offset: Point;
    public get Offset(): Point {
        return this.offset;
    }
    public set Offset(value: Point) {
        this.offset = value;
    }

    private shape: IShape;
    public get Shape(): IShape {
        return this.shape;
    }
    public set Shape(value: IShape) {
        this.shape = value;
    }

    public get AbsolutePosition(): Point {
        if (!this.Shape)
            return new Point(0, 0);
        var bounds = this.Shape.Bounds;
        var shapePosition = new Point(bounds.X, bounds.Y);
        var size = new Size();
        size.Width = bounds.Width;
        size.Height = bounds.Height;
        var relativePosition = this.CalculateRelativePosition(size);
        var position = new Point(shapePosition.X + relativePosition.X, shapePosition.Y + relativePosition.Y);
        return position;
    }

    public CalculateRelativePosition(shapeSize: Size): Point {
        return new Point(shapeSize.Width * this.Offset.X, shapeSize.Height * this.Offset.Y);
    }
}

