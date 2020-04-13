import DesignAdorner from '@/components/Canvas/Adorners/DesignAdorner'
import SelectionAdorner from '@/components/Canvas/Adorners/SelectionAdorner'
import Rectangle from '@/components/Canvas/Drawing/Rectangle'
import BoundsSpecified from '@/components/Canvas/Enums/BoundsSpecified'
import TableDesigner from './TableDesigner'
import DesignBehavior from '@/components/Canvas/Enums/DesignBehavior'
import MouseEventArgs from '@/components/Canvas/EventArgs/MouseEventArgs'
import MouseButtons from '@/components/Canvas/Enums/MouseButtons'
import { ICell } from './ITableLayout'
import ReportXmlNodeDesigner from './ReportXmlNodeDesigner'
import { IPropertyCatalog } from '@/components/Canvas/Interfaces/IPropertyPanel'


export default abstract class ReportItemDesigner extends ReportXmlNodeDesigner {

    /**
     * 是否在表格的单元格内
     * 注意：不要使用 this.Parent instance of TableDesigner https://github.com/webpack/webpack/issues/4520
     */
    public get IsTableCell(): boolean {
        return this._cell != null;
    }

    private _cell: ICell | null;
    public get Cell(): ICell | null {
        return this._cell;
    }

    public get SelectionAdorner(): DesignAdorner | null {
        if (this.IsTableCell) {
            let tableDesigner = this.Parent as TableDesigner;
            return tableDesigner.CellSelectionAdorner;
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
        return this._bounds;
    }
    public set Bounds(value) {
        this.SetBounds(value.X, value.Y, value.Width, value.Height, BoundsSpecified.All);
    }

    protected SetBounds(x: number, y: number, width: number, height: number, specified: BoundsSpecified): void {
        if (this.IsTableCell) { //注意：在TableCell内不允许操作
            return;
        }

        let oldBounds = new Rectangle(this._bounds.X, this._bounds.Y, this._bounds.Width, this._bounds.Height);
        //根据specified设置
        if (specified & BoundsSpecified.X) { this._bounds.X = x; }
        if (specified & BoundsSpecified.Y) { this._bounds.Y = y; }
        if (specified & BoundsSpecified.Width) { this._bounds.Width = width; }
        if (specified & BoundsSpecified.Height) { this._bounds.Height = height; }
        this.InvalidateOnBoundsChanged(oldBounds); // this.Invalidate();
    }

    constructor(xmlNode: Node) {
        super(xmlNode);

        //转换Bounds
        let x = this.GetNamedChildNode("Left");
        if (x) this._bounds.X = this.GetSize(x);
        let y = this.GetNamedChildNode("Top");
        if (y) this._bounds.Y = this.GetSize(y);
        let width = this.GetNamedChildNode("Width");
        if (width) this._bounds.Width = this.GetSize(width);
        let height = this.GetNamedChildNode("Height");
        if (height) this._bounds.Height = this.GetSize(height);
    }

    /**
     * override for change position by canvas
     */
    public OnEndMove(): void {
        this.SetPropertyRSize("Left", this.Bounds.X);
        this.SetPropertyRSize("Top", this.Bounds.Y);
        // 通知属性面板刷新相应的值
        if (this.Surface) {
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

            if (null == this.Parent)
                return false;

            var tableDesigner = this.Parent as TableDesigner;
            if (null != tableDesigner) {
                tableDesigner.BeginCellSelection(e.X, e.Y);
            }
        }
        return false;
    }

    //============IPropertyOwner接口实现=====
    public getPropertyItems(): IPropertyCatalog[] | null {
        //TODO:在表格内不返回Layout类别
        let cats: IPropertyCatalog[] = [
            {
                name: "Layout",
                items: [
                    {
                        title: "Left", readonly: false, editorType: "TextBox",
                        getter: () => this.GetPropertyRSize("Left", "0mm"),
                        setter: v => this.SetPropertyRSize("Left", v)
                    },
                    {
                        title: "Top", readonly: false, editorType: "TextBox",
                        getter: () => this.GetPropertyRSize("Top", "0mm"),
                        setter: v => this.SetPropertyRSize("Top", v)
                    },
                    {
                        title: "Width", readonly: false, editorType: "TextBox",
                        getter: () => this.GetPropertyRSize("Width", "20mm"),
                        setter: v => this.SetPropertyRSize("Width", v)
                    },
                    {
                        title: "Height", readonly: false, editorType: "TextBox",
                        getter: () => this.GetPropertyRSize("Height", "10mm"),
                        setter: v => this.SetPropertyRSize("Height", v)
                    },
                ]
            }
        ]
        return cats;
    }

}