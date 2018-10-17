import Point from "../Drawing/Point"
import Rectangle from "../Drawing/Rectangle"
/**
 * IDiagramItem
 */
interface IDiagramItem {
    Position: Point;
    Bounds: Rectangle;
}

export default IDiagramItem
