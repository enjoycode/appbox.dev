import ItemDesigner from '@/components/Canvas/Designers/ItemDesigner'
import ReportItemDesigner from './ReportItemDesigner'
import Rectangle from '@/components/Canvas/Drawing/Rectangle'
import CellSelectionAdorner from '../Adorners/CellSelectionAdorner'
import Point from '@/components/Canvas/Drawing/Point'
import XmlUtil from './XmlUtil';
import { TableColumn, TableGroups, TableRow, TableGroup } from './TableLayout';
import TableSectionDesigner from './TableSectionDesigner';
import DesignBehavior from '@/components/Canvas/Enums/DesignBehavior'
import { IPropertyCatalog } from '@/components/Canvas/Interfaces/IPropertyPanel'
import ReportRootDesigner from './ReportRootDesigner'

export default class TableDesigner extends ReportItemDesigner {

    private readonly _columnsNode: Node;
    private readonly _columns: TableColumn[] = [];
    public get Columns(): TableColumn[] { return this._columns; }

    private _header: TableSectionDesigner | null;
    public get Header(): TableSectionDesigner | null { return this._header; }
    private _details: TableSectionDesigner | null;
    public get Details(): TableSectionDesigner | null { return this._details; }
    private _footer: TableSectionDesigner | null;
    public get Footer(): TableSectionDesigner | null { return this._footer; }

    public readonly Groups: TableGroups;

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

    constructor(xmlNode: Node) {
        super(xmlNode);
        this.Groups = new TableGroups(this);
        // 先尝试读取列
        this._columnsNode = XmlUtil.GetOrCreateChildNode(this.xmlNode, "TableColumns");
        if (this._columnsNode.childNodes.length > 0) { // 表示非新建的，新建的在OnAddToSurface时初始化
            for (let i = 0; i < this._columnsNode.childNodes.length; i++) {
                this._columns.push(new TableColumn(this, this._columnsNode.childNodes[i]));
                this.Bounds.Width += this._columns[i].Width;
            }
            // 再尝试读取Header/Details/Footer and TableGroups
            let hnode = XmlUtil.GetNamedChildNode(this.xmlNode, "Header");
            if (hnode) {
                this._header = new TableSectionDesigner(this, hnode);
                this.Bounds.Height += this._header.GetRowsHeight();
                this.AddItem(this._header);
            }

            for (const group of this.Groups.Items) {
                if (group.Header) {
                    this.Bounds.Height += group.Header.GetRowsHeight();
                    this.AddItem(group.Header);
                }
            }

            let dnode = XmlUtil.GetNamedChildNode(this.xmlNode, "Details");
            if (dnode) {
                this._details = new TableSectionDesigner(this, dnode);
                this.Bounds.Height += this._details.GetRowsHeight();
                this.AddItem(this._details);
            }

            for (const group of this.Groups.Items) {
                if (group.Footer) {
                    this.Bounds.Height += group.Footer.GetRowsHeight();
                    this.AddItem(group.Footer);
                }
            }

            let fnode = XmlUtil.GetNamedChildNode(this.xmlNode, "Footer");
            if (fnode) {
                this._footer = new TableSectionDesigner(this, fnode);
                this.Bounds.Height += this._footer.GetRowsHeight();
                this.AddItem(this._footer);
            }
        }
    }

    // override for create table
    public OnAddToSurface(byCreate: boolean): void {
        if (!byCreate) { return; }
        //注意Table只需要设置Left & Top
        let pt = "pt";
        this.SetPropertyRSize("Left", this.Bounds.X.toString() + pt, true);
        this.SetPropertyRSize("Top", this.Bounds.Y.toString() + pt, true);
        let initWidth = this.Bounds.Width;
        let initHeight = this.Bounds.Height;
        this.Bounds.Width = this.Bounds.Height = 0; //注意: reset width & height，Insert时重新计算
        let colWidth = Math.round(initWidth / 3);
        for (let i = 0; i < 3; i++) {
            this.InsertColumn(i, colWidth, false);
        }
        let rowHeight = Math.round(initHeight / 2);
        let hnode = XmlUtil.CreateChildNode(this.xmlNode, "Header");
        this._header = new TableSectionDesigner(this, hnode);
        this._header.InsertRow(0, rowHeight);
        this.AddItem(this._header, true);
        let dnode = XmlUtil.CreateChildNode(this.xmlNode, "Details");
        this._details = new TableSectionDesigner(this, dnode);
        this._details.InsertRow(0, rowHeight);
        this.AddItem(this._details, true);
    }

    public AddGroupSection(g: TableGroup, isHeader: boolean) {
        let oldBounds = this.Bounds.Clone();
        let insertPos = 0;
        if (this.Header) { insertPos++; }

        if (isHeader) {
            for (const group of this.Groups.Items) {
                if (group === g) { break; }
                if (group.Header) { insertPos++; }
            }
            g.Header.InsertRow(0); //别忘了插一行，已经同步Table高度
            this.Items.splice(insertPos, 0, g.Header);
        } else {
            for (const group of this.Groups.Items) {
                if (group.Header) { insertPos++; }
            }
            if (this.Details) { insertPos++; }
            for (const group of this.Groups.Items) {
                if (group === g) { break; }
                if (group.Footer) { insertPos++; }
            }
            g.Footer.InsertRow(0); //别忘了插一行，已经同步Table高度
            this.Items.splice(insertPos, 0, g.Footer);
        }

        this.InvalidateOnBoundsChanged(oldBounds); //TODO:仅重画变动部分
    }

