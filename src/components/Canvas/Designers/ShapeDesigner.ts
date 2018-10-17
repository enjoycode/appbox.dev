import Rectangle from '../Drawing/Rectangle'
import Point from '../Drawing/Point'
import BoundsSpecified from '../Enums/BoundsSpecified'
import ItemDesigner from './ItemDesigner'
import Connector from '../Core/Declaratives/Connector'
import IShape from '../Interfaces/IShape'
import IConnector from '../Interfaces/IConnector'
import IConnection from '../Interfaces/IConnection'
import DesignAdorner from '../Adorners/DesignAdorner'
import LazySelectionAdorner from '../Adorners/LazySelectionAdorner'
import ConnectorPosition from '../Core/Declaratives/ConnectorPosition'

export default class ShapeDesigner extends ItemDesigner implements IShape {
    //todo: 考虑移除Position属性
    public get Position(): Point {
        return new Point(this._bounds.X, this._bounds.Y);
    }
    public set Position(value: Point) {
        this.SetBounds(value.X, value.Y, this._bounds.Width, this._bounds.Height, BoundsSpecified.All);
    }

    protected _bounds: Rectangle = new Rectangle(0, 0, 0, 0);
    public get Bounds(): Rectangle {
        return this._bounds;
    }
    public set Bounds(value: Rectangle) {
        this.SetBounds(value.X, value.Y, value.Width, value.Height, BoundsSpecified.All);
    }

    public get SelectionAdorner(): DesignAdorner | null {
        if (!this._selectionAdorner && this.Surface) {
            this._selectionAdorner = new LazySelectionAdorner(this.Surface.Adorners, this);
        }
        return this._selectionAdorner;
    }

    private _connectors: Array<IConnector>;
    public get Connectors(): Array<IConnector> {
        return this._connectors;
    }

    constructor() {
        super();

        this._connectors = new Array<IConnector>();
        this.EnsureDefaultConnectors(); //todo:暂只支持DefaultConnectors
    }

    private EnsureDefaultConnectors() {
        this.EnsureConnector(ConnectorPosition.Auto);
        this.EnsureConnector(ConnectorPosition.Left);
        this.EnsureConnector(ConnectorPosition.Top);
        this.EnsureConnector(ConnectorPosition.Right);
        this.EnsureConnector(ConnectorPosition.Bottom);
    }

    private EnsureConnector(name: string) {
        var index: number = -1;
        for (var i = 0; i < this._connectors.length; i++) {
            if (this._connectors[i].Name === name) {
                index = i;
                break;
            }
        }
        if (index === -1) {
            var connector = new Connector();
            connector.Name = name;
            connector.Offset = ConnectorPosition.GetKnownOffset(name);
            connector.Shape = this;
            this._connectors.push(connector);
        }
    }

    public CanConnect(isStartPoint: boolean, connection: IConnection): boolean {
        return true;
    }

    protected SetBounds(x: number, y: number, width: number, height: number, specified: BoundsSpecified): void {
        let oldBounds = new Rectangle(this._bounds.X, this._bounds.Y, this._bounds.Width, this._bounds.Height);
        this._bounds.X = x;
        this._bounds.Y = y;
        this._bounds.Width = width;
        this._bounds.Height = height;
        this.InvalidateOnBoundsChanged(oldBounds); // this.Invalidate();
    }

    /**
     * 注意：交由LazySelectionAdorner处理
     */
    public Move(deltaX: number, deltaY: number): void {
        let adorner = this.SelectionAdorner as LazySelectionAdorner;
        adorner.Move(deltaX, deltaY);
    }

    public OnEndMove(): void {
        //先获取移动后的新位置
        let adorner = this.SelectionAdorner as LazySelectionAdorner;
        let newX = this._bounds.X += adorner.Bounds.X;
        let newY = this._bounds.Y += adorner.Bounds.Y;
        //再通知Adorner停止移动模式
        adorner.OnEndMove();

        //最后通知服务端更新，如果更新失败，则通知Adorner重新设置位置
        if (this.Surface && this.Surface.DesignService) {
            this.Surface.DesignService.ChangeProperty(this, "Move", newX, newY);
        }
        this._bounds.X = newX;
        this._bounds.Y = newY;
    }

    public Paint(ctx: CanvasRenderingContext2D): void { }

}
