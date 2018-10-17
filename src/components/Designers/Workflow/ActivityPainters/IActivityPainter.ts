import Size from '../../../Canvas/Drawing/Size'
interface IActivityPainter {
    Paint(ctx: CanvasRenderingContext2D, title: string): void;
}

export default IActivityPainter