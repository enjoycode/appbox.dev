// import ReportItemDesigner from './ReportItemDesigner'
// import { IPropertyCatalog } from '@/components/Canvas/Interfaces/IPropertyPanel';
// import XmlUtil from './XmlUtil';
// import ReportItemFactory from './ReportItemFactory';
// import { TableCell } from './TableLayout';
// import Rectangle from '@/components/Canvas/Drawing/Rectangle';

// export default class RectangleDesigner extends ReportItemDesigner {

//     public get IsContainer(): boolean { return true; }

//     constructor(xmlNode: Node, cell: TableCell | null = null) {
//         super(xmlNode);

//         // 开始加载报表元素
//         let itemsNode = XmlUtil.GetNamedChildNode(this.xmlNode, "ReportItems");
//         if (itemsNode) {
//             for (const cnode of itemsNode.childNodes) {
//                 if (cnode.nodeType === Node.ELEMENT_NODE) {
//                     let child = ReportItemFactory.Make(cnode, null);
//                     if (child) { this.AddItem(child); }
//                 }
//             }
//         }
//     }

//     public Paint(g: CanvasRenderingContext2D, clip?: Rectangle): void {
//         let b = this.Bounds; // 注意在表格内是计算出来的
//         g.save();
//         g.beginPath();
//         g.rect(b.X, b.Y, b.Width, b.Height);
//         g.clip();

//         // 绘制背景 //TODO:其他样式如渐变等
//         let bgColor = this.Style.GetStyle("BackgroundColor", null);
//         if (bgColor) {
//             g.fillStyle = bgColor;
//             g.fillRect(b.X, b.Y, b.Width, b.Height);
//         }

//         // 绘制边框
//         g.strokeStyle = "rgb(173,219,241)";
//         g.lineWidth = 1;
//         g.strokeRect(b.X, b.Y, b.Width, b.Height);

//         g.restore();
//     }

//     //============IPropertyOwner接口实现=====
//     // public getPropertyItems(): IPropertyCatalog[] | null {
//     //     let cats: IPropertyCatalog[] = super.getPropertyItems();
//     //     cats.splice(0, 0, {
//     //         name: "Common",
//     //         items: [
//     //             {
//     //                 title: "Value", readonly: false, editor: "TextBox",
//     //                 getter: () => this.GetPropertyString("Value", ""),
//     //                 setter: v => this.SetPropertyString("Value", v, true)
//     //             },
//     //             {
//     //                 title: "CanGrow", readonly: false, editor: "CheckBox",
//     //                 getter: () => this.GetPropertyBool("CanGrow", false),
//     //                 setter: v => this.SetPropertyBool("CanGrow", v)
//     //             },
//     //             {
//     //                 title: "CanShrink", readonly: false, editor: "CheckBox",
//     //                 getter: () => this.GetPropertyBool("CanShrink", false),
//     //                 setter: v => this.SetPropertyBool("CanShrink", v)
//     //             },
//     //         ]
//     //     });
//     //     return cats;
//     // }

// }