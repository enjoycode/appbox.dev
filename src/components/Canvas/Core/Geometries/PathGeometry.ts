import { IGeometry } from '../Legacy'
import PathFigure from '../Segments'

export class PathGeometry implements IGeometry {
    public readonly Figures: Array<PathFigure>;
    public FillRule: FillRule;

    constructor() {
        this.Figures = new Array<PathFigure>();
    }

    public CreatePath(): Path2D {
        //todo: 暂创建一条路径，待验证
        var path = new Path2D();
        let figure = this.Figures[0];
        figure.FillToPath(path);
        return path;
    }
}

// Summary:
//     Specifies how the intersecting areas of System.Windows.Media.PathFigure objects
//     contained in a System.Windows.Media.Geometry are combined to form the area
//     of the System.Windows.Media.Geometry.
enum FillRule {
    // Summary:
    //     Rule that determines whether a point is in the fill region by drawing a ray
    //     from that point to infinity in any direction and counting the number of path
    //     segments within the given shape that the ray crosses. If this number is odd,
    //     the point is inside; if even, the point is outside.
    EvenOdd = 0,
    //
    // Summary:
    //     Rule that determines whether a point is in the fill region of the path by
    //     drawing a ray from that point to infinity in any direction and then examining
    //     the places where a segment of the shape crosses the ray. Starting with a
    //     count of zero, add one each time a segment crosses the ray from left to right
    //     and subtract one each time a path segment crosses the ray from right to left.
    //     After counting the crossings, if the result is zero then the point is outside
    //     the path. Otherwise, it is inside.
    Nonzero = 1,
}

export default FillRule
