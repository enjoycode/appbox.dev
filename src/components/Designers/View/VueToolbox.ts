import SelectEditor from '@/components/Designers/View/PropertyEditors/SelectEditor.vue';
import TextEditor from '@/components/Designers/View/PropertyEditors/TextEditor.vue';
import {IVueProp, IVueWidget} from '@/design/IVueWidget';
import DesignStore from '@/design/DesignStore';
import LoadView from '@/design/LoadView';

export default class VueToolbox {

    private static hasBindChangeEvent = false;
    public static widgets: IVueWidget[] = [];

    public static EnsureLoaded(): Promise<void> {
        if (!VueToolbox.hasBindChangeEvent) {
            VueToolbox.hasBindChangeEvent = true;
            DesignStore.onEvent('SettingsChanged', VueToolbox.onSettingsChanged);
        }

        return new Promise((resolve, reject) => {
            if (this.widgets.length > 0) {
                resolve();
            }

            VueToolbox.loadWidgets().then(() => resolve()).catch(err => reject(err));
        });
    }

    private static onSettingsChanged(name: string) {
        if (name == 'VueWidgets') {
            VueToolbox.loadWidgets().catch(err => console.warn('reload vue widgets error: ' + err));
        }
    }

    private static loadWidgets(): Promise<void> {
        return $runtime.channel.invoke('sys.DesignService.GetAppSettings', [null, 'VueWidgets']).then(res => {
            this.widgets = res;
        });
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

    public static GetPropEditor(prop: IVueProp, root: any): any {
        //TODO: finish it
        let isGlobal = !prop.Editor || prop.Editor.indexOf('.') < 0; //TODO:暂简单判断
        if (isGlobal) {
            if (prop.Editor == 'Select') {
                return SelectEditor;
            } else {
                return TextEditor;
            }
        } else {
            return LoadView(prop.Editor, root);
        }
    }

}
