import ReportItemDesigner from './ReportItemDesigner';
import TextboxDesigner from './TextboxDesigner';
import TableDesigner from './TableDesigner';
import BarcodeDesigner from "./BarcodeDesigner";
import ImageDesigner from './ImageDesigner';
import { TableCell } from './TableLayout';
import XmlUtil from './XmlUtil';

export default class ReportItemFactory {

    public static Make(node: Node, cell: TableCell | null): ReportItemDesigner | null {
        switch (node.nodeName) {
            case "Textbox": return new TextboxDesigner(node, cell);
            case "Table": return new TableDesigner(node);
            case "Image": return new ImageDesigner(node, cell);
            case "CustomReportItem":
                let typeNode = XmlUtil.GetNamedChildNode(node, "Type");
                if (!typeNode) {
                    console.warn("Unknown CustomReportItem's Type");
                    return null;
                }
                // TODO:暂简单认为是条码
                return new BarcodeDesigner(node, cell);
            default:
                console.warn("未实现创建: " + node.nodeName);
        }
    }

}