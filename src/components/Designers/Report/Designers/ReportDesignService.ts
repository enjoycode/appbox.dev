import IDesignService from '@/components/Canvas/Services/IDesignService'
import IShape from '@/components/Canvas/Interfaces/IShape'
import IConnection from '@/components/Canvas/Interfaces/IConnection'
import DesignSurface from '@/components/Canvas/DesignSurface'
import ItemDesigner from '@/components/Canvas/Designers/ItemDesigner'
import ReportItemDesigner from './ReportItemDesigner'
import ReportRootDesigner from './ReportRootDesigner'
import ReportXmlNodeDesigner from './ReportXmlNodeDesigner'

interface IChannel {
    invoke(service: string, args: Array<any>): Promise<any>;
}

export default class ReportDesignService implements IDesignService {

    private readonly _surface: DesignSurface;
    private readonly _channel: IChannel;
    private readonly _modelId: string
    private _rootDesigner: ItemDesigner;

    public get RootDesigner(): ItemDesigner {
        return this._rootDesigner;
    }

    constructor(surface: DesignSurface, channel: IChannel, modelId: string) {
        this._surface = surface;
        this._channel = channel;
        this._modelId = modelId;
        this._surface.DesignService = this;
    }

    //TODO: 仅测试用待移除
    private loadXMLString(txt: string): XMLDocument {
        try //Internet Explorer
        {
            var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(txt);
            return (xmlDoc);
        }
        catch (e) {
            try //Firefox, Mozilla, Opera, etc.
            {
                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(txt, "text/xml");
                return (xmlDoc);
            }
            catch (e) { alert(e.message) }
        }
        return (null);
    }

    /**
     * 获取当前报表定义的xml文本
     */
    public GetXmlString(): string {
        let xmlDoc = (this._rootDesigner as ReportXmlNodeDesigner).XmlNode.ownerDocument;
        return (new XMLSerializer()).serializeToString(xmlDoc); // TODO:IE不支持 XMLSerializer对象。它通过Node对象的xml属性
    }

    public LoadDesignersFromServer(reportModelId: string): void {
        //TODO:从服务端加载报表定义Xml
        var xml = '<Report>'
        xml += '<PageWidth>200mm</PageWidth>'
        xml += '<PageHeight>140mm</PageHeight>'
        xml += '<PageHeader>'
        xml += '<Height>20mm</Height>'
        xml += '<ReportItems>'
        xml += '<Textbox Name="Textbox1">'
        xml += '<Left>50pt</Left>'
        xml += '<Top>10pt</Top>'
        xml += '<Width>100pt</Width>'
        xml += '<Height>30pt</Height>'
        xml += '<Value>测试报表 Hello Future! 1234567890</Value>'
        xml += '</Textbox>'
        xml += '</ReportItems>'
        xml += '</PageHeader>'
        xml += '<Body>'
        xml += '<Height>40mm</Height>'
        xml += '</Body>'
        xml += '<PageFooter>'
        xml += '<Height>15mm</Height>'
        xml += '</PageFooter>'
        xml += "</Report>";
        let xmlDoc = this.loadXMLString(xml);
        var reportNode = xmlDoc.getElementsByTagName("Report")[0]

        var rootDesigner = new ReportRootDesigner(reportNode);
        //ReportDesignService.LoopLoadChildren(rootDesigner, root);
        this._rootDesigner = rootDesigner;
        this._surface.AddItem(this._rootDesigner);

        //必须调用一次
        this._surface.PropertyPanel.setPropertyOwner(this._rootDesigner);
        //重新刷新
        this._surface.Invalidate();
    }

