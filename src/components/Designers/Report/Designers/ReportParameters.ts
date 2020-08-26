// import ReportRootDesigner from './ReportRootDesigner';
// import XmlUtil from './XmlUtil';
// import { IPropertyOwner, IPropertyCatalog } from '@/components/Canvas/Interfaces/IPropertyPanel';
// import ReportDataSets from './ReportDataSet';

// export class ReportParameter implements IPropertyOwner {
//     private readonly _owner: ReportParameters;
//     private readonly _node: Element;
//     public get Node(): Node { return this._node; }

//     public get Name(): string { return this._node.getAttribute("Name"); }
//     public set Name(value) { this._node.setAttribute("Name", value); }

//     public get DataType(): string {
//         let n = XmlUtil.GetNamedChildNode(this._node, "DataType");
//         if (!n) { return "String"; }
//         return n.textContent;
//     }
//     public set DataType(value) {
//         let n = XmlUtil.GetOrCreateChildNode(this._node, "DataType");
//         n.textContent = value;
//     }

//     // TODO: 暂只支持单个默认值
//     public get DefaultValue(): string {
//         let n = XmlUtil.GetNamedChildNode(this._node, "DefaultValue");
//         if (!n) { return ""; }
//         let values = XmlUtil.GetNamedChildNode(n, "Values");
//         if (!values) { return ""; }
//         let v = XmlUtil.GetNamedChildNode(values, "Value");
//         if (!v) { return ""; }
//         return v.textContent;
//     }
//     public set DefaultValue(value) {
//         let n = XmlUtil.GetOrCreateChildNode(this._node, "DefaultValue");
//         let values = XmlUtil.GetOrCreateChildNode(n, "Values");
//         let v = XmlUtil.GetOrCreateChildNode(values, "Value");
//         v.textContent = value;
//     }

//     constructor(owner: ReportParameters, node: Node) {
//         this._owner = owner;
//         this._node = node as Element;
//     }

//     //====IPropertyOwner====
//     public getPropertyOwnerType(): string { return "Parameter"; }

//     public getPropertyItems(): IPropertyCatalog[] {
//         let cats: IPropertyCatalog[] = [
//             {
//                 name: "Common",
//                 items: [
//                     {
//                         title: "Name", readonly: false, editor: "TextBox",
//                         getter: () => this.Name,
//                         setter: v => { this.Name = v; }
//                     },
//                     {
//                         title: "DataType", readonly: false, editor: "Select",
//                         options: ReportDataSets.TypeNames,
//                         getter: () => this.DataType,
//                         setter: v => { this.DataType = v; }
//                     },
//                     {
//                         title: "DefaultValue", readonly: false, editor: "TextBox",
//                         getter: () => this.DefaultValue,
//                         setter: v => { this.DefaultValue = v; }
//                     },
//                 ]
//             }
//         ]
//         return cats;
//     }
// }

// export default class ReportParameters {

//     private readonly _owner: ReportRootDesigner;
//     private _node: Node; // ReportParameters node of Report
//     private readonly _items: ReportParameter[] = [];
//     public get Items(): ReportParameter[] { return this._items; }

//     constructor(owner: ReportRootDesigner) {
//         this._owner = owner;
//         this._node = XmlUtil.GetNamedChildNode(owner.XmlNode, "ReportParameters");
//         if (this._node) {
//             for (const cnode of this._node.childNodes) {
//                 if (cnode.nodeType !== Node.ELEMENT_NODE) { continue; }
//                 this._items.push(new ReportParameter(this, cnode));
//             }
//         }
//     }

//     public Add(name: string): void {
//         //TODO: check name exists
//         if (!this._node) {
//             this._node = XmlUtil.CreateChildNode(this._owner.XmlNode, "ReportParameters");
//         }
//         let cnode = XmlUtil.CreateChildNode(this._node, "ReportParameter");
//         let ds = new ReportParameter(this, cnode);
//         ds.Name = name;
//         ds.DataType = "String"; //默认
//         this._items.push(ds);
//     }

//     public Remove(img: ReportParameter): void {
//         //TODO: 检查是否有引用
//         this._node.removeChild(img.Node);
//         this._items.splice(this._items.indexOf(img), 1);
//         if (this._items.length === 0) {
//             this._owner.XmlNode.removeChild(this._node);
//             this._node = null;
//         }
//     }

//     /**
//      * 获取所有DataSet的名称集合，用于属性面板绑定
//      */
//     public GetNames(): string[] {
//         let res: string[] = [];
//         for (const ds of this._items) {
//             res.push(ds.Name);
//         }
//         return res;
//     }

// }