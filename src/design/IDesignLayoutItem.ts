import {IVueWidget} from '@/design/IVueWidget';
import {IVueLayoutItem} from '@/runtime/IVueVisual';

export default interface IDesignLayoutItem extends IVueLayoutItem {
    /** 对应的工具箱组件定义 */
    c?: IVueWidget;
}
