import DesignAdorner from '@/components/Canvas/Adorners/DesignAdorner'
import SelectionAdorner from '@/components/Canvas/Adorners/SelectionAdorner'
import Rectangle from '@/components/Canvas/Drawing/Rectangle'
import BoundsSpecified from '@/components/Canvas/Enums/BoundsSpecified'
import DesignBehavior from '@/components/Canvas/Enums/DesignBehavior'
import MouseEventArgs from '@/components/Canvas/EventArgs/MouseEventArgs'
import MouseButtons from '@/components/Canvas/Enums/MouseButtons'
import { IPropertyCatalog, IPropertyItem } from '@/components/Canvas/Interfaces/IPropertyPanel'
import ReportObjectDesigner from './ReportObjectDesigner'
import ReportStyle from './ReportStyle'
import TableDesigner from './TableDesigner'
import { Cell } from './TableLayout'
import { IReportItem } from './IReportObject'

export default abstract class ReportItemDesigner extends ReportObjectDesigner {

    /**
     * 是否在表格的单元格内
     * 注意：不要使用 this.Parent instance of TableDesigner https://github.com/webpack/webpack/issues/4520
     */
    public get IsTableCell(): boolean {
        return this.Parent && this.Parent.getPropertyOwnerType() === "Table";
    }

    public get Cell(): Cell | undefined {
        if (!this.IsTableCell) { return undefined; }
        let tabelDesigner = this.Parent as TableDesigner;
        return tabelDesigner.TableLayout.GetCell(this.node as IReportItem);
    }

    public get SelectionAdorner(): DesignAdorner | null {
        if (this.IsTableCell) {
            return (this.Parent as TableDesigner).CellSelectionAdorner;
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
        // 注意: 如果在单元格内获取Cell.Bounds
        return this.IsTableCell ? this.Cell.Bounds : this._bounds;
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

    constructor(node: any) {
        super(node);
        this._style = new ReportStyle(this);

        this._bounds.X = this.GetSize("Left", 0);
        this._bounds.Y = this.GetSize("Top", 0);
        if (this.getPropertyOwnerType() !== "Table") { // 需要排除Table
            this._bounds.Width = this.GetSize("Width", 200);
            this._bounds.Height = this.GetSize("Height", 200);
        }
    }

    //====添加/删除方法====
    public OnAddToSurface(byCreate: boolean): void {
        // console.log("OnAddToSurface: ", this.getPropertyOwnerType());
        if (byCreate) { //仅处理新建的元素
            let pt = "pt";
            this.SetPropertyRSize("Left", this.Bounds.X.toString() + pt, true);
            this.SetPropertyRSize("Top", this.Bounds.Y.toString() + pt, true);
            this.SetPropertyRSize("Width", this.Bounds.Width.toString() + pt, true);
            this.SetPropertyRSize("Height", this.Bounds.Height.toString() + pt, true);
        }
    }

    public OnRemoveFromSurface(): void {
        let parent = this.Parent as ReportObjectDesigner;
        let childs = parent.Node["Items"];
        let index = childs.indexOf(this.node);
        childs.splice(index, 1);
        if (childs.length === 0) {
            delete parent.Node["Items"];
        }
    }

    /**
     * override for in TableCell
     */
    public Invalidate(clip: Rectangle | null = null): void {
        if (this.IsTableCell) {
            this.Parent.Invalidate(); //TODO:仅画指定单元格区域
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
            let tableDesigner = this.Parent as TableDesigner;
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
                    getter: () => this.GetPropertyString("Left", "0mm"),
                    setter: v => this.SetPropertyRSize("Left", v)
                },
                {
                    title: "Top", readonly: false, editor: "TextBox",
                    getter: () => this.GetPropertyString("Top", "0mm"),
                    setter: v => this.SetPropertyRSize("Top", v)
                }
            ];
            if (this.getPropertyOwnerType() !== "Table") {
                items.push({
                    title: "Width", readonly: false, editor: "TextBox",
                    getter: () => this.GetPropertyString("Width", "20mm"),
                    setter: v => this.SetPropertyRSize("Width", v)
                });
                items.push({
                    title: "Height", readonly: false, editor: "TextBox",
                    getter: () => this.GetPropertyString("Height", "10mm"),
                    setter: v => this.SetPropertyRSize("Height", v)
                });
            }

            cats.splice(0, 0, { name: "Layout", items: items });
        }
        return cats;
    }

}