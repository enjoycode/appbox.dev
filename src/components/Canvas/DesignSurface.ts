import ItemDesigner from './Designers/ItemDesigner'
import Point from './Drawing/Point'
import Rectangle from './Drawing/Rectangle'
import MouseButtons from './Enums/MouseButtons'
import MouseEventArgs from './EventArgs/MouseEventArgs'
import SelectionService from './Services/SelectionService'
import DesignAdorners from './Adorners/DesignAdorners'
import IDesignService from './Services/IDesignService'
import BridgeType from './Core/Declaratives/BridgeType'
import RoutingService from './Services/RoutingService'
import { IPropertyPanel } from './Interfaces/IPropertyPanel'

export default class DesignSurface {

    private readonly _canvas: HTMLCanvasElement;
    private readonly _ratio: number;
    private readonly _propertyPanel: IPropertyPanel;
    private _hoverItem: ItemDesigner | null;
    private _items: Array<ItemDesigner>;

    public readonly Adorners: DesignAdorners;
    public readonly SelectionService: SelectionService;
    public DesignService: IDesignService;

    public get PropertyPanel(): IPropertyPanel {
        return this._propertyPanel;
    }

    /**
     * 获取当前画布的下级元素数组
     */
    public get Items(): Array<ItemDesigner> {
        return this._items;
    }

    public get PixelRatio(): number {
        return this._ratio;
    }

    /**
     * 构造
     */
    public constructor(surface: HTMLCanvasElement, adorner: HTMLCanvasElement, ratio: number, propertyPanel: IPropertyPanel) {
        this._ratio = ratio;
        this._canvas = surface;
        this._propertyPanel = propertyPanel;

        this.Adorners = new DesignAdorners(this, adorner);
        this.SelectionService = new SelectionService(this);

        this.ScaleCanvas(surface, surface.width, surface.height, ratio);
        this.ScaleCanvas(adorner, adorner.width, adorner.height, ratio);
        // this.routingService = new RoutingService();
    }

    /**
     * 用于HiDPI
     */
    private ScaleCanvas(canvas: HTMLCanvasElement, width: number, height: number, ratio: number) {
        if (ratio !== 1) {
            canvas.width = width * ratio;
            canvas.height = height * ratio;

            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';

            let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
            ctx.scale(ratio, ratio);
            ctx.save();
        }
    }

    public OnResize(width: number, height: number) {
        if (this._ratio !== 1) {
            this.ScaleCanvas(this._canvas, width, height, this._ratio);
            this.ScaleCanvas(this.Adorners.Canvas, width, height, this._ratio);
        }
        this.Invalidate();
    }

    //===============添加／删除元素方法===================
    /**
     * 添加设计元素
     */
    public AddItem(item: ItemDesigner): void {
        if (!this._items) {
            this._items = new Array<ItemDesigner>();
        }

        item.Surface = this;
        this._items.push(item);
        item.OnAddToSurface();
    }

    public RemoveItem(item: ItemDesigner): void {
        item.OnRemoveFromSurface(); //注意：必须先于下面代码
        item.Surface = null;
        let index = this._items.indexOf(item);
        this._items.splice(index, 1);
    }

    //===============刷新与绘制方法===================
    public Invalidate(clip?: Rectangle): void {
        //先确定更新区域
        var area: Rectangle;
        if (clip) {
            area = clip as Rectangle;
        } else {
            area = new Rectangle(0, 0, this._canvas.width / this._ratio, this._canvas.height / this._ratio);
        }

        var ctx = this._canvas.getContext("2d") as CanvasRenderingContext2D;
        //先清空区域
        ctx.clearRect(area.X, area.Y, area.Width, area.Height);

        //画各个子元素
        for (var i = 0; i < this._items.length; i++) {
            var element = this._items[i];
            if (element.Visible && area.IntersectsWith(element.Bounds)) { //Rectangle.Ceiling(element.Bounds)
                let offsetX = element.Bounds.X;
                let offsetY = element.Bounds.Y;

                ctx.translate(offsetX, offsetY);
                element.Paint(ctx);
                ctx.translate(-offsetX, -offsetY);
            }
        }

        //开始刷新AdornersLayer
        this.Adorners.Invalidate();
    }

