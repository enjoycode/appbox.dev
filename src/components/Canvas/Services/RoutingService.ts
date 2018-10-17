import IRouter from '../Interfaces/IRouter'
import IConnection from '../Interfaces/IConnection'
import ConnectionRoute from '../Core/Declaratives/ConnectionRoute'
import ConnectionType from '../Core/Declaratives/ConnectionType'
import Point from '../Drawing/Point'

export default class RoutingService
{
    /// <summary>
    /// Gets or sets the connection router.
    /// </summary>
    public  Router: IRouter;
    public constructor(){

    }
    // public RoutingService(diagram: DesignSurface){
    //     //this.Router = new GridRouter(diagram);
    // }

    /// <summary>
    /// Creates the connection route.
    /// </summary>
    /// <param name="connection">The connection which should be routed.</param>
    /// <remarks>The routing works only for the <see cref="ConnectionType.Spline"/> and <see cref="ConnectionType.Polyline"/> types.</remarks>
    /// <returns>A list of intermediate points defining the route and the start and end connectors.</returns>
    public FindExtendedRoute(connection: IConnection | null): ConnectionRoute
    {
        var result: ConnectionRoute = new ConnectionRoute();
        if (connection == null) return result;
        //if (connection.IsModified) return new ConnectionRoute(connection.ConnectionPoints.ToList());

        if (connection.ConnectionType != ConnectionType.Bezier)
        {
            //IExtendedRouter extendetRouter = this.Router as IExtendedRouter;
            var router: IRouter = this.Router;
            result.Points=new  Array<Point>();
            if (connection.Source == null || connection.Target == null)
            {
                connection.ConnectionPoints.forEach(element =>{
                    result.Points.push(new Point(element.X,element.Y));
                });
                //extendetRouter = this.FreeRouter as IExtendedRouter;
                //router = this.FreeRouter;
                return result;
            }
            //if (extendetRouter != null)
            //    result = extendetRouter.GetRoutePoints(connection);
            //else if (router != null)
            var points: Array<Point> = router.GetRoutePoints(connection, false);
            points.forEach(element =>{
                result.Points.push(new Point(element.X,element.Y));
            });
        }
        return result;
    }
}