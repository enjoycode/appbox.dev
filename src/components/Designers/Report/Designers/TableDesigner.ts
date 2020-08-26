import Point from '@/components/Canvas/Drawing/Point';
import Rectangle from '@/components/Canvas/Drawing/Rectangle'
import ItemDesigner from '@/components/Canvas/Designers/ItemDesigner';
import ReportItemDesigner from './ReportItemDesigner';
import { TableLayout, Column, Row } from './TableLayout';
import CellSelectionAdorner from '../Adorners/CellSelectionAdorner';
import DesignBehavior from '@/components/Canvas/Enums/DesignBehavior';
import { IPropertyCatalog } from '@/components/Canvas/Interfaces/IPropertyPanel';
import ReportRootDesigner from './ReportRootDesigner';
import { TableGroups } from './IReportObject';

export default class TableDesigner extends ReportItemDesigner {
    public readonly TableLayout: TableLayout;
    public get RowGroups(): TableGroups { return this.TableLayout.Table.RowGroups; }
    public get ColumnGroups(): TableGroups { return this.TableLayout.Table.ColumnGroups; }

    public get IsContainer(): boolean { return true; }
    public get Behavior(): DesignBehavior {
        return this.IsTableCell ? DesignBehavior.None : DesignBehavior.CanMove;
    }

    private _cellSelectionAdorner: CellSelectionAdorner | null;
    public get CellSelectionAdorner(): CellSelectionAdorner {
        if (!this._cellSelectionAdorner && this.Surface) {
            this._cellSelectionAdorner = new CellSelectionAdorner(this.Surface.Adorners, this);
        }
        return this._cellSelectionAdorner;
    }

    constructor(node: any) {
        super(node);
        this.TableLayout = new TableLayout(this);
        if (node.Body) {
            this.TableLayout.Refresh();
        }
    }

    // override for init new table and layout
    public OnAddToSurface(byCreate: boolean): void {
        if (!byCreate) { return; }
        //注意初始化ITable成员
        this.node.Body = { Cells: [], Rows: [], Columns: [] };
        this.node.Corner = { Cells: [] };
        this.node.RowGroups = [];
        this.node.ColumnGroups = [];
        this.TableLayout.InitNewTable(this.Bounds.Width, this.Bounds.Height);
        this.TableLayout.Refresh();
    }

    public Paint(g: CanvasRenderingContext2D, clip?: Rectangle): void {
        g.translate(this.Bounds.X, this.Bounds.Y);
        if (this.Items) {
            for (const item of this.Items) {
                item.Paint(g);
            }
        }
        g.translate(-this.Bounds.X, -this.Bounds.Y);
    }

    //====Operations====
    public ResizeRow(row: Row, delta: number): void {
        let oldBounds = this.Bounds.Clone();
        row.Size += delta;
        this.InvalidateOnBoundsChanged(oldBounds);
    }

    public ResizeColumn(col: Column, delta: number): void {
        let oldBounds = this.Bounds.Clone();
        col.Size += delta;
        this.InvalidateOnBoundsChanged(oldBounds);
    }

    //====Cell Selection Methods====
    private StartPos: Point = new Point(0, 0);
    private EndPos: Point = new Point(0, 0);
    private DragRect: Rectangle = new Rectangle(0, 0, 0, 0);
    public BeginCellSelection(x: number, y: number): void {
        this.StartPos = this.PointToClient(new Point(x, y));
        this.EndPos = this.PointToClient(new Point(x, y));
    }

    private GetCellsInBound(dragRect: Rectangle): ItemDesigner[] {
        var cells: ItemDesigner[] = [];
        for (const item of this.Items) { //TODO:优化相交判断
            //判断选择矩形与单元格是否相交
            if (dragRect.IntersectsWith(item.Bounds)) {
                cells.push(item);
            }
        }
        return cells;
    }

    public MoveCellSelection(deltaX: number, deltaY: number): void {
        this.EndPos.X += deltaX;
        this.EndPos.Y += deltaY;
        let dragRect = new Rectangle(Math.min(this.StartPos.X, this.EndPos.X)
            , Math.min(this.StartPos.Y, this.EndPos.Y)
            , Math.abs(this.EndPos.X - this.StartPos.X)
            , Math.abs(this.EndPos.Y - this.StartPos.Y));

        let cells = this.GetCellsInBound(dragRect);
        this.DragRect = dragRect;
        if (cells && cells.length > 0 && this.Surface) {
            this.Surface.SelectionService.SelectItems(cells);
        }
    }

    //====IPropertyOwner====
    public getPropertyItems(): IPropertyCatalog[] | null {
        let cats = super.getPropertyItems();
        cats.push({
            name: "Data",
            items: [
                {
                    title: "DataSource", readonly: false, editor: "Select",
                    options: (this.Surface.DesignService.RootDesigner as ReportRootDesigner).DataSources.GetNames(),
                    getter: () => this.GetPropertyString("DataSource", ""),
                    setter: v => this.SetPropertyString("DataSource", v)
                },
                {
                    title: "RowGroups", readonly: false, editor: "TableGroups",
                    options: true,
                    getter: () => this,
                    setter: v => {/* do nothing */ }
                },
                {
                    title: "ColumnGroups", readonly: false, editor: "TableGroups",
                    options: false,
                    getter: () => this,
                    setter: v => {/* do nothing */ }
                }
            ]
        });
        return cats;
    }
}