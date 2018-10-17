import Point from '../Drawing/Point'
import Size from '../Drawing/Size'
import IShape from './IShape'

interface IConnector {
    //Gets the name of the connector
    Name: string;

    //Gets the shape to which this connector belongs.
    Shape: IShape;

    //Gets or sets the offset of the top-left corner of the shape. Its value range from 0 to 1.
    Offset: Point;

    //Gets the absolute or actual position of the connector with respect to the diagramming surface.
    AbsolutePosition: Point;

    //Calculates the relative position of the connector.
    CalculateRelativePosition(shapeSize: Size): Point;
}

export default IConnector;
