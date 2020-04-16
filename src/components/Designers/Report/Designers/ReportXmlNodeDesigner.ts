import ItemDesigner from "@/components/Canvas/Designers/ItemDesigner";
// import PaintRegion from "@/components/Canvas/Enums/PaintRegion";
import BoundsSpecified from '@/components/Canvas/Enums/BoundsSpecified';
import XmlUtil from './XmlUtil';

/**
 * 所有报表元素的设计者基类
 */
export default abstract class ReportXmlNodeDesigner extends ItemDesigner {

    /** 对应的Xml节点 eg: <TextBox><Value>Hello</Value></TextBox>*/
    protected xmlNode: Node;
    public get XmlNode(): Node {
        return this.xmlNode;
    }

    constructor(xmlNode: Node) {
        super();
        this.xmlNode = xmlNode;
    }

    //====读写XmlNode属性方法，读仅由属性面板，写可能画布或属性面板====
    protected GetPropertyRSize(prop: string, defaultValue: string): string {
        let node = XmlUtil.GetNamedChildNode(this.xmlNode, prop);
        if (!node) return defaultValue;
        return node.textContent;
    }

    /**
     * 设置指定属性的报表单位
     * @param prop 属性名称
     * @param value 数值单位为像素，字符串表示由PropertyPanel设置的值
     * @param byCreate 是否由新建时设置，是则不需要反向设置Bounds
     */
    protected SetPropertyRSize(prop: string, value: string | number, byCreate: boolean = false) {
        let node = XmlUtil.GetOrCreateChildNode(this.xmlNode, prop);
        if (typeof value === 'number') { // 表示由画布激发的变更
            let unit = XmlUtil.GetSizeUnit(node);
            let newSize = XmlUtil.PixelToSize(value as number, unit);
            node.textContent = newSize;
        } else { // 表示由属性面板激发的变更，或画布新建元素后设置
            node.textContent = value;
            if (!byCreate) {
                let pixels = XmlUtil.SizeToPixel(value);
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

    protected GetPropertyBool(prop: string, defaultValue: boolean): boolean {
        let node = XmlUtil.GetNamedChildNode(this.xmlNode, prop);
        if (!node) return defaultValue;
        return node.textContent === 'true' ? true : false;
    }

    protected SetPropertyBool(prop: string, value: boolean) {
        let node = XmlUtil.GetOrCreateChildNode(this.xmlNode, prop);
        node.textContent = value.toString();
        // console.log(this.getPropertyOwnerType() + "." + prop + " changed to: " + node.textContent);
    }

    protected GetPropertyString(prop: string, defaultValue: string): string {
        let node = XmlUtil.GetNamedChildNode(this.xmlNode, prop);
        if (!node) return defaultValue;
        return node.textContent;
    }

    protected SetPropertyString(prop: string, value: string, needInvalidate: boolean = false) {
        let node = XmlUtil.GetOrCreateChildNode(this.xmlNode, prop);
        node.textContent = value;
        if (needInvalidate) {
            this.Invalidate();
        }
    }

    //====IPropertyOwner接口实现====
    public getPropertyOwnerType(): string {
        return this.xmlNode.nodeName;
    }

}