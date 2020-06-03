import { IPropertyOwner, IPropertyCatalog } from '@/components/Canvas/Interfaces/IPropertyPanel';
import { TableLayout } from './TableLayout';
import ReportRootDesigner from './ReportRootDesigner';

export interface IReportObject { }

export interface IReportItem extends IReportObject {
    $T: string;
    Name?: string;
    Width?: string;
    Height?: string;
}

type SortDirection = "Asc" | "Desc";

export interface IGrouping {
    Expression?: string;
}
interface ISorting {
    Expression?: string;
    Direction: SortDirection;
}
interface IFilter {
    Expression?: string;
}

interface ITableGroup {
    Name?: string;
    ReportItem?: IReportItem;
    ChildGroups?: ITableGroup[];
    Groupings?: IGrouping[];
    Sortings?: ISorting[];
    Filters?: IFilter[];
}

export interface ITableCell {
    RowIndex: number;
    ColumnIndex: number;
    RowSpan: number;
    ColumnSpan: number;
    ReportItem: IReportItem;
}

export interface ITableBodyRow {
    Height: string;
}

export interface ITableBodyColumn {
    Width: string;
}

export interface ITableCellContainer {
    readonly Cells: ITableCell[];
}

export interface ITableBody extends ITableCellContainer {
    readonly Rows: ITableBodyRow[];
    readonly Columns: ITableBodyColumn[];
}

interface ITable extends IReportItem {
    readonly Body: ITableBody;
    readonly Corner: ITableCellContainer;
    readonly RowGroups: ITableGroup[];
    readonly ColumnGroups: ITableGroup[];
    DataSource?: string;
}

export interface ILeafIndices { indexOfFirstLeaf: number; indexOfLastLeaf: number }

//================================================================

export class Table {
    private readonly tableLayout: TableLayout;
    public get TableLayout(): TableLayout { return this.tableLayout; }
    private readonly def: ITable;
    public get Def(): ITable { return this.def; }

    public get Width(): string { return this.def.Width; }
    public set Width(value) { this.def.Width = value; }
    public get Height(): string { return this.def.Height; }
    public set Height(value) { this.def.Height = value; }

    public get Body(): ITableBody { return this.def.Body; }
    public get Corner(): ITableCellContainer { return this.def.Corner; }

    private readonly rowGroups: TableGroups;
    public get RowGroups(): TableGroups { return this.rowGroups; }
    private readonly columnGroups: TableGroups;
    public get ColumnGroups(): TableGroups { return this.columnGroups; }

    constructor(owner: TableLayout, data: any) {
        this.tableLayout = owner;
        this.def = data;
        this.rowGroups = new TableGroups(this, TableGroupsType.TableRowGroups);
        this.columnGroups = new TableGroups(this, TableGroupsType.TableColumnGroups);
    }

}

enum TableGroupsType { TableRowGroups, TableColumnGroups, ChildGroups }

export class TableGroups {
    private readonly owner: Table | TableGroup;
    private readonly type: TableGroupsType;
    private readonly groups: TableGroup[] = [];
    public get Items(): TableGroup[] { return this.groups; }

    public get Count(): number { return this.groups.length; }
    // public get length(): number { return this.groups.length; }
    // [Symbol.iterator]() { return this.groups[Symbol.iterator]; }

    constructor(owner: Table | TableGroup, type: TableGroupsType) {
        this.owner = owner;
        this.type = type;

        let list: ITableGroup[] | null = null;
        if (type === TableGroupsType.TableRowGroups) {
            list = (owner as Table).Def.RowGroups;
        } else if (type === TableGroupsType.TableColumnGroups) {
            list = (owner as Table).Def.ColumnGroups;
        } else {
            list = (owner as TableGroup).Def.ChildGroups;
        }
        if (list && list.length > 0) {
            for (const g of list) {
                let ng = new TableGroup(g);
                if (type === TableGroupsType.ChildGroups) {
                    ng.Parent = owner as TableGroup;
                    //ng.Table = 
                } else {
                    ng.Table = owner as Table;
                }
                this.groups.push(ng);
            }
        }
    }

    public At(index: number): TableGroup { return this.groups[index]; }
    public IndexOf(group: TableGroup): number { return this.groups.indexOf(group); }

    public Add(group: TableGroup) { this.Insert(this.groups.length, group); }

