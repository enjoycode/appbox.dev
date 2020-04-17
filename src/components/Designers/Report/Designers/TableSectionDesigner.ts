import ReportXmlNodeDesigner from './ReportXmlNodeDesigner';
import { TableRow, TableCell } from './TableLayout';
import TableDesigner from './TableDesigner';
import DesignBehavior from '@/components/Canvas/Enums/DesignBehavior';
import Rectangle from '@/components/Canvas/Drawing/Rectangle';
import BoundsSpecified from '@/components/Canvas/Enums/BoundsSpecified';
import XmlUtil from './XmlUtil';
import Point from '@/components/Canvas/Drawing/Point';
import ItemDesigner from '@/components/Canvas/Designers/ItemDesigner';

export default class TableSectionDesigner extends ReportXmlNodeDesigner {

    private readonly _rowsNode: Node;
    private readonly _rows: TableRow[] = [];
    public get Rows(): TableRow[] { return this._rows; }
    public readonly Table: TableDesigner;

    public get IsContainer(): boolean { return true; } //必须设为true
    public get Behavior(): DesignBehavior { return DesignBehavior.None; }

    private readonly _bounds: Rectangle = new Rectangle(0, 0, 0, 0); //每次重新计算，这里仅缓存
    public get Bounds(): Rectangle {
        //暂计算，另暂不考虑TableGroups的高度
        let name = this.getPropertyOwnerType();
        this._bounds.Y = 0; //reset it
        if (name === "Details") {
            if (this.Table.Header) { this._bounds.Y += this.Table.Header.Bounds.Height; }
        } else if (name === "Footer") {
            if (this.Table.Header) { this._bounds.Y += this.Table.Header.Bounds.Height; }
            if (this.Table.Details) { this._bounds.Y += this.Table.Details.Bounds.Height; }
        }

        this._bounds.Height = 0; //reset it
        for (const row of this._rows) {
            this._bounds.Height += row.Height;
        }
        this._bounds.X = 0;
        this._bounds.Width = this.Table.Bounds.Width;
        return this._bounds;
    }
    protected SetBounds(x: number, y: number, width: number, height: number, specified: BoundsSpecified): void {
        console.warn("不允许设置TableSection的Bounds.");
    }

    constructor(owner: TableDesigner, node: Node) {
        super(node);
        this.Table = owner;

        // 开始加载Rows
        this._rowsNode = XmlUtil.GetOrCreateChildNode(this.xmlNode, "TableRows");
        for (let i = 0; i < this._rowsNode.childNodes.length; i++) {
            this._rows.push(new TableRow(this, this._rowsNode.childNodes[i]));
        }
    }

    public InsertRow(index: number, height: number = 100) {
        let len = this._rowsNode.childNodes.length;
        if (len === 0 || index >= len) { //添加至尾部
            let cnode = XmlUtil.CreateChildNode(this._rowsNode, "TableRow");
            let row = new TableRow(this, cnode);
            row.Height = height;
            this._rows.push(row);
            row.InitCells();
        } else {
            console.warn("未实现");
        }
        this.Table.Bounds.Height += height; //需要更新缓存值
    }

    // override for find TableCell
    public FindHoverItem(p: Point, ctx: CanvasRenderingContext2D): ItemDesigner | null {
        // 先找到对应的行
        let row: TableRow | null;
        let offsetY = 0;
        for (const r of this._rows) {
            if (r.Height + offsetY >= p.Y) {
                row = r; break;
            }
            offsetY += r.Height;
        }
        if (!row) { return this; }
        // 再找到对应的单元格
        let cell: TableCell | null;
        let offsetX = 0;
        for (const c of row.Cells) {
            if (c.LastWidth + offsetX >= p.X) {
                cell = c; break;
            }
            offsetX += c.LastWidth;
        }
        if (!cell || !cell.Target) { return this; }
        return cell.Target;
    }

    public Paint(g: CanvasRenderingContext2D): void {
        let b = this.Bounds;
        g.translate(b.X, b.Y);
        let diffY = 0;
        for (const row of this._rows) {
            row.Paint(g, diffY + b.Y);
            g.translate(0, row.Height);
            diffY += row.Height;
        }
        g.translate(-b.X, -b.Y - diffY);
    }

}