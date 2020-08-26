import { ITableBody, IReportItem, ITableCellContainer, ITableCell, IGrouping, ILeafIndices } from './IReportObject';
import { Table, TableGroup, TableGroups, TableCellContainer } from './IReportObject';
import TableDesigner from './TableDesigner';
import RSizeUtil from './RSizeUtil';
import Size from '@/components/Canvas/Drawing/Size';
import Rectangle from '@/components/Canvas/Drawing/Rectangle';
import ReportToolbox from '../ReportToolbox';

const DefaultItemRWidth = "100pt";
const DefaultItemRHeight = "20pt";

/**
 * Base class for TableLayout's Row & Column
 */
abstract class TableMember {

    public readonly Index: number;
    private size: number;
    public get Size(): number { return this.size; }
    public set Size(value) {
        this.size = value;
        if (this.tableLayout) {
            this.tableLayout.UpdateTableAndContentSize();
        }
    }
    public TableRatio: number;
    private tableLayout: TableLayout | null;
    public get TableLayout(): TableLayout { return this.tableLayout; }

    constructor(index: number, owner: TableLayout, size: number) {
        this.Index = index;
        this.tableLayout = owner;
        this.size = size;
    }

    protected abstract GetCells(): Cell[];

    public SetSizeCore(size: number) { this.size = size; }
}

export class Column extends TableMember {
    public get Cells(): Cell[] {
        let list: Cell[] = [];
        for (let i = 0; i < this.TableLayout.Rows.length; i++) {
            list.push(this.TableLayout.Rows[i].Cells[this.Index]);
        }
        return list;
    }

    protected GetCells(): Cell[] { return this.Cells; }
}

export class Row extends TableMember {
    public readonly Cells: Cell[] = [];

    constructor(index: number, owner: TableLayout, size: number) {
        super(index, owner, size);
        for (let i = 0; i < owner.Columns.length; i++) {
            this.Cells.push(new Cell(owner, index, i));
        }
    }

    protected GetCells(): Cell[] { return this.Cells; }
}

export class Cell {
    public readonly TableLayout: TableLayout;
    public readonly RowIndex: number;
    public readonly ColIndex: number;
    public ReportItem: IReportItem | null;

    private rowSpan: number;
    public get RowSpan(): number { return this.rowSpan; }
    private colSpan: number;
    public get ColSpan(): number { return this.colSpan; }
    private mergeTarget: Cell | null;
    public get MergeTarget(): Cell | null { return this.mergeTarget; }
    private readonly bounds: Rectangle = new Rectangle(0, 0, 0, 0);
    public get Bounds(): Rectangle { return this.bounds; } //TODO: return clone?
    public set Bounds(value: Rectangle) {
        if (!this.bounds.EqualsTo(value)) {
            this.bounds.CopyFrom(value);
            if (!this.mergeTarget && this.ReportItem) {
                let itemWidth = RSizeUtil.SizeToPixel(this.ReportItem.Width);
                let itemHeight = RSizeUtil.SizeToPixel(this.ReportItem.Height);
                if (itemWidth !== this.bounds.Width || itemHeight !== this.bounds.Height) {
                    this.ReportItem.Width = this.bounds.Width.toString() + "pt"; //TODO:单位转换
                    this.ReportItem.Height = this.bounds.Height.toString() + "pt"; //TODO:单位转换
                }
            }
        }
    }

    public RowGroup: TableGroup | null;
    public ColumnGroup: TableGroup | null;

    constructor(tableLayout: TableLayout, rowIndex: number, colIndex: number) {
        this.TableLayout = tableLayout;
        this.RowIndex = rowIndex;
        this.ColIndex = colIndex;
    }

    public Merge(rows: number, columns: number): void {
        this.rowSpan = rows;
        this.colSpan = columns;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                let cell = this.TableLayout.CellAt(this.RowIndex + i, this.ColIndex + j);
                if (cell !== this) {
                    cell.mergeTarget = this;
                }
            }
        }
    }
}

export enum SelectionMode { Replace, Append }
export enum InsertPosition { Before, After }
export enum GroupPosition { Inside, Outside }

type WalkCallback = (group: TableGroup, level: number, index: number, length: number) => void;
type CalcSpanCallback = (group: TableGroup, level: number) => number;

interface IRectangularSelection {
    firstColumnIndex: number;
    lastColumnIndex: number;
    firstRowIndex: number;
    lastRowIndex: number;
}

export class TableLayout {
    private readonly owner: TableDesigner;
    public get Owner(): TableDesigner { return this.owner; }
    public readonly Table: Table;
    public get Body(): ITableBody { return this.Table.Body; }
    public get Corner(): ITableCellContainer { return this.Table.Corner; }
    public readonly Rows: Row[] = [];
    public readonly Columns: Column[] = [];

    private readonly cells: Map<IReportItem, Cell>;
    private readonly selectedCells: Cell[] = [];

    private bodyRowCount = 0;
    private bodyColumnCount = 0;
    private columnHeaderRowCount = 0;
    public get CornerRowCount(): number { return this.columnHeaderRowCount; }
    private rowHeaderColumnCount = 0;
    public get CornerColumnCount(): number { return this.rowHeaderColumnCount; }
    private layoutSuspendCount = 0;

    constructor(owner: TableDesigner) {
        this.owner = owner;
        this.Table = new Table(this, this.owner.Node);
        this.cells = new Map<IReportItem, Cell>();
    }

    /**
     * 初始化新建的Table
     */
    public InitNewTable(width: number, height: number) {
        let colWidth = Math.round(width / 3).toString() + "pt"; //TODO:单位转换
        let rowHeight = Math.round(height / 2).toString() + "pt"; //TODO:单位转换
        //Body
        for (let i = 0; i < 3; i++) {
            this.Table.Body.Cells.push({
                RowIndex: 0, ColumnIndex: i, RowSpan: 1, ColumnSpan: 1, ReportItem: { $T: "TextBox" }
            });
            this.Table.Body.Columns.push({ Width: colWidth });
        }
        this.Table.Body.Rows.push({ Height: rowHeight });
        //Row Groups
        this.Table.RowGroups.Add(new TableGroup({ Name: "detailGroup", Groupings: [{}] }));
        //Column Groups
        for (let i = 0; i < 3; i++) {
            this.Table.ColumnGroups.Add(new TableGroup({ ReportItem: { $T: "TextBox", "Height": rowHeight } }));
        }
    }

    private Init(): void {
        this.SuspendLayout();

        try {
            let leafRowGroups = TableGroup.GetLeafGroups(this.Table.RowGroups);
            let leafColumnGroups = TableGroup.GetLeafGroups(this.Table.ColumnGroups);

            let bodyRows: number[] = [];
            let bodyColumns: number[] = [];
            if (TableLayout.InitBodyRowsColumns(this.Body,
                leafRowGroups.length, leafColumnGroups.length, bodyRows, bodyColumns)) {
                this.Body.Rows.splice(0, this.Body.Rows.length);
                for (let i = 0; i < bodyRows.length; i++) {
                    this.Body.Rows.push({ Height: bodyRows[i].toString() + "pt" }); //TODO:单位转换
                }

                this.Body.Columns.splice(0, this.Body.Columns.length);
                for (let i = 0; i < bodyColumns.length; i++) {
                    this.Body.Columns.push({ Width: bodyColumns[i].toString() + "pt" }); //TODO:单位转换
                }
            }

            this.bodyColumnCount = leafColumnGroups.length;
            this.bodyRowCount = leafRowGroups.length;

            let columnDistances = TableLayout.CalculateDistanceList(this.Table.ColumnGroups, true, false);
            let columnHeaderRows: number[] = [];
            for (let i = 0; i < columnDistances.length; i++) {
                let size = i === 0 ? columnDistances[0] : (columnDistances[i] - columnDistances[i - 1]);
                columnHeaderRows.push(size);
            }
            this.columnHeaderRowCount = columnHeaderRows.length;

            let rowDistances = TableLayout.CalculateDistanceList(this.Table.RowGroups, false, false);
            let rowHeaderColumns: number[] = [];
            for (let i = 0; i < rowDistances.length; i++) {
                let size = 0 == i ? rowDistances[0] : (rowDistances[i] - rowDistances[i - 1]);
                rowHeaderColumns.push(size);
            }
            this.rowHeaderColumnCount = rowHeaderColumns.length;

            for (let i = 0; i < this.rowHeaderColumnCount; i++) {
                this.Columns.push(new Column(i, this, rowHeaderColumns[i]));
            }
            for (let i = 0; i < this.bodyColumnCount; i++) {
                this.Columns.push(new Column(this.rowHeaderColumnCount + i, this,
                    RSizeUtil.SizeToPixel(this.Body.Columns[i].Width)));
            }
            for (let i = 0; i < this.columnHeaderRowCount; i++) {
                this.Rows.push(new Row(i, this, columnHeaderRows[i]));
            }
            for (let i = 0; i < this.bodyRowCount; i++) {
                this.Rows.push(new Row(this.columnHeaderRowCount + i, this,
                    RSizeUtil.SizeToPixel(this.Body.Rows[i].Height)));
            }

            if (this.CornerRowCount > 0 && this.CornerColumnCount > 0) {
                for (let i = 0; i < this.CornerRowCount; i++) {
                    for (let j = 0; j < this.CornerColumnCount; j++) {
                        let cornerCell = TableCellContainer.GetCellAt(this.Corner, i, j);
                        this.SetCell(this.CellAt(i, j), cornerCell.RowSpan, cornerCell.ColumnSpan
                            , cornerCell.ReportItem, null, null);
                    }
                }
            }

            TableLayout.WalkHierarchy(this.Table.ColumnGroups, this.rowHeaderColumnCount, 0
                , (group, level, index, length) => this.AddColumnGroup(group, level, index, length)
                , (group, level) => this.RowSpanOfColumnGroup(group, level));
            TableLayout.WalkHierarchy(this.Table.RowGroups, this.columnHeaderRowCount, 0
                , (group, level, index, length) => this.AddRowGroup(group, level, index, length)
                , (group, level) => this.ColumnSpanOfRowHeader(group, level));

            for (let i = 0; i < this.bodyRowCount; i++) {
                for (let j = 0; j < this.bodyColumnCount; j++) {
                    let tableCell = TableCellContainer.GetCellAt(this.Body, i, j);
                    this.SetCell(this.CellAt(this.columnHeaderRowCount + i, this.rowHeaderColumnCount + j)
                        , tableCell.RowSpan, tableCell.ColumnSpan, tableCell.ReportItem
                        , leafRowGroups[i], leafColumnGroups[j]);
                }
            }

            this.UpdateTableAndContentSize();
        } finally {
            this.ResumeLayout();
        }
    }

    public UpdateTableAndContentSize(): void {
        let tableSize = this.CalcTableSizeFromContent();
        this.UpdateRowsAndColumnsRatio(tableSize);
        this.Table.Width = tableSize.Width.toString() + "pt"; //TODO:单位转换
        this.Table.Height = tableSize.Height.toString() + "pt"; //TODO:单位转换
        this.owner.Bounds.Width = tableSize.Width;
        this.owner.Bounds.Height = tableSize.Height;
        this.LayoutContent();
    }

