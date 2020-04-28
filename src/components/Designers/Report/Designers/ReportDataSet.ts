import ReportRootDesigner from "./ReportRootDesigner";
import XmlUtil from './XmlUtil';
import { IEntityMember, EntityMemberType, EntityFieldType } from "@/design/IEntityMember";
import { IPropertyOwner, IPropertyCatalog } from '@/components/Canvas/Interfaces/IPropertyPanel'

class Field implements IPropertyOwner {
    private readonly _owner: ReportDataSet;
    public get DataSet(): ReportDataSet { return this._owner; }
    private readonly _node: Element;
    public get Node(): Node { return this._node; }

    public get Name(): string { return this._node.getAttribute("Name"); }
    public set Name(value) { this._node.setAttribute("Name", value); }

    public get DataField(): string {
        let n = XmlUtil.GetNamedChildNode(this._node, "DataField");
        if (n) { return n.textContent; }
        return "";
    }
    public set DataField(value) {
        let n = XmlUtil.GetOrCreateChildNode(this._node, "DataField");
        n.textContent = value;
    }

    public get TypeName(): string {
        let n = XmlUtil.GetNamedChildNode(this._node, "TypeName");
        if (n) { return n.textContent; }
        return "";
    }
    public set TypeName(value) {
        let n = XmlUtil.GetOrCreateChildNode(this._node, "TypeName");
        n.textContent = value;
    }

    constructor(owner: ReportDataSet, node: Node) {
        this._owner = owner;
        this._node = node as Element;
    }

    //====IPropertyOwner====
    public getPropertyOwnerType(): string { return "Field"; }

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
                        title: "DataField", readonly: false, editor: "TextBox",
                        getter: () => this.DataField,
                        setter: v => { this.DataField = v; }
                    },
                    {
                        title: "TypeName", readonly: false, editor: "Select",
                        options: ReportDataSets.TypeNames,
                        getter: () => this.TypeName,
                        setter: v => { this.TypeName = v; }
                    },
                ]
            }
        ]
        return cats;
    }
}

class Query {
    private readonly _node: Node;

    public get CommandText(): string {
        let n = XmlUtil.GetNamedChildNode(this._node, "CommandText");
        if (n) { return n.textContent; }
        return "";
    }
    public set CommandText(value) {
        let n = XmlUtil.GetOrCreateChildNode(this._node, "CommandText");
        n.textContent = value;
    }

    constructor(node: Node) {
        this._node = node;
    }
}

export class ReportDataSet implements IPropertyOwner {
    private readonly _owner: ReportDataSets;
    private readonly _node: Element;
    public get Node(): Node { return this._node; }

    private _fieldsNode: Node | null;
    private readonly _fields: Field[] = [];
    public get Fields(): Field[] { return this._fields; }

    public readonly Query: Query;

    public get Name(): string { return this._node.getAttribute("Name"); }
    public set Name(value) { this._node.setAttribute("Name", value); }

    public get QueryCommand(): string { return this.Query.CommandText; }
    public set QueryCommand(value) { this.Query.CommandText = value; }

    constructor(owner: ReportDataSets, node: Node) {
        this._owner = owner;
        this._node = node as Element;
        this.Query = new Query(XmlUtil.GetOrCreateChildNode(this._node, "Query"));
        this._fieldsNode = XmlUtil.GetNamedChildNode(this._node, "Fields");
        if (this._fieldsNode) {
            for (const cnode of this._fieldsNode.childNodes) {
                if (cnode.nodeType !== Node.ELEMENT_NODE) { continue; }
                this._fields.push(new Field(this, cnode));
            }
        }
    }

    public AddField(name: string, dataField: string, typeName: string) {
        if (!this._fieldsNode) {
            this._fieldsNode = XmlUtil.CreateChildNode(this._node, "Fields");
        }
        let cnode = XmlUtil.CreateChildNode(this._fieldsNode, "Field");
        let field = new Field(this, cnode);
        field.Name = name;
        field.DataField = dataField;
        field.TypeName = typeName;
        this._fields.push(field);
    }

