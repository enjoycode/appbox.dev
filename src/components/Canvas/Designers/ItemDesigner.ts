import DesignSurface from '../DesignSurface'
import Rectangle from '../Drawing/Rectangle'
import Point from '../Drawing/Point'
import BoundsSpecified from '../Enums/BoundsSpecified'
import MouseEventArgs from '../EventArgs/MouseEventArgs'
import DesignAdorners from '../Adorners/DesignAdorners'
import SelectionAdorner from '../Adorners/SelectionAdorner'
//import SelectionAdorner from '../../Designers/Report/Adorners/SectionSelectionAdorner' //test SectionSelectionAdorner
import DesignAdorner from '../Adorners/DesignAdorner'
import ResizeAnchorLocation from '../Enums/ResizeAnchorLocation'
import DesignBehavior from '../Enums/DesignBehavior'
import { IPropertyOwner, IPropertyCatalog } from '../Interfaces/IPropertyPanel'

export default abstract class ItemDesigner implements IPropertyOwner {

    protected _id: number = -1;
    /**
     * 用于标识与服务端元素对应
     */
    public get ID(): number {
        return this._id;
    }

    /**
     * 用于控制当前实例在画布上是否能改变位置或大小
     */
    public get Behavior(): DesignBehavior {
        return DesignBehavior.CanMove | DesignBehavior.CanResize;
    }

    private _surface: DesignSurface | null;
    public get Surface(): DesignSurface | null {
        if (this.Parent) {
            return this.Parent.Surface;
        } else {
            return this._surface;
        }
    }
    public set Surface(value: DesignSurface | null) {
        this._surface = value;
    }

    public Parent: ItemDesigner | null;

    public abstract get Bounds(): Rectangle;
    public abstract set Bounds(value: Rectangle); // TODO: remove it

    public get Visible(): boolean { return true; }

    /**
     * 当前实例是否容器
     */
    public get IsContainer(): boolean { return false; }

    private _items: Array<ItemDesigner>;
    /**
     * 获取当前元素的下级元素数组
     */
    public get Items(): Array<ItemDesigner> { return this._items; }

    protected _selectionAdorner: DesignAdorner | null = null;
    public get SelectionAdorner(): DesignAdorner | null {
        if (!this._selectionAdorner && this.Surface) {
            this._selectionAdorner = new SelectionAdorner(this.Surface.Adorners, this);
        }
        return this._selectionAdorner;
    }

    //============布局计算方法===========
    protected abstract SetBounds(x: number, y: number, width: number, height: number, specified: BoundsSpecified): void;

    public get Location(): Point {
        return new Point(this.Bounds.X, this.Bounds.Y);
    }

    public set Location(value: Point) {
        this.SetBounds(value.X, value.Y, this.Bounds.Width, this.Bounds.Height, BoundsSpecified.Location);
    }

    /**
     * 控件坐标系转换为画布坐标系
     */
    public PointToSurface(clientPt: Point): Point {
        var x = clientPt.X;
        var y = clientPt.Y;

        var temp: ItemDesigner | null = this;
        while (temp != null) {
            x += temp.Bounds.X;
            y += temp.Bounds.Y;
            temp = temp.Parent;
        }

        return new Point(x, y);
    }

    /**
     * 画布坐标系转换为控件坐标系
     */
    public PointToClient(surfacePt: Point): Point {
        let zero: Point = this.PointToSurface(new Point(0, 0));
        return new Point(surfacePt.X - zero.X, surfacePt.Y - zero.Y);
    }

    /**
     * 由SelectionService调用，在前端移动当前实例
     * @param deltaX 
     * @param deltaY 
     */
    public Move(deltaX: number, deltaY: number): void {
        if ((this.Behavior & DesignBehavior.CanMove) === 0) { return; }

        let dx = Math.round(deltaX);
        let dy = Math.round(deltaY);
        if (dx === 0 && dy === 0) { return; }

        if (this.Parent != null) {
            //预留10像素点 否则移到极限位置时候不容易在选中
            var newBounds = new Rectangle(this.Bounds.X + dx, this.Bounds.Y + dy, this.Bounds.Width, this.Bounds.Height);
            if (newBounds.Y + 10 >= this.Parent.Bounds.Height) { return; }
            if (newBounds.X + 10 >= this.Parent.Bounds.Width) { return; }
            if (newBounds.X + newBounds.Width <= 10) { return; }
            if (newBounds.Y + newBounds.Height <= 10) { return; }
        }
        this.SetBounds(this.Bounds.X + dx, this.Bounds.Y + dy,
            this.Bounds.Width, this.Bounds.Height, BoundsSpecified.Location);
    }

