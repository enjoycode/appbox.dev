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

    //====添加/删除方法====
    public OnAddToSurface(byCreate: boolean): void {
        // super.OnAddToSurface(byCreate);
        if (byCreate) { //仅处理新建的元素
            let pt = "pt";
            this.SetPropertyRSize("Left", this.Bounds.X.toString() + pt, true);
            this.SetPropertyRSize("Top", this.Bounds.Y.toString() + pt, true);
            this.SetPropertyRSize("Width", this.Bounds.Width.toString() + pt, true);
            this.SetPropertyRSize("Height", this.Bounds.Height.toString() + pt, true);
        }
    }

    public OnRemoveFromSurface(): void {
        // super.OnRemoveFromSurface();
        let parentNode = this.xmlNode.parentNode;
        if (!parentNode) { console.warn("删除元素无法找到上级节点的ReportItems节点"); }
        parentNode.removeChild(this.xmlNode);
        // TODO:暂简单判断上级是否ReportItems
        if (parentNode.nodeName === "ReportItems" && parentNode.childNodes.length === 0) {
            parentNode.parentNode.removeChild(parentNode);
        }
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
        let node = XmlUtil.GetNamedChildNode(this.xmlNode, prop);
        if (!node) {
            node = this.xmlNode.appendChild(this.xmlNode.ownerDocument.createElement(prop));
        }

        if (typeof value === 'number') { // 表示由画布激发的变更
            let unit = this.GetSizeUnit(node);
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
        let node = XmlUtil.GetNamedChildNode(this.xmlNode, prop);
        if (!node) {
            node = this.xmlNode.appendChild(this.xmlNode.ownerDocument.createElement(prop));
        }
        node.textContent = value.toString();
        // console.log(this.getPropertyOwnerType() + "." + prop + " changed to: " + node.textContent);
    }

    protected GetPropertyString(prop: string, defaultValue: string): string {
        let node = XmlUtil.GetNamedChildNode(this.xmlNode, prop);
        if (!node) return defaultValue;
        return node.textContent;
    }

    protected SetPropertyString(prop: string, value: string, needInvalidate: boolean = false) {
        let node = XmlUtil.GetNamedChildNode(this.xmlNode, prop);
        if (!node) {
            node = this.xmlNode.appendChild(this.xmlNode.ownerDocument.createElement(prop));
        }
        node.textContent = value;
        if (needInvalidate) {
            this.Invalidate();
        }
    }

    //====IPropertyOwner接口实现====
    public getPropertyOwnerType(): string {
        return this.xmlNode.nodeName;
    }

    // ====以下通用辅助方法====
    /**
     * 尝试获取当前节点下的Size值，转换为像素
     * @param sizeName eg: Height
     * @param defaultValue 不存在则返回的默认值
     */
    public TryGetSize(sizeName: string, defaultValue: number): number {
        let node = XmlUtil.GetNamedChildNode(this.xmlNode, sizeName);
        if (!node) return defaultValue;
        return this.GetSize(node);
    }

    /**
     * 解析报表单位至像素值
     * @param node eg: <Height>.5in</Height>
     */
    public GetSize(node: Node): number {
        return XmlUtil.SizeToPixel(node.textContent); //TODO: use node.nodeValue is null
    }

    /**
     * 获取报表单位，有异常返回mm
     * @param node eg: <Height>.5in</Height>
     */
    private GetSizeUnit(node: Node): string {
        let u = "mm";
        let t = node.textContent; //TODO: use node.nodeValue is null
        if (!t || t.length === 0 || t[0] === '=') return u;

        t = t.trim();
        let space = t.lastIndexOf(' ');
        try {
            if (space != -1) { // any spaces
                u = t.substring(space).trim();
            } else if (t.length >= 3) {
                u = t.substring(t.length - 2);
            }
        } catch (error) {
            console.log("GetSizeUnit from [" + t + "] error.");
        }
        return u;
    }

}