    public RemoveField(field: Field): void {
        this._fieldsNode.removeChild(field.Node);
        this._fields.splice(this._fields.indexOf(field), 1);
        if (this._fields.length === 0) {
            this._node.removeChild(this._fieldsNode);
            this._fieldsNode = null;
        }
    }

    /**
     * 用于界面拖动Field节点顺序后同步xml子节点顺序
     */
    public OnDropField(dragField: Field, dropField: Field, type: "before" | "after") {
        //只需要调整xml节点的顺序
        this._fieldsNode.removeChild(dragField.Node);
        let refChild = type === "after" ? dropField.Node.nextSibling : dropField.Node;
        this._fieldsNode.insertBefore(dragField.Node, refChild);
    }

    //====IPropertyOwner====
    public getPropertyOwnerType(): string { return "DataSet"; }

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
                        title: "QueryCommand", readonly: false, editor: "TextBox",
                        getter: () => this.QueryCommand,
                        setter: v => { this.QueryCommand = v; }
                    }
                ]
            }
        ]
        return cats;
    }

}

export default class ReportDataSets {

    private readonly _owner: ReportRootDesigner;
    private _node: Node; // DataSets node of Report
    private readonly _items: ReportDataSet[] = [];
    public get Items(): ReportDataSet[] { return this._items; }

    constructor(owner: ReportRootDesigner) {
        this._owner = owner;
        this._node = XmlUtil.GetNamedChildNode(owner.XmlNode, "DataSets");
        if (this._node) {
            for (const cnode of this._node.childNodes) {
                if (cnode.nodeType !== Node.ELEMENT_NODE) { continue; }
                this._items.push(new ReportDataSet(this, cnode));
            }
        }
    }

    /**
     * 根据实体模型的成员添加为DataSet
     */
    public Add(name: string | null, members: IEntityMember[] | null): void {
        if (!this._node) {
            this._node = XmlUtil.CreateChildNode(this._owner.XmlNode, "DataSets");
        }
        let cnode = XmlUtil.CreateChildNode(this._node, "DataSet");
        let ds = new ReportDataSet(this, cnode);
        if (name) { ds.Name = name; }
        if (members) {
            for (const m of members) {
                if (m.Type !== EntityMemberType.DataField) { continue; }
                ds.AddField(m.Name, m.Name, ReportDataSets.ToTypeName(m.DataType));
            }
        }
        this._items.push(ds);
    }

    /**
     * 删除指定的DataSet
     */
    public Remove(ds: ReportDataSet): void {
        //TODO: 检查是否有引用
        this._node.removeChild(ds.Node);
        this._items.splice(this._items.indexOf(ds), 1);
        if (this._items.length === 0) {
            this._owner.XmlNode.removeChild(this._node);
            this._node = null;
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

    private static ToTypeName(fieldType: EntityFieldType): string {
        switch (fieldType) {
            case EntityFieldType.Enum: return "Int32"; // TODO: check
            case EntityFieldType.String: return "String";
            case EntityFieldType.Boolean: return "Boolean";
            case EntityFieldType.DateTime: return "DateTime";
            case EntityFieldType.Decimal: return "Decimal";
            case EntityFieldType.Byte: return "Byte";
            case EntityFieldType.Int16: return "Int16";
            case EntityFieldType.Int32: return "Int32";
            case EntityFieldType.Int64: return "Int64";
            case EntityFieldType.UInt16: return "UInt16";
            case EntityFieldType.UInt32: return "UInt32";
            case EntityFieldType.UInt64: return "UInt64";
            case EntityFieldType.Float: return "Float";
            case EntityFieldType.Double: return "Double";
            default: return "Object";
        }
    }

    public static readonly TypeNames: string[] = [
        "String", "Boolean", "DateTime", "Decimal",
        "Byte", "Int16", "Int32", "Int64", "UInt16", "UInt32", "UInt64",
        "Float", "Double"
    ];

}