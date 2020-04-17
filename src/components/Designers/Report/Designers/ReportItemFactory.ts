import ReportItemDesigner from './ReportItemDesigner';
import TextboxDesigner from './TextboxDesigner';
import TableDesigner from './TableDesigner';
import { TableCell } from './TableLayout';

export default class ReportItemFactory {

    public static Make(node: Node, cell: TableCell | null): ReportItemDesigner | null {
        switch(node.nodeName) {
            case "Textbox": return new TextboxDesigner(node, cell);
            case "Table": return new TableDesigner(node);
            default: 
                console.warn("未实现创建: " + node.nodeName);
        }
    }

}