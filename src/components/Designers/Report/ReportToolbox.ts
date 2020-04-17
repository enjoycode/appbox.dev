import ReportItemDesigner from "./Designers/ReportItemDesigner";
import { IDesignToolboxItem, IDesignToolbox } from '@/components/Canvas/Services/ToolboxService';
import DesignSurface from '@/components/Canvas/DesignSurface';
import ItemDesigner from '@/components/Canvas/Designers/ItemDesigner';
import ReportXmlNodeDesigner from './Designers/ReportXmlNodeDesigner';
import XmlUtil from './Designers/XmlUtil';
import DesignStore from "@/design/DesignStore";
import TextboxDesigner from './Designers/TextboxDesigner';
import TableDesigner from './Designers/TableDesigner';

class ReportToolboxItem<T extends ReportItemDesigner> implements IDesignToolboxItem {
    public get IsConnection(): boolean { return false; }
    private readonly factory: (node: Node) => T;
    public readonly Name: string;
    public readonly Icon?: string;

    constructor(ctor: { new(node: Node): T }, icon: string | null = null) {
        this.factory = (n) => new ctor(n);

        let funcNameRegex = /function (.{1,})\(/;
        let results = (funcNameRegex).exec(ctor.toString());
        let name = (results && results.length > 1) ? results[1] : "";
        this.Name = name.slice(0, name.length - 8 /* xxxDesigner */);
        this.Icon = icon;
    }

    public Create(parent: DesignSurface | ItemDesigner): ItemDesigner {
        //parent不可能是DesignSurface
        let p = parent as ReportXmlNodeDesigner;
        let itemsNode = XmlUtil.GetOrCreateChildNode(p.XmlNode, "ReportItems");
        let newNode = itemsNode.appendChild(p.XmlNode.ownerDocument.createElement(this.Name));
        return this.factory(newNode);
    }
}

export default class ReportToolbox implements IDesignToolbox {

    public get SelectedItem(): IDesignToolboxItem | null {
        if (!DesignStore.toolBoxTree) { return null; }
        let item = DesignStore.toolBoxTree.getSelected();
        if (item instanceof ReportToolboxItem) { return item; }
        return null;
    }
    public set SelectedItem(value) { //暂只支持清空选择
        if (!DesignStore.toolBoxTree) { return; }
        DesignStore.toolBoxTree.clearSelected();
    }

    public static GetToolboxItems(): IDesignToolboxItem[] {
        return [
            new ReportToolboxItem<TextboxDesigner>(TextboxDesigner, "text-width"),
            new ReportToolboxItem<TableDesigner>(TableDesigner, "table"),
        ]
    }

}