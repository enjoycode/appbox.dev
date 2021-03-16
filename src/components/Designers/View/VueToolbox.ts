import SelectEditor from '@/components/Designers/View/PropertyEditors/SelectEditor.vue';

export interface IVueProp {
    readonly Name: string;
    readonly Type: string;
    readonly Default?: any;         //默认值
    readonly Editor?: string        //属性编辑器
    readonly EditorOptions?: any;   //属性编辑器选项
}

export interface IVueEvent {
    readonly Name: string;
}

export interface IVueState {
    readonly Name: string;
    readonly Type: string;
    readonly Value: any;
}

export interface IVueComponent {
    readonly Name: string;          //工具箱的显示名称
    readonly Icon: string;          //工具箱显示图标
    readonly Component: string;     //全局组件名称: eg: ElInput或者自定义名称 eg:sys.Views.Dashboard
    readonly VModel?: string;       //v-model, 保存的为类型 eg:string
    readonly VText?: string;        //Button类组件的v-text
    readonly DWidth: number;        //默认宽度，单位:网格
    readonly DHeight: number;       //默认高度，单位:网格
    readonly Props?: IVueProp[];
    readonly Events?: IVueEvent[];
}

export default class VueToolbox {

    private static components: IVueComponent[] = [
        {
            Name: 'Button', Component: 'ElButton', VText: 'Button', Icon: 'fas fa-ad fa-fw',
            DWidth: 3, DHeight: 1,
            Props: [
                {
                    Name: 'type', Type: 'string', Default: 'primary', Editor: 'Select',
                    EditorOptions: [null, 'primary', 'success', 'warning', 'danger', 'info', 'text']
                }, {
                    Name: 'size', Type: 'string', Default: 'small', Editor: 'Select',
                    EditorOptions: [null, 'medium', 'small', 'mini']
                }
            ],
            Events: [{Name: 'click'}]
        },
        {
            Name: 'Input', Component: 'ElInput', VModel: 'string', Icon: 'fas fa-text-width fa-fw',
            DWidth: 4, DHeight: 1,
            Props: [
                {
                    Name: 'size', Type: 'string', Default: 'small', Editor: 'Select',
                    EditorOptions: [null, 'medium', 'small', 'mini']
                }
            ]
        }
    ];

    public static GetToolboxItems(): IVueComponent[] {
        //TODO:从服务端加载
        return VueToolbox.components;
    }

    public static MakeDefaultProps(component: IVueComponent): any {
        if (!component.Props) {
            return null;
        }
        let props = {};
        for (const prop of component.Props) {
            if (prop.Default) {
                props[prop.Name] = prop.Default;
            }
        }
        return props;
    }

    public static GetComponent(name: string): IVueComponent {
        return VueToolbox.components.find(c => c.Name == name);
    }

    public static GetPropEditor(prop: IVueProp): any {
        return SelectEditor;
    }

}
