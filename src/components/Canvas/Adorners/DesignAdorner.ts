import ItemDesigner from '../Designers/ItemDesigner'
import DesignAdorners from './DesignAdorners'
import Point from '../Drawing/Point'
import MouseEventArgs from '../EventArgs/MouseEventArgs'

export default class DesignAdorner {
    public readonly Target: ItemDesigner;
    public readonly Owner: DesignAdorners;

    /**
     * 是否专用于元素选择装饰
     */
    public get IsSelectionAdorner() {
        return true;
    }

    constructor(owner: DesignAdorners, target: ItemDesigner) {
        this.Owner = owner;
        this.Target = target;
    }

    /**
     * 测试点是否在当前装饰范围内
     * @param pt 已转为控件坐标系
     */
    public HitTest(pt: Point): [boolean, string] {
        return [false, ''];
    }

    /**
     * 注意：坐标系已转为目标的坐标系
     */
    public OnRender(ctx: CanvasRenderingContext2D) { }

    /**
     * 用于拖动处理，注意：此时MouseButton 肯定== Left
     */
    public OnMouseMove(e: MouseEventArgs) { }

    /**
     * 用于拖动结束处理
     */
    public OnMouseUp(e: MouseEventArgs) { }

}