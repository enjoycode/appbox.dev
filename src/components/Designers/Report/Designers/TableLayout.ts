import TableDesigner from './TableDesigner';
import XmlUtil from './XmlUtil';
import TableSectionDesigner from './TableSectionDesigner';
import ReportItemDesigner from './ReportItemDesigner';
import TextboxDesigner from './TextboxDesigner';
import Rectangle from '@/components/Canvas/Drawing/Rectangle';
import ReportItemFactory from './ReportItemFactory';

export class TableColumn {

    private readonly _node: Node;
    public get Node(): Node { return this._node; }
    public readonly Owner: TableDesigner;

    private _width: number; //only for cache
    public get Width(): number { return this._width; }
    public set Width(value) {
        this._width = value; // 更新缓存
        let cnode = XmlUtil.GetOrCreateChildNode(this._node, "Width");
        let unit = XmlUtil.GetSizeUnit(cnode);
        let newSize = XmlUtil.PixelToSize(value, unit);
        cnode.textContent = newSize;
    }

    constructor(owner: TableDesigner, xmlNode: Node) {
        this.Owner = owner;
        this._node = xmlNode;
        this._width = XmlUtil.TryGetSize(this._node, "Width", 120);
    }

}

export class TableRow {

    private readonly _node: Node;
    public readonly Owner: TableSectionDesigner;

    private readonly _cellsNode: Node;
    private readonly _cells: TableCell[] = [];
    public get Cells(): TableCell[] { return this._cells; }

    private _height: number; //only for cache
    public get Height(): number { return this._height; }
    public set Height(value) {
        this._height = value; //更新缓存
        let cnode = XmlUtil.GetOrCreateChildNode(this._node, "Height");
        let unit = XmlUtil.GetSizeUnit(cnode);
        let newSize = XmlUtil.PixelToSize(value, unit);
        cnode.textContent = newSize;
    }

    constructor(owner: TableSectionDesigner, xmlNode: Node) {
        this.Owner = owner;
        this._node = xmlNode;
        this._height = XmlUtil.TryGetSize(this._node, "Height", 100);

        //开始加载Cells
        this._cellsNode = XmlUtil.GetOrCreateChildNode(this._node, "TableCells");
        for (const cellNode of this._cellsNode.childNodes) {
            this._cells.push(new TableCell(this, cellNode));
        }
    }

    private FindCellIndex(colIndex: number): number {
        let ci = 0;
        let pos = 0;
        for (let i = 0; i < this.Cells.length; i++) {
            const cell = this.Cells[i];
            if (ci === colIndex) {
                break;
            } else {
                pos++;
                ci += cell.ColSpan;
            }
        }
        return pos;
    }

    public InsertCell(colIndex: number) {
        let pos = this.FindCellIndex(colIndex);
        let cellNode = XmlUtil.CreateChildNode(this._cellsNode, "TableCell");
        let cell = new TableCell(this, cellNode);
        this._cells.splice(pos, 0, cell);
    }

    public DeleteCell(colIndex: number) {
        let pos = this.FindCellIndex(colIndex);
        this._cellsNode.removeChild(this._cells[pos].Node);
        this._cells.splice(pos, 1);
    }

    /**
     * 仅用于新建的Row初始化Cells
     */
    public InitCells(): void {
        for (const col of this.Owner.Table.Columns) {
            let cellNode = XmlUtil.CreateChildNode(this._cellsNode, "TableCell");
            let cell = new TableCell(this, cellNode);
            this._cells.push(cell);
        }
    }

    public Paint(g: CanvasRenderingContext2D, offsetY: number): void {
        let diffX = 0;
        for (const cell of this._cells) {
            cell.Paint(g, diffX, offsetY);
            g.translate(cell.LastWidth, 0);
            diffX += cell.LastWidth;
        }
        g.translate(-diffX, 0);
    }
}

export class TableCell {
    private readonly _node: Node;
    public get Node(): Node { return this._node; }
    private readonly _itemsNode: Node;
    public readonly Row: TableRow;
    private _target: ReportItemDesigner;
    public get Target(): ReportItemDesigner { return this._target; }

    public get ColSpan(): number { return 1; } //TODO: fix
    /** 计算获取当前单元格所对应的列序号 */
    public get ColIndex(): number {
        let colIndex = 0;
        for (let i = 0; i < this.Row.Cells.length; i++) {
            const cell = this.Row.Cells[i];
            if (cell === this) { break; }
            colIndex += cell.ColSpan;
        }
        return colIndex;
    }

    //以下LastXXX用于缓存，防止重复计算相对于Table边框的位置
    private _lastX: number;
    public get LastX(): number { return this._lastX; }
    private _lastY: number;
    public get LastY(): number { return this._lastY; }
    private _lastWidth: number;
    public get LastWidth(): number { return this._lastWidth; }

    constructor(owner: TableRow, node: Node) {
        this.Row = owner;
        this._node = node;

        //开始加载Cell内的ReportItems
        this._itemsNode = XmlUtil.GetOrCreateChildNode(this._node, "ReportItems");
        if (this._itemsNode.childNodes.length > 1) {
            console.warn("TableCell contains multi children: ", this._node);
        }
        if (this._itemsNode.childNodes.length === 0) { // 新建的直接初始化
            let cnode = XmlUtil.CreateChildNode(this._itemsNode, "Textbox");
            this._target = new TextboxDesigner(cnode, this);
            //不需要AddItem to parent(TableSectionDesigner)
        } else {
            for (const cnode of this._itemsNode.childNodes) {
                if (cnode.nodeType === Node.ELEMENT_NODE) {
                    this._target = ReportItemFactory.Make(cnode, this);
                    break;
                }
            }
        }
    }

    /**
     * 计算单元格内的ReportItem的Bounds，由ReportItemDesiginer.Bounds属性读调用
     */
    public CalcTargetBounds(bounds: Rectangle): void {
        let cols = this.Row.Owner.Table.Columns;
        this._lastWidth = 0;
        for (let i = 0; i < this.Row.Cells.length; i++) {
            if (this.Row.Cells[i] === this) {
                //TODO: 计算ColSpan
                this._lastWidth = cols[i].Width;
                break;
            }
        }
        //Do not use this._target.Bounds.XXX, dead loop
        bounds.X = 0;
        bounds.Y = 0;
        bounds.Width = this._lastWidth;
        bounds.Height = this.Row.Height;
    }

    public Paint(g: CanvasRenderingContext2D, offsetX: number, offsetY: number): void {
        this._lastX = offsetX;
        this._lastY = offsetY;
        if (this._target) { this._target.Paint(g); }
    }

    /**
     * 替换单元格内的ReportItem
     * @param target 转换Cell的目标实例
     */
    public ConvertTo(target: ReportItemDesigner): void {
        // TODO:
    }
}