import MouseButtons from '../Enums/MouseButtons'

export default class MouseEventArgs {
    public readonly X: number;
    public readonly Y: number;
    public readonly DeltaX: number;
    public readonly DeltaY: number;
    public readonly Button: MouseButtons;
    public readonly Clicks: number;

    constructor(buttons: MouseButtons, clicks: number, x: number, y: number, deltaX: number, deltaY: number) {
        this.Button = buttons;
        this.Clicks = clicks;
        this.X = x;
        this.Y = y;
        this.DeltaX = deltaX;
        this.DeltaY = deltaY;
    }
}