    public Insert(index: number, group: TableGroup) {
        if (index < 0 || index > this.groups.length) { throw new Error("OutOfRange"); }

        // 处理关系并同步定义
        if (this.type === TableGroupsType.ChildGroups) {
            group.Parent = this.owner as TableGroup;
            //group.Table
            let parent: ITableGroup = (this.owner as TableGroup).Def;
            if (!parent.ChildGroups) { parent.ChildGroups = []; }
            parent.ChildGroups.splice(index, 0, group.Def);
        } else {
            group.Table = this.owner as Table;
            group.Parent = null;
            if (this.type === TableGroupsType.TableRowGroups) {
                (this.owner as Table).Def.RowGroups.splice(index, 0, group.Def);
            } else {
                (this.owner as Table).Def.ColumnGroups.splice(index, 0, group.Def);
            }
        }

        this.groups.splice(index, 0, group);
    }

    public Remove(group: TableGroup) { this.RemoveAt(this.IndexOf(group)); }

    public RemoveAt(index: number) {
        if (index < 0 || index >= this.groups.length) { throw new Error("OutOfRange"); }

        let group = this.groups[index];
        // 处理关系并同步定义
        if (this.type === TableGroupsType.ChildGroups) {
            let parent: ITableGroup = (this.owner as TableGroup).Def;
            parent.ChildGroups.splice(index, 1);
            if (parent.ChildGroups.length === 0) {
                delete parent.ChildGroups;
            }
        } else if (this.type === TableGroupsType.TableRowGroups) {
            (this.owner as Table).Def.RowGroups.splice(index, 1);
        } else {
            (this.owner as Table).Def.ColumnGroups.splice(index, 1);
        }

        group.Table = null;
        group.Parent = null;
        this.groups.splice(index, 1);
    }

    public Clear() {
        for (let i = this.groups.length - 1; i >= 0; i--) {
            this.RemoveAt(i);
        }
    }

    public CopyTo(array: TableGroup[], arrayIndex: number) {
        for (let i = 0; i < this.Count; i++) {
            array[i + arrayIndex] = this.groups[i];
        }
    }
}

//type VisitorCallback = (group: ITableGroup, index: number, level: number, parent: ITableGroup | null) => boolean;
type VisitorCallback = (group: TableGroup, index: number, level: number) => boolean;

export class TableGroup implements IPropertyOwner {
    private readonly def: ITableGroup;
    public get Def(): ITableGroup { return this.def; }

    public Table: Table | null;
    public Parent: TableGroup | null;

    private readonly childGroups: TableGroups;
    public get ChildGroups(): TableGroups { return this.childGroups; }
    public get NoneStaticChildGroups(): TableGroup[] { //仅用于树绑定
        if (this.childGroups.Count === 0) {
            return null;
        } else {
            return this.childGroups.Items.filter(t => !t.IsStatic());
        }
    }

    public get Name(): string | null { return this.def.Name; }
    public set Name(value) { this.def.Name = value; }

    public get ReportItem(): IReportItem | null { return this.def.ReportItem; }
    public set ReportItem(value) { this.def.ReportItem = value; }

    public RowIndex: number;
    public RowSpan: number;
    public ColumnIndex: number;
    public ColumnSpan: number;

    constructor(data: any) {
        this.def = data;
        this.childGroups = new TableGroups(this, TableGroupsType.ChildGroups);
    }

    public IsStatic(): boolean {
        if (!this.def.Groupings) { return true; }
        return this.def.Groupings.length === 0;
    }
    public IsDynamic(): boolean {
        if (!this.def.Groupings) { return false; }
        return this.def.Groupings.length > 0;
    }
    public IsDetail(): boolean {
        if (!this.def.Groupings) { return false; }
        if (this.def.Groupings.length === 0) { return false; }
        for (const g of this.def.Groupings) {
            if (g.Expression) { return false; }
        }
        return true;
    }

    public static InitDynamicGroup(group: TableGroup, groupName: string, groupings: IGrouping[]) {
        group.Name = groupName;
        if (group.def.Groupings) { group.def.Groupings.splice(0, group.def.Groupings.length); }
        if (group.def.Sortings) { group.def.Sortings.splice(0, group.def.Sortings.length); }
        if (group.def.Filters) { group.def.Filters.splice(0, group.def.Filters.length); }

        for (const grouping of groupings) {
            if (!group.def.Groupings) { group.def.Groupings = []; }
            group.def.Groupings.push(grouping);
            if (grouping.Expression) {
                if (!group.def.Sortings) { group.def.Sortings = []; }
                group.def.Sortings.push({ Expression: grouping.Expression, Direction: "Asc" });
            }
        }

        if (groupings.length > 0 && group.ReportItem.$T == "TextBox" && groupings[0].Expression) {
            (<any>group.ReportItem).Value = groupings[0].Expression;
        }
    }

