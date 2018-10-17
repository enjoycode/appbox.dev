import IActivityPainter from './IActivityPainter'
import Size from '../../../Canvas/Drawing/Size'
import Point from '../../../Canvas/Drawing/Point'
import Rectangle from '../../../Canvas/Drawing/Rectangle'
import ActivityDesigner from '../ActivityDesigner'

let bitmap = new Image();
bitmap.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAzCAYAAACNHMgNAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAALEwAACxMBAJqcGAAABCJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjI0PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj41MTwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAg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";
let bitmap2 = new Image();
bitmap2.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAzCAYAAACNHMgNAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAALEwAACxMBAJqcGAAABCJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjI0PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj41MTwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAg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";

export default class HumanActivityPainter implements IActivityPainter {
    private _isSingle: boolean;
    private _designer: ActivityDesigner;

    constructor(designer: ActivityDesigner, isSingle: boolean) {
        this._designer = designer;
        this._isSingle = isSingle;
    }

    private DrawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
        if (w < 2 * r)
            r = w / 2;
        if (h < 2 * r)
            r = h / 2;
        ctx.strokeStyle = 'DarkGreen';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        ctx.stroke();
    }

    public Paint(ctx: CanvasRenderingContext2D, title: string): void {
        if (this._isSingle) {
            ctx.drawImage(bitmap, 2, (this._designer.Bounds.Height - 20) / 2, 12, 20);
        } else {
            ctx.drawImage(bitmap2, 2, (this._designer.Bounds.Height - 20) / 2, 12, 20);
        }
        this.DrawRoundRect(ctx, 0, 0, this._designer.Bounds.Width, this._designer.Bounds.Height, 8);
        if (title) {
            var dx = 0;
            let ms = ctx.measureText(title);
            if (this._designer.Bounds.Width > ms.width) {
                dx = (this._designer.Bounds.Width - ms.width) / 2;
            }

            ctx.fillStyle = "black";
            ctx.textBaseline = "middle";
            ctx.fillText(title, dx + 4, this._designer.Bounds.Height / 2);
        }
    }
}