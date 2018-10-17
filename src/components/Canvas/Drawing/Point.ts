export default class Point {
    public X: number;
    public Y: number;

    constructor(x: number, y: number) {
        this.X = x;
        this.Y = y;
    }

    public toString(): string {
        return "{" + this.X + ", " + this.Y + "}";
    }

    /**
     * Returns the distance between the specified points.
     */
    public static Distance(startPoint: Point, endPoint: Point): number {
        return Math.sqrt(Math.pow(startPoint.X - endPoint.X, 2) + Math.pow(startPoint.Y - endPoint.Y, 2));
    }

}