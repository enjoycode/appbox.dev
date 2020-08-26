import Rectangle from '@/components/Canvas/Drawing/Rectangle'
import IDesignService from '@/components/Canvas/Services/IDesignService'
import IShape from '@/components/Canvas/Interfaces/IShape'
import IConnection from '@/components/Canvas/Interfaces/IConnection'
import DesignSurface from '@/components/Canvas/DesignSurface'
import ItemDesigner from '@/components/Canvas/Designers/ItemDesigner'
import ReportItemDesigner from './ReportItemDesigner'
import ReportRootDesigner from './ReportRootDesigner'
import ReportToolbox from "../ReportToolbox";

import TextBoxEditor from "@/components/Canvas/PropertyEditors/TextBoxEditor.vue";
import CheckBoxEditor from "@/components/Canvas/PropertyEditors/CheckBoxEditor.vue";
import SelectEditor from "@/components/Canvas/PropertyEditors/SelectEditor.vue";
import ColorEditor from "@/components/Canvas/PropertyEditors/ColorEditor.vue";
import ParametersEditor from "../PropertyEditors/ParametersEditor.vue";
import DataSourcesEditor from "../PropertyEditors/DataSourcesEditor.vue";
import BorderStyleEditor from "../PropertyEditors/BorderStyleEditor.vue";
import ImageEditor from "../PropertyEditors/ImageEditor.vue";
import TableGroupsEditor from "../PropertyEditors/TableGroupsEditor.vue";

import { SelectionMode, InsertPosition, GroupPosition, Cell, TableLayout } from './TableLayout'

interface IChannel {
    invoke(service: string, args: Array<any>): Promise<any>;
}

export default class ReportDesignService implements IDesignService {

    private readonly _surface: DesignSurface;
    public get Surface(): DesignSurface { return this._surface; }
    private readonly _channel: IChannel;
    private readonly _modelId: string
    private _rootDesigner: ItemDesigner;
    public get RootDesigner(): ItemDesigner { return this._rootDesigner; }

    constructor(surface: DesignSurface, channel: IChannel, modelId: string) {
        this._surface = surface;
        this._channel = channel;
        this._modelId = modelId;
        this._surface.DesignService = this;
        this._surface.ToolboxService.Toolbox = new ReportToolbox();
        (<any>this._surface.PropertyPanel).DesignService = this;
    }

    /**
     * 解析并加载报表至设计界面内
     * @param json 报表定义json
     */
    public LoadDesigners(json: string): void {
        var rootDesigner = new ReportRootDesigner(JSON.parse(json));
        this._rootDesigner = rootDesigner;
        this._surface.AddItem(this._rootDesigner);

        //必须调用一次
        this._surface.PropertyPanel.setPropertyOwner(this._rootDesigner);
        //重新刷新
        this._surface.Invalidate();
    }

    public ChangeProperty(item: ItemDesigner, name: string, tag: any, value: any): void {
        console.log("ReportDesignService.ChangeProperty: " + name, value)
    }

    /**
     * 删除所有选中的元素
     */
    public DeleteSelection(): void {
        let selection = this._surface.SelectionService.SelectedItems;
        if (!selection || selection.length === 0) { return; }

        let needInvalidates: ItemDesigner[] = []; //需要重画的上级列表
        let areas: Rectangle[] = []; //需要重画的区域
        for (const item of selection) {
            if (item instanceof ReportItemDesigner && !item.IsTableCell) { //仅ReportItemDesigner可以删除
                if (item.Parent) {
                    needInvalidates.push(item.Parent);
                    areas.push(item.Bounds); //Noneed clone
                    item.Parent.RemoveItem(item);
                } else {
                    console.warn("待删除的元素无上级");
                }
            }
        }
        this._surface.SelectionService.ClearSelection(); //清除选择

        //TODO:合并重绘区域
        for (let i = 0; i < needInvalidates.length; i++) {
            const item = needInvalidates[i];
            item.Invalidate(areas[i]);
        }
    }

