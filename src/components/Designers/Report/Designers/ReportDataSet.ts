import ReportRootDesigner from "./ReportRootDesigner";
import XmlUtil from './XmlUtil';
import { IEntityMember, EntityMemberType, EntityFieldType } from "@/design/IEntityMember";
import { IPropertyOwner, IPropertyCatalog } from '@/components/Canvas/Interfaces/IPropertyPanel'

class ReportDataField implements IPropertyOwner {
    private readonly _owner: ReportDataSet;
    private readonly _node: Element;

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

export class ReportDataSet implements IPropertyOwner {
    private readonly _owner: ReportDataSets;
    private readonly _node: Element;
    private _fieldsNode: Node | null;
    private readonly _fields: ReportDataField[] = [];
    public get Fields(): ReportDataField[] { return this._fields; }

    public get Name(): string { return this._node.getAttribute("Name"); }
    public set Name(value) { this._node.setAttribute("Name", value); }

    public get QueryCommand(): string { return ""; }
    public set QueryCommand(value) { }

    constructor(owner: ReportDataSets, node: Node) {
        this._owner = owner;
        this._node = node as Element;

        this._fieldsNode = XmlUtil.GetNamedChildNode(this._node, "Fields");
        if (this._fieldsNode) {
            for (const cnode of this._fieldsNode.childNodes) {
                this._fields.push(new ReportDataField(this, cnode));
            }
        }
    }

    public AddField(name: string, dataField: string, typeName: string) {
        if (!this._fieldsNode) {
            this._fieldsNode = XmlUtil.CreateChildNode(this._node, "Fields");
        }
        let cnode = XmlUtil.CreateChildNode(this._fieldsNode, "Field");
        let field = new ReportDataField(this, cnode);
        field.Name = name;
        field.DataField = dataField;
        field.TypeName = typeName;
        this._fields.push(field);
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
                this._items.push(new ReportDataSet(this, cnode));
            }
        }
    }

    /**
     * 根据实体模型的成员添加为DataSet
     */
    public Add(name: string | null, members: IEntityMember[] | null) {
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