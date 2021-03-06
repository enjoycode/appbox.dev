import Rectangle from '@/components/Canvas/Drawing/Rectangle'
import Point from '@/components/Canvas/Drawing/Point'
import DesignAdorner from '@/components/Canvas/Adorners/DesignAdorner'
import MouseEventArgs from '@/components/Canvas/EventArgs/MouseEventArgs'
import TableDesigner from '../Designers/TableDesigner'
import ReportItemDesigner from '../Designers/ReportItemDesigner'
import ItemDesigner from '@/components/Canvas/Designers/ItemDesigner'
import { Row, Column } from "../Designers/TableLayout";

const offset = 10;
const HandleSize = 5;
const SelectionColor = "rgb(100, 149, 237)";

interface IElement {
    HitTest(pt: Point): [boolean, string];
}

/**
 * 用于选择整个表格
 */
class SelectHandle implements IElement {
    Bounds: Rectangle;
    Cursor: string;
    Target: ItemDesigner;

    HitTest(pt: Point): [boolean, string] {
        if (this.Bounds.Contains(pt.X, pt.Y)) {
            return [true, this.Cursor];
        } else {
            return [false, ""];
        }
    }
}

/**
 * 用于Resize column or row
 */
class ResizeHandle implements IElement {
    Bounds: Rectangle;
    Cursor: string;
    Column: Column | null;
    Row: Row | null;

    HitTest(pt: Point): [boolean, string] {
        if (this.Bounds.Contains(pt.X, pt.Y)) {
            return [true, this.Cursor];
        } else {
            return [false, ""];
        }
    }
}

/**
 * 用于移动表格位置
 */
class MoveTableHandle implements IElement {
    Bounds: Rectangle;
    Cursor: string;

    HitTest(pt: Point): [boolean, string] {
        if (this.Bounds.Contains(pt.X, pt.Y)) {
            return [true, this.Cursor];
        } else {
            return [false, ""];
        }
    }
}

export default class CellSelectionAdorner extends DesignAdorner {

    private _hitTestElement: IElement | null = null;

    private DrawMoveArrows(g: CanvasRenderingContext2D, width: number, height: number) {
        var oldStyle = g.strokeStyle;
        var oldLineWidth = g.lineWidth;
        //Draw Line
        g.beginPath();
        g.strokeStyle = "black";
        g.lineWidth = 2;
        g.moveTo(3.5, height / 2);
        g.lineTo(width - 3.5, height / 2);

        g.moveTo(width / 2, 3.5);
        g.lineTo(width / 2, height - 3.5);
        g.stroke();

        //Left
        g.beginPath();
        g.fillStyle = "black";
        g.moveTo(0, height / 2);
        g.lineTo(3.5, height / 2 - 3.5);
        g.lineTo(3.5, height / 2 + 3.5);
        g.lineTo(0, height / 2);
        g.closePath();
        g.fill();

        //Right
        g.beginPath();
        g.moveTo(width, height / 2);
        g.lineTo(width - 3.5, height / 2 - 3.5);
        g.lineTo(width - 3.5, height / 2 + 3.5);
        g.lineTo(width, height / 2);
        g.closePath();
        g.fill();

        //Top
        g.beginPath();
        g.moveTo(width / 2, 0);
        g.lineTo(width / 2 - 3.5, height / 2 - 3.5);
        g.lineTo(width / 2 + 3.5, height / 2 - 3.5);
        g.lineTo(width / 2, 0);
        g.closePath();
        g.fill();

        //bottom
        g.beginPath();
        g.moveTo(width / 2, height);
        g.lineTo(width / 2 - 3.5, height - 3.5);
        g.lineTo(width / 2 + 3.5, height - 3.5);
        g.lineTo(width / 2, height);
        g.closePath();
        g.fill();
        g.strokeStyle = oldStyle;
        g.lineWidth = oldLineWidth;
    }

