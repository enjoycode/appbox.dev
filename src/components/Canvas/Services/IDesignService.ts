import ItemDesigner from '../Designers/ItemDesigner'
import IShape from '../Interfaces/IShape'
import IConnection from '../Interfaces/IConnection'
import { IPropertyOwner, IPropertyCatalog } from '../Interfaces/IPropertyPanel'

interface IDesignService {

    RootDesigner: IPropertyOwner;

    ChangeProperty(item: ItemDesigner, name: string, tag: any, value: any): void;

    GetShapes(): Array<IShape>;

    GetConnections(): Array<IConnection>;

    GetPropertyEditor(type: string): any /* Vue component options */;
}

export default IDesignService