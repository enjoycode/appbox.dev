import IConnection from './IConnection'
import Point from '../Drawing/Point'

interface IRouter {
     GetRoutePoints(connection: IConnection,showLastLine: boolean): Array<Point>
}
export default  IRouter
       