    /**
     * 由SelectionService调用，通知当前实例移动操作结束
     * 负责通知服务端对应的元素改变相应的属性
     */
    public OnEndMove(): void {
        if ((this.Behavior & DesignBehavior.CanMove) === 0) {
            // console.warn("当前行为不允许移动: ", this.getPropertyOwnerType());
            return;
        }

        if (this.Surface && this.Surface.DesignService) {
            this.Surface.DesignService.ChangeProperty(this, "Move", this.Bounds.X, this.Bounds.Y);
        }
    }

    /**
     * 由SelectionAdorner调用，通知当前实例改变大小
     * @param location 
     * @param deltaX 
     * @param deltaY 
     */
    public Resize(location: ResizeAnchorLocation, deltaX: number, deltaY: number): void {
        if (!(this.Behavior & DesignBehavior.CanResize)) { return; }

        let dx = Math.round(deltaX);
        let dy = Math.round(deltaY);
        if (dx === 0 && dy === 0) { return; }

        //todo: check minSize
        var newBounds = new Rectangle(this.Bounds.X, this.Bounds.Y, this.Bounds.Width, this.Bounds.Height);
        var specified = BoundsSpecified.All;

        //todo: fix BoundsSpecified
        switch (location) {
            case ResizeAnchorLocation.LeftTop:
                if (newBounds.Height - dy <= 0 || newBounds.Width - dx <= 0)
                    break;
                newBounds.X += dx;
                newBounds.Y += dy;
                newBounds.Width -= dx;
                newBounds.Height -= dy;
                break;
            case ResizeAnchorLocation.LeftCenter:
                if (newBounds.Width - dx <= 0)
                    break;
                newBounds.X += dx;
                newBounds.Width -= dx;
                break;
            case ResizeAnchorLocation.LeftBottom:
                if (newBounds.Height + dy <= 0 || newBounds.Width - dx <= 0)
                    break;
                newBounds.X += dx;
                newBounds.Width -= dx;
                newBounds.Height += dy;
                break;
            case ResizeAnchorLocation.RightTop:
                if (newBounds.Height - dy <= 0 || newBounds.Width + dx <= 0)
                    break;
                newBounds.Y += dy;
                newBounds.Width += dx;
                newBounds.Height -= dy;
                break;
            case ResizeAnchorLocation.RightCenter:
                if (newBounds.Width + dx <= 0)
                    break;
                newBounds.Width += dx;
                break;
            case ResizeAnchorLocation.RightBottom:
                if (newBounds.Height + dy <= 0 || newBounds.Width + dx <= 0)
                    break;
                newBounds.Width += dx;
                newBounds.Height += dy;
                break;
            case ResizeAnchorLocation.TopCenter:
                if (newBounds.Height - dy <= 0)
                    break;
                newBounds.Y += dy;
                newBounds.Height -= dy;
                specified = BoundsSpecified.Height;
                break;
            case ResizeAnchorLocation.BottomCenter:
                if (newBounds.Height + dy <= 0)
                    break;
                newBounds.Height += dy;
                specified = BoundsSpecified.Height;
                break;
            default:
                break;
        }

        this.SetBounds(newBounds.X, newBounds.Y, newBounds.Width, newBounds.Height, specified);
    }

    /**
     * 由各SelectionAdorner调用，通知当前实例Resize操作结束
     * 负责通知服务端对应的元素改变相应的属性
     */
    public OnEndResize(): void {
        if (!(this.Behavior & DesignBehavior.CanResize)) {
            return;
        }

        if (this.Surface && this.Surface.DesignService) {
            this.Surface.DesignService.ChangeProperty(this, "Resize", this.Bounds.Width, this.Bounds.Height);
        }
    }

    //============添加及移除方法===========
    /**
     * 当被添加到画布后执行的操作，由子类实现相关逻辑
     * @param byCreate 是否新建的元素
     */
    public OnAddToSurface(byCreate: boolean): void { }
    /**
     * 当被从画布移除后执行的操作，由子类实现相关逻辑
     */
    public OnRemoveFromSurface(): void { }

