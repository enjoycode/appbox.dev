import ReportItemDesigner from './ReportItemDesigner'
import { IPropertyCatalog } from '@/components/Canvas/Interfaces/IPropertyPanel';
import { TextAlignEnum, VerticalAlignEnum } from './ReportStyle';

export default class TextboxDesigner extends ReportItemDesigner {

    public Paint(g: CanvasRenderingContext2D): void {
        let b = this.Bounds; // 注意在表格内是计算出来的
        g.save();
        g.beginPath();
        g.rect(b.X, b.Y, b.Width, b.Height);
        g.clip();

        // 绘制背景 //TODO:其他样式如渐变等
        let bgColor = this.Style.GetStyle("BackgroundColor", null);
        if (bgColor) {
            g.fillStyle = bgColor;
            g.fillRect(b.X, b.Y, b.Width, b.Height);
        }

        // 绘制边框
        g.strokeStyle = "rgb(173,219,241)";
        g.lineWidth = 1;
        g.strokeRect(b.X, b.Y, b.Width, b.Height);
        // 根据Style绘制边框，TODO:如果在表格内还需要参考表格Style
        let bs = this.Style.BorderStyles;
        if (bs[1].style !== "None") {
            g.beginPath();
            g.strokeStyle = bs[1].color;
            g.lineWidth = bs[1].width;
            g.moveTo(b.X, b.Y);
            g.lineTo(b.X, b.Y + b.Height);
            g.stroke();
        }
        if (bs[2].style != "None") {
            g.beginPath();
            g.strokeStyle = bs[2].color;
            g.lineWidth = bs[2].width;
            g.moveTo(b.X, b.Y);
            g.lineTo(b.X + b.Width, b.Y);
            g.stroke();
        }
        if (bs[3].style != "None") {
            g.beginPath();
            g.strokeStyle = bs[3].color;
            g.lineWidth = bs[3].width;
            g.moveTo(b.X + b.Width, b.Y);
            g.lineTo(b.X + b.Width, b.Y + b.Height);
            g.stroke();
        }
        if (bs[4].style != "None") {
            g.beginPath();
            g.strokeStyle = bs[4].color;
            g.lineWidth = bs[4].width;
            g.moveTo(b.X, b.Y + b.Height);
            g.lineTo(b.X + b.Width, b.Y + b.Height);
            g.stroke();
        }

        // 绘制文本, TODO:根据Style绘制，另考虑绑定值不同样式
        let text = this.GetPropertyString("Value", "");
        if (text.length > 0) {
            g.font = this.Style.PaintFont;
            g.fillStyle = this.Style.GetStyle("Color", "black");

            let x = 0;
            if (this.Style.TextAlign === TextAlignEnum.Center) {
                g.textAlign = "center";
                x = b.X + b.Width / 2;
            } else if (this.Style.TextAlign === TextAlignEnum.Right) {
                g.textAlign = "right";
                x = b.Right - 2;
            } else {
                g.textAlign = "left";
                x = b.X + 2;
            }
            let y = 0;
            if (this.Style.VerticalAlign === VerticalAlignEnum.Middle) {
                g.textBaseline = "middle";
                y = b.Y + b.Height / 2;
            } else if (this.Style.VerticalAlign == VerticalAlignEnum.Bottom) {
                g.textBaseline = "bottom";
                y = b.Bottom - 2;
            } else {
                g.textBaseline = "top";
                y = b.Y + 2
            }

            g.fillText(text, x, y);
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