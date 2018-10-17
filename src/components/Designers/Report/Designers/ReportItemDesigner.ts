import DesignAdorners from '../../../Canvas/Adorners/DesignAdorners'
import DesignAdorner from '../../../Canvas/Adorners/DesignAdorner'
import SelectionAdorner from '../../../Canvas/Adorners/SelectionAdorner'
import ItemDesigner from '../../../Canvas/Designers/ItemDesigner'
import Rectangle from '../../../Canvas/Drawing/Rectangle'
import BoundsSpecified from '../../../Canvas/Enums/BoundsSpecified'
import IServerReportItem from './IServerReportItem'
import TableDesigner from './TableDesigner'
import DesignBehavior from '../../../Canvas/Enums/DesignBehavior'
import MouseEventArgs from '../../../Canvas/EventArgs/MouseEventArgs'
import MouseButtons from '../../../Canvas/Enums/MouseButtons'
import { ICell } from './ITableLayout'


export default abstract class ReportItemDesigner extends ItemDesigner {

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

    private _bounds: Rectangle = new Rectangle(0, 0, 0, 0);
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
        this._bounds.X = x;
        this._bounds.Y = y;
        this._bounds.Width = width;
        this._bounds.Height = height;
        this.InvalidateOnBoundsChanged(oldBounds); // this.Invalidate();
    }

    public Fetch(serverItem: IServerReportItem) {
        this._id = serverItem.ID;
        this._bounds.X = serverItem.Bounds.X;
        this._bounds.Y = serverItem.Bounds.Y;
        this._bounds.Width = serverItem.Bounds.Width;
        this._bounds.Height = serverItem.Bounds.Height;
        let si: any = serverItem;
        if (si.Cell) {
            this._cell = si.Cell;
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

}