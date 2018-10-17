import Point from '../Drawing/Point'
import Rectangle from '../Drawing/Rectangle'

export default class Utils{
    //An infinitesimal value.
    private static Epsilon: number = 1E-06;

    // Determines whether the specified values are equal with Epsilon approximation.
    public static IsEqual(value1: number,value2: number) {
        var result = Math.abs(value1-value2) < this.Epsilon;
        return result;
    }

    //Gets a point from the minimum X and Y values from the specified points.
    public static GetTopLeftPoint(points: Array<Point>): Point
    {
        var x:number,y:number;
        
        x=points[0].X;y=points[0].Y;
        // for(var i=1;i<points.length;i++){
        //     if(x>points[i].X)
        //         x = points[i].X;
        //     if(y>points[i].Y)
        //         y = points[i].Y;
        // }
        points.forEach(element => {
            if(x > element.X)
                x = element.X;
            if(y > element.Y)
                y = element.Y;
        });
        return new Point(x,y);
    }

    //Returns the middle point between the given points.
    public static MiddlePoint(point1: Point,point2: Point):Point{
        return new Point((point1.X+point2.X)/2,(point1.Y + point2.Y)/2);
    }

    //Returns the distance of the point to the origin.
    public static Distance(x:number,y:number):number{
        return Math.sqrt((x*x)+(y*y));
    }

    //Swaps the values of the two numbers
    // public static Swap()

    // Swaps the values of the two points.

    //Converts the specified value from degrees to radians.
    public static ToRadians(degress: number): number {
        return degress / 180 * Math.PI;
    }
    //Converts the Cartesian coordinates to polar coordinates.

    //Polar to cartesian coordinates conversion.
    public static PolarToCartesian(coordinateCenter: Point,angle: number,rho: number): Point{
        var radians = this.ToRadians(angle);
        return new Point((coordinateCenter.X + (Math.cos(radians)*rho)),coordinateCenter.Y - (radians * rho));
    }

    //Normalizes the specified angle into the [0, 2Pi] interval.
    public static NormalizeAngle(angle: number):number {
        while(angle > Math.PI * 2)
            angle -= 2* Math.PI;
        while(angle < 0)
            angle += Math.PI * 2;
        return angle;
    }

    public static CreateByTwoPoint(point1: Point,point2: Point): Rectangle{
        var rect = new Rectangle(0,0,0,0);
        rect.X = Math.min(point1.X,point2.X);
        rect.Y = Math.min(point1.Y,point2.Y);
        rect.Width = Math.max(Math.max(point1.X,point2.X)-rect.X,0);
        rect.Height = Math.max(Math.max(point1.Y,point2.Y)-rect.Y,0);
        return rect;
    }

    //Calculates the intersection point between the specified
    public static IntersectionPointOnRectangle(rectangle: Rectangle,lineStart: Point,lineEnd: Point,intersectionPoint: Point) :void {
       var rc = this.CreateByTwoPoint(new Point(lineStart.X,lineStart.Y),new Point(lineEnd.X,lineEnd.Y));

       var x1 = lineStart.X;
       var y1 = lineStart.Y;
       var x2 = lineEnd.X;
       var y2 = lineEnd.Y;

       if(Math.abs(x1 - x2)<this.Epsilon){
           intersectionPoint.X = x1;
           //try with the top line
           intersectionPoint.Y = rectangle.Y;
           if(intersectionPoint.X >= rectangle.X && intersectionPoint.X <= rectangle.Right && intersectionPoint.Y >= rc.Y && intersectionPoint.Y <= rc.Bottom){
               return;
           }
           //try width the bottom line
           intersectionPoint.Y = rectangle.Y + rectangle.Height;
           if(intersectionPoint.X >= rectangle.X && intersectionPoint.X <= rectangle.Right && intersectionPoint.Y >= rc.Y && intersectionPoint.Y <= rc.Bottom)
            return;
       }else if(Math.abs(y1 -y2)<this.Epsilon){
            intersectionPoint.Y = y1;

            // Try with the left line segment  
            intersectionPoint.X = rectangle.X;
            if (intersectionPoint.Y >= rectangle.Y && intersectionPoint.Y <= rectangle.Bottom &&
                intersectionPoint.X >= rc.X && intersectionPoint.X <= rc.Right) return;

            // Try with the right line segment
            intersectionPoint.X = rectangle.Right;
            if (intersectionPoint.Y >= rectangle.Y && intersectionPoint.Y <= rectangle.Bottom &&
                intersectionPoint.X >= rc.X && intersectionPoint.X <= rc.Right) return;                     
       }else{
            var a = (y1 - y2) / (x1 - x2);
            var b = ((x1 * y2) - (x2 * y1)) / (x1 - x2);

            ////TOP
            intersectionPoint.Y = rectangle.X;
            intersectionPoint.X = (intersectionPoint.Y - b) / a;
            if (intersectionPoint.X >= rectangle.X && intersectionPoint.X <= rectangle.Right &&
                intersectionPoint.Y <= rectangle.Bottom &&
                intersectionPoint.Y >= rc.Y && intersectionPoint.Y <= rc.Bottom) return;

            //// BOTTOM
            intersectionPoint.Y = rectangle.Bottom;
            intersectionPoint.X = (intersectionPoint.Y - b) / a;
            if (intersectionPoint.X >= rectangle.X && intersectionPoint.X <= rectangle.Right &&
               intersectionPoint.Y >= rectangle.Y &&
                intersectionPoint.Y >= rc.Y && intersectionPoint.Y <= rc.Bottom) return;
            ////LEFT
            intersectionPoint.X = rectangle.X;
            intersectionPoint.Y = (a * intersectionPoint.X) + b;
            if (intersectionPoint.Y >= rectangle.Y && intersectionPoint.Y <= rectangle.Bottom &&
                intersectionPoint.X <= rectangle.Right &&
                intersectionPoint.X >= rc.X && intersectionPoint.X <= rc.Right) return;

            ////RIGHT
            intersectionPoint.X = rectangle.Right;
            intersectionPoint.Y = (a * intersectionPoint.X) + b;
            if (intersectionPoint.Y >= rectangle.Y && intersectionPoint.Y <= rectangle.Bottom &&
                intersectionPoint.X >= rectangle.X &&
                intersectionPoint.X >= rc.X && intersectionPoint.X <= rc.Right) return;
            }       
    }

    //Returns whether the line (line segments) intersect and returns in the crossingPoint the actual crossing

}
