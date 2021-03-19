import SelectEditor from '@/components/Designers/View/PropertyEditors/SelectEditor.vue';
import TextEditor from '@/components/Designers/View/PropertyEditors/TextEditor.vue';
import {IVueProp, IVueWidget} from '@/design/IVueWidget';

export default class VueToolbox {

    private static widgets: IVueWidget[] = [
        {
            Name: 'Button', Component: 'ElButton', Text: 'Button', Icon: 'fas fa-ad fa-fw',
            Width: 3, Height: 1, Style: {width: '100%'},
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
            Name: 'Input', Component: 'ElInput', Model: 'string', Icon: 'fas fa-text-width fa-fw',
            Width: 4, Height: 1,
            Props: [
                {
                    Name: 'size', Type: 'string', Default: 'small', Editor: 'Select',
                    EditorOptions: [null, 'medium', 'small', 'mini']
                },
                {
                    Name: 'placeholder', Type: 'string', Default: ''
                }
            ]
        },
        {
            Name: 'Checkbox', Component: 'ElCheckbox', Text: 'Checkbox', Model: 'string',
            Icon: 'fas fa-check-square fa-fw', Width: 4, Height: 1,
            Style: {height: '100%'},
            Props: [
                {
                    Name: 'size', Type: 'string', Default: 'small', Editor: 'Select',
                    EditorOptions: [null, 'medium', 'small', 'mini']
                }
            ]
        }
    ];

    public static GetToolboxItems(): IVueWidget[] {
        //TODO:从服务端加载
        return VueToolbox.widgets;
    }

    public static MakeDefaultProps(component: IVueWidget): any {
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

    public static GetWidget(name: string): IVueWidget {
        return VueToolbox.widgets.find(c => c.Name == name);
    }

    public static GetPropEditor(prop: IVueProp): any {
        //TODO: finish it
        if (prop.Editor == 'Select') {
            return SelectEditor;
        } else {
            return TextEditor;
        }
    }

}
