import Rectangle from '../Drawing/Rectangle'
import Point from '../Drawing/Point'
import ConnectionDesigner from '../Designers/ConnectionDesigner'
import IConnection from '../Interfaces/IConnection'
import DesignSurface from '../DesignSurface'
import IShape from '../Interfaces/IShape'
import ShapeUtilities from './ShapeUtilities'

const ConnectorActivationRadius = 5;
const ConnectorHitTestRadius = 5;

export default class ConnectionUtilities {

    //todo:改为传入缓存的surface.Shapes，包括转换至画布坐标系的Bounds
    public static ActivateNearestConnector(surface: DesignSurface, connection: IConnection, isStartPoint: boolean, point: Point): void {
        let shapes = surface.DesignService.GetShapes();
        if (shapes.length === 0)
            return;

        var nearestShapes = new Array<IShape>();
        for (var i = 0; i < shapes.length; i++) {
            var bounds = ShapeUtilities.GetConnectorsBounds(shapes[i]); //todo:转换成画布坐标系
            bounds.Inflate(ConnectorActivationRadius, ConnectorActivationRadius);
            if (bounds.Contains(point.X, point.Y) && shapes[i].CanConnect(isStartPoint, connection)) {
                nearestShapes.push(shapes[i]);
            }
        }

        if (nearestShapes.length > 0) {
            //todo:验证 IsTargetShapeValid(activeConnector, topShape, connectionType)

            //先查找最接近的
            for (var i = nearestShapes.length - 1; i >= 0; i--) {
                var shape = nearestShapes[i];
                for (var j = 0; j < shape.Connectors.length; j++) {
                    var distance = Point.Distance(shape.Connectors[j].AbsolutePosition, point);
                    if (distance < ConnectorActivationRadius) {
                        //shape.IsConnectorsAdornerVisible = true;
                        if (distance < ConnectorHitTestRadius) {
                            surface.Adorners.ActiveConnector = shape.Connectors[j]; //shape.Connectors[j].IsActive = true;
                            return;
                        }
                    }
                }
            }

            //再查找默认的
            // var topShape = nearestShapes[nearestShapes.length - 1];
            // if (topShape.Connectors.Contains(ConnectorPosition.Gliding))
            //     surface.Adorners.ActiveConnector = topShape.Connectors[ConnectorPosition.Gliding]; 
            // else if (topShape.Connectors.Contains(ConnectorPosition.Auto))
            //     surface.Adorners.ActiveConnector = topShape.Connectors[ConnectorPosition.Auto];
        }
        //开始更新NearestShapes
        surface.Adorners.UpdateNearestShapes(nearestShapes);
    }
}
