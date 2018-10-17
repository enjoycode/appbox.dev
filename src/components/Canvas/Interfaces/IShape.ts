import IConnection from './IConnection'
import IDiagramItem from './IDiagramItem'
import IConnector from './IConnector'

interface IShape extends IDiagramItem {

    // Gets the incoming links (connections).
    //IEnumerable<IConnection> IncomingLinks { get; }

    // Gets the outgoing links (connections).
    //IEnumerable<IConnection> OutgoingLinks { get; }

    //Gets the connectors of this shape.
    Connectors: Array<IConnector>;

    CanConnect(isStartPoint: boolean, connection: IConnection): boolean;

    //Gets or sets a value indicating whether the connector adorner is visible.    
    //bool IsConnectorsAdornerVisible { get; set; }    
}

export default IShape