import MouseEventArgs from '../EventArgs/MouseEventArgs'
import DesignSurface from '../DesignSurface'
import ItemDesigner from '../Designers/ItemDesigner'
import DesignBehavior from '../Enums/DesignBehavior'
import TableDesigner from '../../Designers/Report/Designers/TableDesigner'
import ReportItemDesigner from '../../Designers/Report/Designers/ReportItemDesigner'

export default class SelectionService {

    private readonly _surface: DesignSurface;
    private readonly _selectedItems: Array<ItemDesigner>;
    private _moving: boolean = false; //用于标记是否开始移动选择的元素

    public get SelectedItems(): Array<ItemDesigner> {
        return this._selectedItems;
    }

    constructor(surface: DesignSurface) {
        this._surface = surface;
        this._selectedItems = new Array<ItemDesigner>();
    }

    public SelectItem(item: ItemDesigner | null): void {
        if (item == null && this._selectedItems.length > 0) {
            this._selectedItems.splice(0, this._selectedItems.length);
            this.OnSelectionChanged();
        } else if (item != null) {
            //判断旧选择项是否与新选择项相同
            if (this._selectedItems.length == 1 && this._selectedItems[0] === item) {
                return;
            }

            this._selectedItems.splice(0, this._selectedItems.length);
            this._selectedItems.push(item);
            this.OnSelectionChanged();
        }
    }

    public SelectItems(items: Array<ItemDesigner> | null): void {
        if (items == null && this._selectedItems.length > 0) {
            this._selectedItems.splice(0, this._selectedItems.length);
            this.OnSelectionChanged();
        } else if (items != null) {
            //判断旧选择项是否与新选择项相同
            this._selectedItems.splice(0, this._selectedItems.length);
            items.forEach(e => {
                this._selectedItems.push(e);
            });
            this.OnSelectionChanged();
        }
    }

    public ClearSelection(): void {
        this.SelectItem(null);
        this._surface.ResetHoverItem();
    }

    public MoveSelection(deltaX: number, deltaY: number): void {
        if (this.SelectedItems.length > 0) {
            this._moving = true;

            //再处理移动所有选择的对象
            for (const item of this._selectedItems) {
                //判断是否单元格内选择
                if (item instanceof ReportItemDesigner && item.IsTableCell) {
                    let tableDesigner = item.Cell.Row.Owner.Owner;
                    tableDesigner.MoveCellSelection(deltaX, deltaY);
                    break;
                }
                item.Move(deltaX, deltaY);
            }
        }
    }

    /**
     * 用于处理移动结束
     * @param e 
     */
    public OnMouseUp(e: MouseEventArgs) {
        if (this._moving) {
            this._moving = false;
            //逐个处理选择的元素
            for (var i = 0; i < this._selectedItems.length; i++) {
                this._selectedItems[i].OnEndMove();
            }
        }
    }

    private OnSelectionChanged(): void {
        this._surface.Adorners.ClearSelected();
        for (var i = 0; i < this._selectedItems.length; i++) {
            //根据选择的设计对象的CreateSelectionAdorner()方法创建相应的选择装饰器
            let sad = this._selectedItems[i].SelectionAdorner;
            if (sad) {
                this._surface.Adorners.Add(sad);
            }
        }
        this._surface.Adorners.Invalidate();

        //设置属性面板
        if (this._selectedItems.length > 0) { //有选择则暂设为第一个
            this._surface.PropertyPanel.setPropertyOwner(this._selectedItems[0]);
        } else { //没有选择设为根节点
            this._surface.PropertyPanel.setPropertyOwner(this._surface.DesignService.RootDesigner);
        }
    }

}