import DesignAdorner from '@/components/Canvas/Adorners/DesignAdorner'
import SectionSelectionAdorner from '../Adorners/SectionSelectionAdorner'
import Rectangle from '@/components/Canvas/Drawing/Rectangle'
import BoundsSpecified from '@/components/Canvas/Enums/BoundsSpecified'
import DesignBehavior from '@/components/Canvas/Enums/DesignBehavior'
import { IPropertyCatalog } from '@/components/Canvas/Interfaces/IPropertyPanel'
import ReportObjectDesigner from './ReportObjectDesigner'

export default class ReportSectionDesigner extends ReportObjectDesigner {
    private _bounds: Rectangle = new Rectangle(0, 0, 0, 0); //only for cache
    public get Bounds(): Rectangle { return this._bounds; }
    public set Bounds(value) {
        this.SetBounds(value.X, value.Y, value.Width, value.Height, BoundsSpecified.All);
    }

    public get IsContainer(): boolean { return true; }
    public get Behavior(): DesignBehavior { return DesignBehavior.CanResize; }

    public get SelectionAdorner(): DesignAdorner | null {
        if (!this._selectionAdorner && this.Surface) {
            this._selectionAdorner = new SectionSelectionAdorner(this.Surface.Adorners, this);
        }
        return this._selectionAdorner;
    }

    constructor(node: any, pageWidth: number, top: number) {
        super(node);

        let height = this.GetSize("Height", 200);
        this._bounds = new Rectangle(0, top, pageWidth, height);
        // 开始加载报表元素
        this.LoadChildDesigners();
    }

    protected SetBounds(x: number, y: number, width: number, height: number, specified: BoundsSpecified): void {
        if (specified !== BoundsSpecified.Height) { //注意：只支持设置高度
            console.warn("ReportSectionDesigner只支持设置高度值");
            return;
        }

        // 开始重新布局，并重新绘制
        let diff = height - this._bounds.Height;
        if (this.Parent) {
            this._bounds.Height = height;
            var index = -1;
            for (var i = 0; i < this.Parent.Items.length; i++) {
                var element = this.Parent.Items[i];
                if (index === -1 && element === this) {
                    index = i;
                }
                if (index !== -1 && i > index) { //表示后面的Section，全部偏移位置
                    element.Bounds.Y += diff;
                }
            }
            this.Parent.Bounds.Height += diff;
        }
        if (this.Surface) {
            //this.Parent.Invalidate(); //TODO:不需要全部重画，变动以下部分重画即可
            this.Surface.Invalidate();
        }
    }

    /**
     * override for change height by canvas
     */
    public OnEndResize(): void {
        this.SetPropertyRSize("Height", this.Bounds.Height);
        // 通知属性面板刷新相应的值
        if (this.Surface) {
            this.Surface.PropertyPanel.refreshProperty("Height");
        }
    }

    public Paint(g: CanvasRenderingContext2D, clip?: Rectangle): void {
        g.save();
        g.beginPath();
        if (clip) { //裁剪相交区域
            g.rect(Math.max(clip.X, this.Bounds.X),
                Math.max(clip.Y + this.Bounds.Y, this.Bounds.Y),
                Math.min(clip.Width, this.Bounds.Width - clip.X),
                Math.min(clip.Height, this.Bounds.Height - clip.Y));
        } else {
            g.rect(this.Bounds.X, this.Bounds.Y, this.Bounds.Width, this.Bounds.Height);
        }
        g.clip();

        g.fillStyle = "white";
        g.fillRect(this.Bounds.X, this.Bounds.Y, this.Bounds.Width, this.Bounds.Height);

        g.strokeStyle = "rgb(173,219,241)";
        g.lineWidth = 1;
        g.strokeRect(this.Bounds.X, this.Bounds.Y, this.Bounds.Width, this.Bounds.Height);

        if (this.Items) {
            g.translate(this.Bounds.X, this.Bounds.Y);
            for (const item of this.Items) {
                if (!clip || clip.IntersectsWith(item.Bounds)) {
                    item.Paint(g);
                }
            }
            g.translate(-this.Bounds.X, -this.Bounds.Y);
        }

        g.restore();
    }

    //============IPropertyOwner接口实现=====
    public getPropertyItems(): IPropertyCatalog[] | null {
        let cats: IPropertyCatalog[] = [
            {
                name: "Common",
                items: [
                    {
                        title: "Height", readonly: false, editor: "TextBox",
                        getter: () => this.GetPropertyString("Height", "0mm"),
                        setter: v => this.SetPropertyRSize("Height", v)
                    },
                ]
            }
        ]
        // if (this.getPropertyOwnerType() !== "Body") {
        //     cats[0].items.push({
        //         title: "PrintOnFirstPage", readonly: false, editor: "CheckBox",
        //         getter: () => this.GetPropertyBool("PrintOnFirstPage", true),
        //         setter: v => this.SetPropertyBool("PrintOnFirstPage", v)
        //     });
        //     cats[0].items.push({
        //         title: "PrintOnLastPage", readonly: false, editor: "CheckBox",
        //         getter: () => this.GetPropertyBool("PrintOnLastPage", true),
        //         setter: v => this.SetPropertyBool("PrintOnLastPage", v)
        //     });
        // }

        return cats;
    }
}