    private DrawSelectedCells(g: CanvasRenderingContext2D, cells: ItemDesigner[]) {
        let sx: number, sy: number, ex: number, ey: number;
        let sx2: number, sy2: number, ex2: number, ey2: number;
        let draw: boolean = false;
        for (var i = 0; i < cells.length; i++) {
            const element = cells[i];
            if (element instanceof ReportItemDesigner && element.Parent === this.Target) {
                //Top
                draw = true;
                sx = Math.ceil(element.Bounds.X); sy = Math.ceil(element.Bounds.Y);
                ex = Math.ceil(element.Bounds.X + element.Bounds.Width); ey = sy;
                sx2 = 0; sy2 = 0; ex2 = 0; ey2 = 0;
                var x: number, y: number, x2: number, y2: number;
                for (var j = 0; j < cells.length; j++) {
                    if (i == j) { continue; }

                    var comp = cells[j];
                    if (comp instanceof ReportItemDesigner && comp.Parent === this.Target) {
                        x = Math.ceil(comp.Bounds.X); y = Math.ceil(comp.Bounds.Y + comp.Bounds.Height);
                        x2 = Math.ceil(x + comp.Bounds.Width); y2 = y;
                        if (ey != y) { continue; }

                        if (sx >= x && ex <= x2 && sx2 == ex2) {
                            //正上方全部被遮挡
                            draw = false;
                            break;
                        }
                        if (sx < x && x <= ex && sx2 == ex2) {
                            ex = x;
                            continue;
                        }
                        if (sx >= x && sx < x2 && sx2 == ex2) {
                            sx = x2;
                            continue;
                        }
                        if (sx < x && ex > x2 && sx2 == ex2) {
                            //拆分 2段线
                            ex2 = ex; ex = x; sx2 = x2;
                            sy2 = sy; ey2 = sy;
                            continue;
                        }

                        if (sx <= x && ex == x2) {
                            //Left
                            ex = x;
                            continue;
                        }

                        if (sx2 != ex2 && sx2 == x && ex2 <= x2) {
                            //Right
                            sx2 = x2;
                            sy2 = sy; ey2 = sy;
                            continue;
                        }
                    }
                }
                if (draw) {
                    g.beginPath();
                    if (sx != ex) {
                        g.moveTo(sx, sy);
                        g.lineTo(ex, ey);
                    }
                    if (sx2 != ex2) {
                        g.moveTo(sx2, sy2);
                        g.lineTo(ex2, ey2);
                    }
                    g.stroke();
                }

                //Bottom
                draw = true;
                sx = Math.ceil(element.Bounds.X); sy = Math.ceil(element.Bounds.Y + element.Bounds.Height);
                ex = Math.ceil(element.Bounds.X + element.Bounds.Width); ey = sy;
                sx2 = 0; sy2 = 0; ex2 = 0; ey2 = 0;
                var x: number, y: number, x2: number, y2: number;
                for (var j = 0; j < cells.length; j++) {
                    if (i == j) { continue; }

                    var comp = cells[j];
                    if (comp instanceof ReportItemDesigner && comp.Parent === this.Target) {
                        x = Math.ceil(comp.Bounds.X); y = Math.ceil(comp.Bounds.Y);
                        x2 = Math.ceil(x + comp.Bounds.Width); y2 = y;
                        if (ey != y) { continue; }

                        if (sx >= x && ex <= x2 && sx2 == ex2) {
                            //正下方全部被遮挡
                            draw = false;
                            break;
                        }
                        if (sx >= x && sx < x2 && sx2 == ex2) {
                            sx = x2;
                            continue;
                        }
                        if (sx < x && x <= ex && sx2 == ex2) {
                            ex = x;
                            continue;
                        }

                        if (sx < x && ex > x2 && sx2 == ex2) {
                            //拆分 2段线
                            ex2 = ex; ex = x; sx2 = x2;
                            sy2 = sy; ey2 = sy;
                            continue;
                        }
                        if (sx <= x && ex == x2) {
                            //left
                            ex = x;
                            continue;
                        }
                        //Right 
                        if (sx2 != ex2 && sx2 == x && x2 <= ex2) {
                            sx2 = x2;
                            continue;
                        }
                    }
                }
                if (draw) {
                    g.beginPath();
                    if (sx != ex) {
                        g.moveTo(sx, sy);
                        g.lineTo(ex, ey);
                    }
                    if (sx2 != ex2) {
                        g.moveTo(sx2, sy2);
                        g.lineTo(ex2, ey2);
                    }
                    g.stroke();
                }

                //Left
                draw = true;
                sx = Math.ceil(element.Bounds.X); sy = Math.ceil(element.Bounds.Y);
                ex = sx; ey = Math.ceil(sy + element.Bounds.Height);
                sx2 = 0; sy2 = 0; ex2 = 0; ey2 = 0;
                var x: number, y: number, x2: number, y2: number;
                for (var j = 0; j < cells.length; j++) {
                    if (i == j) { continue; }

                    var comp = cells[j];
                    if (comp instanceof ReportItemDesigner && comp.Parent === this.Target) {
                        x = Math.ceil(comp.Bounds.X + comp.Bounds.Width); y = Math.ceil(comp.Bounds.Y);
                        x2 = x; y2 = Math.ceil(y + comp.Bounds.Height);
                        if (ex != x) { continue; }

                        if (sy >= y && ey <= y2 && sy2 == ey2) {
                            //Left方全部被遮挡
                            draw = false;
                            break;
                        }
                        if (sy >= y && sy < y2 && sy2 == ey2) {
                            sy = y2;
                            continue;
                        }
                        if (ey <= y2 && ey > y && sy2 == ey2) {
                            ey = y;
                            continue;
                        }

                        if (sy < y && ey > y2 && sy2 == ey2) {
                            //拆分 2段线
                            ey2 = ey; ey = y; sy2 = y2;
                            sx2 = x; ex2 = x;
                            continue;
                        }
                        //Top
                        if (sy < y && ey == y2) {
                            ey = y;
                            continue;
                        }

                        if (sy == y && ey2 > y2) {
                            sy = y2;
                            continue;
                        }

                        //Right 
                        if (sy2 != ey2 && sy2 == y && y2 > ey2) {
                            sy2 = ey2; //下分段被遮盖
                            continue;
                        }

                        if (sy2 != ey2 && ey == y2 && y < sy) {
                            sy = ey; //上分段被遮盖
                            continue;
                        }
                    }
                }
                if (draw) {
                    g.beginPath();
                    if (sy != ey) {
                        g.moveTo(sx, sy);
                        g.lineTo(ex, ey);
                    }
                    if (sy2 != ey2) {
                        g.moveTo(sx2, sy2);
                        g.lineTo(ex2, ey2);
                    }
                    g.stroke();
                }

                //Right
                draw = true;
                sx = Math.ceil(element.Bounds.X + element.Bounds.Width); sy = Math.ceil(element.Bounds.Y);
                ex = sx; ey = Math.ceil(sy + element.Bounds.Height);
                sx2 = 0; sy2 = 0; ex2 = 0; ey2 = 0;
                var x: number, y: number, x2: number, y2: number;
                for (var j = 0; j < cells.length; j++) {
                    if (i == j) { continue; }

                    var comp = cells[j];
                    if (comp instanceof ReportItemDesigner && comp.Parent === this.Target) {
                        x = Math.ceil(comp.Bounds.X); y = Math.ceil(comp.Bounds.Y);
                        x2 = x; y2 = Math.ceil(y + comp.Bounds.Height);
                        if (ex != x) { continue; }

                        if (sy >= y && ey <= y2 && sy2 == ey2) {
                            //Right方全部被遮挡
                            draw = false;
                            break;
                        }
                        if (sy >= y && sy < y2 && sy2 == ey2) {
                            sy = y2;
                            continue;
                        }
                        if (ey <= y2 && ey > y && sy2 == ey2) {
                            ey = y;
                            continue;
                        }

                        if (sy < y && ey > y2 && sy2 == ey2) {
                            //拆分 2段线
                            ey2 = ey; ey = y; sy2 = y2;
                            sx2 = x; ex2 = x;
                            continue;
                        }
                        //Top
                        if (sy < y && ey == y2) {
                            ey = y;
                            continue;
                        }

                        if (sy == y && ey2 > y2) {
                            sy = y2;
                            continue;
                        }

                        //Right 
                        if (sy2 != ey2 && sy2 == y && y2 > ey2) {
                            sy2 = ey2; //下分段被遮盖
                            continue;
                        }

                        if (sy2 != ey2 && ey == y2 && y < sy) {
                            sy = ey; //上分段被遮盖
                            continue;
                        }
                    }
                }
                if (draw) {
                    g.beginPath();
                    if (sy != ey) {
                        g.moveTo(sx, sy);
                        g.lineTo(ex, ey);
                    }
                    if (sy2 != ey2) {
                        g.moveTo(sx2, sy2);
                        g.lineTo(ex2, ey2);
                    }
                    g.stroke();
                }
            }
        }
    }