    /**
     * 新增表格行或列
     * @returns 错误信息
     */
    public InsertRowOrColumn(before: boolean, isRow: boolean): string | null {
        let selection = this._surface.SelectionService.SelectedItems;
        if (selection.length === 0 || !(selection[0] instanceof ReportItemDesigner)
            || !(selection[0] as ReportItemDesigner).IsTableCell) {
            return "Please select some TableCell first.";
        }

        let reportItem = selection[0] as ReportItemDesigner;
        let layoutCell = reportItem.Cell;
        let tableLayout = layoutCell.TableLayout;
        tableLayout.SelectSingleCell(layoutCell.RowIndex, layoutCell.ColIndex, SelectionMode.Replace);

        if (isRow) {
            tableLayout.InsertRow(before ? InsertPosition.Before : InsertPosition.After, GroupPosition.Inside);
        } else {
            tableLayout.InsertColumn(before ? InsertPosition.Before : InsertPosition.After, GroupPosition.Inside);
        }

        reportItem.Parent.Invalidate();
    }

    /**
     * 删除表格行或列
     * @returns 错误信息
     */
    public DeleteRowOrColumn(isRow: boolean): string | null {
        let selection = this._surface.SelectionService.SelectedItems;
        if (selection.length === 0 || !(selection[0] instanceof ReportItemDesigner)
            || !(selection[0] as ReportItemDesigner).IsTableCell) {
            return "Please select some TableCell first.";
        }

        let reportItem = selection[0] as ReportItemDesigner;
        let layoutCell = reportItem.Cell;
        let tableLayout = layoutCell.TableLayout;
        tableLayout.SelectSingleCell(layoutCell.RowIndex, layoutCell.ColIndex, SelectionMode.Replace);

        let oldTableBounds = tableLayout.Owner.Bounds.Clone();
        if (isRow) {
            tableLayout.DeleteRows(true);
        } else {
            tableLayout.DeleteColumns(true);
        }
        //TODO:暂简单重新选择第一个单元格
        this._surface.SelectionService.SelectItem(tableLayout.Owner.Items[0]);
        tableLayout.Owner.InvalidateOnBoundsChanged(oldTableBounds);
    }

    public MergeSelectedCells(): string | null {
        let selection = this._surface.SelectionService.SelectedItems;
        if (selection.length === 0 || !(selection[0] instanceof ReportItemDesigner)
            || !(selection[0] as ReportItemDesigner).IsTableCell) {
            return "Please select some TableCell first.";
        }
        let firstItem = (selection[0] as ReportItemDesigner);
        let tableLayout = firstItem.Cell.TableLayout;
        this.SetSelectedCells(selection, tableLayout);

        tableLayout.MergeSelectedCells();
        //TODO:暂简单重新选择第一个单元格
        this._surface.SelectionService.SelectItem(tableLayout.Owner.Items[0]);
        tableLayout.Owner.Invalidate();
    }

    public SplitSelectedCells(): string | null {
        let selection = this._surface.SelectionService.SelectedItems;
        if (selection.length === 0 || !(selection[0] instanceof ReportItemDesigner)
            || !(selection[0] as ReportItemDesigner).IsTableCell) {
            return "Please select some TableCell first.";
        }
        let firstItem = (selection[0] as ReportItemDesigner);
        let tableLayout = firstItem.Cell.TableLayout;
        this.SetSelectedCells(selection, tableLayout);

        tableLayout.SplitSelectedCells();
        //TODO:暂简单重新选择第一个单元格
        this._surface.SelectionService.SelectItem(tableLayout.Owner.Items[0]);
        tableLayout.Owner.Invalidate();
    }

    private SetSelectedCells(selection: ItemDesigner[], tableLayout: TableLayout) {
        let firstItem = (selection[0] as ReportItemDesigner);
        let selectedCells: Cell[] = [];
        selectedCells.push(firstItem.Cell);
        for (let i = 1; i < selection.length; i++) {
            const item = selection[i];
            if (item.Parent === firstItem.Parent) {
                selectedCells.push((item as ReportItemDesigner).Cell);
            }
        }

        tableLayout.SetSelectedCells(selectedCells);
    }

    public GetShapes(): Array<IShape> { return []; }
    public GetConnections(): Array<IConnection> { return []; }

    //====Property Editors====
    private static readonly _editors = {
        TextBox: TextBoxEditor,
        CheckBox: CheckBoxEditor,
        Select: SelectEditor,
        Color: ColorEditor,
        ReportParameters: ParametersEditor,
        ReportDataSources: DataSourcesEditor,
        Image: ImageEditor,
        BorderStyle: BorderStyleEditor,
        TableGroups: TableGroupsEditor
    }

    public GetPropertyEditor(type: string): any {
        return ReportDesignService._editors[type];
    }

}