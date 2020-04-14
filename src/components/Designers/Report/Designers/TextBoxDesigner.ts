import ReportItemDesigner from './ReportItemDesigner'
import { IPropertyCatalog } from '@/components/Canvas/Interfaces/IPropertyPanel';

export default class TextBoxDesigner extends ReportItemDesigner {

    public Paint(g: CanvasRenderingContext2D): void {
        g.save();
        g.beginPath();
        g.rect(this.Bounds.X, this.Bounds.Y, this.Bounds.Width, this.Bounds.Height);
        g.clip();

        // 绘制边框，TODO:根据Style绘制，如果在表格内还需要参考表格Style
        g.strokeStyle = "rgb(173,219,241)";
        g.lineWidth = 1;
        g.strokeRect(this.Bounds.X, this.Bounds.Y, this.Bounds.Width, this.Bounds.Height);

        // 测试画出范围
        // g.fillStyle = "red";
        // g.fillRect(this.Bounds.X + 10, this.Bounds.Y + 10, this.Bounds.Width, this.Bounds.Height);

        // 绘制文本, TODO:根据Style绘制，另考虑绑定值不同样式
        let text = this.GetPropertyString("Value", "");
        if (text.length > 0) {
            g.font = this.Style.PaintFont;
            g.fillStyle = "black";
            g.textBaseline = "top";
            g.fillText(text, this.Bounds.X + 2, this.Bounds.Y + 2);
        }

        g.restore();
    }

    //============IPropertyOwner接口实现=====
    public getPropertyItems(): IPropertyCatalog[] | null {
        let cats: IPropertyCatalog[] = super.getPropertyItems();
        cats.splice(0, 0, {
            name: "Common",
            items: [
                {
                    title: "Value", readonly: false, editor: "TextBox",
                    getter: () => this.GetPropertyString("Value", ""),
                    setter: v => this.SetPropertyString("Value", v, true)
                },
                {
                    title: "CanGrow", readonly: false, editor: "CheckBox",
                    getter: () => this.GetPropertyBool("CanGrow", false),
                    setter: v => this.SetPropertyBool("CanGrow", v)
                },
                {
                    title: "CanShrink", readonly: false, editor: "CheckBox",
                    getter: () => this.GetPropertyBool("CanShrink", false),
                    setter: v => this.SetPropertyBool("CanShrink", v)
                },
            ]
        });
        return cats;
    }

}