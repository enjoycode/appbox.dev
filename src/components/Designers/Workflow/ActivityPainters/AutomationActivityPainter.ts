import IActivityPainter from './IActivityPainter'
import Size from '../../../Canvas/Drawing/Size'
import Point from '../../../Canvas/Drawing/Point'
import Rectangle from '../../../Canvas/Drawing/Rectangle'
import ActivityDesigner from '../ActivityDesigner'

let bitmap = new Image();
bitmap.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAzCAYAAACNHMgNAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAALEwAACxMBAJqcGAAABCJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjI0PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj41MTwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxkYzpzdWJqZWN0PgogICAgICAgICAgICA8cmRmOkJhZy8+CiAgICAgICAgIDwvZGM6c3ViamVjdD4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMTc6MDM6MTEgMTQ6MDM6MzY8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPlBpeGVsbWF0b3IgMy42PC94bXA6Q3JlYXRvclRvb2w+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgqyrJqFAAAD+ElEQVRYCe2UXYjWRRSH1/ykQisFM5MWtJTCjNLLbswgwksNgkgK0SCQUEG6LGUjuqgbwcAPsJvAiwIpIVlc8QsrqpswSlA0KPzIsg/TSnue/87v3dnXfTe8M3gPPP85c2bmnDNnZv49PV3pVqBbgZumAreUTO6l3Qe7YHyx2UwEbfthFihjB5v//uo8kx9HvwLX4E0wYC+8Adr+hMWgmMCYRhvl4wQZV+Y8QnsedPYXHIcToGNtZ2ERKM0Os/VB0/Cvjl0kf5ehx2hvL7pBZ0MvWCJlCpiEYgKtzNRrifPpGB+F32AObIQJcBUM/A8o2aFZvwbav4E74TrRuSivgo4McLno9hNAPdQ25150LJHRR5Sfi/W20upMSQK/o2uzbNoy7i6lo8SBE9ZCHHkWyfgQ+tOwFA4Wu6UR5/wB66CjZHdmdxhclDL9iv4ERJagNCWhzY0aQJ802i3Kds26uRG0EQOdS6fol0o/65zTvq61xBKlTGZ3GlzoAlt5F7xl98AWiD1lPIWt3iXdIamdn8Ds4tS3vi2fY5c4z5ycg2uvkzp7fwdZnNYAdZBR7TnIOooLPBvb98FsPLj74HlwTQKkxs1vAbvrLNFO+A4mww3J28xOximD/Vp/h76BRpSxWDOYc7gb25Pg2EPgDy1B3Ent/Ef6C0FpdhVnGnToZBf5CnWorIRPYAVMgmmgfAzPwItFp+mZCnVZmiSTqRPqgPb9S/pizfgjWAAD0A+zIDIH5VM4BvOLsUlQ56KDB2ADfA/vgcFWwWrwNfvD2wxeSx+VwXTcB8dhHtwKX4FViN/Wg1qOMbX9At1s0q/rfBj7gWpsGXq71FVp1dpsvoQ4TZtzqYNk7DPm94IyAcbBMOd1zd3mHlDyH/FOK1lkEMdslb1wEnTsm3C+wVvSHnF2GdFu8DjWnGS0xd7rAKJjDzWBtQ0Tt/cC5JdrNinDLvSX4MPKlvGfsD0HCY7aCq7eyLN8+8HJOvUGxMFe9OmgzIAcrpk6z/nnwHeyFCLZYdP3wSRbt+rC1PKtZsbQx2uaJOog2rYOTRvakXU7Uwbuor2j6AbJGexDvwD3wyvgTnSYsziF/gFsh9PQUdyi23VxSqQ+AH2QF12P/4D9KRhV3EVkB0ocWAL1dlJG7dsgUh90bK0yxOCfUnGxkiDqlq3ua3PHite6oyTyg8z4Ftoz1qlZx3k9/jX2uaDUlRi08NV5svUv6EEqA3BUBXGOB2rrLo7AflBM6uFGG+H+F3uzUH0mbILV4G2S9fALmITtGpgC3riX4XXIOzGBG5bxrPARGWA3DHtA9COd7K3sMzGth2ZNva5eT6UfDGSm9aHqPGVG7Uq3Av+7CvwLiL5M62EvMSQAAAAASUVORK5CYII=";

export default class AutomationActivityPainter implements IActivityPainter {

    private _designer: ActivityDesigner;
    constructor(designer: ActivityDesigner) {
        this._designer = designer;
    }

    private DrawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
        if (w < 2 * r)
            r = w / 2;
        if (h < 2 * r)
            r = h / 2;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'DarkGreen';
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
        // if(this.bitmap.complete==false){
        //     return false;
        // }        
        this.DrawRoundRect(ctx, 0, 0, this._designer.Bounds.Width, this._designer.Bounds.Height, 30);
        ctx.drawImage(bitmap, 2, (this._designer.Bounds.Height - 20) / 2, 12, 20);
        if (title) {
            var dx = 0;
            let ms = ctx.measureText(title);
            if (this._designer.Bounds.Width > ms.width) {
                dx = (this._designer.Bounds.Width - ms.width) / 2;
            }

            ctx.fillStyle = "black";
            ctx.textBaseline = "middle";
            ctx.fillText(title, dx + 6, this._designer.Bounds.Height / 2);
        }
    }
}