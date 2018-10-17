import Size from '../../Canvas/Drawing/Size'
import Rectangle from '../../Canvas/Drawing/Rectangle'
import DesignBehavior from '../../Canvas/Enums/DesignBehavior'
import ShapeDesigner from '../../Canvas/Designers/ShapeDesigner'
import ItemDesigner from '../../Canvas/Designers/ItemDesigner'
import IConnection from '../../Canvas/Interfaces/IConnection'
import ActivityModel from './ActivityPainters/ActivityModel'
import IActivityPainter from './ActivityPainters/IActivityPainter'
import StartActivityPainter from './ActivityPainters/StartActivityPainter'
import HumanActivityPainter from './ActivityPainters/HumanActivityPainter'
import AutomationActivityPainter from './ActivityPainters/AutomationActivityPainter'
import DecisionActivityPainter from './ActivityPainters/DecisionActivityPainter'

enum BoundsSpecified {
    None = 0x00000000,
    X = 0x00000001,
    Y = 0x00000002,
    Location = 0x00000003,
    Width = 0x00000004,
    Height = 0x00000008,
    Size = 0x0000000c,
    All = 0x0000000f
}

export default class ActivityDesigner extends ShapeDesigner {
    private _size: Size;
    private _painter: IActivityPainter | null = null;
    public _title: string;
    public get Behavior(): DesignBehavior {
        return DesignBehavior.CanMove; //暂禁止改变大小
    }

    constructor() {
        super();

        //todo!!!!
        // var typeName = model.Name;
        // this._painter = ActivityPainters.GetPainter(typeName.Remove(typeName.Length - 5));
        // this.SetBounds(model.Location.X, model.Location.Y, 0, 0, BoundsSpecified.All); //todo: check it

        // var humanAM:HumanActivityModel = _model as HumanActivityModel;
        // if (humanAM != null)
        //     humanAM.ActionsChanging += OnHumanActionsChanging;
    }

    public OnAddToSurface(): void {
        super.OnAddToSurface();
        super.Invalidate();
    }
    public OnRemoveFromSurface(): void {
        //判断连接至当前模型实例的，打断连接
        // var links = this.Surface.GetConnections();
        // for (var i: number = 0; i < links.Count; i++)
        // {
        //     if (links[i].Source == this){
        //         //暂直接删除连接线，由连接线的OnRemoveFromSurface处理相关逻辑
        //         var designer = links[i] as ItemDesigner;
        //         if (designer != null)
        //             designer.Remove();
        //         else
        //             links[i].Source = null;
        //     }
        //     else if (links[i].Target == this)
        //     {
        //         links[i].Target = null;
        //     }
        // }
        console.log('ActivityDesigner OnRemoveFromSurface todo!!!!');
        super.OnRemoveFromSurface();
    }

    public Invalidate(): void {
        /*if (this.Parent != null)
            this.Parent.Invalidate();
        else*/
        if (this.Surface != null) {
            var rect: Rectangle = new Rectangle(this.Bounds.X - 1, this.Bounds.Y - 1, this.Bounds.Width + 2, this.Bounds.Height + 2);
            this.Surface.Invalidate(rect);
            // this.Surface.Invalidate(Rectangle.Ceiling(Rectangle.Inflate(this.Bounds, 1, 1)));
        }
    }

    public CanConnect(isStartPoint: boolean, connection: IConnection): boolean {
        // if (isStartPoint){
        //     if (connection.Target != null && connection.Target == this)
        //         return false;

        //     var avaLinks = this.Model.GetAvaliableOutLinks();
        //     if (avaLinks == null || avaLinks.Length == 0)
        //         return false;
        // }else{
        //     if (this.Model is StartActivityModel) //暂用此判断排除开始节点，即开始节点不允许接入
        //         return false;

        //     if (connection.Source != null && connection.Source == this)
        //        return false;
        // }
        console.log('ActivityDesigner CanConnect todo.....\n');
        return true;
    }

    /// <summary>
    /// 用于监测HumanActivity的ActionsChanged
    /// </summary>
    // private  OnHumanActionsChanging(e: HumanActionsChangingEventArgs) : void
    // {
    // var humanActivity = this._model as HumanActivityModel;
    // if (humanActivity.IsSingleHuman) //单人活动
    //  {
    //     //1.处理删除的
    //     var deletes = e.OldActions.Except(e.NewActions).ToArray();
    //     if (deletes.Length > 0)
    //     {
    //         var connections = this.Surface.GetConnections().Cast<ActivityConnection>();
    //         for (int i = 0; i < deletes.Length; i++)
    //         {
    //             //1.1 找到对应的ConditionLink
    //                var link = humanActivity.ResultConditions.SingleOrDefault(t => t.Name == deletes[i].OldName);
    //             //1.2 从现有的连接线查找
    //             var connection = connections.SingleOrDefault(t => t.Link == link);
    //             if (connection != null)
    //                 connection.Remove();
    //             //1.3 最后删除link
    //                 humanActivity.ResultConditions.Remove(link);
    //             }
    //         }

    //         //2.处理重命名的
    //         var renames = e.OldActions.Intersect(e.NewActions).Where(t => t.Name != t.OldName).ToArray();
    //         for (int i = 0; i < renames.Length; i++)
    //         {
    //             var link = humanActivity.ResultConditions.SingleOrDefault(t => t.Name == renames[i].OldName);
    //             link.Name = renames[i].Name;
    //             renames[i].AcceptNameChange();
    //             //todo:通知刷新相应的连接线
    //         }

    //         //3.处理新添加的
    //         var adds = e.NewActions.Except(e.OldActions).ToArray();
    //         for (int i = 0; i < adds.Length; i++)
    //         {
    //             var link = new ConditionLink();
    //             link.Name = adds[i].Name;
    //             humanActivity.ResultConditions.Add(link);
    //         }
    //     }
    //     else //多人活动
    //     {
    //         //todo:需要判断删除的有没有在ResultConditions的表达式内引用到，有引用则不允许删除
    //         throw new NotImplementedException();
    //     }
    // }       
    public Paint(ctx: CanvasRenderingContext2D): void {
        if (this._painter != null) {
            this._painter.Paint(ctx, this._title);
        } else {
            //todo: 暂简单给制边框
            ctx.lineWidth = 2;
            ctx.strokeStyle = "green";
            ctx.strokeRect(0, 0, this.Bounds.Width, this.Bounds.Height);
        }

    }

    /**
     * 用于填充服务端返回的数据
     */
    public Fetch(data: any): void {

        this._title = data.Title;
        this._id = data.ID;
        this._bounds.X = data.Bounds.X;
        this._bounds.Y = data.Bounds.Y;
        this._bounds.Width = data.Bounds.Width;
        this._bounds.Height = data.Bounds.Height;
        if (data.Bounds instanceof Rectangle) {
            console.log("data.Bounds is Rectangle");
        }
        switch (data.ItemType) {
            case ActivityModel.StartActivityModel:
                this._painter = new StartActivityPainter(this);
                break;
            case ActivityModel.SingleHumanActivityModel:
                this._painter = new HumanActivityPainter(this, true);
                break;
            case ActivityModel.MultiHumanActivityModel:
                this._painter = new HumanActivityPainter(this, false);
                break;
            case ActivityModel.AutomationActivityModel:
                this._painter = new AutomationActivityPainter(this);
                break;
            case ActivityModel.DecisionActivityModel:
                this._painter = new DecisionActivityPainter(this);
                break;
        }
    }

}