    public ChangeProperty(item: ItemDesigner, name: string, tag: any, value: any): void {
        console.log("ReportDesignService.ChangeProperty: " + name, value)
        // this._channel.invoke("sys.DesignService.ChangeReportItemProperty", [this._modelId, item.ID, name, tag, value]).then(res => {
        //     if (res) {
        //         let item = (res as IServerReportItem[])[0]; //todo:暂只返回一个
        //         // 先根据ID找到对应的设计器
        //         let designer = ReportDesignService.LoopFindByID(this._rootDesigner, item.ID);
        //         if (designer) {
        //             designer.Fetch(item);
        //             if (item.Items) {
        //                 for (var i = 0; i < item.Items.length; i++) {
        //                     var element = item.Items[i];
        //                     var subDesigner = ReportDesignService.LoopFindByID(designer, element.ID);
        //                     if (subDesigner) {
        //                         subDesigner.Fetch(element);
        //                     } else {
        //                         //添加新增
        //                         var newSubDesigner = ReportDesignService.CreateDesigner(element.ItemType);
        //                         newSubDesigner.Fetch(element);
        //                         ReportDesignService.LoopLoadChildren(newSubDesigner, element);
        //                         designer.AddItem(newSubDesigner);
        //                     }
        //                 }
        //                 if (designer.Items.length != item.Items.length) {
        //                     //删除节点
        //                     var found: ItemDesigner | null ;
        //                     for (var i = 0; i < designer.Items.length; i++) {
        //                         found = designer.Items[i];
        //                         for (var j = 0; j < item.Items.length; j++) {
        //                             if (designer.Items[i].ID == item.Items[j].ID) {
        //                                 found = null;
        //                                 break;
        //                             }
        //                         }
        //                         if (found) {
        //                             //删除节点
        //                             designer.RemoveItem(found);
        //                         }
        //                     }
        //                 }
        //                 //重新绘制
        //                 if (designer instanceof ReportRootDesigner) { //todo: 暂ReportRootDesigner重绘Surface
        //                     if (this._rootDesigner.Surface) {
        //                         this._rootDesigner.Surface.Invalidate();
        //                     }
        //                 } else {
        //                     designer.Invalidate();
        //                 }
        //             }
        //         }
        //     }
        // }).catch(err => {
        //     console.log("ChangeProperty Error:", err);
        // })
    }

    public TableOperation(opt: string): void {
        var items = this._surface.SelectionService.SelectedItems;
        if (opt == 'SplitCells') {
            if (items.length != 1) {
                return;
            }
            let item = items[0]
            if (item instanceof ReportItemDesigner && item.Parent) {
                if (!item.IsTableCell)
                    return;
                if (item.Cell)
                    ReportDesignService.ChangeProperty(item.Parent, opt, item.Cell.RI, item.Cell.CI);
            }
            return;
        }

        if (opt == 'InsertRow') {
            if (items.length != 1) {
                return;
            }
            let item = items[0]
            if (item instanceof ReportItemDesigner && item.Parent) {
                if (!item.IsTableCell)
                    return;
                if (item.Cell)
                    ReportDesignService.ChangeProperty(item.Parent, opt, item.Cell.RI, item.Cell.CI);
            }
            return;
        }
        if (opt == 'InsertColumn') {
            if (items.length != 1) {
                return;
            }
            let item = items[0]
            if (item instanceof ReportItemDesigner && item.Parent) {
                if (!item.IsTableCell)
                    return;
                if (item.Cell)
                    ReportDesignService.ChangeProperty(item.Parent, opt, item.Cell.RI, item.Cell.CI);
            }
            return;
        }
        if (opt == 'MergeCells') {
            if (items.length <= 1)
                return;
            var cells: string = '';
            for (var i = 0; i < items.length; i++) {
                let item = items[i];
                if (item instanceof ReportItemDesigner && item.Parent) {
                    if (!item.IsTableCell)
                        return;
                    if (item.Cell)
                        cells += item.ID + ';';
                }
            }
            var parent = items[0].Parent;
            if (parent)
                ReportDesignService.ChangeProperty(parent, opt, items.length, cells);
            return;
        }
    }

    public GetShapes(): Array<IShape> {
        return [];
    }

    public GetConnections(): Array<IConnection> {
        return [];
    }

    //======================以下静态辅助方法=====================
    /**
     * 改变设计元素的某项属性，此静态方法只是调用实例同名方法的代理
     * @param item 
     * @param name 
     * @param tag 用于辅助定位元素属性，如TableLayout.RowIndex
     * @param value 
     */
    public static ChangeProperty(item: ItemDesigner, name: string, tag: any, value: any): void {
        if (item.Surface) {
            item.Surface.DesignService.ChangeProperty(item, name, tag, value);
        }
    }

    private static LoopFindByID(parent: ItemDesigner, id: number): ItemDesigner | null {
        if (parent.ID === id)
            return parent;

        if (parent.Items) {
            var found: ItemDesigner | null = null;
            for (var i = 0; i < parent.Items.length; i++) {
                found = ReportDesignService.LoopFindByID(parent.Items[i], id);
                if (found)
                    return found;
            }
        }

        return null;
    }

}