import DesignSurface from '../DesignSurface';
import ItemDesigner from '../Designers/ItemDesigner';
import ConnectionDesigner from '../Designers/ConnectionDesigner';
import Point from '../Drawing/Point';

export interface IDesignToolbox {
    SelectedItem: IDesignToolboxItem | null;
}

export interface IDesignToolboxItem {
    /**
     * 是否连接线
     */
    IsConnection: boolean;
    /**
     * 创建对应的设计元素的实例
     */
    Create(parent: DesignSurface | ItemDesigner): ItemDesigner;
}

export default class ToolboxService {
    private readonly _surface: DesignSurface;
    private _currentContainer: ItemDesigner | null;
    private _toolbox: IDesignToolbox;
    public get Toolbox(): IDesignToolbox { return this._toolbox; }
    public set Toolbox(value) { this._toolbox = value; }

    public get SelectedItem(): IDesignToolboxItem | null {
        if (this.Toolbox) { return this.Toolbox.SelectedItem; }
        return null;
    }

    constructor(surface: DesignSurface) {
        this._surface = surface;
    }

    public BeginCreation(x: number, y: number) {
        //先获取mouse下的Container
        this._currentContainer = this._surface.GetContainerUnderMouse(x, y);
        //TODO:可在这里处理canvas只允许一个根级Container的情况，如果Container==null则退出新建模式
        //清空已选择项
        this._surface.SelectionService.ClearSelection();
        //通知Adorners开始画新建框
        this._surface.Adorners.BeginCreation(x, y, this.SelectedItem.IsConnection);

        this._surface.Adorners.Canvas.style.cursor = "crosshair";
    }

    public OnMouseMove(x: number, y: number): void {
        this._surface.Adorners.UpdateCreationEndPoint(x, y);
    }

    public EndCreation(x: number, y: number): void {
        //通知Adorners停止画新建框
        this._surface.Adorners.EndCreation();
        //开始创建元素，并加入画布
        if (!this._currentContainer) { //没有选择任何上级容器，直接添加至画布
            let newItem = this.SelectedItem.Create(this._surface);
            if (newItem instanceof ConnectionDesigner) {
                newItem.StartPoint = this._surface.Adorners.CreationStartPoint;
                newItem.EndPoint = this._surface.Adorners.CreationEndPoint;
            } else {
                newItem.Bounds = this._surface.Adorners.CreationRectangle;
            }
            this._surface.AddItem(newItem);
            //选择新建的
            this._surface.SelectionService.SelectItem(newItem);
        } else { //存在上级容器，需要转换坐标
            let newItem = this.SelectedItem.Create(this._currentContainer);
            let ptCanvas = this._currentContainer.PointToSurface(new Point(0, 0));
            if (newItem instanceof ConnectionDesigner) {
                let startPt = this._surface.Adorners.CreationStartPoint;
                let endPt = this._surface.Adorners.CreationEndPoint;
                newItem.StartPoint = new Point(startPt.X - ptCanvas.X, startPt.Y - ptCanvas.Y);
                newItem.EndPoint = new Point(endPt.X - ptCanvas.X, endPt.Y - ptCanvas.Y);
            } else {
                let newRect = this._surface.Adorners.CreationRectangle;
                newRect.X -= ptCanvas.X;
                newRect.Y -= ptCanvas.Y;
                newItem.Bounds = newRect;
            }
            this._currentContainer.AddItem(newItem);
            //选择新建的
            this._surface.SelectionService.SelectItem(newItem);
        }

        this._surface.Adorners.Canvas.style.cursor = "";
        if (this.Toolbox) {
            this.Toolbox.SelectedItem = null;
        }
    }

}