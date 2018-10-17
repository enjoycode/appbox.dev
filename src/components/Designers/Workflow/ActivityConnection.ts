import ConnectionDesigner from '../../Canvas/Designers/ConnectionDesigner'
import IShape from '../../Canvas/Interfaces/IShape'
import ActivityDesigner from './ActivityDesigner'
import CapType from '../../Canvas/Core/Declaratives/CapType'
import Point from '../../Canvas/Drawing/Point'
import DesignBehavior from '../../Canvas/Enums/DesignBehavior'
import { IPropertyCatalog } from '../../Canvas/Interfaces/IPropertyPanel'

export class ActivityModel {
    public Title: string;
    public Location: Point;
    public GetOutLinks(): Array<FlowLink> | null {
        return null;
    }

    public GetAvaliableOutLinks(): Array<FlowLink> | null {
        var links = this.GetOutLinks();
        if (links == null || links.length == 0)
            return null;
        var outLinks: Array<FlowLink> = new Array<FlowLink>();

        // return links.Where(t => t.SourceConnection == null).ToArray();
        links.forEach(t => {
            var link: FlowLink = new FlowLink();
            link.Name = t.Name;
            link.SourceConnection = t.SourceConnection;
            link.SourceConnector = t.SourceConnector;
            link.Target = t.Target;
            link.TargetConnector = t.TargetConnector;
            outLinks.push(link);
        });
        return outLinks;
    }
}

export class FlowLink {
    public Name: string | null;
    public SourceConnector: string = 'Auto';
    public TargetConnector: string = 'Auto';
    public SourceConnection: ActivityConnection | null;
    public Target: ActivityModel | null;
}

export default class ActivityConnection extends ConnectionDesigner {
    //todo:临时方案用于解决移动已连接源至相同的源但Connector不同
    private _preSourceLink: FlowLink | null;
    private _preSource: IShape | null; //同上组合

    private _sourceLink: FlowLink | null;

    private _isLoading: boolean = false;

    public get Behavior(): DesignBehavior {
        return DesignBehavior.None;
    }

    // public FlowLink Link{
    //     get { return this._sourceLink; }
    // }     

    // public get Title(): string | null {
    //     if (this._sourceLink == null)
    //         return null;
    //     return this._sourceLink.Name;
    // }

    // public set Title(value: string | null) {
    //     if (this._sourceLink != null) {
    //         //todo ....
    //         //暂直接修改单人活动的连接名称所对应的Action.Name
    //         // var designer = this.Source as ActivityDesigner;
    //         // SingleHumanActivityModel sham = designer.Model as SingleHumanActivityModel;
    //         // if (sham != null){
    //         //     var act = sham.Actions.Single(t => t.Name == _sourceLink.Name);
    //         //     act.Name = value;
    //         //     act.AcceptNameChange();
    //         // }
    //         this._sourceLink.Name = value;
    //     }
    // }

    // constructor(link: FlowLink, source: ActivityDesigner | null, target: ActivityDesigner | null) {
    //     super();
    //     this.BackColor = 'DarkGreen';
    //     this.TargetCapType = CapType.Arrow2Filled;
    //     this.Route = true;
    //     this._isLoading = true;
    //     this._sourceLink = link;
    //     if (this._sourceLink != null)
    //         this._sourceLink.SourceConnection = this;
    // }

    public DetachSourceLink(): void {
        if (this._sourceLink != null) {
            this._sourceLink.SourceConnection = null;
        } else {
            this._preSource = null;
            this._preSourceLink = null;
        }
    }

    public OnRemoveFromSurface(): void {
        if (this.Source != null && this.Target != null) {
            if (this._sourceLink != null)
                this._sourceLink.Target = null;
        }
        if (this.Source != null) {
            if (this._sourceLink != null)
                this._sourceLink.SourceConnection = null;
            this._sourceLink = null;
        } else {
            this._preSource = null;
            this._preSourceLink = null;
        }

        super.OnRemoveFromSurface();
        this.Invalidate();
    }

    public OnSourceChanged(oldSource: IShape): void {
        super.OnSourceChanged(oldSource);
        // if (this._isLoading)
        //     return;
        // var oldSourceModel: ActivityModel | null = oldSource == null ? null : (oldSource as ActivityDesigner).Model;
        // var newSourceModel: ActivityModel | null = this.Source == null ? null : (this.Source as ActivityDesigner).Model;
        // //注意：不可能存在 non null -> non null，设计器拖动首尾点时自动清空
        // if (oldSourceModel == null && newSourceModel != null) {
        //     //todo:对话框选择可供输出的连接名称，如HumanAction或Decision有多个输出
        //     var avaliableConnections = newSourceModel.GetAvaliableOutLinks();
        // }
    }

    public OnTargetChanged(oldTarget: IShape): void {
        super.OnTargetChanged(oldTarget);

        if (this._isLoading)
            return;
        console.log('OnTargetChanged todo....');
        // if (this.Source != null && this._sourceLink != null){
        //     var sourceModel: ActivityModel = (this.Source as ActivityDesigner).Model;
        //     var oldTargetModel: ActivityModel = oldTarget == null ? null : ((ActivityDesigner)oldTarget).Model;
        //     var newTargetModel: ActivityModel = this.Target == null ? null : ((ActivityDesigner)this.Target).Model;

        //     //注意：不可能存在 non null -> non null，设计器拖动首尾点时自动清空
        //     if (oldTargetModel == null && newTargetModel != null) //null -> non null
        //     {
        //         this._sourceLink.SourceConnector = this.SourceConnectorPosition;
        //         this._sourceLink.TargetConnector = this.TargetConnectorPosition;
        //         this._sourceLink.Target = newTargetModel;
        //     }
        //     else if (oldTargetModel != null && newTargetModel == null) //non null -> null
        //     {
        //         this._sourceLink.Target = null;
        //     }
        // }
    }

    public OnSourceConnectorPositionChanged(newPosition: string, oldPosition: string): void {
        super.OnSourceConnectorPositionChanged(newPosition, oldPosition);

        if (this._isLoading)
            return;

        if (this._sourceLink != null)
            this._sourceLink.SourceConnector = newPosition;
    }

    public OnTargetConnectorPositionChanged(newPosition: string, oldPosition: string): void {
        super.OnTargetConnectorPositionChanged(newPosition, oldPosition);

        if (this._isLoading)
            return;

        if (this._sourceLink != null)
            this._sourceLink.TargetConnector = newPosition;
    }

    //===============IPropertyOwner实现==================
    public getPropertyItems(): IPropertyCatalog[] | null {
        var res = new Array<IPropertyCatalog>();
        let _this = this;
        res.push({
            name: "显示", items: [
                { title: "标题", editorType: "TextBox", readonly: true, getter: () => _this.Title, setter: (v) => { } }
            ]
        });
        res.push({
            name: "位置", items: [
                { title: "开始点", editorType: "TextBox", readonly: true, getter: () => _this.StartPoint.toString(), setter: (v) => { } },
                { title: "结束点", editorType: "TextBox", readonly: true, getter: () => _this.EndPoint.toString(), setter: (v) => { } }
            ]
        });
        return res;
    }
}