import ReportItemDesigner from './ReportItemDesigner'
import { IPropertyCatalog } from '@/components/Canvas/Interfaces/IPropertyPanel';

export default class TextBoxDesigner extends ReportItemDesigner {

    public Paint(g: CanvasRenderingContext2D): void {
        g.save();
        g.rect(this.Bounds.X, this.Bounds.Y, this.Bounds.Width, this.Bounds.Height);
        g.clip();

        // 绘制边框，TODO:根据Style绘制，如果在表格内还需要参考表格Style
        g.strokeStyle = "rgb(173,219,241)";
        g.lineWidth = 1;
        g.strokeRect(this.Bounds.X, this.Bounds.Y, this.Bounds.Width, this.Bounds.Height);

        // 绘制文本, TODO:根据Style绘制，另考虑绑定值不同样式
        let text = this.GetPropertyString("Value", "");
        if (text.length > 0) {
            g.fillStyle = "black";
            g.textBaseline = "top";
            g.fillText(text, this.Bounds.X + 2, this.Bounds.Y + 2);
        }

        g.restore();
    }

    //============IPropertyOwner接口实现=====
    public getPropertyItems(): IPropertyCatalog[] | null {
        var cats: IPropertyCatalog[] = super.getPropertyItems();
        cats.splice(0, 0, {
            name: "Common",
            items: [
                {
                    title: "Value", readonly: false, editorType: "TextBox",
                    getter: () => this.GetPropertyString("Value", ""),
                    setter: v => this.SetPropertyString("Value", v, true)
                }
            ]
        });
        return cats;
    }

}