    public OnRender(g: CanvasRenderingContext2D) {
        let table = this.Target as TableDesigner;
        //画顶部灰条
        g.fillStyle = "rgb(240,240,240)"
        g.fillRect(-offset, -offset, this.Target.Bounds.Width + offset, offset);
        //画左侧灰条
        g.fillRect(-offset, 0, offset, this.Target.Bounds.Height);

        //画顶部列边框
        let x = 0;
        g.strokeStyle = SelectionColor;
        g.lineWidth = 1;
        for (const column of table.TableLayout.Columns) {
            g.strokeRect(x, -offset, column.Size, offset);
            x += column.Size;
        }

        //画左侧行边框
        let y = 0;
        for (const row of table.TableLayout.Rows) {
            let rowGroup = row.Cells[0].RowGroup;
            if (rowGroup && rowGroup.IsDetail) {
                // g.strokeStyle = "black";
                let dx = -offset + 2;
                let dy = y + row.Size / 2 - 3;
                for (let i = 0; i < 3; i++) {
                    g.moveTo(dx, dy);
                    g.lineTo(dx + 6, dy);
                    g.stroke();
                    dy += 3;
                }
                // g.strokeStyle = SelectionColor;
            }
            g.strokeRect(-offset, y, offset, row.Size);
            y += row.Size;
        }

        //画左上边框
        g.strokeRect(-offset, -offset, offset, offset);

        //draw move handle
        this.DrawMoveArrows(g, 16, 16);

        //画选择的Cell
        let surface = this.Target.Surface;
        g.lineWidth = 2;
        this.DrawSelectedCells(g, surface.SelectionService.SelectedItems)
    }

