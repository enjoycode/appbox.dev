
export interface IPropertyOwner {
    getPropertyOwnerType(): string;
    getPropertyItems(): Array<IPropertyCatalog> | null;
}

/**
 * 属性分类
 */
export interface IPropertyCatalog {
    name: string;
    items: Array<IPropertyItem>;
}

export interface IPropertyItem {
    /**
     * 属性名称
     */
    title: string;
    /**编辑器类型*/
    editorType: string;
    readonly: boolean;
    getter(): any;
    setter(value: any): void;
}

export interface IPropertyPanel {
    /**
     * 设置当前PropertyPanel显示的对象
     */
    setPropertyOwner(owner: IPropertyOwner): void;

    /**
     * 刷新指定属性的值
     */
    refreshProperty(propName: string): void;
}
