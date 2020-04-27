import TableDesigner from './TableDesigner';
import XmlUtil from './XmlUtil';
import TableSectionDesigner from './TableSectionDesigner';
import ReportItemDesigner from './ReportItemDesigner';
import TextboxDesigner from './TextboxDesigner';
import Rectangle from '@/components/Canvas/Drawing/Rectangle';
import ReportItemFactory from './ReportItemFactory';
import Grouping from './Grouping';
import { IPropertyOwner, IPropertyCatalog } from '@/components/Canvas/Interfaces/IPropertyPanel';

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
        let cellNode = XmlUtil.CreateChildNode(this._cellsNode, "TableCell", colIndex);
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

export class TableGroup implements IPropertyOwner {

    private readonly _owner: TableGroups;
    public get Owner(): TableGroups { return this._owner; }
    private readonly _node: Node;
    public get Node(): Node { return this._node; }
    private _grouping: Grouping | null;

    public get Grouping(): Grouping {
        if (!this._grouping) {
            let gnode = XmlUtil.CreateChildNode(this._node, "Grouping");
            this._grouping = new Grouping(gnode);
        }
        return this._grouping;
    }

    public get Name(): string {
        if (!this._grouping) { return ""; }
        return this._grouping.Name;
    }
    public set Name(value) {
        this.Grouping.Name = value;
    }

    private _header: TableSectionDesigner | null = null;
    public get Header(): TableSectionDesigner | null { return this._header; }
    private _footer: TableSectionDesigner | null = null;
    public get Footer(): TableSectionDesigner | null { return this._footer; }

    constructor(owner: TableGroups, node: Node) {
        this._owner = owner;
        this._node = node;
        let gnode = XmlUtil.GetNamedChildNode(node, "Grouping");
        if (gnode) {
            this._grouping = new Grouping(gnode);
        }
        let hnode = XmlUtil.GetNamedChildNode(node, "Header");
        if (hnode) {
            this._header = new TableSectionDesigner(this, hnode);
        }
        let fnode = XmlUtil.GetNamedChildNode(node, "Footer");
        if (fnode) {
            this._footer = new TableSectionDesigner(this, fnode);
        }
    }

    private SetHeader(has: boolean): void {
        if (has) {
            if (!this._header) {
                let hnode = XmlUtil.CreateChildNode(this._node, "Header");
                this._header = new TableSectionDesigner(this, hnode);
                this.Owner.Table.AddGroupSection(this, true);
            }
        } else {
            if (this._header) {
                let hnode = XmlUtil.GetNamedChildNode(this._node, "Header");
                this._node.removeChild(hnode);
                this.Owner.Table.RemoveGroupSection(this, true);
                this._header = null;
            }
        }
    }
    private SetFooter(has: boolean): void {
        if (has) {
            if (!this._footer) {
                let hnode = XmlUtil.CreateChildNode(this._node, "Footer");
                this._footer = new TableSectionDesigner(this, hnode);
                this.Owner.Table.AddGroupSection(this, false);
            }
        } else {
            if (this._footer) {
                let hnode = XmlUtil.GetNamedChildNode(this._node, "Footer");
                this._node.removeChild(hnode);
                this.Owner.Table.RemoveGroupSection(this, false);
                this._footer = null;
            }
        }
    }

    //====IPropertyOwner====
    public getPropertyOwnerType(): string { return "Parameter"; }

    public getPropertyItems(): IPropertyCatalog[] {
        let cats: IPropertyCatalog[] = [
            {
                name: "Common",
                items: [
                    {
                        title: "Name", readonly: false, editor: "TextBox",
                        getter: () => this.Name,
                        setter: v => { this.Name = v; }
                    },
                    {
                        title: "Expression", readonly: false, editor: "TextBox",
                        getter: () => this.Grouping.Expression,
                        setter: v => { this.Grouping.Expression = v; }
                    },
                    {
                        title: "GroupHeader", readonly: false, editor: "CheckBox",
                        getter: () => this.Header !== null,
                        setter: v => { this.SetHeader(v); }
                    },
                    {
                        title: "GroupFooter", readonly: false, editor: "CheckBox",
                        getter: () => this.Footer !== null,
                        setter: v => { this.SetFooter(v); }
                    },
                ]
            }
        ]
        return cats;
    }

}

export class TableGroups {
    private readonly _table: TableDesigner;
    public get Table(): TableDesigner { return this._table; }
    private _node: Node; // TableGroups node of Report

    private readonly _items: TableGroup[] = [];
    public get Items(): TableGroup[] { return this._items; }

    constructor(table: TableDesigner) {
        this._table = table;
        this._node = XmlUtil.GetNamedChildNode(table.XmlNode, "TableGroups");
        if (this._node) {
            for (const cnode of this._node.childNodes) {
                if (cnode.nodeType !== Node.ELEMENT_NODE) { continue; }
                this._items.push(new TableGroup(this, cnode));
            }
        }
    }

    public Add(name: string): void {
        //TODO: check name exists
        if (!this._node) {
            this._node = XmlUtil.CreateChildNode(this._table.XmlNode, "TableGroups");
        }
        let cnode = XmlUtil.CreateChildNode(this._node, "TableGroup");
        let ds = new TableGroup(this, cnode);
        ds.Name = name;
        this._items.push(ds);
    }

    public Remove(item: TableGroup): void {
        //TODO: 检查是否有引用
        this._node.removeChild(item.Node);
        this._items.splice(this._items.indexOf(item), 1);
        if (this._items.length === 0) {
            this._table.XmlNode.removeChild(this._node);
            this._node = null;
        }
        //如果有GroupHeader or GroupFooter需要通知Table移除相应的Section
        if (item.Header) {
            this.Table.RemoveGroupSection(item, true);
        }
        if (item.Footer) {
            this.Table.RemoveGroupSection(item, false);
        }
    }

    /**
     * 获取所有DataSet的名称集合，用于属性面板绑定
     */
    public GetNames(): string[] {
        let res: string[] = [];
        for (const ds of this._items) {
            res.push(ds.Name);
        }
        return res;
    }
}