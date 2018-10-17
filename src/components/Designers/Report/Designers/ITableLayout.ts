import Rectangle from '../../../Canvas/Drawing/Rectangle'
export interface IRow {
    Index: number;
    Size: number;
}

export interface IColumn {
    Index: number;
    Size: number;
}

export interface ITableLayout {
    Rows: Array<IRow>;
    Columns: Array<IColumn>;
}

export interface ICell {
    RI: number;
    RS: number;
    CI: number;
    CS: number;
}