    private GetElements(): Array<IElement> {
        let ls = new Array<IElement>();
        let table = this.Target as TableDesigner;

        //加入列ResizeHandle
        let x = 0;
        for (const column of table.TableLayout.Columns) {
            let resizeHandle = new ResizeHandle();
            resizeHandle.Bounds = new Rectangle(x + column.Size - HandleSize / 2, -offset, HandleSize, offset);
            resizeHandle.Cursor = "ew-resize";
            resizeHandle.Column = column;
            ls.push(resizeHandle);
            x += column.Size;
        }
        //加入行ResizeHandle
        let y = 0;
        for (const row of table.TableLayout.Rows) {
            let resizeHandle = new ResizeHandle();
            resizeHandle.Bounds = new Rectangle(-offset, y + row.Size - HandleSize / 2, offset, HandleSize);
            resizeHandle.Cursor = "ns-resize";
            resizeHandle.Row = row;
            ls.push(resizeHandle);
            y += row.Size;
        }

        //add move table handle
        let moveHandle = new MoveTableHandle();
        moveHandle.Bounds = new Rectangle(0, 0, 15, 15);
        moveHandle.Cursor = "move";
        ls.push(moveHandle);
        //add select table handle
        let selectTable = new SelectHandle();
        selectTable.Bounds = new Rectangle(-offset, -offset, offset, offset);
        selectTable.Cursor = "";
        selectTable.Target = table;
        ls.push(selectTable);

        return ls;
    }

    public HitTest(pt: Point): [boolean, string] {
        let ls = this.GetElements();
        let hitElement: IElement | null = null;
        let hitCursor: string = "";
        for (let i = 0; i < ls.length; i++) {
            let res = ls[i].HitTest(pt);
            if (res[0]) {
                hitElement = ls[i];
                hitCursor = res[1];
            }
        }

        if (hitElement) {
            this._hitTestElement = hitElement;
            return [true, hitCursor];
        }
        else {
            this._hitTestElement = null;
            return [false, hitCursor];
        }
    }

    public OnMouseMove(e: MouseEventArgs) {
        //TODO: debounce延迟处理
        if (this._hitTestElement) {
            if (this._hitTestElement instanceof ResizeHandle) {
                let table = this.Target as TableDesigner;
                if (this._hitTestElement.Row) { // resize row height
                    if (e.DeltaY === 0) { return; }
                    table.ResizeRow(this._hitTestElement.Row, e.DeltaY);
                } else { // resize column width
                    if (e.DeltaX === 0) { return; }
                    table.ResizeColumn(this._hitTestElement.Column, e.DeltaX);
                }
            } else if (this._hitTestElement instanceof MoveTableHandle) {
                let table = this.Target as TableDesigner;
                table.Move(e.DeltaX, e.DeltaY);
            }
        }
    }

    public OnMouseUp(e: MouseEventArgs) {
        if (!this._hitTestElement) { return; }
        if (this._hitTestElement instanceof MoveTableHandle) {
            let table = this.Target as TableDesigner;
            table.OnEndMove();
        } else if (this._hitTestElement instanceof SelectHandle) {
            this.Target.Surface.SelectionService.SelectItem(this._hitTestElement.Target);
        }
    }

}