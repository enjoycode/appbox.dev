import ItemDesigner from '../../../Canvas/Designers/ItemDesigner'
import ReportItemDesigner from './ReportItemDesigner'
import Rectangle from '../../../Canvas/Drawing/Rectangle'
import BoundsSpecified from '../../../Canvas/Enums/BoundsSpecified'
import IServerReportItem from './IServerReportItem'
import { ITableLayout, IRow, IColumn, ICell} from './ITableLayout'
import CellSelectionAdorner from '../Adorners/CellSelectionAdorner'
import Point from '../../../Canvas/Drawing/Point'

export default class TableDesigner extends ReportItemDesigner {

    public get IsContainer(): boolean {
        return true;
    }

    private _tableLayout: ITableLayout;
    public get TableLayout(): ITableLayout {
        return this._tableLayout;
    }

    private _cellSelectionAdorner: CellSelectionAdorner | null;
    public get CellSelectionAdorner(): CellSelectionAdorner {
        if (!this._cellSelectionAdorner && this.Surface) {
            this._cellSelectionAdorner = new CellSelectionAdorner(this.Surface.Adorners, this);
        }
        return this._cellSelectionAdorner as CellSelectionAdorner;
    }

    public Fetch(serverItem: IServerReportItem) {
        super.Fetch(serverItem);

        //处理TableLayout
        let a: any = serverItem;
        this._tableLayout = a.TableLayout;
    }

    public Paint(g: CanvasRenderingContext2D): void {
        g.translate(this.Bounds.X, this.Bounds.Y);
        for (var i = 0; i < this.Items.length; i++) {
            this.Items[i].Paint(g);
        }
        g.translate(-this.Bounds.X, -this.Bounds.Y);
    }

    //--Cell Selection Methods---
    private StartPos: Point = new Point(0, 0);
    private EndPos: Point = new Point(0, 0);
    private DragRect: Rectangle = new Rectangle(0,0,0,0);
    public BeginCellSelection(x: number, y: number): void {
        this.StartPos = this.PointToClient(new Point(x,y));
        this.EndPos = this.PointToClient(new Point(x,y));
    }

    public GetCellsInBound(dragRect: Rectangle): Array<ItemDesigner> | null{
        var dragCell: Array<ItemDesigner> = new Array<ItemDesigner>();
        for (var i = 0; i < this.Items.length; i++) {
            //判断选择矩形与单元格是否相交
            var item = this.Items[i];
            if (dragRect.Contains(item.Bounds.X, item.Bounds.Y) ||
                dragRect.Contains(item.Bounds.X + item.Bounds.Width, item.Bounds.Y) ||
                dragRect.Contains(item.Bounds.X, item.Bounds.Y + item.Bounds.Height) ||
                dragRect.Contains(item.Bounds.X + item.Bounds.Width, item.Bounds.Y + item.Bounds.Height))
                dragCell.push(item);
            if (item.Bounds.Contains(dragRect.X, dragRect.Y) ||
                item.Bounds.Contains(dragRect.X + dragRect.Width, dragRect.Y) ||
                item.Bounds.Contains(dragRect.X, dragRect.Y + dragRect.Height) ||
                item.Bounds.Contains(dragRect.X + dragRect.Width, dragRect.Y + dragRect.Height))
                dragCell.push(item);
            if (dragRect.X > item.Bounds.X && dragRect.Width + dragRect.X < item.Bounds.Width + item.Bounds.X && 
                dragRect.Y < item.Bounds.Y  && dragRect.Y + dragRect.Height > item.Bounds.Height +item.Bounds.Y)
                dragCell.push(item);
            if (item.Bounds.X > dragRect.X && item.Bounds.Width + item.Bounds.X < dragRect.Width + dragRect.X && 
                item.Bounds.Y < dragRect.Y  && item.Bounds.Y + item.Bounds.Height > dragRect.Height +dragRect.Y)
                dragCell.push(item);                
        }
        return dragCell;
    }
    
    public MoveCellSelection(deltaX: number,deltaY: number): void{
        this.EndPos.X += deltaX;
        this.EndPos.Y += deltaY;
        
        var dragRect = new Rectangle(Math.min(this.StartPos.X, this.EndPos.X)
            , Math.min(this.StartPos.Y, this.EndPos.Y)
            , Math.abs(this.EndPos.X - this.StartPos.X)
            , Math.abs(this.EndPos.Y - this.StartPos.Y));
        var cells = this.GetCellsInBound(dragRect);
        this.DragRect = dragRect;
        if (cells) {
            if (this.Surface){
                this.Surface.SelectionService.SelectItems(cells);
            }
        }
    }
}