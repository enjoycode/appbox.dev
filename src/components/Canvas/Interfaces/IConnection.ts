import Point from '../Drawing/Point'
import IDiagramItem from './IDiagramItem'
import IShape from './IShape'
import ConnectionType from '../Core/Declaratives/ConnectionType'
import IConnector from './IConnector'

interface IConnection extends IDiagramItem {
    //Gets or sets the position of where this connection starts.
    StartPoint: Point;
    //Gets or sets the position of where this connection ends.
    EndPoint: Point;
    //Gets or sets the source shape of this connection.
    Source: IShape | null;
    SourceConnectorPosition: string;

    //Gets the actual source connector of this connection if the connector is dynamically assigned (<see cref="ConnectorPosition.Auto"/
    SourceConnectorResult: IConnector | null;

    //Gets or sets the target shape of this connection.
    Target: IShape | null;

    //Gets the actual target connector of this connection if the connector is dynamically assigned (<see cref="ConnectorPosition.Auto"/>).
    TargetConnectorResult: IConnector | null;

    //Gets the connection points.
     ConnectionPoints: Array<Point>;

    //Gets or sets the type of the connection.
    ConnectionType: ConnectionType;

    //Updates this connection.
    Update(isManipulating: false): void;
}

export default IConnection