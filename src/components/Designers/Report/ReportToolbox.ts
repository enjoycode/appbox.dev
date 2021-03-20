import ReportItemDesigner from "./Designers/ReportItemDesigner";
import { IDesignToolboxItem, IDesignToolbox } from '@/components/Canvas/Services/ToolboxService';
import DesignSurface from '@/components/Canvas/DesignSurface';
import ItemDesigner from '@/components/Canvas/Designers/ItemDesigner';
import DesignStore from "@/design/DesignStore";
import TextBoxDesigner from './Designers/TextboxDesigner';
import ReportObjectDesigner from './Designers/ReportObjectDesigner';
import TableDesigner from './Designers/TableDesigner';
import BarcodeDesigner from "./Designers/BarcodeDesigner";
import ImageDesigner from './Designers/ImageDesigner';
// import RectangleDesigner from './Designers/RectangleDesigner';
// import ListDesigner from './Designers/ListDesigner';
import ChartDesigner from './Designers/ChartDesigner';

class ReportToolboxItem<T extends ReportItemDesigner> implements IDesignToolboxItem {
    public get IsConnection(): boolean { return false; }
    private readonly factory: (node: any) => T;
    public readonly Name: string;
    public readonly Icon?: string;

    constructor(ctor: { new(node: any): T }, icon: string | null = null) {
        this.factory = (n) => new ctor(n);

        let funcNameRegex = /function (.{1,})\(/;
        let results = (funcNameRegex).exec(ctor.toString());
        let name = (results && results.length > 1) ? results[1] : "";
        this.Name = name.slice(0, name.length - 8 /* xxxDesigner */);
        this.Icon = icon;
    }

    public Create(parent: DesignSurface | ItemDesigner): ItemDesigner {
        //parent不可能是DesignSurface
        let p = parent as ReportObjectDesigner;
        if (!p.Node["Items"]) {
            p.Node["Items"] = [];
        }
        let itemsNode = p.Node["Items"];
        let newNode = { $T: this.Name };
        itemsNode.push(newNode);
        return this.factory(newNode);
    }
}

export default class ReportToolbox implements IDesignToolbox {

    public get SelectedItem(): IDesignToolboxItem | null {
        if (!DesignStore.toolbox) { return null; }
        let item = DesignStore.toolbox.getSelected();
        if (item instanceof ReportToolboxItem) { return item; }
        return null;
    }
    public set SelectedItem(value) { //暂只支持清空选择
        if (!DesignStore.toolbox) { return; }
        DesignStore.toolbox.clearSelected();
    }

    public static GetToolboxItems(): IDesignToolboxItem[] {
        return [
            new ReportToolboxItem<TextBoxDesigner>(TextBoxDesigner, "text-width"),
            new ReportToolboxItem<TableDesigner>(TableDesigner, "table"),
            // new ReportToolboxItem<ListDesigner>(ListDesigner, "list"),
            new ReportToolboxItem<ChartDesigner>(ChartDesigner, "chart-bar"),
            new ReportToolboxItem<ImageDesigner>(ImageDesigner, "image"),
            new ReportToolboxItem<BarcodeDesigner>(BarcodeDesigner, "barcode"),
            // new ReportToolboxItem<RectangleDesigner>(RectangleDesigner, "square"),
        ]
    }

    public static Make(node: any): ReportItemDesigner | null {
        switch (node.$T) {
            case "TextBox": return new TextBoxDesigner(node);
            case "Table": return new TableDesigner(node);
            case "Image": return new ImageDesigner(node);
            case "Barcode": return new BarcodeDesigner(node);
            // case "List": return new ListDesigner(node);
            // case "Chart": return new ChartDesigner(node);
            // case "Rectangle": return new RectangleDesigner(node);
            default:
                console.warn("未实现创建: " + node.$T);
        }
    }

}
