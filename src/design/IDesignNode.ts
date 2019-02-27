import DesignNodeType from './DesignNodeType'
import ModelType from './ModelType'

export interface IDesignNode {
    readonly ID: string;
    readonly Type: DesignNodeType;
    readonly Text: string; // TODO: remove
    readonly Name: string;
    CheckoutBy: string;
    readonly Nodes?: undefined | null | IDesignNode[];
}

export interface IModelNode extends IDesignNode {
    readonly App: string;
    readonly ModelType: ModelType;
}