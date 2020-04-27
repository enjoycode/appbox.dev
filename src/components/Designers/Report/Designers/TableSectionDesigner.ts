import ReportXmlNodeDesigner from './ReportXmlNodeDesigner';
import { TableRow, TableCell, TableGroup } from './TableLayout';
import TableDesigner from './TableDesigner';
import DesignBehavior from '@/components/Canvas/Enums/DesignBehavior';
import Rectangle from '@/components/Canvas/Drawing/Rectangle';
import BoundsSpecified from '@/components/Canvas/Enums/BoundsSpecified';
import XmlUtil from './XmlUtil';
import Point from '@/components/Canvas/Drawing/Point';
import ItemDesigner from '@/components/Canvas/Designers/ItemDesigner';
import { IPropertyCatalog, IPropertyItem } from '@/components/Canvas/Interfaces/IPropertyPanel';

/**
 * Table's Header/Details/Footer or TableGroup's Header/Footer
 */
export default class TableSectionDesigner extends ReportXmlNodeDesigner {

    private readonly _rowsNode: Node;
    private readonly _rows: TableRow[] = [];
    public get Rows(): TableRow[] { return this._rows; }
    public readonly Table: TableDesigner;

    public get IsContainer(): boolean { return true; } //必须设为true
    public get Behavior(): DesignBehavior { return DesignBehavior.None; }

    private readonly _bounds: Rectangle = new Rectangle(0, 0, 0, 0); //每次重新计算，这里仅缓存
    public get Bounds(): Rectangle {
        //每次计算所得
        let offsetY = 0; //相对于表格
        for (const item of this.Table.Items) {
            const sec = item as TableSectionDesigner;
            if (sec === this) { break; }
            offsetY += sec.GetRowsHeight();
        }

        this._bounds.X = 0;
        this._bounds.Y = offsetY;
        this._bounds.Height = this.GetRowsHeight();
        this._bounds.Width = this.Table.Bounds.Width;
        return this._bounds;
    }
    protected SetBounds(x: number, y: number, width: number, height: number, specified: BoundsSpecified): void {
        console.warn("不允许设置TableSection的Bounds.");
    }

    constructor(owner: TableDesigner | TableGroup, node: Node) {
        super(node);
        if (owner instanceof TableDesigner) {
            this.Table = owner;
        } else {
            this.Table = owner.Owner.Table;
        }

        // 开始加载Rows
        this._rowsNode = XmlUtil.GetOrCreateChildNode(this.xmlNode, "TableRows");
        for (const cnode of this._rowsNode.childNodes) {
            this._rows.push(new TableRow(this, cnode));
        }
    }

    public GetRowsHeight(): number {
        let total = 0;
        for (const row of this._rows) {
            total += row.Height;
        }
        return total;
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

    //RepeatOnNewPage
    //============IPropertyOwner接口实现=====
    public getPropertyItems(): IPropertyCatalog[] | null {
        let cats = [];
        // 在表格内不返回Layout类别
        if (this.getPropertyOwnerType() !== "Details") {
            let items: IPropertyItem[] = [
                {
                    title: "RepeatOnNewPage", readonly: false, editor: "CheckBox",
                    getter: () => this.GetPropertyBool("RepeatOnNewPage", false),
                    setter: v => this.SetPropertyBool("RepeatOnNewPage", v)
                }
            ];
            cats.push({ name: "Common", items: items });
        }
        return cats;
    }
}