    //==============Mouse EventHandlers=============
    public OnMouseDown(e: MouseEventArgs) {
        if (this._hoverItem && this._hoverItem.PreviewMouseDown(e)) {
            return;
        }

        //先判断有没有击中已选择项的锚点
        if (this.Adorners.HitTestItem != null) {
            //todo: HitTestItem.OnMouseDown
            return;
        }

        //判断有没有选择工具箱项，有则表示在新建模式
        // if (e.Button == MouseButtons.Left && this.toolboxService.SelectedItem != null) {
        //     this.toolboxService.BeginCreation(e.X, e.Y);
        //     return;
        // }

        //设置选择的Item
        this.SelectionService.SelectItem(this._hoverItem);

        //todo:如果选择项为Conatiner，则开始设置选择框的起始位置
    }

    public OnMouseMove(e: MouseEventArgs) {
        //先处理装饰层
        if (e.Button === MouseButtons.None
            && this.Adorners.HitTest(new Point(e.X, e.Y))) {
            return;
        }

        //处理Mouse拖动
        if (e.Button === MouseButtons.Left) {
            //todo:
            if (this.Adorners.HitTestItem) { //先处理装饰层的拖动
                this.Adorners.HitTestItem.OnMouseMove(e);
            }
            // else if (this.toolboxService.SelectedItem != null) //已从工具箱选择了新建的对象，并在拖动过程中
            // {
            //     this.toolboxService.OnMouseMove(e.X, e.Y);
            // }
            else { //处理已选择的对象的移动
                this.SelectionService.MoveSelection(e.DeltaX, e.DeltaY);
            }
        }

        //处理Mouse下的HoverItem
        this.FindHoverItemOnMouseMove(e);
    }

    public OnMouseUp(e: MouseEventArgs) {
        if (e.Button === MouseButtons.Left) {
            // if (this.toolboxService.SelectedItem != null) //新建模式下结束
            //     this.toolboxService.EndCreation(e.X, e.Y);

            //通知adorners
            this.Adorners.OnMouseUp(e);
            //通知选择服务结束移动
            this.SelectionService.OnMouseUp(e);

            //todo:清空选择框
        }
    }

    //==============Hover相关方法====================
    /**
     * MouseMove时查找其下的设计对象
     */
    private FindHoverItemOnMouseMove(e: MouseEventArgs): void {
        var ctx = this._canvas.getContext("2d") as CanvasRenderingContext2D;
        if (this._hoverItem) {
            let ptCanvas = this._hoverItem.PointToSurface(new Point(0, 0));
            let clientX = e.X - ptCanvas.X;
            let clientY = e.Y - ptCanvas.Y;
            if (!this._hoverItem.HitTest(clientX, clientY, ctx)) { //已离开该区域
                //todo: 
            }
            else {
                //如果是容器类的元素，尝试在hoverItem内部查找
                if (this._hoverItem.IsContainer) {
                    this._hoverItem = this._hoverItem.FindHoverItem(new Point(clientX, clientY), ctx);
                }
                return;
            }
        }

        //重新开始查找hoverItem
        this._hoverItem = this.GetItemUnderMouse(e.X, e.Y, ctx);
    }

    private GetItemUnderMouse(x: number, y: number, ctx: CanvasRenderingContext2D): ItemDesigner | null {
        var found: ItemDesigner | null = null;
        if (this._items) {
            for (var i = 0; i < this._items.length; i++) {
                var element = this._items[i];
                let clientX = x - element.Bounds.X;
                let clientY = y - element.Bounds.Y;
                if (element.Visible && element.HitTest(clientX, clientY, ctx)) {
                    found = element;
                    if (found.IsContainer) {
                        found = found.FindHoverItem(new Point(clientX, clientY), ctx);
                    }
                }
            }
        }

        return found;
    }

}