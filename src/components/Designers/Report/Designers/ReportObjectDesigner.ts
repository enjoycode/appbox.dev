import ItemDesigner from "@/components/Canvas/Designers/ItemDesigner";
import BoundsSpecified from '@/components/Canvas/Enums/BoundsSpecified';
import RSizeUtil from './RSizeUtil';
import ReportToolbox from '../ReportToolbox';

/**
 * 所有报表元素的设计者基类
 */
export default abstract class ReportObjectDesigner extends ItemDesigner {

    protected node: any;
    public get Node(): any {
        return this.node;
    }

    constructor(node: any) {
        super();
        this.node = node;
    }

    /**
     * 用于容器类加载子级对应的设计器
     */
    protected LoadChildDesigners() {
        let childs = this.node["Items"];
        if (childs) {
            for (const c of childs) {
                let designer = ReportToolbox.Make(c);
                this.AddItem(designer, false);
            }
        }
    }

    //====属性读写====
    protected GetSize(propName: string, defaultValue: number): number {
        if (this.node[propName]) {
            return RSizeUtil.SizeToPixel(this.node[propName]);
        }
        return defaultValue;
    }

    protected GetPropertyBool(prop: string, defaultValue: boolean): boolean {
        if (this.node[prop]) {
            return this.node[prop];
        }
        return defaultValue;
    }

    protected SetPropertyBool(prop: string, value: boolean) {
        this.node[prop] = value;
    }

    protected GetPropertyString(prop: string, defaultValue: string): string {
        if (this.node[prop]) {
            return this.node[prop];
        }
        return defaultValue;
    }

    protected SetPropertyString(prop: string, value: string, needInvalidate: boolean = false) {
        if (!value) {
            delete this.node[prop];
        } else {
            this.node[prop] = value;
        }
        if (needInvalidate) {
            this.Invalidate();
        }
    }

    /**
     * 设置指定属性的报表单位
     * @param prop 属性名称
     * @param value 数值单位为像素，字符串表示由PropertyPanel设置的值
     * @param byCreate 是否由新建时设置，是则不需要反向设置Bounds
     */
    protected SetPropertyRSize(prop: string, value: string | number, byCreate: boolean = false) {
        let oldSize = this.GetPropertyString(prop, null);
        if (typeof value === 'number') { // 表示由画布激发的变更
            let unit = RSizeUtil.GetSizeUnit(oldSize);
            let newSize = RSizeUtil.PixelToSize(value as number, unit);
            this.node[prop] = newSize;
        } else { // 表示由属性面板激发的变更，或画布新建元素后设置
            this.node[prop] = value;
            if (!byCreate) {
                let pixels = RSizeUtil.SizeToPixel(value);
                // 需要反向设置Bounds
                switch (prop) {
                    case "Height": this.SetBounds(0, 0, 0, pixels, BoundsSpecified.Height); break;
                    case "Width": this.SetBounds(0, 0, pixels, 0, BoundsSpecified.Width); break;
                    case "Left": this.SetBounds(pixels, 0, 0, 0, BoundsSpecified.X); break;
                    case "Top": this.SetBounds(0, pixels, 0, 0, BoundsSpecified.Y); break;
                }
            }
        }
        // console.log(this.getPropertyOwnerType() + "." + prop + " changed to: " + node.textContent);
    }

    protected GetChildByType(typeName: string): any {
        if (this.node.Items) {
            for (const c of this.node.Items) {
                if (c.$T === typeName) {
                    return c;
                }
            }
        }
        return null;
    }

    //====IPropertyOwner接口实现====
    public getPropertyOwnerType(): string {
        return this.node.$T ? this.node.$T : "Report";
    }

}