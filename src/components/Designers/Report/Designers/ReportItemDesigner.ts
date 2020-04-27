import DesignAdorner from '@/components/Canvas/Adorners/DesignAdorner'
import SelectionAdorner from '@/components/Canvas/Adorners/SelectionAdorner'
import Rectangle from '@/components/Canvas/Drawing/Rectangle'
import BoundsSpecified from '@/components/Canvas/Enums/BoundsSpecified'
import TableDesigner from './TableDesigner'
import DesignBehavior from '@/components/Canvas/Enums/DesignBehavior'
import MouseEventArgs from '@/components/Canvas/EventArgs/MouseEventArgs'
import MouseButtons from '@/components/Canvas/Enums/MouseButtons'
import ReportXmlNodeDesigner from './ReportXmlNodeDesigner'
import { IPropertyCatalog, IPropertyItem } from '@/components/Canvas/Interfaces/IPropertyPanel'
import XmlUtil from './XmlUtil'
import ReportStyle from './ReportStyle'
import { TableCell } from './TableLayout'
import DesignSurface from '@/components/Canvas/DesignSurface'

export default abstract class ReportItemDesigner extends ReportXmlNodeDesigner {

    /**
     * 是否在表格的单元格内
     * 注意：不要使用 this.Parent instance of TableDesigner https://github.com/webpack/webpack/issues/4520
     */
    public get IsTableCell(): boolean { return this._cell != null; }

    private _cell: TableCell | null;
    public get Cell(): TableCell | null { return this._cell; }

    public get Surface(): DesignSurface | null {
        if (this.IsTableCell) {
            return this._cell.Row.Owner.Table.Surface;
        } else {
            return super.Surface;
        }
    }

    public get SelectionAdorner(): DesignAdorner | null {
        if (this.IsTableCell) {
            return this._cell.Row.Owner.Table.CellSelectionAdorner;
        } else {
            if (!this._selectionAdorner && this.Surface) {
                this._selectionAdorner = new SelectionAdorner(this.Surface.Adorners, this);
            }
            return this._selectionAdorner;
        }
    }

    public get Behavior(): DesignBehavior {
        return this.IsTableCell ? DesignBehavior.None : DesignBehavior.CanMove | DesignBehavior.CanResize;
    }

    private _bounds: Rectangle = new Rectangle(0, 0, 0, 0); //only for cache
    public get Bounds(): Rectangle {
        if (this._cell) { this._cell.CalcTargetBounds(this._bounds); } // 如果在单元格内每次计算获取
        return this._bounds;
    }
    public set Bounds(value) {
        this.SetBounds(value.X, value.Y, value.Width, value.Height, BoundsSpecified.All);
    }

    protected SetBounds(x: number, y: number, width: number, height: number, specified: BoundsSpecified): void {
        if (this.IsTableCell) { //注意：在TableCell内不允许操作
            console.warn("不允许设置在表格内的元素的Bounds");
            return;
        }

        let oldBounds = this._bounds.Clone();
        //根据specified设置
        if (specified & BoundsSpecified.X) { this._bounds.X = x; }
        if (specified & BoundsSpecified.Y) { this._bounds.Y = y; }
        if (specified & BoundsSpecified.Width) { this._bounds.Width = width; }
        if (specified & BoundsSpecified.Height) { this._bounds.Height = height; }
        this.InvalidateOnBoundsChanged(oldBounds); // this.Invalidate();
    }

    private readonly _style: ReportStyle;
    public get Style(): ReportStyle { return this._style; }

    constructor(xmlNode: Node, cell: TableCell | null = null) {
        super(xmlNode);
        this._style = new ReportStyle(this);
        this._cell = cell;

        if (!cell) { // 不在表格内则转换单位    
            this._bounds.X = XmlUtil.TryGetSize(this.xmlNode, "Left", 0);
            this._bounds.Y = XmlUtil.TryGetSize(this.xmlNode, "Top", 0);
            if (this.getPropertyOwnerType() !== "Table") { // 需要排除Table
                this._bounds.Width = XmlUtil.TryGetSize(this.xmlNode, "Width", 200);
                this._bounds.Height = XmlUtil.TryGetSize(this.xmlNode, "Height", 100);
            }
        }
    }

