import Rectangle from '../Drawing/Rectangle'
import Point from '../Drawing/Point'
import IShape from '../Interfaces/IShape'
import ConnectorPosition from '../Core/Declaratives/ConnectorPosition'
import IConnector from '../Interfaces/IConnector'

export default class ShapeUtilities {
    
    /**
     * Gets the connectors' enclosing bounds.
     */
    public static GetConnectorsBounds(shape: IShape | null): Rectangle {
        if (!shape || shape.Connectors.length == 0)
            return new Rectangle(0, 0, 0, 0);

        var minX: number = Number.MAX_VALUE;
        var minY: number = Number.MAX_VALUE;
        var maxX: number = Number.MIN_VALUE;
        var maxY: number = Number.MIN_VALUE;
        for (let connector of shape.Connectors) {
            var position = connector.AbsolutePosition;
            minX = Math.min(minX, position.X);
            minY = Math.min(minY, position.Y);

            maxX = Math.max(maxX, position.X);
            maxY = Math.max(maxY, position.Y);
        }
        return new Rectangle(minX, minY, maxX - minX, maxY - minY);
    }
    
    /// <summary>
    /// Gets the closest connector position.
    /// </summary>
    /// <param name="shape">The shape.</param>
    /// <param name="point">The point.</param>
    /// <returns></returns>
    public static GetNearestConnector2(shape: IShape, point: Point): IConnector | null {
        if (shape != null) {
            return this.GetNearestConnector(shape, point, Number.MAX_VALUE);
        }
        return null;
    }


    /// <summary>
    /// Gets the nearest connector.
    /// </summary>
    /// <param name="shapes">The shapes.</param>
    /// <param name="point">The point.</param>
    /// <param name="delta">The delta.</param>
    /// <returns></returns>
    public static GetNearestConnector(shapes: IShape, point: Point, delta: number): IConnector | null {
        // var resolvedConnector: IConnector | null = null;
        // var minDistance = Number.MAX_VALUE;

        // for(let connector of shapes.SelectMany(shape => shape.Connectors.Where(c => c.Name != ConnectorPosition.Auto))){
        //     var currentDistance = connector.AbsolutePosition.Distance(point);
        //     if (currentDistance < minDistance && currentDistance < delta){
        //         minDistance = currentDistance;
        //         resolvedConnector = connector;
        //     }
        // }
        // return resolvedConnector;        
        console.log("GetNearestConnector todo ...")
        return null; //todo:!!!!!
    }

}