    //============绘制方法===========
    public Invalidate(): void {
        if (this.Surface) {
            var ptCanvas = this.PointToSurface(new Point(0, 0));
            var rect = new Rectangle(ptCanvas.X, ptCanvas.Y, this.Bounds.Width, this.Bounds.Height);
            //rect.Inflate(1,1);
            // TODO:*** 直接转换坐标后调用Paint重画
            this.Surface.Invalidate(rect); // Rectangle.Ceiling(rectpf0Lda
        }
    }

    /**
     * 元素Bounds改变后通知Canvas重新绘制合并区域
     */
    protected InvalidateOnBoundsChanged(oldBounds: Rectangle): void { //TODO: 移除此方法，与Invalidate()合并
        if (!this.Surface) { return; }

        let ptSurface = this.Parent == null ? new Point(0, 0) : this.Parent.PointToSurface(new Point(0, 0));
        var invalidRect = Rectangle.Union(oldBounds, this.Bounds);
        invalidRect.X += ptSurface.X;
        invalidRect.Y += ptSurface.Y;
        // invalidRect.Inflate(1, 1);
        // console.log("Old:", oldBounds.X, oldBounds.Y, oldBounds.Width, oldBounds.Height);
        // console.log("New:", this.Bounds.X, this.Bounds.Y, this.Bounds.Width, this.Bounds.Height);
        // console.log("Union:", invalidRect);

        this.Surface.Invalidate(invalidRect); //画旧区域与新区域的Union
    }

    public abstract Paint(ctx: CanvasRenderingContext2D): void;

    //============Mouse相关方法==========
    /**
     * Previews the mouse down. 画布坐标系
     */
    public PreviewMouseDown(e: MouseEventArgs): boolean {
        return false;
    }

    /**
     * 检测点是否在当前实例范围内
     * @param x 已转换为控件的坐标系
     * @param y 已转换为控件的坐标系
     */
    public HitTest(x: number, y: number, ctx: CanvasRenderingContext2D): boolean {
        return x >= 0 && x <= this.Bounds.Width && y >= 0 && y <= this.Bounds.Height;
    }

    /**
     * 上层调用时本身已Hover，用于确认ContainerItem下的子项是否Hover
     * 如果找不到子项，必须返回自己
     * @param p 已转换为当前元素的坐标系
     */
    public FindHoverItem(p: Point, ctx: CanvasRenderingContext2D): ItemDesigner | null {
        if (!this._items) { return this; }

        let found: ItemDesigner | null = null;
        for (const element of this._items) {
            let clientX = p.X - element.Bounds.X;
            let clientY = p.Y - element.Bounds.Y;
            if (element.Visible && element.HitTest(clientX, clientY, ctx)) {
                found = element;
                if (found.IsContainer) {
                    found = found.FindHoverItem(new Point(clientX, clientY), ctx);
                }
            }
        }
        return found == null ? this : found;
    }

    //============容器相关方法===========
    /**
     * 添加子级元素
     * @param item 
     * @param byCreate 是否新建的
     */
    public AddItem(item: ItemDesigner, byCreate: boolean = false): void {
        if (!this.IsContainer)
            throw new Error("非容器元素不能添加子元素");

        item.Parent = this;
        if (!this._items)
            this._items = new Array<ItemDesigner>();
        this._items.push(item);
        item.OnAddToSurface(byCreate);
        // if (!byCreate) {
        //非DiagramHostItem需要刷新Canvas
        this.Invalidate();
        // }
    }

    public RemoveItem(item: ItemDesigner): void {
        if (!this.IsContainer)
            throw new Error("非容器元素不能删除子元素");

        item.OnRemoveFromSurface(); //注意：必须先于下面代码
        item.Parent = null;
        let index = this._items.indexOf(item);
        this._items.splice(index, 1);
        //todo: 非DiagramHostItem需要刷新Canvas
        this.Invalidate();
    }

    //============填充服务端数据方法===========
    public Fetch(data: any) { }

    //============IPropertyOwner接口实现=====
    public getPropertyItems(): IPropertyCatalog[] | null {
        return null;
    }

    public getPropertyOwnerType(): string {
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec((this).constructor.toString());
        return (results && results.length > 1) ? results[1] : "";
    }

}