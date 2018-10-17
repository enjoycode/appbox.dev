import Point from '../../Drawing/Point'
import IConnector from '../../Interfaces/IConnector'

export default class ConnectorPosition {
    /// <summary>
    /// The connection's connector is calculated.
    /// </summary>
    public static readonly Auto: string = "Auto";

    /// <summary>
    /// The connection is bound to the left of the shape.
    /// </summary>
    public static readonly Left: string = "Left";

    /// <summary>
    /// The connection is bound to the top of the shape.
    /// </summary>
    public static readonly Top: string = "Top";

    /// <summary>
    /// The connection is bound to the right of the shape.
    /// </summary>
    public static readonly Right: string = "Right";

    /// <summary>
    /// The connection glides along the edge of the shape.
    /// </summary>
    /// <remarks>This connector does not have a relative position on the shape or absolute position with respect to the surface.</remarks>
    public static readonly Gliding: string = "Gliding";

    /// <summary>
    /// The connection is bound to the bottom of the shape.
    /// </summary>
    public static readonly Bottom: string = "Bottom";

    public static IsCustom(connector: IConnector): boolean {
        //todo
        return false;
    }

    private static readonly knownConnectors: any = {
        Auto: [0.5, 0.5],
        Left: [0, 0.5],
        Right: [1, 0.5],
        Top: [0.5, 0],
        Bottom: [0.5, 1],
        Gliding: [0.5, 0.5]
    };

    /**
     * Gets the known offset.
     * Note that the gliding connector return double.NaN since it's not located anywhere on the shape but rather spread among the edge of it.
     * The offset with respect to the shape. If the connector is not a known connector an exception will be thrown.
     */
    public static GetKnownOffset(name: string): Point {
        let pt = ConnectorPosition.knownConnectors[name];
        if (pt) {
            return new Point(pt[0], pt[1]);
        } else {
            throw new Error("Can not find known offset for: " + name);
        }
    }
}