    public static CountDynamicDescendants(groups: TableGroups): number {
        if (!groups || groups.Count === 0) {
            return 0;
        }

        let count = 0;
        for (let i = 0; i < groups.Count; i++) {
            if (groups.At(i).IsDynamic()) { count++; }

            count += TableGroup.CountDynamicDescendants(groups.At(i).ChildGroups);
        }
        return count;
    }

    public static GetIndicesOfLeavesOfTableGroup(nodes: TableGroups
        , startIndex: number, nodeToFind: TableGroup, indices: ILeafIndices): boolean {
        let num = 0;
        for (const group of nodes.Items) {
            let num2 = startIndex + num;
            num += TableGroup.GetLeafCount(group);
            let num3 = startIndex + num - 1;
            if (group == nodeToFind) {
                indices.indexOfFirstLeaf = num2;
                indices.indexOfLastLeaf = num3;
                return true;
            }
            if (!TableGroup.IsLeafGroup(group)
                && TableGroup.GetIndicesOfLeavesOfTableGroup(group.ChildGroups, num2, nodeToFind, indices)) {
                return true;
            }
        }
        indices.indexOfFirstLeaf = 0;
        indices.indexOfLastLeaf = 0;
        return false;
    }

    private static GetLeafCount(group: TableGroup): number {
        if (TableGroup.IsLeafGroup(group)) {
            return 1;
        }
        let num = 0;
        for (const group1 of group.ChildGroups.Items) {
            num += TableGroup.GetLeafCount(group1);
        }
        return num;
    }

    public static GetLeafGroups(hierarchy: TableGroups): TableGroup[] {
        let list: TableGroup[] = [];
        this.Visit(hierarchy, 0, (group, index, level) => {
            if (this.IsLeafGroup(group)) {
                list.push(group);
            }
            return false;
        });
        return list;
    }

    public static GetRootGroup(group: TableGroup): TableGroup {
        while (group && group.Parent) {
            group = group.Parent;
        }
        return group;
    }

    public static FindGroup(hierarchy: TableGroups, name: string): TableGroup | null {
        let result: TableGroup | null = null;
        this.Visit(hierarchy, 0, (group, index, level) => {
            if (group.Name == name) {
                result = group;
                return true;
            }
            return false;
        });
        return result;
    }

    public static FindDynamicAncestorOrSelf(group: TableGroup): TableGroup {
        while (group && !group.IsDynamic()) {
            group = group.Parent;
        }
        return group;
    }

    public static DeleteDynamicGroup(group: TableGroup) {
        if (group.def.Groupings) { delete group.def.Groupings; }
        if (group.def.Sortings) { delete group.def.Sortings; }
        if (group.def.Filters) { delete group.def.Filters; }
    }

    public static IsStaticHierarchy(group: TableGroup): boolean {
        if (group.IsDynamic()) {
            return false;
        }
        for (let i = group.ChildGroups.Count - 1; i >= 0; i--) {
            if (!TableGroup.IsStaticHierarchy(group.ChildGroups.At(i))) {
                return false;
            }
        }
        return true;
    }

    public static GetParentCollection(group: TableGroup): TableGroups | null {
        if (group.Parent) {
            return group.Parent.ChildGroups;
        }
        if (group.Table) {
            if (group.Table.RowGroups.IndexOf(group) >= 0) {
                return group.Table.RowGroups;
            }
            if (group.Table.ColumnGroups.IndexOf(group) >= 0) {
                return group.Table.ColumnGroups;
            }
        }
        return null;
    }

    private static IsLeafGroup(group: TableGroup): boolean {
        return !(group.ChildGroups && group.ChildGroups.Count > 0);
    }

