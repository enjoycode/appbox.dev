import Point from '../../Canvas/Drawing/Point'
import Rectangle from '../../Canvas/Drawing/Rectangle'
import ItemDesigner from '../../Canvas/Designers/ItemDesigner'
import IDesignService from '../../Canvas/Services/IDesignService'
import DesignSurface from '../../Canvas/DesignSurface'
import ActivityConnection from './ActivityConnection'
import ActivityDesigner from './ActivityDesigner'
import IShape from '../../Canvas/Interfaces/IShape'
import IConnection from '../../Canvas/Interfaces/IConnection'
import { IPropertyOwner, IPropertyCatalog } from '../../Canvas/Interfaces/IPropertyPanel'


interface IChannel {
    invoke(service: string, args: Array<any>): Promise<any>;
}

interface IWorkflowData {
    Connections: Array<any>;
    Designers: Array<any>;
}

/**仅用于包装*/
class WorkflowRootDesigner implements IPropertyOwner {

    private readonly _service: WorkflowDesignService;

    constructor(service: WorkflowDesignService) {
        this._service = service;
    }

    getPropertyOwnerType(): string {
        return "工作流模型";
    }

    getPropertyItems(): IPropertyCatalog[] | null {
        var res = new Array<IPropertyCatalog>();
        res.push({
            name: "属性", items: [
                { title: "标识", editorType: "TextBox", readonly: true, getter: () => this._service.ModelID, setter: (v) => { } },
                { title: "参数", editorType: "TextBox", readonly: false, getter: () => '参数列表', setter: (v) => { } }
            ]
        });
        return res;
    }
}

export default class WorkflowDesignService implements IDesignService {
    private readonly _surface: DesignSurface;
    private readonly _channel: IChannel;
    private readonly _modelId: string

    public get ModelID(): string {
        return this._modelId;
    }

    private readonly _rootDesigner: IPropertyOwner;
    public get RootDesigner(): IPropertyOwner {
        return this._rootDesigner;
    }

    constructor(surface: DesignSurface, channel: IChannel, modelId: string) {
        this._surface = surface;
        this._channel = channel;
        this._modelId = modelId;
        this._surface.DesignService = this;
        this._rootDesigner = new WorkflowRootDesigner(this);
    }

    public ChangeProperty(item: ItemDesigner, name: string, tag: any, value: any): void {
        this._channel.invoke("sys.DesignHub.ChangeWorkflowItemProperty", [this._modelId, item.ID, name, tag, value]).then(res => {
            if (res) {
                let items = res as Array<any>;
                for (var i = 0; i < items.length; i++) {
                    var element = items[i];
                    // 先根据ID找到对应的设计器
                    let designer = this.FindByID(element.ID);
                    if (designer) {
                        designer.Fetch(element);
                    }

                    //todo: 暂全部重绘
                    this._surface.Invalidate();
                }
            }
        }).catch(err => {
            console.log("ChangeProperty Error:", err);
        })
    }

    private FindByID(id: number): ItemDesigner | null {
        for (var i = 0; i < this._surface.Items.length; i++) {
            var element = this._surface.Items[i];
            if (element.ID === id) {
                return element;
            }
        }
        return null;
    }

    public LoadDesignersFromServer(data: IWorkflowData): void {
        //先加载Designers
        for (var i = 0; i < data.Designers.length; i++) {
            var element = data.Designers[i];
            var designer = new ActivityDesigner();
            designer.Fetch(element);
            this._surface.AddItem(designer);
        }

        //再加载Connections，注意：处理Source及Target引用
        for (var i = 0; i < data.Connections.length; i++) {
            var element = data.Connections[i];
            var connection = new ActivityConnection();
            connection.Fetch(element);
            this._surface.AddItem(connection);
        }

        //必须调用一次
        this._surface.PropertyPanel.setPropertyOwner(this._rootDesigner);

        //重新刷新
        this._surface.Invalidate();
    }

    public GetShapes(): Array<IShape> {
        let list = new Array<IShape>();
        for (var i = 0; i < this._surface.Items.length; i++) {
            var element = this._surface.Items[i];
            if (element instanceof ActivityDesigner) {
                list.push(element);
            }
        }
        return list;
    }

    public GetConnections(): Array<IConnection> {
        let list = new Array<IConnection>();
        for (var i = 0; i < this._surface.Items.length; i++) {
            var element = this._surface.Items[i];
            if (element instanceof ActivityConnection) {
                list.push(element);
            }
        }
        return list;
    }

}