    private UpdateRowsAndColumnsRatio(newTableSize: Size) {
        if (newTableSize.Width === 0) {
            let ratio = 1 / this.Columns.length;
            this.Columns.forEach(c => c.TableRatio = ratio);
        } else {
            this.Columns.forEach(c => c.TableRatio = c.Size / newTableSize.Width);
        }

        if (newTableSize.Height === 0) {
            let ratio = 1 / this.Rows.length;
            this.Rows.forEach(r => r.TableRatio = ratio);
        } else {
            this.Rows.forEach(r => r.TableRatio = r.Size / newTableSize.Height);
        }
    }

    private CalcTableSizeFromContent(): Size {
        let width = 0;
        for (let i = 0; i < this.Columns.length; i++) {
            width += this.Columns[i].Size;
        }

        let height = 0;
        for (let i = 0; i < this.Rows.length; i++) {
            height += this.Rows[i].Size;
        }
        return { Width: width, Height: height };
    }

    private LayoutContent(): void {
        this.SuspendLayout();

        let tableWidth = RSizeUtil.SizeToPixel(this.Table.Width);
        for (let i = 0; i < this.Columns.length; i++) {
            const col = this.Columns[i];
            col.SetSizeCore(tableWidth * col.TableRatio);

            let j = i - this.rowHeaderColumnCount;
            if (j >= 0) {
                this.Body.Columns[j].Width = col.Size.toString() + "pt"; //TODO:单位转换
            }
        }

        let tableHeight = RSizeUtil.SizeToPixel(this.Table.Height);
        for (let i = 0; i < this.Rows.length; i++) {
            const row = this.Rows[i];
            row.SetSizeCore(tableHeight * row.TableRatio);

            let j = i - this.columnHeaderRowCount;
            if (j >= 0) {
                this.Body.Rows[j].Height = row.Size.toString() + "pt"; //TODO:单位转换
            }
        }

        let y = 0;
        for (let i = 0; i < this.Rows.length; i++) {
            let x = 0;
            const row = this.Rows[i];
            for (let j = 0; j < this.Columns.length; j++) {
                const col = this.Columns[j];
                let cell = this.CellAt(i, j);
                let bounds = new Rectangle(0, 0, 0, 0);
                if (!cell.MergeTarget) {
                    let width = 0;
                    for (let k = 0; k < cell.ColSpan; k++) {
                        width += this.Columns[j + k].Size;
                    }

                    let height = 0;
                    for (let k = 0; k < cell.RowSpan; k++) {
                        height += this.Rows[i + k].Size;
                    }

                    bounds = new Rectangle(x, y, width, height);
                }
                cell.Bounds = bounds;
                x += col.Size;
            }
            y += row.Size;
        }

        this.ResumeLayout();
    }

    private AddColumnGroup(group: TableGroup, rowIndex: number, colIndex: number, colSpan: number) {
        group.ColumnIndex = colIndex;
        group.RowIndex = rowIndex;
        group.ColumnSpan = colSpan;
        group.RowSpan = 1;

        this.SetCell(this.CellAt(rowIndex, colIndex), this.RowSpanOfColumnGroup(group, rowIndex)
            , colSpan, group.ReportItem, null, group);
    }

    private AddRowGroup(group: TableGroup, colIndex: number, rowIndex: number, rowSpan: number) {
        group.ColumnIndex = colIndex;
        group.RowIndex = rowIndex;
        group.ColumnSpan = 1;
        group.RowSpan = rowSpan;

        this.SetCell(this.CellAt(rowIndex, colIndex), rowSpan, this.ColumnSpanOfRowHeader(group, colIndex)
            , group.ReportItem, group, null);
    }

    private RowSpanOfColumnGroup(group: TableGroup, startRowIndex: number): number {
        if (!group.ReportItem) {
            throw new Error("No header for this group.");
        }

        let h = RSizeUtil.SizeToPixel(group.ReportItem.Height);
        let i = startRowIndex;
        while (i < this.columnHeaderRowCount) {
            let rowHeight = this.Rows[i++].Size;
            if (h <= rowHeight) { break; }
            h -= rowHeight;
        }
        return i - startRowIndex;
    }

    private ColumnSpanOfRowHeader(group: TableGroup, startColumnIndex: number): number {
        if (!group.ReportItem) {
            throw new Error("No header for this group.");
        }

        let w = RSizeUtil.SizeToPixel(group.ReportItem.Width);
        let i = startColumnIndex;
        while (i < this.rowHeaderColumnCount) {
            let columnWidth = this.Columns[i++].Size;
            if (w <= columnWidth) { break; }
            w -= columnWidth;
        }
        return i - startColumnIndex;
    }

    private SetCell(layoutCell: Cell, rowSpan: number, colSpan: number
        , reportItem: IReportItem, rowGroup: TableGroup | null, columnGroup: TableGroup | null): void {
        layoutCell.Merge(rowSpan, colSpan);
        layoutCell.ReportItem = reportItem;
        layoutCell.RowGroup = rowGroup;
        layoutCell.ColumnGroup = columnGroup;
        if (reportItem) {
            this.cells.set(reportItem, layoutCell);
        }
    }

    private SuspendLayout(): void {
        this.layoutSuspendCount++;
    }
    private ResumeLayout(): void {
        if (this.layoutSuspendCount > 0) { this.layoutSuspendCount--; }
    }
    private PerformLayout(): void {
        if (this.layoutSuspendCount === 0) {
            this.Refresh();
        }
    }

    public Refresh(): void {
        this.Rows.splice(0, this.Rows.length);
        this.Columns.splice(0, this.Columns.length);
        this.cells.clear();
        if (this.owner.Items) {
            this.owner.Items.splice(0, this.owner.Items.length);
        }

        this.Init();

        for (let i = 0; i < this.Rows.length; i++) {
            for (const c of this.Rows[i].Cells) {
                if (c.ReportItem) {
                    let designer = ReportToolbox.Make(c.ReportItem);
                    // designer.Bounds.CopyFrom(c.Bounds);
                    this.owner.AddItem(designer);
                }
            }
        }
    }

    //====Get Methods====
    public GetCell(reportItem: IReportItem): Cell | undefined {
        return this.cells.get(reportItem);
    }
    public CellAt(rowIndex: number, colIndex: number): Cell {
        return this.Rows[rowIndex].Cells[colIndex];
    }
    private ColumnGroupAt(rowIndex: number, colIndex: number): TableGroup {
        let cell = this.CellAt(rowIndex, colIndex);
        if (cell.MergeTarget) { cell = cell.MergeTarget; }
        return cell.ColumnGroup;
    }
    private RowGroupAt(rowIndex: number, colIndex: number): TableGroup {
        let cell = this.CellAt(rowIndex, colIndex);
        if (cell.MergeTarget) { cell = cell.MergeTarget; }
        return cell.RowGroup;
    }

    //====IsXXXX Methods====
    private IsBodyRow(rowIndex: number): boolean {
        return rowIndex >= this.columnHeaderRowCount;
    }
    private IsBodyColumn(colIndex: number): boolean {
        return colIndex >= this.rowHeaderColumnCount;
    }
    private IsColumnHeaderCell(rowIndex: number, colIndex: number): boolean {
        return rowIndex < this.columnHeaderRowCount && colIndex >= this.rowHeaderColumnCount;
    }
    private IsRowHeaderCell(rowIndex: number, colIndex: number): boolean {
        return rowIndex >= this.columnHeaderRowCount && colIndex < this.rowHeaderColumnCount;
    }
    private IsBodyCell(rowIndex: number, colIndex: number): boolean {
        return this.IsBodyRow(rowIndex) && this.IsBodyColumn(colIndex);
    }
    private IsCornerCell(rowIndex: number, colIndex: number): boolean {
        return rowIndex < this.columnHeaderRowCount && colIndex < this.rowHeaderColumnCount;
    }

    //====Selection Methods====
    private GetRectangularSelection(ss: IRectangularSelection): boolean {
        ss.firstColumnIndex = ss.firstRowIndex = Number.MAX_SAFE_INTEGER;
        ss.lastColumnIndex = ss.lastRowIndex = -1;

        let selectedCells = this.GetSelectedCells();
        for (const cell of selectedCells) {
            ss.firstColumnIndex = Math.min(cell.ColIndex, ss.firstColumnIndex);
            ss.firstRowIndex = Math.min(cell.RowIndex, ss.firstRowIndex);

            ss.lastColumnIndex = Math.max(cell.ColIndex + cell.ColSpan - 1, ss.lastColumnIndex);
            ss.lastRowIndex = Math.max(cell.RowIndex + cell.RowSpan - 1, ss.lastRowIndex);
        }

        if (ss.lastColumnIndex == -1) {
            return false;
        }

        for (let rowIndex = ss.firstRowIndex; rowIndex <= ss.lastRowIndex; rowIndex++) {
            for (var columnIndex = ss.firstColumnIndex; columnIndex <= ss.lastColumnIndex; columnIndex++) {
                var cell = this.CellAt(rowIndex, columnIndex);
                if (!this.IsCellSelected(cell)) {
                    return false;
                }
            }
        }
        return true;
    }

    private GetFirstSelectedColumn(): number {
        for (let i = 0; i < this.Columns.length; i++) {
            if (this.IsColumnOrCellSelected(this.Columns[i])) {
                return i;
            }
        }
        return -1;
    }

    private GetLastSelectedColumn(): number {
        for (let i = this.Columns.length - 1; i >= 0; i--) {
            if (this.IsColumnOrCellSelected(this.Columns[i])) {
                return i;
            }
        }
        return -1;
    }

    private GetFirstSelectedRow(): number {
        for (let i = 0; i < this.Rows.length; i++) {
            if (this.IsRowOrCellSelected(this.Rows[i])) {
                return i;
            }
        }
        return -1;
    }

    private GetLastSelectedRow(): number {
        for (let i = this.Rows.length - 1; i >= 0; i--) {
            if (this.IsRowOrCellSelected(this.Rows[i])) {
                return i;
            }
        }
        return -1;
    }

    private IsCellSelected(cell: Cell): boolean {
        if (cell.MergeTarget) {
            return this.IsCellSelected(cell.MergeTarget);
        }

        for (let i = this.selectedCells.length - 1; i >= 0; i--) {
            const element = this.selectedCells[i];
            if (element.RowIndex === cell.RowIndex && element.ColIndex === cell.ColIndex) {
                return true;
            }
        }
        return false;
    }

    private IsRowOrCellSelected(row: Row): boolean {
        for (const cell of row.Cells) {
            if (this.IsCellSelected(cell)) {
                return true;
            }
        }
        return false;
    }

    private IsColumnOrCellSelected(column: Column): boolean {
        for (const cell of column.Cells) {
            if (this.IsCellSelected(cell)) {
                return true;
            }
        }
        return false;
    }

