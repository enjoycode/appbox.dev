import ItemDesigner from "@/components/Canvas/Designers/ItemDesigner";

/**
 * 所有报表元素的设计者基类
 */
export default abstract class ReportXmlNodeDesigner extends ItemDesigner {

    protected static readonly POINTSIZE: number = 72.27;

    /** 对应的Xml节点 eg: <TextBox><Value>Hello</Value></TextBox>*/
    protected xmlNode: Node;

    constructor(xmlNode: Node) {
        super();
        this.xmlNode = xmlNode;
    }

    //============IPropertyOwner接口实现=====
    public getPropertyOwnerType(): string {
        return this.xmlNode.nodeName;
    }

    // ====以下通用辅助方法====
    public GetNamedChildNode(name: string): Node | null {
        if (!this.xmlNode) return null;
        for (const cNode of this.xmlNode.childNodes) {
            if (cNode.nodeType === Node.ELEMENT_NODE && cNode.nodeName === name) {
                return cNode;
            }
        }
        return null;
    }

    /**
     * 尝试获取当前节点下的Size值，转换为像素
     * @param sizeName eg: Height
     * @param defaultValue 不存在则返回的默认值
     */
    public TryGetSize(sizeName: string, defaultValue: number): number {
        let node = this.GetNamedChildNode(sizeName);
        if (!node) return defaultValue;
        return this.GetSize(node);
    }

    /**
     * 解析报表单位至像素值
     * @param node eg: <Height>.5in</Height>
     */
    public GetSize(node: Node): number {
        let t = node.textContent; //TODO: use node.nodeValue is null
        if (!t || t.length === 0 || t[0] === '=') return 0;

        // Size is specified in CSS Length Units
        // format is <decimal number nnn.nnn><optional space><unit>
        // in -> inches (1 inch = 2.54 cm)
        // cm -> centimeters (.01 meters)
        // mm -> millimeters (.001 meters)
        // pt -> points (1 point = 1/72 inches)
        // pc -> Picas (1 pica = 12 points)
        t = t.trim();
        let space = t.lastIndexOf(' ');
        let n = "";     // number string
        let u = "in";   // unit string
        let d: number;  // initial number
        try {
            if (space != -1) { // any spaces
                n = t.substring(0, space).trim();
                u = t.substring(space).trim();
            } else if (t.length >= 3) {
                n = t.substring(0, t.length - 2);
                u = t.substring(t.length - 2);
            } else {
                return 0; // Illegal unit
            }
            d = parseFloat(n);
        } catch (error) {
            console.log("GetSize from [" + t + "] error.");
            return 0;
        }

        let size: number; // TODO:以下直接转换为pixels
        switch (u) {
            case "in": size = d * 2540; break;
            case "cm": size = d * 1000; break;
            case "mm": size = d * 100; break;
            case "pt": size = d * 2540 / ReportXmlNodeDesigner.POINTSIZE; break;
            case "pc": size = d * (2540 / ReportXmlNodeDesigner.POINTSIZE * 12); break;
            default: size = d * 2540; break; // Illegal unit
        }
        // return as pixels
        return size / 2540 * ReportXmlNodeDesigner.POINTSIZE;
    }

}