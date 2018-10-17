import Rectangle from '../../../Canvas/Drawing/Rectangle'
import ReportItemType from './ReportItemType'

/**
 * 用于映射服务端返回的报表元素设计器
 */
interface IServerReportItem {
    ID: number;
    ItemType: ReportItemType;
    Bounds: Rectangle;
    Items: Array<IServerReportItem>;
    Bitmap?: string
}

export default IServerReportItem