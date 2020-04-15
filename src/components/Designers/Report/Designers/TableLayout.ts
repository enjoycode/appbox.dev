import TableDesigner from './TableDesigner';

export class TableColumn {

    private readonly _node: Node;
    private readonly _owner: TableDesigner;
    public get Owner(): TableDesigner { return this._owner; }

    constructor(owner: TableDesigner, xmlNode: Node) {
        this._owner = owner;
        this._node = xmlNode;
    }

}

export class TableRow {

}

export class TableCell {
    
}