import ReportRootDesigner from "./ReportRootDesigner";
import {EntityMemberType} from '@/assets/js/EntityMemberType';
import { IEntityMember} from "@/design/IEntityMember";
import { IPropertyOwner, IPropertyCatalog } from '@/components/Canvas/Interfaces/IPropertyPanel'
import {DataFieldType} from '@/assets/js/EntityMemberType';

class Field implements IPropertyOwner {
    private readonly _owner: ReportDataSource;
    public get DataSource(): ReportDataSource { return this._owner; }
    private readonly _node: any;
    public get Node(): any { return this._node; }

    public get Name(): string { return this._node.Name; }
    public set Name(value) { this._node.Name = value; }

    public get Type(): string { return this._node.Type; }
    public set Type(value) { this._node.Type = value; }

    constructor(owner: ReportDataSource, node: any) {
        this._owner = owner;
        this._node = node;
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
                        title: "TypeName", readonly: false, editor: "Select",
                        options: ReportDataSources.TypeNames,
                        getter: () => this.Type,
                        setter: v => { this.Type = v; }
                    },
                ]
            }
        ]
        return cats;
    }
}

export class ReportDataSource implements IPropertyOwner {
    private readonly _owner: ReportDataSources;
    private readonly _node: any;
    public get Node(): Node { return this._node; }

    private readonly _fields: Field[] = [];
    public get Fields(): Field[] { return this._fields; }

    public get Name(): string { return this._node.Name; }
    public set Name(value) { this._node.Name = value; }

    constructor(owner: ReportDataSources, node: any) {
        this._owner = owner;
        this._node = node;
        if (this._node.Fields) {
            for (const cnode of this._node.Fields) {
                this._fields.push(new Field(this, cnode));
            }
        }
    }

    public AddField(name: string, dataField: string, typeName: string) {
        if (!this._node.Fields) {
            this._node.Fields = [];
        }

        let field = new Field(this, { Name: name, Type: typeName });
        this._node.Fields.push(field.Node);
        this._fields.push(field);
    }

    public RemoveField(field: Field): void {
        this._node.Fields.splice(this._node.Fields.indexOf(field.Node), 1);
        this._fields.splice(this._fields.indexOf(field), 1);
        if (this._node.Fields.length === 0) {
            delete this._node.Fields;
        }
    }

    /**
     * 用于界面拖动Field节点顺序后同步子节点顺序
     */
    public OnDropField(dragField: Field, dropField: Field, type: "before" | "after") {
        this._node.Fields.splice(this._node.Fields.indexOf(dragField.Node), 1);
        let dropPos = this._node.Fields.indexOf(dropField.Node);
        if (type === "after") {
            dropPos += 1;
        }
        this._node.Fields.splice(dropPos, 0, dragField.Node);
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
                    }
                ]
            }
        ]
        return cats;
    }

}

export default class ReportDataSources {

    private readonly _owner: ReportRootDesigner;
    private readonly _items: ReportDataSource[] = [];
    public get Items(): ReportDataSource[] { return this._items; }

    constructor(owner: ReportRootDesigner) {
        this._owner = owner;
        if (this._owner.Node.DataSources) {
            for (const cnode of this._owner.Node.DataSources) {
                this._items.push(new ReportDataSource(this, cnode));
            }
        }
    }

    /**
     * 根据实体模型的成员添加为DataSource
     */
    public Add(name: string | null, members: IEntityMember[] | null): void {
        if (!this._owner.Node.DataSources) {
            this._owner.Node.DataSources = [];
        }
        let ds = new ReportDataSource(this, {});
        if (name) { ds.Name = name; }

        if (members) {
            for (const m of members) {
                if (m.Type !== EntityMemberType.DataField) { continue; }
                ds.AddField(m.Name, m.Name, ReportDataSources.ToTypeName(m.DataType));
            }
        }
        this._owner.Node.DataSources.push(ds.Node);
        this._items.push(ds);
    }

    /**
     * 删除指定的DataSet
     */
    public Remove(ds: ReportDataSource): void {
        //TODO: 检查是否有引用
        this._owner.Node.DataSources.splice(this._owner.Node.DataSources.indexOf(ds.Node), 1);
        this._items.splice(this._items.indexOf(ds), 1);
        if (this._items.length === 0) {
            delete this._owner.Node.DataSources;
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

    private static ToTypeName(fieldType: DataFieldType): string {
        switch (fieldType) {
            case DataFieldType.String: return "String";
            case DataFieldType.Boolean: return "Boolean";
            case DataFieldType.DateTime: return "DateTime";
            case DataFieldType.Decimal: return "Decimal";
            case DataFieldType.Enum:
            case DataFieldType.Byte:
            case DataFieldType.Int16:
            case DataFieldType.Int32:
            case DataFieldType.Int64:
            case DataFieldType.UInt16:
            case DataFieldType.UInt32:
            case DataFieldType.UInt64: return "Integer";
            case DataFieldType.Float:
            case DataFieldType.Double: return "Float";
            default: return "String";
        }
    }

    public static readonly TypeNames: string[] = [
        "String", "Boolean", "DateTime", "Decimal",
        "Integer", "Double"
    ];

}
