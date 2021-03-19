import SelectEditor from '@/components/Designers/View/PropertyEditors/SelectEditor.vue';
import TextEditor from '@/components/Designers/View/PropertyEditors/TextEditor.vue';
import {IVueProp, IVueWidget} from '@/design/IVueWidget';

export default class VueToolbox {

    private static widgets: IVueWidget[] = [];

    public static EnsureLoaded(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.widgets.length > 0) {
                resolve();
            }

            $runtime.channel.invoke('sys.DesignService.GetAppSettings', [null, 'VueWidgets'])
                .then(res => {
                    this.widgets = res;
                    resolve();
                }).catch(err => reject(err));
        });
    }

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
