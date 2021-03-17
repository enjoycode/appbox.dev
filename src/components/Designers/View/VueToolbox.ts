import Vue from 'vue';
import SelectEditor from '@/components/Designers/View/PropertyEditors/SelectEditor.vue';
import {IVueProp, IVueWidget} from '@/design/IVueWidget';

export default class VueToolbox {

    private static widgets: IVueWidget[] = [
        {
            Name: 'Button', Component: 'ElButton', VText: 'Button', Icon: 'fas fa-ad fa-fw',
            DWidth: 3, DHeight: 1, Style: {width: '100%'},
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
                },
                {
                    Name: 'placeholder', Type: 'string', Default: ''
                }
            ]
        },
        {
            Name: 'Checkbox', Component: 'ElCheckbox', VText: 'Checkbox', VModel: 'string',
            Icon: 'fas fa-check-square fa-fw', DWidth: 4, DHeight: 1,
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

    public static GetComponent(name: string): IVueWidget {
        return VueToolbox.widgets.find(c => c.Name == name);
    }

    public static GetPropEditor(prop: IVueProp): any {
        //TODO: finish it
        if (prop.Editor == 'Select') {
            return SelectEditor;
        } else {
            return Vue.component('ElInput');
        }
    }

}