    public static Visit(tableGroups: TableGroups, level: number, callback: VisitorCallback) {
        for (let i = 0; i < tableGroups.Count; i++) {
            const tableGroup = tableGroups.At(i);
            if (callback(tableGroup, i, level)) {
                return true;
            }
            if (tableGroup.ChildGroups.Count > 0) {
                if (this.Visit(tableGroup.ChildGroups, level + 1, callback)) {
                    return true;
                }
            }
        }
        return false;
    }

    public static SwapContent(group1: TableGroup, group2: TableGroup) {
        let temp = group2.ReportItem;
        group2.ReportItem = group1.ReportItem;
        group1.ReportItem = temp;
    }

    public static PromoteChildrenAndRemoveGroup(group: TableGroup) {
        let parentGroups = TableGroup.GetParentCollection(group);
        let index = parentGroups.IndexOf(group);
        parentGroups.RemoveAt(index);
        for (let i = group.ChildGroups.Count - 1; i >= 0; i--) {
            let item = group.ChildGroups.At(i);
            group.ChildGroups.RemoveAt(i);
            parentGroups.Insert(index, item);
        }
    }

    //====IPropertyOwner====
    getPropertyOwnerType(): string { return "TableGroup"; }

    public GetFields(): string[] {
        let rootGroup = TableGroup.GetRootGroup(this);
        if (!rootGroup.Table || !rootGroup.Table.Def.DataSource) {
            return [];
        }
        let rootDesigner = rootGroup.Table.TableLayout.Owner.Surface.DesignService.RootDesigner as ReportRootDesigner;
        if (!rootDesigner.DataSources || rootDesigner.DataSources.Items.length === 0) {
            return [];
        }
        let ds = rootDesigner.DataSources.Items.find(t => t.Name === rootGroup.Table.Def.DataSource);
        if (!ds) {
            return [];
        }
        let res: string[] = [];
        for (const field of ds.Fields) {
            res.push("=Fields." + field.Name);
        }
        return res;
    }

    private GetFirstGrouping(): string {
        return this.def.Groupings && this.def.Groupings.length > 0 && this.def.Groupings[0].Expression ?
            this.def.Groupings[0].Expression : "";
    }
    private SetFirstGrouping(v: string) {
        if (!this.def.Groupings) {
            this.def.Groupings = [];
        }
        if (this.def.Groupings.length === 0) {
            this.def.Groupings.push({ Expression: v });
        } else {
            this.def.Groupings[0].Expression = v;
        }
    }

    getPropertyItems(): IPropertyCatalog[] {
        let cats: IPropertyCatalog[] = [
            {
                name: "Properties",
                items: [
                    {
                        title: "Name", readonly: false, editor: "TextBox",
                        getter: () => this.Name,
                        setter: v => this.Name = v
                    },
                    {
                        title: "GroupBy", readonly: false, editor: "Select",
                        options: this.GetFields(),
                        getter: () => this.GetFirstGrouping(),
                        setter: v => this.SetFirstGrouping(v)
                    }
                ]
            }
        ]
        return cats;
    }
}

export class TableCellContainer {
    public static GetCellAt(container: ITableCellContainer, rowIndex: number, colIndex: number): ITableCell {
        let tableCell: ITableCell = null;
        if (container.Cells) {
            tableCell = container.Cells.find(c => c.RowIndex === rowIndex && c.ColumnIndex === colIndex);
        }
        if (!tableCell) {
            tableCell = { RowIndex: rowIndex, ColumnIndex: colIndex, RowSpan: 1, ColumnSpan: 1, ReportItem: null };
        }
        return tableCell;
    }

    public static SetCellContent(container: ITableCellContainer, rowIndex: number, columnIndex: number
        , item: IReportItem | null, rowSpan: number, columnSpan: number) {
        if (!item) { return; }

        let list = container.Cells.filter(c => {
            return rowIndex <= c.RowIndex && c.RowIndex < (rowIndex + rowSpan)
                && columnIndex <= c.ColumnIndex && c.ColumnIndex < (columnIndex + columnSpan);
        });

        for (let i = 0; i < list.length; i++) {
            container.Cells.splice(container.Cells.indexOf(list[i]), 1);
        }

        let cell = container.Cells.find(c => c.RowIndex === rowIndex && c.ColumnIndex === columnIndex);
        if (cell) {
            cell.ReportItem = item;
        } else {
            container.Cells.push({
                RowIndex: rowIndex, ColumnIndex: columnIndex, RowSpan: rowSpan, ColumnSpan: columnSpan, ReportItem: item
            });
        }
    }
}