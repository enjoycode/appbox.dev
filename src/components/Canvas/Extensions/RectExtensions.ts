import Point from '../Drawing/Point'
import Rectangle from '../Drawing/Rectangle'

export default class RectExtensions {

    public static CreateByTwoPoint(point1: Point, point2: Point): Rectangle {
        var rect = new Rectangle(0, 0, 0, 0);
        rect.X = Math.min(point1.X, point2.X);
        rect.Y = Math.min(point1.Y, point2.Y);
        rect.Width = Math.max(Math.max(point1.X, point2.X) - rect.X, 0);
        rect.Height = Math.max(Math.max(point1.Y, point2.Y) - rect.Y, 0);
        return rect;
    }
    
}