    public RemoveGroupSection(g: TableGroup, isHeader: boolean) {
        let oldBounds = this.Bounds.Clone();
        let hf = isHeader ? g.Header : g.Footer;

        for (let i = 0; i < this.Items.length; i++) {
            if (this.Items[i] === hf) {
                this.Items.splice(i, 1);
                break;
            }
        }

        this.Bounds.Height -= hf.GetRowsHeight();
        this.InvalidateOnBoundsChanged(oldBounds);
    }

    /**
     * 添加列，并同步表格宽度
     * @param index 添加列位置
     * @param width 列宽度
     * @param needInvalidate 仅新建的表格初始化行列时设为false
     */
    public InsertColumn(index: number, width: number = 100, needInvalidate = true) {
        let len = this._columnsNode.childNodes.length;
        if (index > len) { index = len; }
        // 添加Xml节点及列
        let cnode = XmlUtil.CreateChildNode(this._columnsNode, "TableColumn", index);
        let col = new TableColumn(this, cnode);
        col.Width = width;
        this._columns.splice(index, 0, col);
        // 同步添加各行的单元格(如果初始化时调用还没有行)
        if (this.Items) {
            for (const item of this.Items) {
                let sec = item as TableSectionDesigner;
                for (const row of sec.Rows) {
                    row.InsertCell(index);
                }
            }
        }
        this.Bounds.Width += width; //更新缓存值
    }

    /**
     * 删除列并同步表格宽度
     * @param index 列位置
     */
    public DeleteColumn(index: number) {
        if (this._columns.length === 1) { return; }
        let col = this._columns[index];
        // 删除Xml节点及列
        this._columnsNode.removeChild(col.Node)
        this._columns.splice(index, 1);
        // 同步删除各行的单元格
        for (const item of this.Items) {
            let sec = item as TableSectionDesigner;
            for (const row of sec.Rows) {
                row.DeleteCell(index);
            }
        }
        this.Bounds.Width -= col.Width; //更新缓存值
    }

    public MoveColumn(fromIndex: number, toIndex: number) {
        //TODO:
    }

    public ResizeRow(row: TableRow, delta: number): void {
        row.Height += delta;
        //如果Row对应的TableSection.Bounds改为缓存，则这里需要重新计算
        let oldBounds = this.Bounds.Clone();
        this.Bounds.Height += delta; //需要更新缓存值
        this.InvalidateOnBoundsChanged(oldBounds);
    }

    public ResizeColumn(col: TableColumn, delta: number): void {
        col.Width += delta;
        let oldBounds = this.Bounds.Clone();
        this.Bounds.Width += delta; //需要更新缓存值
        this.InvalidateOnBoundsChanged(oldBounds);
    }

    public Paint(g: CanvasRenderingContext2D, clip?: Rectangle): void {
        g.translate(this.Bounds.X, this.Bounds.Y);
        for (const item of this.Items) {
            item.Paint(g);
        }
        g.translate(-this.Bounds.X, -this.Bounds.Y);
    }

    //====Cell Selection Methods====
    private StartPos: Point = new Point(0, 0);
    private EndPos: Point = new Point(0, 0);
    private DragRect: Rectangle = new Rectangle(0, 0, 0, 0);
    public BeginCellSelection(x: number, y: number): void {
        this.StartPos = this.PointToClient(new Point(x, y));
        this.EndPos = this.PointToClient(new Point(x, y));
    }

    private GetCellsInBound(dragRect: Rectangle): Array<ItemDesigner> | null {
        // TODO: 不允许跨Section选择
        var dragCell: Array<ItemDesigner> = new Array<ItemDesigner>();
        // let rowBounds = new Rectangle(0, 0, 0, 0);
        let cellBounds = new Rectangle(0, 0, 0, 0);
        for (const item of this.Items) {
            const sec = item as TableSectionDesigner;
            let sb = sec.Bounds;
            //判断选择矩形与单元格是否相交
            if (sb.IntersectsWith(dragRect)) {
                for (const row of sec.Rows) {
                    //TODO:行相交
                    for (const cell of row.Cells) {
                        cellBounds.X = cell.LastX;
                        cellBounds.Y = cell.LastY;
                        cellBounds.Width = cell.LastWidth;
                        cellBounds.Height = row.Height;
                        if (cellBounds.IntersectsWith(dragRect)) {
                            dragCell.push(cell.Target);
                        }
                    }
                }
            }
        }
        return dragCell;
    }

    public MoveCellSelection(deltaX: number, deltaY: number): void {
        this.EndPos.X += deltaX;
        this.EndPos.Y += deltaY;

        var dragRect = new Rectangle(Math.min(this.StartPos.X, this.EndPos.X)
            , Math.min(this.StartPos.Y, this.EndPos.Y)
            , Math.abs(this.EndPos.X - this.StartPos.X)
            , Math.abs(this.EndPos.Y - this.StartPos.Y));
        var cells = this.GetCellsInBound(dragRect);
        this.DragRect = dragRect;
        if (cells) {
            if (this.Surface) {
                this.Surface.SelectionService.SelectItems(cells);
            }
        }
    }

    //====IPropertyOwner====
    public getPropertyItems(): IPropertyCatalog[] | null {
        let cats = super.getPropertyItems();
        cats.push({
            name: "Data",
            items: [
                {
                    title: "DataSetName", readonly: false, editor: "Select",
                    options: (this.Surface.DesignService.RootDesigner as ReportRootDesigner).DataSets.GetNames(),
                    getter: () => this.GetPropertyString("DataSetName", ""),
                    setter: v => this.SetPropertyString("DataSetName", v)
                },
                {
                    title: "Groups", readonly: false, editor: "TableGroups",
                    getter: () => this,
                    setter: v => {/* do nothing */ }
                }
            ]
        });
        return cats;
    }
}