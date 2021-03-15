export interface IVueComponent {
    readonly Name: string;          //工具箱的显示名称
    readonly Icon: string;
    readonly Component: string;     //全局组件名称: eg: ElInput或者自定义名称 eg:sys.Views.Dashboard
    readonly VText?: string;
    readonly DefaultWidth: number;
    readonly DefaultHeight: number;
}

export default class VueToolbox {

    private static components: IVueComponent[] = [
        {
            Name: 'Button',
            Component: 'ElButton',
            VText: 'Button',
            Icon: 'fas fa-ad fa-fw',
            DefaultWidth: 3,
            DefaultHeight: 1
        },
        {Name: 'Input', Component: 'ElInput', Icon: 'fas fa-text-width fa-fw', DefaultWidth: 4, DefaultHeight: 1}
    ];

    public static GetToolboxItems(): IVueComponent[] {
        return VueToolbox.components;
    }

    public static GetComponent(name: string): IVueComponent {
        return VueToolbox.components.find(c => c.Name == name);
    }

}