    //====添加/删除方法====
    public OnAddToSurface(byCreate: boolean): void {
        // console.log("OnAddToSurface: ", this.getPropertyOwnerType());
        // super.OnAddToSurface(byCreate);
        if (byCreate) { //仅处理新建的元素
            let pt = "pt";
            this.SetPropertyRSize("Left", this.Bounds.X.toString() + pt, true);
            this.SetPropertyRSize("Top", this.Bounds.Y.toString() + pt, true);
            this.SetPropertyRSize("Width", this.Bounds.Width.toString() + pt, true);
            this.SetPropertyRSize("Height", this.Bounds.Height.toString() + pt, true);
        }
    }

    public OnRemoveFromSurface(): void {
        // super.OnRemoveFromSurface();
        let parentNode = this.xmlNode.parentNode;
        if (!parentNode) { console.warn("删除元素无法找到上级节点的ReportItems节点"); }
        parentNode.removeChild(this.xmlNode);
        // TODO:暂简单判断上级是否ReportItems
        if (parentNode.nodeName === "ReportItems" && parentNode.childNodes.length === 0) {
            parentNode.parentNode.removeChild(parentNode);
        }
    }

    /**
     * override for in TableCell
     */
    public Invalidate(clip: Rectangle | null = null): void {
        if (this._cell) {
            this._cell.Row.Owner.Table.Invalidate(); //TODO:仅画指定单元格区域
        } else {
            super.Invalidate(clip);
        }
    }

    /**
     * override for change position by canvas
     */
    public OnEndMove(): void {
        if (this.IsTableCell) { return; } // 忽略不处理单元格

        this.SetPropertyRSize("Left", this.Bounds.X);
        this.SetPropertyRSize("Top", this.Bounds.Y);
        // 通知属性面板刷新相应的值，需要排除Table,因为选择的是单元格非整个表格
        if (this.Surface && this.getPropertyOwnerType() !== "Table") {
            this.Surface.PropertyPanel.refreshProperty("Left");
            this.Surface.PropertyPanel.refreshProperty("Top");
        }
    }

    /**
     * override for change size by canvas
     */
    public OnEndResize(): void {
        this.SetPropertyRSize("Width", this.Bounds.Width);
        this.SetPropertyRSize("Height", this.Bounds.Height);
        // 通知属性面板刷新相应的值
        if (this.Surface) {
            this.Surface.PropertyPanel.refreshProperty("Width");
            this.Surface.PropertyPanel.refreshProperty("Height");
        }
    }

    public PreviewMouseDown(e: MouseEventArgs): boolean {
        if (e.Button == MouseButtons.Left && this.IsTableCell) {
            //在表格内则开始单元格选取

            let tableDesigner = this.Cell.Row.Owner.Table;
            if (tableDesigner) {
                tableDesigner.BeginCellSelection(e.X, e.Y);
            }
        }
        return false;
    }

    //============IPropertyOwner接口实现=====
    public getPropertyItems(): IPropertyCatalog[] | null {
        let cats = this.Style.GetPropertyItems();
        // 在表格内不返回Layout类别
        if (!this.IsTableCell) {
            let items: IPropertyItem[] = [
                {
                    title: "Left", readonly: false, editor: "TextBox",
                    getter: () => this.GetPropertyRSize("Left", "0mm"),
                    setter: v => this.SetPropertyRSize("Left", v)
                },
                {
                    title: "Top", readonly: false, editor: "TextBox",
                    getter: () => this.GetPropertyRSize("Top", "0mm"),
                    setter: v => this.SetPropertyRSize("Top", v)
                }
            ];
            if (this.getPropertyOwnerType() !== "Table") {
                items.push({
                    title: "Width", readonly: false, editor: "TextBox",
                    getter: () => this.GetPropertyRSize("Width", "20mm"),
                    setter: v => this.SetPropertyRSize("Width", v)
                });
                items.push({
                    title: "Height", readonly: false, editor: "TextBox",
                    getter: () => this.GetPropertyRSize("Height", "10mm"),
                    setter: v => this.SetPropertyRSize("Height", v)
                });
            }

            cats.splice(0, 0, { name: "Layout", items: items });
        }
        return cats;
    }

}