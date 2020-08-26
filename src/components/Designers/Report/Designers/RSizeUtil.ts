
export default class RSizeUtil {

    private static readonly POINTSIZE: number = 72.27;

    /**
     * 将报表单位转换为像素值
     * @param t eg: 2in or 3mm
     */
    public static SizeToPixel(t: string, round: boolean = true): number {
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
            case "pt": size = d * 2540 / RSizeUtil.POINTSIZE; break;
            case "pc": size = d * (2540 / (RSizeUtil.POINTSIZE * 12)); break;
            default: size = d * 2540; break; // Illegal unit
        }
        // return as pixels
        if (round) {
            return Math.round(size / 2540 * RSizeUtil.POINTSIZE);
        } else {
            return size / 2540 * RSizeUtil.POINTSIZE;
        }
    }

    /**
     * 将像素值转换为报表单位
     * @param pixels 像素值
     * @param unit 单位 eg: mm or in
     */
    public static PixelToSize(pixels: number, unit: string): string {
        let inch = pixels / RSizeUtil.POINTSIZE;
        switch (unit) {
            case "cm": return (inch * 2.54).toString() + "cm";
            case "mm": return (inch * 25.4).toString() + "mm";
            case "pt": return (inch * RSizeUtil.POINTSIZE).toString() + "pt";
            case "pc": return (inch * RSizeUtil.POINTSIZE * 12).toString() + "pc";
            default: return inch.toString() + "in";
        }
    }

    public static AddSize(s1: string, s2: string): string {
        let type = this.GetSizeUnit(s1);
        let v1 = this.SizeToPixel(s1);
        let v2 = this.SizeToPixel(s2);
        return this.PixelToSize(v1 + v2, type);
    }

    public static SubtractSize(s1: string, s2: string): string {
        let type = this.GetSizeUnit(s1);
        let v1 = this.SizeToPixel(s1);
        let v2 = this.SizeToPixel(s2);
        return this.PixelToSize(v1 - v2, type);
    }

    /**
     * 获取报表单位，有异常返回pt
     */
    public static GetSizeUnit(value: string): string {
        let u = "pt";
        let t = value;
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