    public SelectSingleCell(rowIndex: number, columnIndex: number, selectionMode: SelectionMode) {
        let cellsToSelect: Cell[] = [];
        cellsToSelect.push(this.CellAt(rowIndex, columnIndex));

        if (selectionMode === SelectionMode.Append) {
            cellsToSelect = cellsToSelect.concat(this.selectedCells);
        }
        this.SetSelectedCells(cellsToSelect);
    }

    public SetSelectedCells(list: Cell[] | null) {
        this.selectedCells.splice(0, this.selectedCells.length);

        if (list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                let cell = list[i];
                if (cell.MergeTarget) {
                    cell = cell.MergeTarget;
                }
                if (!cell.ReportItem) {
                    throw new Error("Cannot select a cell with no report item.");
                }
                if (this.selectedCells.indexOf(cell) < 0) {
                    this.selectedCells.push(cell);
                }
            }
        }
    }

    private GetSelectedCells(): Cell[] {
        let cells: Cell[] = [];
        for (let i = 0; i < this.Rows.length; i++) {
            for (let j = 0; j < this.Columns.length; j++) {
                let cell = this.CellAt(i, j);
                if (!cell.MergeTarget && this.IsCellSelected(cell)) {
                    cells.push(cell);
                }
            }
        }
        return cells;
    }

    private FindRowGroupForCell(rowIndex: number, columnIndex: number): TableGroup | null {
        if (this.IsRowHeaderCell(rowIndex, columnIndex)) {
            return this.FindRowGroupForRowHeaderCell(rowIndex, columnIndex);
        }
        if (this.IsBodyCell(rowIndex, columnIndex)) {
            let groups = TableGroup.GetLeafGroups(this.Table.RowGroups);
            return groups[rowIndex - this.columnHeaderRowCount];
        }
        return null;
    }

    private FindColumnGroupForCell(rowIndex: number, columnIndex: number): TableGroup | null {
        if (this.IsColumnHeaderCell(rowIndex, columnIndex)) {
            return this.FindColumnGroupForColumnHeaderCell(rowIndex, columnIndex);
        }
        if (this.IsBodyCell(rowIndex, columnIndex)) {
            let groups = TableGroup.GetLeafGroups(this.Table.ColumnGroups);
            return groups[columnIndex - this.rowHeaderColumnCount];
        }
        return null;
    }

    private FindRowGroupForRowHeaderCell(rowIndex: number, columnIndex: number): TableGroup {
        let cell = this.CellAt(rowIndex, columnIndex);
        if (cell.MergeTarget) { cell = cell.MergeTarget; }
        return cell.RowGroup;
    }

    private FindColumnGroupForColumnHeaderCell(rowIndex: number, columnIndex: number): TableGroup {
        let cell = this.CellAt(rowIndex, columnIndex);
        if (cell.MergeTarget) { cell = cell.MergeTarget; }
        return cell.ColumnGroup;
    }

    private GetReferenceGroupForNewRowOrColumn(referenceGroup: TableGroup
        , insertPos: InsertPosition, groupPos: GroupPosition): TableGroup {
        let outsideGroup = groupPos === GroupPosition.Outside;
        let before = insertPos === InsertPosition.Before;

        if (referenceGroup.IsDynamic()) {
            if (outsideGroup) {
                outsideGroup = false;
            } else if (referenceGroup.ChildGroups.Count > 0) {
                referenceGroup = before ? referenceGroup.ChildGroups.At(0)
                    : referenceGroup.ChildGroups.At(referenceGroup.ChildGroups.Count - 1);
            } else {
                let group = new TableGroup({ Name: this.CreateUniqueGroupName("Group") });
                referenceGroup.ChildGroups.Add(group);
                referenceGroup = group;
            }
        }

        while (true) {
            let parent = referenceGroup.Parent;
            if (!parent) { return referenceGroup; }
            if (before) {
                if (parent.ChildGroups.At(0) !== referenceGroup) {
                    return referenceGroup;
                }
            } else if (parent.ChildGroups.At(parent.ChildGroups.Count - 1) !== referenceGroup) {
                return referenceGroup;
            }
            if (parent.IsDynamic()) {
                if (!outsideGroup) { return referenceGroup; }
                outsideGroup = false;
            }
            referenceGroup = parent;
        }
    }

    //====IndexOf Methods====
    private RowIndexOfColumnGroup(group: TableGroup): number {
        let y = 0;
        while (group.Parent) {
            group = group.Parent;
            if (group.ReportItem) {
                y += RSizeUtil.SizeToPixel(group.ReportItem.Height);
            }
        }

        let h = 0;
        for (let i = 0; i < this.columnHeaderRowCount; i++) {
            if (h === y) { return i; }
            h += this.Rows[i].Size;
        }

        return this.columnHeaderRowCount;
    }

    private ColumnIndexOfRowGroup(group: TableGroup): number {
        let x = 0;
        while (group.Parent) {
            group = group.Parent;
            if (group.ReportItem) {
                x += RSizeUtil.SizeToPixel(group.ReportItem.Width);
            }
        }

        let w = 0;
        for (let i = 0; i < this.rowHeaderColumnCount; i++) {
            if (x === w) { return i; }
            w += this.Columns[i].Size;
        }

        return this.rowHeaderColumnCount;
    }

    //====Insert Row & Column Methods====
    public InsertRow(insertPos: InsertPosition, groupPos: GroupPosition) {
        this.SuspendLayout();

        let rowIndex = insertPos == InsertPosition.Before
            ? this.GetFirstSelectedRow() : this.GetLastSelectedRow();

        if (rowIndex < this.columnHeaderRowCount) {
            this.InsertRowInColumnHeader(rowIndex, insertPos, groupPos, rowIndex);
        } else {
            let colIndex = this.GetLastSelectedColumn();
            let group = this.FindRowGroupForCell(rowIndex, colIndex);
            group = this.GetReferenceGroupForNewRowOrColumn(group, insertPos, groupPos);
            this.InsertBodyRow(group, insertPos);
        }

        this.ResumeLayout();
        this.PerformLayout();
    }

    public InsertColumn(insertPos: InsertPosition, groupPos: GroupPosition) {
        this.SuspendLayout();

        let colIndex = insertPos === InsertPosition.Before
            ? this.GetFirstSelectedColumn() : this.GetLastSelectedColumn();

        if (colIndex < this.rowHeaderColumnCount) {
            this.InsertColumnInRowHeader(colIndex, insertPos, groupPos, colIndex);
        } else {
            let rowIndex = this.GetLastSelectedRow();
            let group = this.FindColumnGroupForCell(rowIndex, colIndex);
            group = this.GetReferenceGroupForNewRowOrColumn(group, insertPos, groupPos);
            this.InsertBodyColumn(group, insertPos);
        }

        this.ResumeLayout();
        this.PerformLayout();
    }

    private InsertRowInColumnHeader(rowIndex: number, insertPos: InsertPosition
        , groupPos: GroupPosition, formattingRowIndex: number) {
        if (insertPos === InsertPosition.After) { rowIndex++; }

        let insertDistance = 0;
        for (let i = 0; i < rowIndex; i++) {
            insertDistance += this.Rows[i].Size;
        }

        this.InsertRowOrColumnInHeader(this.Table.ColumnGroups, insertPos, groupPos
            , insertDistance, true, 0);
        this.InsertRowAt(this.Corner, rowIndex, this.rowHeaderColumnCount
            , formattingRowIndex, 0);

        this.PerformLayout();
    }

    private InsertColumnInRowHeader(columnIndex: number, insertPos: InsertPosition
        , groupPos: GroupPosition, formattingColumnIndex: number) {
        if (insertPos == InsertPosition.After) { columnIndex++; }

        let insertDistance = 0;
        for (let i = 0; i < columnIndex; i++) {
            insertDistance += this.Columns[i].Size;
        }

        this.InsertRowOrColumnInHeader(this.Table.RowGroups, insertPos, groupPos
            , insertDistance, false, 0);
        this.InsertColumnAt(this.Corner, columnIndex, this.columnHeaderRowCount
            , formattingColumnIndex, 0);

        this.PerformLayout();
    }

    private InsertRowOrColumnInHeader(hierarchy: TableGroups, insertPos: InsertPosition
        , groupPos: GroupPosition, insertDistance: number, isColumnGroup: boolean, startDistance: number) {
        if (insertDistance === 0) {
            this.InsertGroupsAboveDescendandHeaders(
                isColumnGroup ? this.Table.ColumnGroups : this.Table.RowGroups
                , insertPos, groupPos);
        }
        else {
            this.InsertRowOrColumnInHeaderCore(hierarchy, insertPos, groupPos
                , insertDistance, isColumnGroup, startDistance);
        }
    }

    private InsertRowOrColumnInHeaderCore(hierarchy: TableGroups, insertPos: InsertPosition
        , groupPos: GroupPosition, insertDistance: number, isColumnGroup: boolean, startDistance: number) {
        for (let i = 0; i < hierarchy.Count; i++) {
            let group = hierarchy.At(i);
            let dist = startDistance;
            let item = group.ReportItem;
            if (item) {
                let size = isColumnGroup ? RSizeUtil.SizeToPixel(item.Height) : RSizeUtil.SizeToPixel(item.Width);
                let pos = startDistance + size;
                if (pos === insertDistance) {
                    this.InsertGroupsAboveDescendandHeaders(group.ChildGroups, InsertPosition.Before
                        , insertPos == InsertPosition.After ? GroupPosition.Outside : groupPos);
                    continue;
                }

                if (pos > insertDistance) {
                    if (isColumnGroup) {
                        item.Height = RSizeUtil.AddSize(item.Height, DefaultItemRHeight);
                    } else {
                        item.Width = RSizeUtil.AddSize(item.Width, DefaultItemRWidth);
                    }
                    continue;
                }

                dist = pos;
            }

            this.InsertRowOrColumnInHeader(group.ChildGroups, insertPos, groupPos
                , insertDistance, isColumnGroup, dist);
        }
    }

    private InsertGroupsAboveDescendandHeaders(groups: TableGroups
        , insertPos: InsertPosition, groupPos: GroupPosition) {
        if (groups.Count === 0) {
            groups.Add(this.NewGroup({ $T: "TextBox" }));
            return;
        }

        for (let i = 0; i < groups.Count; i++) {
            let group1 = groups.At(i);
            let refItem: IReportItem = group1.ReportItem ? group1.ReportItem : { $T: "TextBox" };
            let newGroup = this.NewGroup(refItem);

            if (insertPos === InsertPosition.Before) {
                if (groupPos === GroupPosition.Outside) {
                    let childGroups = TableGroup.GetParentCollection(group1);
                    let index = childGroups.IndexOf(group1);
                    childGroups.RemoveAt(index);
                    childGroups.Insert(index, newGroup);

                    newGroup.ChildGroups.Add(group1);
                } else {
                    let groupsToMove = new Array<TableGroup>(group1.ChildGroups.Count);
                    group1.ChildGroups.CopyTo(groupsToMove, 0);

                    for (let j = 0; j < groupsToMove.length; j++) {
                        let childGroup = groupsToMove[j];
                        group1.ChildGroups.Remove(childGroup);
                        newGroup.ChildGroups.Add(childGroup);
                    }

                    group1.ChildGroups.Add(newGroup);
                    TableGroup.SwapContent(group1, newGroup);
                }
            } else {
                let groupsToMove = new Array<TableGroup>(group1.ChildGroups.Count);
                group1.ChildGroups.CopyTo(groupsToMove, 0);

                for (let j = 0; j < groupsToMove.length; j++) {
                    let childGroup = groupsToMove[j];
                    group1.ChildGroups.Remove(childGroup);
                    newGroup.ChildGroups.Add(childGroup);
                }

                group1.ChildGroups.Add(newGroup);
            }
        }
    }

    private InsertRowAt(container: ITableCellContainer, rowIndex: number, containerColumnCount: number
        , referenceRowIndex: number, containerColumnIndex: number) {
        let cellsToInsert: ITableCell[] = [];
        for (let i = 0; i < containerColumnCount; i++) {
            let cell = container.Cells.find(c => c.ColumnIndex == i && c.RowIndex < rowIndex
                && rowIndex <= c.RowIndex + c.RowSpan - 1);
            if (!cell) {
                let item: IReportItem = { $T: "TextBox" };
                var columnIndex = containerColumnIndex + i;
                item.Width = this.Columns[columnIndex].Size.toString() + "pt"; //TODO:单位转换
                item.Height = DefaultItemRHeight;

                if (referenceRowIndex >= 0) {
                    let refCell = this.CellAt(referenceRowIndex, columnIndex);
                    if (refCell.MergeTarget) {
                        refCell = refCell.MergeTarget;
                    }
                    if (refCell.ReportItem) {
                        TableLayout.CopyStyle(refCell.ReportItem, item);
                    }
                }

                //this.Table.AddItem(item);
                let tableCell: ITableCell = {
                    RowIndex: rowIndex, ColumnIndex: i, RowSpan: 1, ColumnSpan: 1, ReportItem: item
                };
                cellsToInsert.push(tableCell);
            }
        }

        for (const cell of container.Cells) {
            if (cell.RowIndex >= rowIndex) {
                cell.RowIndex++;
            } else if ((cell.RowIndex + cell.RowSpan - 1) >= rowIndex) {
                cell.RowSpan++;
            }
        }

        for (const cell of cellsToInsert) {
            container.Cells.push(cell);
        }
    }

    private InsertColumnAt(container: ITableCellContainer, columnIndex: number, containerRowCount: number
        , referenceColumnIndex: number, containerRowIndex: number) {
        let cellsToInsert: ITableCell[] = [];
        for (let i = 0; i < containerRowCount; i++) {
            let cell = container.Cells.find(c => c.RowIndex == i && c.ColumnIndex < columnIndex
                && columnIndex <= c.ColumnIndex + c.ColumnSpan - 1);
            if (!cell) {
                let item: IReportItem = { $T: "TextBox" };
                let rowIndex = containerRowIndex + i;
                item.Width = DefaultItemRWidth;
                item.Height = this.Rows[rowIndex].Size.toString() + "pt"; //TODO:单位转换

                if (referenceColumnIndex >= 0) {
                    let refCell = this.CellAt(rowIndex, referenceColumnIndex);
                    if (refCell.MergeTarget) {
                        refCell = refCell.MergeTarget;
                    }
                    if (refCell.ReportItem) {
                        TableLayout.CopyStyle(refCell.ReportItem, item);
                    }
                }

                //this.Table.AddItem(item);
                let tableCell: ITableCell = {
                    RowIndex: i, ColumnIndex: columnIndex, RowSpan: 1, ColumnSpan: 1, ReportItem: item
                };
                cellsToInsert.push(tableCell);
            }
        }

        for (const cell of container.Cells) {
            if (cell.ColumnIndex >= columnIndex) {
                cell.ColumnIndex++;
            } else if ((cell.ColumnIndex + cell.ColumnSpan - 1) >= columnIndex) {
                cell.ColumnSpan++;
            }
        }

        for (const cell of cellsToInsert) {
            container.Cells.push(cell);
        }
    }

    private InsertBodyRow(referenceGroup: TableGroup, insertPos: InsertPosition): number {
        let index = this.InsertRowOrColumn(this.Table.RowGroups, referenceGroup, insertPos, false);
        this.InsertRowAt(this.Body, index, this.bodyColumnCount
            , this.columnHeaderRowCount + (insertPos === InsertPosition.Before ? index : index - 1)
            , this.rowHeaderColumnCount);

        this.Body.Rows.splice(index, 0, { Height: DefaultItemRHeight });
        this.PerformLayout();
        return this.columnHeaderRowCount + index;
    }

    private InsertBodyColumn(referenceGroup: TableGroup, insertPos: InsertPosition): number {
        let index = this.InsertRowOrColumn(this.Table.ColumnGroups, referenceGroup, insertPos, true);
        this.InsertColumnAt(this.Body, index, this.bodyRowCount
            , this.rowHeaderColumnCount + (insertPos == InsertPosition.Before ? index : index - 1)
            , this.columnHeaderRowCount);

        this.Body.Columns.splice(index, 0, { Width: DefaultItemRWidth });
        this.PerformLayout();
        return this.rowHeaderColumnCount + index;
    }

    private InsertRowOrColumn(hierarchy: TableGroups, referenceGroup: TableGroup
        , insertPos: InsertPosition, isColumnGroup: boolean): number {
        let groups = TableGroup.GetParentCollection(referenceGroup);
        let position = groups.IndexOf(referenceGroup);
        if (insertPos === InsertPosition.After) {
            position += 1;
        }

        let newGroup: TableGroup;
        while (referenceGroup) {
            newGroup = this.NewGroup(referenceGroup.ReportItem);
            if (newGroup.ReportItem) {
                if (isColumnGroup) {
                    newGroup.ReportItem.Height = referenceGroup.ReportItem.Height;
                } else {
                    newGroup.ReportItem.Width = referenceGroup.ReportItem.Width;
                }
            }

            groups.Insert(position, newGroup);
            groups = newGroup.ChildGroups;
            position = 0;

            if (referenceGroup.ChildGroups.Count > 0) {
                referenceGroup = referenceGroup.ChildGroups.At(0);
            }
            else {
                referenceGroup = null;
            }
        }

        return TableGroup.GetLeafGroups(hierarchy).indexOf(newGroup);
    }

    //====Delete Row & Column Methods====
    public DeleteRows(deleteRelatedGroups: boolean) {
        let rows: number[] = [];
        for (let i = this.Rows.length - 1; i >= 0; i--) {
            if (this.IsRowOrCellSelected(this.Rows[i])) {
                rows.push(i);
            }
        }

        let remainingBodyRows = this.Rows.length - this.columnHeaderRowCount;
        for (let i = 0; i < rows.length; i++) {
            if (rows[i] >= this.columnHeaderRowCount) {
                remainingBodyRows--;
            }
        }
        if (remainingBodyRows <= 0) {
            throw new Error("Table body must contain at least one row.");
        }

        for (let i = 0; i < rows.length; i++) {
            this.SuspendLayout();

            let rowIndex = rows[i];
            if (rowIndex < this.columnHeaderRowCount) {
                this.DeleteColumnHeaderRow(rowIndex, deleteRelatedGroups);
            } else {
                this.DeleteBodyRow(rowIndex, deleteRelatedGroups);
            }

            this.ResumeLayout();
            this.PerformLayout();
        }
    }

    public DeleteColumns(deleteRelatedGroups: boolean) {
        let columns: number[] = [];
        for (let i = this.Columns.length - 1; i >= 0; i--) {
            if (this.IsColumnOrCellSelected(this.Columns[i])) {
                columns.push(i);
            }
        }

        let remainingBodyColumns = this.Columns.length - this.rowHeaderColumnCount;
        for (let i = 0; i < columns.length; i++) {
            if (columns[i] >= this.rowHeaderColumnCount) {
                remainingBodyColumns--;
            }
        }
        if (remainingBodyColumns <= 0) {
            throw new Error("Table body must contain at least one column.");
        }

        for (let i = 0; i < columns.length; i++) {
            this.SuspendLayout();

            let columnIndex = columns[i];
            if (columnIndex < this.rowHeaderColumnCount) {
                this.DeleteRowHeaderColumn(columnIndex, deleteRelatedGroups);
            } else {
                this.DeleteBodyColumn(columnIndex, deleteRelatedGroups);
            }

            this.ResumeLayout();
            this.PerformLayout();
        }
    }

    private DeleteBodyRow(rowIndex: number, deleteRelatedGroups: boolean) {
        let dynamicGroups: TableGroup[] = [];
        for (let i = 0; i < this.rowHeaderColumnCount; i++) {
            let cell = this.CellAt(rowIndex, i);
            if (!cell.MergeTarget && cell.RowGroup.IsDynamic()) {
                dynamicGroups.push(cell.RowGroup);
            }
        }

        if (dynamicGroups.length > 0 && !deleteRelatedGroups) {
            return;
        }

        for (let i = 0; i < dynamicGroups.length; i++) {
            TableGroup.DeleteDynamicGroup(dynamicGroups[i]);
        }

        let hierarchy = this.Table.RowGroups;
        let leafGroups = TableGroup.GetLeafGroups(hierarchy);
        let group = leafGroups[rowIndex - this.columnHeaderRowCount];
        let childGroups: TableGroups = null;
        do {
            if (group.Parent) {
                childGroups = group.Parent.ChildGroups;
                if (childGroups.Count > 1) {
                    break;
                }

                group = group.Parent;
            } else {
                childGroups = hierarchy;
                break;
            }
        } while (group);

        childGroups.Remove(group);
        group.ReportItem = null;
        TableGroup.Visit(group.ChildGroups, 0, (group1, index, level) => {
            group1.ReportItem = null;
            return false;
        });

        let distances = TableLayout.CalculateDistanceList(hierarchy, false, false);
        for (let i = this.rowHeaderColumnCount - 1; i >= distances.length; i--) {
            this.DeleteCellsAtColumn(this.Corner, i);
        }

        this.Table.Body.Rows.splice(rowIndex - this.columnHeaderRowCount, 1);
        this.DeleteRowAt(rowIndex);
    }

    private DeleteBodyColumn(columnIndex: number, deleteRelatedGroups: boolean) {
        let dynamicGroups: TableGroup[] = [];
        for (let i = 0; i < this.columnHeaderRowCount; i++) {
            let cell = this.CellAt(i, columnIndex);
            if (!cell.MergeTarget && cell.ColumnGroup.IsDynamic()) {
                dynamicGroups.push(cell.ColumnGroup);
            }
        }

        if (dynamicGroups.length > 0 && !deleteRelatedGroups) {
            return;
        }

        for (let i = 0; i < dynamicGroups.length; i++) {
            TableGroup.DeleteDynamicGroup(dynamicGroups[i]);
        }

        let hierarchy = this.Table.ColumnGroups;
        let leafGroups = TableGroup.GetLeafGroups(hierarchy);
        let group = leafGroups[columnIndex - this.rowHeaderColumnCount];

        let childGroups: TableGroups = null;
        do {
            if (group.Parent) {
                childGroups = group.Parent.ChildGroups;
                if (childGroups.Count > 1) {
                    break;
                }

                group = group.Parent;
            } else {
                childGroups = hierarchy;
                break;
            }
        } while (group);

        childGroups.Remove(group);
        group.ReportItem = null;
        TableGroup.Visit(group.ChildGroups, 0, (group1, index, level) => {
            group1.ReportItem = null;
            return false;
        });

        let distances = TableLayout.CalculateDistanceList(hierarchy, true, false);
        for (let i = this.columnHeaderRowCount - 1; i >= distances.length; i--) {
            this.DeleteCellsAtRow(this.Corner, i);
        }

        this.Table.Body.Columns.splice(columnIndex - this.rowHeaderColumnCount, 1);
        this.DeleteColumnAt(columnIndex);
    }

    private DeleteColumnHeaderRow(rowIndex: number, deleteRelatedGroups: boolean) {
        let dynamicGroups: TableGroup[] = [];
        for (let i = this.rowHeaderColumnCount; i < this.Columns.length; i++) {
            let cell = this.CellAt(rowIndex, i);
            if (!cell.MergeTarget && cell.RowSpan <= 1) {
                let group = this.FindColumnGroupForColumnHeaderCell(rowIndex, i);
                if (group.IsDynamic()) {
                    dynamicGroups.push(group);
                }
            }
        }

        if (dynamicGroups.length > 0 && !deleteRelatedGroups) {
            return;
        }

        let groupsToDelete: TableGroup[] = [];
        for (let i = this.rowHeaderColumnCount; i < this.Columns.length; i++) {
            let cell = this.CellAt(rowIndex, i);
            if (cell.MergeTarget) {
                cell = cell.MergeTarget;
            }

            let group = cell.ColumnGroup;
            if (cell.RowSpan > 1) {
                if (group.ReportItem) {
                    group.ReportItem.Height = RSizeUtil.SubtractSize(
                        group.ReportItem.Height, this.Rows[rowIndex].Size.toString() + "pt");
                }
            } else {
                group.ReportItem = null;

                if (deleteRelatedGroups) {
                    TableGroup.DeleteDynamicGroup(group);
                    if (group.ChildGroups.Count > 0 && groupsToDelete.indexOf(group) < 0) {
                        groupsToDelete.push(group);
                    }
                }
            }
        }

        for (let i = 0; i < groupsToDelete.length; i++) {
            let group1 = groupsToDelete[i];

            let parentGroups: TableGroups = null;
            if (group1.Parent != null) {
                parentGroups = group1.Parent.ChildGroups;
            } else {
                parentGroups = this.Table.ColumnGroups;
            }

            let index = parentGroups.IndexOf(group1);
            parentGroups.RemoveAt(index);

            for (let j = group1.ChildGroups.Count - 1; j >= 0; j--) {
                parentGroups.Insert(index, group1.ChildGroups.At(j));
            }
        }

        this.DeleteRowAt(rowIndex);
    }

    private DeleteRowHeaderColumn(columnIndex: number, deleteRelatedGroups: boolean) {
        let dynamicGroups: TableGroup[] = [];
        for (let i = this.columnHeaderRowCount; i < this.Rows.length; i++) {
            let cell = this.CellAt(i, columnIndex);
            if (!cell.MergeTarget && cell.ColSpan <= 1) {
                let group = this.FindRowGroupForRowHeaderCell(i, columnIndex);
                if (group.IsDynamic()) {
                    dynamicGroups.push(group);
                }
            }
        }

        if (dynamicGroups.length > 0 && !deleteRelatedGroups) {
            return;
        }

        let groupsToDelete: TableGroup[] = [];
        for (let i = this.columnHeaderRowCount; i < this.Rows.length; i++) {
            let cell = this.CellAt(i, columnIndex);
            if (cell.MergeTarget) {
                cell = cell.MergeTarget;
            }

            let group = cell.RowGroup;
            if (cell.ColSpan > 1) {
                if (group.ReportItem) {
                    group.ReportItem.Width = RSizeUtil.SubtractSize(
                        group.ReportItem.Width, this.Columns[columnIndex].Size.toString() + "pt");
                }
            } else {
                group.ReportItem = null;

                if (deleteRelatedGroups) {
                    TableGroup.DeleteDynamicGroup(group);
                    if (group.ChildGroups.Count > 0 && groupsToDelete.indexOf(group) < 0) {
                        groupsToDelete.push(group);
                    }
                }
            }
        }

        for (let i = 0; i < groupsToDelete.length; i++) {
            let group1 = groupsToDelete[i];

            let parentGroups: TableGroups = null;
            if (group1.Parent != null) {
                parentGroups = group1.Parent.ChildGroups;
            }
            else {
                parentGroups = this.Table.RowGroups;
            }

            let index = parentGroups.IndexOf(group1);
            parentGroups.RemoveAt(index);

            for (let j = group1.ChildGroups.Count - 1; j >= 0; j--) {
                parentGroups.Insert(index, group1.ChildGroups.At(j));
            }
        }

        this.DeleteColumnAt(columnIndex);
    }

    private DeleteRowAt(rowIndex: number) {
        let row = this.Rows[rowIndex];
        for (let i = 0; i < row.Cells.length; i++) {
            let cell = row.Cells[i];
            if (cell.RowSpan <= 1) {
                if (cell.ReportItem) {
                    cell.ReportItem = null;
                }
            }
        }

        if (rowIndex < this.columnHeaderRowCount) {
            this.DeleteCellsAtRow(this.Corner, rowIndex);
        } else {
            rowIndex -= this.columnHeaderRowCount;
            if (0 <= rowIndex && rowIndex < this.bodyRowCount) {
                this.DeleteCellsAtRow(this.Body, rowIndex);
            }
        }
    }

    private DeleteColumnAt(columnIndex: number) {
        let column = this.Columns[columnIndex];
        let cells = column.Cells;
        for (const cell of cells) {
            let cell1 = cell;
            if (cell.MergeTarget) {
                cell1 = cell.MergeTarget;
            }

            if (cell1.ColSpan <= 1) {
                if (cell1.ReportItem) {
                    cell1.ReportItem = null;
                }
            }
        }

        if (columnIndex < this.rowHeaderColumnCount) {
            if (0 <= columnIndex && columnIndex < this.CornerColumnCount) {
                this.DeleteCellsAtColumn(this.Corner, columnIndex);
            }
        } else {
            columnIndex -= this.rowHeaderColumnCount;
            if (0 <= columnIndex && columnIndex < this.bodyColumnCount) {
                this.DeleteCellsAtColumn(this.Body, columnIndex);
            }
        }
    }

    private DeleteCellsAtRow(container: ITableCellContainer, rowIndex: number) {
        for (let i = container.Cells.length - 1; i >= 0; i--) {
            let cell = container.Cells[i];
            if (cell.RowIndex <= rowIndex) {
                if (cell.RowIndex + cell.RowSpan > rowIndex) {
                    if (cell.RowSpan > 1) {
                        cell.RowSpan--;
                    } else {
                        container.Cells.splice(i, 1);
                        cell.ReportItem = null;
                    }
                }
            } else {
                cell.RowIndex--;
            }
        }
    }

    private DeleteCellsAtColumn(container: ITableCellContainer, columnIndex: number) {
        for (let i = container.Cells.length - 1; i >= 0; i--) {
            let cell = container.Cells[i];
            if (cell.ColumnIndex <= columnIndex) {
                if (cell.ColumnIndex + cell.ColumnSpan > columnIndex) {
                    if (cell.ColumnSpan > 1) {
                        cell.ColumnSpan--;
                    } else {
                        container.Cells.splice(i, 1);
                        cell.ReportItem = null;
                    }
                }
            } else {
                cell.ColumnIndex--;
            }
        }
    }

    //====Merge Cells Methods====
    public MergeSelectedCells() {
        if (!this.CanMergeSelectedCells()) { return; }

        this.SuspendLayout();

        let ss: IRectangularSelection = {
            firstColumnIndex: 0, lastColumnIndex: 0, firstRowIndex: 0, lastRowIndex: 0
        };
        this.GetRectangularSelection(ss);

        let columnCount = ss.lastColumnIndex - ss.firstColumnIndex + 1;
        let rowCount = ss.lastRowIndex - ss.firstRowIndex + 1;
        let cell = this.CellAt(ss.firstRowIndex, ss.firstColumnIndex);

        if (this.IsRowHeaderCell(cell.RowIndex, cell.ColIndex)) {
            this.MergeHeaderCells(false, ss.firstColumnIndex, ss.firstRowIndex, columnCount, rowCount);
        } else if (this.IsColumnHeaderCell(cell.RowIndex, cell.ColIndex)) {
            this.MergeHeaderCells(true, ss.firstColumnIndex, ss.firstRowIndex, columnCount, rowCount);
        } else {
            this.MergeCells(cell, rowCount, columnCount);
        }

        this.ResumeLayout();
        this.PerformLayout();
    }

    private CanMergeSelectedCells(): boolean {
        let ss: IRectangularSelection = {
            firstColumnIndex: 0, lastColumnIndex: 0, firstRowIndex: 0, lastRowIndex: 0
        };
        if (!this.GetRectangularSelection(ss)) {
            return false;
        }

        return this.CanMergeSelectedCellsAt(ss.firstColumnIndex, ss.lastColumnIndex
            , ss.firstRowIndex, ss.lastRowIndex);
    }

    private CanMergeSelectedCellsAt(firstColumnIndex: number, lastColumnIndex: number
        , firstRowIndex: number, lastRowIndex: number): boolean {
        let selectedColumns = 0;
        let selectedRows = 0;
        let span = 0;
        for (let i = firstColumnIndex; i <= lastColumnIndex; i += Math.max(1, span)) {
            selectedColumns++;
            span = this.CellAt(firstRowIndex, i).ColSpan;
        }

        for (let i = firstRowIndex; i <= lastRowIndex; i += Math.max(1, span)) {
            selectedRows++;
            span = this.CellAt(i, firstColumnIndex).RowSpan;
        }

        if (selectedRows < 2 && selectedColumns < 2) {
            return false;
        }

        let firstCell = this.CellAt(firstRowIndex, firstColumnIndex);
        let lastCell = this.CellAt(lastRowIndex, lastColumnIndex);

        if (this.IsCornerCell(firstCell.RowIndex, firstCell.ColIndex)) {
            if (!this.IsCornerCell(lastCell.RowIndex, lastCell.ColIndex)) {
                return false;
            }

            if (selectedColumns <= 1) {
                return selectedRows > 1;
            }
            return true;
        }

        if (this.IsBodyCell(firstCell.RowIndex, firstCell.ColIndex)) {
            return this.CanMergeBodyColumnCells(firstColumnIndex, lastColumnIndex) &&
                this.CanMergeBodyRowCells(firstRowIndex, lastRowIndex);
        }

        if (this.IsRowHeaderCell(firstCell.RowIndex, firstCell.ColIndex)) {
            return this.CanMergeRowHeaderCells(firstColumnIndex, lastColumnIndex
                , firstRowIndex, lastRowIndex);
        }

        if (this.IsColumnHeaderCell(firstCell.RowIndex, firstCell.ColIndex)) {
            return this.CanMergeColumnHeaderCells(firstColumnIndex, lastColumnIndex
                , firstRowIndex, lastRowIndex);
        }

        return false;
    }

    private CanMergeRowHeaderCells(left: number, right: number, top: number, bottom: number): boolean {
        if (right >= this.rowHeaderColumnCount) {
            return false;
        }

        let rows = 0;
        let columns = 0;
        for (var i = left; i <= right; i += this.CellAt(top, i).ColSpan) {
            columns++;
        }
        for (var i = top; i <= bottom; i += this.CellAt(i, left).RowSpan) {
            rows++;
        }

        let cell: Cell = null;

        if (rows === 1 && columns > 1) {
            let rowGroup1: TableGroup = null;
            for (let i = left; i <= right; i += cell.ColSpan) {
                cell = this.CellAt(top, i);
                let group = cell.RowGroup;
                if (group.IsDynamic()) {
                    if (rowGroup1) {
                        return false;
                    }
                    rowGroup1 = group;
                }

                if (i + cell.ColSpan - 1 < right && group.ChildGroups.Count != 1) {
                    return false;
                }
            }
            return true;
        }

        if (columns != 1 && rows <= 1) {
            return false;
        }

        let parent: TableGroup = null;
        let rowGroup: TableGroup = null;
        for (let i = top; i <= bottom; i += cell.RowSpan) {
            cell = this.CellAt(i, left);
            let group = cell.RowGroup;
            if (!parent) {
                parent = group.Parent;
            } else if (parent !== group.Parent) {
                return false;
            }

            if (group.IsDynamic()) {
                if (rowGroup) {
                    return false;
                }
                rowGroup = group;
            }
        }

        return true;
    }

    private CanMergeColumnHeaderCells(left: number, right: number, top: number, bottom: number): boolean {
        if (bottom >= this.columnHeaderRowCount) {
            return false;
        }

        let rows = 0;
        let columns = 0;
        for (let i = left; i <= right; i += this.CellAt(top, i).ColSpan) {
            columns++;
        }
        for (let i = top; i <= bottom; i += this.CellAt(i, left).RowSpan) {
            rows++;
        }

        let cell: Cell = null;
        if (columns === 1 && rows > 1) {
            let columnGroup1: TableGroup = null;
            for (let i = top; i <= bottom; i += cell.RowSpan) {
                cell = this.CellAt(i, left);
                let group = cell.ColumnGroup;
                if (group.IsDynamic()) {
                    if (columnGroup1) {
                        return false;
                    }
                    columnGroup1 = group;
                }
                if (i + cell.RowSpan < bottom && group.ChildGroups.Count != 1) {
                    return false;
                }
            }
            return true;
        }

        if (rows !== 1 && columns <= 1) {
            return false;
        }

        let parent: TableGroup = null;
        let columnGroup: TableGroup = null;
        for (let i = left; i <= right; i += cell.ColSpan) {
            cell = this.CellAt(top, i);
            let group = cell.ColumnGroup;
            if (!parent) {
                parent = group.Parent;
            } else if (parent !== group.Parent) {
                return false;
            }

            if (group.IsDynamic()) {
                if (columnGroup) {
                    return false;
                }
                columnGroup = group;
            }
        }

        return true;
    }

    private CanMergeBodyColumnCells(leftColumn: number, rightColumn: number): boolean {
        let leafGroups = TableGroup.GetLeafGroups(this.Table.ColumnGroups);
        let group1 = TableGroup.FindDynamicAncestorOrSelf(leafGroups[leftColumn - this.rowHeaderColumnCount]);
        for (let i = leftColumn + 1; i <= rightColumn; i++) {
            let group2 = TableGroup.FindDynamicAncestorOrSelf(leafGroups[i - this.rowHeaderColumnCount]);
            if (group1 !== group2) {
                return false;
            }
        }
        return true;
    }

    private CanMergeBodyRowCells(topRow: number, bottomRow: number): boolean {
        let leafGroups = TableGroup.GetLeafGroups(this.Table.RowGroups);
        let group1 = TableGroup.FindDynamicAncestorOrSelf(leafGroups[topRow - this.columnHeaderRowCount]);
        for (let i = topRow + 1; i <= bottomRow; i++) {
            let group2 = TableGroup.FindDynamicAncestorOrSelf(leafGroups[i - this.columnHeaderRowCount]);
            if (group1 !== group2) {
                return false;
            }
        }
        return true;
    }

    private MergeHeaderCells(isColumnHeader: boolean, left: number, top: number, width: number, height: number) {
        let bottom = top + height - 1;
        let right = left + width - 1;
        let cellsX = 0;
        let cellsY = 0;

        for (let i = left; i <= right; i += this.CellAt(top, i).ColSpan) {
            cellsX++;
        }
        for (let i = top; i <= bottom; i += this.CellAt(i, left).RowSpan) {
            cellsY++;
        }

        if (isColumnHeader ? (cellsX == 1) : (cellsY == 1)) {
            this.MergeHeaderCellsAlongHierarchy(isColumnHeader, left, top, width, height);
        } else {
            this.MergeSiblingHeaderCells(isColumnHeader, left, top, width, height);
        }
    }

    private MergeHeaderCellsAlongHierarchy(isColumnGroup: boolean
        , left: number, top: number, width: number, height: number) {
        let right = left + width - 1;
        let bottom = top + height - 1;

        let start: TableGroup = null;
        let end: TableGroup = null;

        if (isColumnGroup) {
            start = this.ColumnGroupAt(top, left);
            end = this.ColumnGroupAt(bottom, left);
        } else {
            start = this.RowGroupAt(top, left);
            end = this.RowGroupAt(top, right);
        }

        let mergerTarget = start;
        while (mergerTarget !== end) {
            if (mergerTarget.IsDynamic() && mergerTarget.ReportItem) {
                break;
            }
            mergerTarget = mergerTarget.ChildGroups.At(0);
        }

        if (!(mergerTarget.IsDynamic() && mergerTarget.ReportItem)) {
            mergerTarget = start;
        }

        let g = start;
        while (g) {
            let next = g.ChildGroups.Count > 0 ? g.ChildGroups.At(0) : null;
            if (g !== mergerTarget) {
                TableGroup.PromoteChildrenAndRemoveGroup(g);

                let item = g.ReportItem;
                if (item) {
                    if (isColumnGroup) {
                        mergerTarget.ReportItem.Height = RSizeUtil.AddSize(mergerTarget.ReportItem.Height, item.Height);
                    } else {
                        mergerTarget.ReportItem.Width = RSizeUtil.AddSize(mergerTarget.ReportItem.Width, item.Width);
                    }
                }

                g.ReportItem = null;
            }

            if (g === end) { break; }
            g = next;
        }

        if (isColumnGroup) {
            let distances = TableLayout.CalculateDistanceList(this.Table.ColumnGroups, true, false);
            if (this.columnHeaderRowCount !== distances.length) {
                for (let i = bottom; i >= top + 1; i--) {
                    this.DeleteCellsAtRow(this.Corner, i);
                }
            }
        } else {
            let distances = TableLayout.CalculateDistanceList(this.Table.RowGroups, false, false);
            if (this.rowHeaderColumnCount !== distances.length) {
                for (let i = right; i >= left + 1; i--) {
                    this.DeleteCellsAtColumn(this.Corner, i);
                }
            }
        }
    }

    private MergeSiblingHeaderCells(isColumnHeader: boolean
        , left: number, top: number, width: number, height: number) {
        let right = left + width - 1;
        let bottom = top + height - 1;

        let cell = this.CellAt(top, left);
        let group: TableGroup = isColumnHeader ? cell.ColumnGroup : cell.RowGroup;
        let parentChildGroups = TableGroup.GetParentCollection(group);

        let mergeTarget: TableGroup = null;
        let groupsToMerge: TableGroup[] = [];

        if (isColumnHeader) {
            let c: Cell = null;
            for (let i = left; i <= right; i += c.ColSpan) {
                c = this.CellAt(top, i);
                let group2 = c.ColumnGroup;
                groupsToMerge.push(group2);
                if (group2.IsDynamic()) {
                    mergeTarget = group2;
                }
            }
        } else {
            let c: Cell = null;
            for (let i = top; i <= bottom; i += c.RowSpan) {
                c = this.CellAt(i, left);
                let group2 = c.RowGroup;
                groupsToMerge.push(group2);
                if (group2.IsDynamic()) {
                    mergeTarget = group2;
                }
            }
        }

        if (!mergeTarget) {
            mergeTarget = group;
        }

        let newGroup = new TableGroup({ Name: this.CreateUniqueGroupName("Group") });

        for (let i = mergeTarget.ChildGroups.Count - 1; i >= 0; i--) {
            let g1 = mergeTarget.ChildGroups.At(i);
            mergeTarget.ChildGroups.RemoveAt(i);
            newGroup.ChildGroups.Insert(0, g1);
        }

        let x = groupsToMerge.indexOf(mergeTarget);
        groupsToMerge[x] = newGroup;

        for (let i = 0; i < groupsToMerge.length; i++) {
            let g1 = groupsToMerge[i];
            let parentGroups = TableGroup.GetParentCollection(g1);
            if (parentGroups) {
                parentGroups.Remove(g1);
                g1.ReportItem = null;
            }

            if (g1.ChildGroups.Count > 0) {
                let pos1 = mergeTarget.ChildGroups.Count;
                for (let j = g1.ChildGroups.Count - 1; j >= 0; j--) {
                    let child1 = g1.ChildGroups.At(j);
                    g1.ChildGroups.RemoveAt(j);

                    mergeTarget.ChildGroups.Insert(pos1, child1);
                }
            } else {
                mergeTarget.ChildGroups.Add(g1);
            }
        }
    }

    private MergeCells(location: Cell, rowCount: number, columnCount: number) {
        let isCornerCell = this.IsCornerCell(location.RowIndex, location.ColIndex);
        let cellContainer: ITableCellContainer = isCornerCell ? this.Corner : this.Body;
        let rowIndex = isCornerCell ? location.RowIndex : location.RowIndex - this.columnHeaderRowCount;
        let columnIndex = isCornerCell ? location.ColIndex : location.ColIndex - this.rowHeaderColumnCount;

        let cellsToRemove = cellContainer.Cells.filter(c => rowIndex <= c.RowIndex
            && c.RowIndex < (rowIndex + rowCount) && columnIndex <= c.ColumnIndex
            && c.ColumnIndex < (columnIndex + columnCount));

        let item = TableCellContainer.GetCellAt(cellContainer, rowIndex, columnIndex).ReportItem;

        for (let i = cellsToRemove.length - 1; i >= 0; i--) {
            let cell = cellsToRemove[i];
            cellContainer.Cells.splice(cellContainer.Cells.indexOf(cell), 1);
            if (cell.ReportItem && cell.ReportItem !== item) {
                cell.ReportItem = null;
            }
        }

        TableCellContainer.SetCellContent(cellContainer, rowIndex, columnIndex, item, rowCount, columnCount);
    }

    //====Split Cells Methods====
    public SplitSelectedCells() {
        if (!this.CanSplitSelectedCells()) { return; }

        this.SuspendLayout();
        try {
            let selectedCells = this.GetSelectedCells();
            for (const cell of selectedCells) {
                if (this.IsRowHeaderCell(cell.RowIndex, cell.ColIndex)) {
                    this.SplitHeaderCell(cell, false);
                } else if (this.IsColumnHeaderCell(cell.RowIndex, cell.ColIndex)) {
                    this.SplitHeaderCell(cell, true);
                } else {
                    this.SplitCell(cell);
                }
            }
        } finally {
            this.ResumeLayout();
            this.PerformLayout();
        }
    }

    private CanSplitSelectedCells(): boolean {
        let spanned = false;
        let selectedCells = this.GetSelectedCells();
        for (const cell of selectedCells) {
            spanned = cell.RowSpan > 1 || cell.ColSpan > 1;
            if (spanned) {
                if (this.IsRowHeaderCell(cell.RowIndex, cell.ColIndex)) {
                    spanned = this.CanSplitGroupHeaderCell(cell, false);
                } else if (this.IsColumnHeaderCell(cell.RowIndex, cell.ColIndex)) {
                    spanned = this.CanSplitGroupHeaderCell(cell, true);
                }
            }
            if (!spanned) {
                return false;
            }
        }
        return spanned;
    }

    private CanSplitGroupHeaderCell(cell: Cell, isColumnHeader: boolean): boolean {
        let group = isColumnHeader ? cell.ColumnGroup : cell.RowGroup;
        if (!group) { return false; }
        if (group.ChildGroups.Count > 1) { return true; }
        return isColumnHeader ? cell.RowSpan > 1 : cell.ColSpan > 1;
    }

    private SplitHeaderCell(cell: Cell, isColumnHeader: boolean) {
        let splitGroup = isColumnHeader ? cell.ColumnGroup : cell.RowGroup;
        if (splitGroup.ChildGroups.Count > 1) {
            this.SplitGroupAcrossHierarchy(splitGroup, isColumnHeader, cell);
        } else {
            this.SplitGroupAlongHierarchy(splitGroup, isColumnHeader, cell);
        }
    }

    private SplitGroupAcrossHierarchy(splitGroup: TableGroup, isColumnHeader: boolean, cell: Cell) {
        let colIndex = cell.ColIndex;
        let rowIndex = cell.RowIndex;

        let colWidth = this.Columns[colIndex].Size;
        let rowHeight = this.Rows[rowIndex].Size;

        let group1 = splitGroup;
        if (splitGroup.IsDynamic()) {
            let item = splitGroup.ReportItem;
            splitGroup.ReportItem = null;
            group1 = this.CreateNewStaticGroupUnder(splitGroup, item);
        }

        let parentGroups = TableGroup.GetParentCollection(group1);
        let index = parentGroups.IndexOf(group1);
        let groups = new Array<TableGroup>(group1.ChildGroups.Count);
        group1.ChildGroups.CopyTo(groups, 0);
        for (let i = 0; i < groups.length; i++) {
            if (i === 0) {
                if (isColumnHeader) {
                    group1.ReportItem.Width = colWidth.toString() + "pt"; //TODO:单位转换
                } else {
                    group1.ReportItem.Height = rowHeight.toString() + "pt"; //TODO:单位转换
                }
            } else {
                let rwidth = group1.ReportItem.Width;
                let rheight = group1.ReportItem.Height;
                if (isColumnHeader) {
                    rwidth = this.Columns[colIndex + i].Size.toString() + "pt";//TODO:单位转换
                } else {
                    rheight = this.Rows[rowIndex + i].Size.toString() + "pt"; //TODO:单位转换
                }

                let newGroup = new TableGroup({});
                newGroup.Name = this.CreateUniqueGroupName("Group");
                newGroup.ReportItem = { $T: "TextBox" };

                TableLayout.CopyStyle(group1.ReportItem, newGroup.ReportItem);

                newGroup.ReportItem.Width = rwidth;
                newGroup.ReportItem.Height = rheight;

                parentGroups.Insert(index + i, newGroup);

                let childGroup = groups[i];
                group1.ChildGroups.Remove(childGroup);
                newGroup.ChildGroups.Add(childGroup);
            }
        }
    }

    private SplitGroupAlongHierarchy(splitGroup: TableGroup, isColumnHeader: boolean, cell: Cell) {
        let span = isColumnHeader ? cell.RowSpan : cell.ColSpan;
        for (let i = span - 1; i >= 0; i--) {
            let item: IReportItem = null;
            if (i === 0) {
                item = splitGroup.ReportItem;
            } else {
                item = this.CreateNewStaticGroupUnder(splitGroup, { $T: "TextBox" }).ReportItem;
                TableLayout.CopyStyle(splitGroup.ReportItem, item);
            }

            if (isColumnHeader) {
                item.Height = this.Rows[cell.RowIndex + i].Size.toString() + "pt"; //TODO:单位转换
            } else {
                item.Width = this.Columns[cell.ColIndex + i].Size.toString() + "pt"; //TODO:单位转换
            }
        }
    }

    private SplitCell(splitCell: Cell) {
        let isCornerCell = this.IsCornerCell(splitCell.RowIndex, splitCell.ColIndex);
        let cellContainer: ITableCellContainer = isCornerCell ? this.Corner : this.Body;
        let rowIndex = isCornerCell ? splitCell.RowIndex : splitCell.RowIndex - this.columnHeaderRowCount;
        let columnIndex = isCornerCell ? splitCell.ColIndex : splitCell.ColIndex - this.rowHeaderColumnCount;

        let cell = TableCellContainer.GetCellAt(cellContainer, rowIndex, columnIndex);
        let rowSpan = cell.RowSpan;
        let colSpan = cell.ColumnSpan;
        let item = cell.ReportItem;

        cellContainer.Cells.splice(cellContainer.Cells.indexOf(cell), 1);

        item.Width = "0" + RSizeUtil.GetSizeUnit(item.Width);
        item.Height = "0" + RSizeUtil.GetSizeUnit(item.Height);

        TableCellContainer.SetCellContent(cellContainer, rowIndex, columnIndex, item, 1, 1);

        for (let i = 0; i < rowSpan; i++) {
            for (let j = 0; j < colSpan; j++) {
                if (i > 0 || j > 0) {
                    let item1: IReportItem = { $T: "TextBox" };
                    TableLayout.CopyStyle(item, item1);
                    TableCellContainer.SetCellContent(cellContainer, rowIndex + i, columnIndex + j, item1, 1, 1);
                }
            }
        }
    }

    //====Add Group Methods====
    public InsertOuterRowGroup(referenceGroup: TableGroup, groupName: string, groupings: IGrouping[],
        addHeader: boolean, addFooter: boolean): boolean {
        let formattingColumnIndex = this.GetFirstSelectedColumn();
        this.InsertOuterDynamicRowGroup(referenceGroup, this.CreateUniqueGroupName(groupName)
            , groupings, addHeader, addFooter, formattingColumnIndex);
        return true;
    }

    private InsertOuterDynamicRowGroup(referenceGroup: TableGroup, groupName: string, groupings: IGrouping[]
        , addHeader: boolean, addFooter: boolean, formattingColumnIndex: number) {
        let indices: ILeafIndices = { indexOfFirstLeaf: 0, indexOfLastLeaf: 0 };
        TableGroup.GetIndicesOfLeavesOfTableGroup(this.Table.RowGroups, 0, referenceGroup, indices);

        let columnIndex = this.ColumnIndexOfRowGroup(referenceGroup);
        this.InsertColumnInRowHeader(columnIndex, InsertPosition.Before, GroupPosition.Outside
            , formattingColumnIndex);

        let columnIndex1 = this.ColumnIndexOfRowGroup(referenceGroup) - 1;
        let rowIndex = this.columnHeaderRowCount;

        let newGroup = this.CellAt(rowIndex, columnIndex1).RowGroup;
        TableGroup.InitDynamicGroup(newGroup, groupName, groupings);

        this.SetHeaderLabelText(rowIndex, columnIndex1, groupName);
        this.AddHeaderFooterToRowGroup(newGroup, addHeader, addFooter);
        this.SetSelectedCells([this.CellAt(rowIndex, columnIndex1)]);
    }

    private AddHeaderFooterToRowGroup(rowGroup: TableGroup, addHeader: boolean, addFooter: boolean) {
        if (rowGroup && rowGroup.ChildGroups.Count > 0) {
            let group1 = rowGroup.ChildGroups.At(0);
            let group2 = rowGroup.ChildGroups.At(rowGroup.ChildGroups.Count - 1);
            if (addHeader) {
                this.InsertBodyRow(group1, InsertPosition.Before);
            }
            if (addFooter) {
                this.InsertBodyRow(group2, InsertPosition.After);
            }
        }
    }

    private GetHeaderLabelItem(rowIndex: number, columnIndex: number): IReportItem | null {
        if (rowIndex < this.columnHeaderRowCount) { return null; }

        let headerRowIndex = 0;

        let cell = this.CellAt(rowIndex, columnIndex);
        let rowGroup = cell.RowGroup;

        let root = TableGroup.GetRootGroup(rowGroup);
        let index = this.Table.RowGroups.IndexOf(root);
        if (index > 0) {
            let prevRootRowGroup = this.Table.RowGroups.At(index - 1);
            if (prevRootRowGroup.IsDynamic()) { return null; }

            if (TableGroup.CountDynamicDescendants(prevRootRowGroup.ChildGroups) > 0) {
                return null;
            }

            let indices: ILeafIndices = { indexOfFirstLeaf: 0, indexOfLastLeaf: 0 };
            if (!TableGroup.GetIndicesOfLeavesOfTableGroup(this.Table.RowGroups, 0, prevRootRowGroup, indices)) {
                return null;
            }

            headerRowIndex = this.columnHeaderRowCount + indices.indexOfLastLeaf;
        } else if (this.columnHeaderRowCount > 0 && columnIndex < this.rowHeaderColumnCount) {
            headerRowIndex = this.columnHeaderRowCount - 1;
        } else if (this.IsBodyCell(rowIndex, columnIndex)) {
            headerRowIndex = this.columnHeaderRowCount - 1;
        } else {
            return null;
        }

        if (headerRowIndex < 0 || columnIndex < 0) { return null; }

        let headerCell = this.CellAt(headerRowIndex, columnIndex);
        if (headerCell.MergeTarget) {
            headerCell = headerCell.MergeTarget;
            if (headerCell.ColIndex !== columnIndex) {
                return null;
            }
        }

        let item = headerCell.ReportItem;
        if (TableLayout.IsEmptyTextBox(item)) {
            return item;
        }

        return null;
    }

    private SetHeaderLabelText(rowIndex: number, columnIndex: number, dataField: string) {
        if (!dataField) { return; }

        let item = this.GetHeaderLabelItem(rowIndex, columnIndex);
        if (item.$T === "TextBox" || item.$T === "HtmlTextBox") {
            (<any>item).Value = dataField;
        }
    }

    private NewGroup(referenceItem: IReportItem | null): TableGroup {
        let newGroup = new TableGroup({});
        newGroup.Name = this.CreateUniqueGroupName("Group");

        if (referenceItem) {
            let contentItem: IReportItem = { $T: "TextBox" };
            contentItem.Width = DefaultItemRWidth;
            contentItem.Height = DefaultItemRHeight;

            //this.Table.AddItem(contentItem);
            TableLayout.CopyStyle(referenceItem, contentItem);
            newGroup.ReportItem = contentItem;
        }

        return newGroup;
    }

    private CreateNewStaticGroupUnder(group: TableGroup, reportItem: IReportItem): TableGroup {
        let newGroup = new TableGroup({
            Name: this.CreateUniqueGroupName("Group"),
            ReportItem: reportItem
        });

        for (let i = 0; i < group.ChildGroups.Count; i++) {
            const g = group.ChildGroups.At(i);
            newGroup.ChildGroups.Add(g);
        }

        group.ChildGroups.Clear();
        group.ChildGroups.Add(newGroup);
        return newGroup;
    }

    private CreateUniqueGroupName(name: string): string {
        let i = 1;
        let s = name;
        if (name == "Group") {
            s = "Group1";
        }
        while (TableGroup.FindGroup(this.Table.ColumnGroups, s)
            || TableGroup.FindGroup(this.Table.RowGroups, s)) {
            s = name + (i++);
        }
        return s;
    }

    //====Delete Group Methods====
    public DeleteRowGroup(group: TableGroup, deleteRelated: boolean) {
        if (group.IsStatic() || group.IsDetail()) {
            throw new Error("Cannot delete static or detail group.");
        }

        TableGroup.DeleteDynamicGroup(group);
        if (deleteRelated) {
            let groupsToDelete: TableGroup[] = [];
            if (group.ChildGroups.Count > 0) {
                for (let i = 0; i < group.ChildGroups.Count; i++) {
                    let childGroup = group.ChildGroups.At(i);
                    if (TableGroup.IsStaticHierarchy(childGroup)) {
                        groupsToDelete.push(childGroup);
                    }
                }
            } else {
                groupsToDelete.push(group);
            }

            for (let i = 0; i < groupsToDelete.length; i++) {
                let group1 = groupsToDelete[i];
                let indices: ILeafIndices = { indexOfFirstLeaf: 0, indexOfLastLeaf: 0 };
                if (TableGroup.GetIndicesOfLeavesOfTableGroup(this.Table.RowGroups
                    , this.columnHeaderRowCount, group1, indices)) {
                    for (let j = indices.indexOfLastLeaf; j >= indices.indexOfFirstLeaf; j--) {
                        if (this.Rows.length - this.columnHeaderRowCount === 1) { break; }

                        this.DeleteBodyRow(j, true);
                        this.PerformLayout();
                    }
                }
            }

            if (group.ColumnIndex >= 0 && this.CanDeleteRowHeaderColumn(group.ColumnIndex)) {
                this.DeleteRowHeaderColumn(group.ColumnIndex, true);
            }
        }

        this.PerformLayout();
    }

    public DeleteColumnGroup(group: TableGroup, deleteRelated: boolean) {
        if (group.IsStatic() || group.IsDetail()) {
            throw new Error("Cannot delete static or detail group.");
        }

        TableGroup.DeleteDynamicGroup(group);
        if (deleteRelated) {
            let groupsToDelete: TableGroup[] = [];
            if (group.ChildGroups.Count > 0) {
                for (let i = 0; i < group.ChildGroups.Count; i++) {
                    let childGroup = group.ChildGroups.At(i);
                    if (TableGroup.IsStaticHierarchy(childGroup)) {
                        groupsToDelete.push(childGroup);
                    }
                }
            } else {
                groupsToDelete.push(group);
            }

            for (let i = 0; i < groupsToDelete.length; i++) {
                let group1 = groupsToDelete[i];
                let indices: ILeafIndices = { indexOfFirstLeaf: 0, indexOfLastLeaf: 0 };
                if (TableGroup.GetIndicesOfLeavesOfTableGroup(this.Table.ColumnGroups
                    , this.rowHeaderColumnCount, group1, indices)) {
                    for (let j = indices.indexOfLastLeaf; j >= indices.indexOfFirstLeaf; j--) {
                        if (this.Columns.length - this.rowHeaderColumnCount === 1) { break; }

                        this.DeleteBodyColumn(j, true);
                        this.PerformLayout();
                    }
                }
            }

            if (group.RowIndex >= 0 && this.CanDeleteColumnHeaderRow(group.RowIndex)) {
                this.DeleteColumnHeaderRow(group.RowIndex, true);
            }
        }

        this.PerformLayout();
    }

    private CanDeleteColumnHeaderRow(rowIndex: number): boolean {
        for (let i = this.rowHeaderColumnCount; i < this.Columns.length; i++) {
            let cell = this.CellAt(rowIndex, i);
            if (!cell.MergeTarget && cell.ColumnGroup.IsDynamic()) {
                return false;
            }
        }
        return true;
    }

    private CanDeleteRowHeaderColumn(columnIndex: number): boolean {
        for (let i = this.columnHeaderRowCount; i < this.Rows.length; i++) {
            let cell = this.CellAt(i, columnIndex);
            if (!cell.MergeTarget && cell.RowGroup.IsDynamic()) {
                return false;
            }
        }
        return true;
    }

    //====Static Methods====
    private static CopyStyle(source: IReportItem, dest: IReportItem) {
        //TODO:
        if (source && dest) {
            //Style.Copy(source, dest, false, true);
            //dest.StyleName = source.StyleName;
        }
    }

    private static InitBodyRowsColumns(body: ITableBody, rowCount: number, columnCount: number
        , bodyRows: number[], bodyColumns: number[]): boolean {
        let bodyRowCount = body.Rows.length;
        if (bodyRowCount > 0 && bodyRowCount != rowCount) {
            throw new Error(`Table Body has ${bodyRowCount} rows but ${rowCount} are expected.`);
        }

        let bodyColumnCount = body.Columns.length;
        if (bodyColumnCount > 0 && bodyColumnCount != columnCount) {
            throw new Error(`Table Body has ${bodyColumnCount} columns but ${columnCount} are expected.`);
        }

        for (let i = 0; i < rowCount; i++) {
            let size = bodyRowCount > 0 ? RSizeUtil.SizeToPixel(body.Rows[i].Height) : 0;
            bodyRows.push(size);
        }
        for (let i = 0; i < columnCount; i++) {
            let size = bodyColumnCount > 0 ? RSizeUtil.SizeToPixel(body.Columns[i].Width) : 0;
            bodyColumns.push(size);
        }

        if (bodyRowCount > 0 && bodyColumnCount > 0) {
            return false;
        }

        for (const cell of body.Cells) {
            if (!cell.ReportItem) { continue; }
            if (cell.RowIndex >= bodyRows.length) { continue; }
            if (cell.ColumnIndex >= bodyColumns.length) { continue; }

            if (bodyRowCount === 0 && cell.RowSpan <= 1) {
                let size = bodyRows[cell.RowIndex];
                let itemHeight = RSizeUtil.SizeToPixel(cell.ReportItem.Height);
                if (itemHeight > size) {
                    size = itemHeight;
                }
                bodyRows[cell.RowIndex] = size;
            }
            if (bodyColumnCount === 0 && cell.ColumnSpan <= 1) {
                let size = bodyColumns[cell.ColumnIndex];
                let itemWidth = RSizeUtil.SizeToPixel(cell.ReportItem.Width);
                if (itemWidth > size) {
                    size = itemWidth;
                }
                bodyColumns[cell.ColumnIndex] = size;
            }
        }

        for (let i = 0; i < rowCount; i++) {
            if (bodyRows[i] === 0) { bodyRows[i] = 200; }
        }
        for (let i = 0; i < columnCount; i++) {
            if (bodyColumns[i] === 0) { bodyColumns[i] = 100; }
        }
        return true;
    }

    private static CalculateDistanceList(hierarchy: TableGroups, isColumnGroup: boolean, visibleOnly: boolean): number[] {
        let list: number[] = [];
        TableLayout.CollectDistances(hierarchy, isColumnGroup, visibleOnly, 0, list);
        return this.RemoveDuplicates(list.sort());
    }

    private static CollectDistances(hierarchy: TableGroups, isColumnGroup: boolean, visibleOnly: boolean,
        distance: number, list: number[]): void {
        for (let i = 0; i < hierarchy.Count; i++) {
            const group = hierarchy.At(i);
            let maxDistance = distance;

            let item = group.ReportItem;
            if (item && (!visibleOnly /*|| item.Visible*/)) {
                let size = isColumnGroup ? RSizeUtil.SizeToPixel(item.Height) : RSizeUtil.SizeToPixel(item.Width);
                maxDistance += size;
                list.push(maxDistance);
            }

            if (group.ChildGroups) {
                this.CollectDistances(group.ChildGroups, isColumnGroup, visibleOnly, maxDistance, list);
            }
        }
    }

    private static RemoveDuplicates(sortedList: number[]): number[] {
        let list: number[] = [];
        let u = 0;
        for (let i = 0; i < sortedList.length; i++) {
            const v = sortedList[i];
            if (u !== v) {
                list.push(v);
                u = v;
            }
        }
        return list;
    }

    private static WalkHierarchy(hierarchy: TableGroups, startIndex: number, level: number
        , callback: WalkCallback, calcSpan: CalcSpanCallback): number {
        let count = 0;
        for (let i = 0; i < hierarchy.Count; i++) {
            const group = hierarchy.At(i);
            group.RowIndex = group.ColumnIndex = group.RowSpan = group.ColumnSpan = -1;

            let index = startIndex + count;
            if (group.ChildGroups && group.ChildGroups.Count > 0) {
                let nextLevel = level;
                if (group.ReportItem) {
                    nextLevel = calcSpan(group, level);
                }
                count += this.WalkHierarchy(group.ChildGroups, index, nextLevel, callback, calcSpan);
            } else {
                count++;
            }

            if (group.ReportItem) {
                callback(group, level, index, startIndex + count - index);
            }
        }
        return count;
    }

    private static IsEmptyTextBox(item: IReportItem): boolean {
        if (item.$T !== "TextBox") { return false; }

        let value: string = (<any>item).Value;
        if (!value) { return true; }
        if (value === item.Name) { return true; }
        return false;
    }

}