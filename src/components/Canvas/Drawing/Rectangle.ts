
export default class Rectangle {
    public X: number;
    public Y: number;
    public Width: number;
    public Height: number;

    public get Right(): number {
        return this.X + this.Width;
    }

    public get Bottom(): number {
        return this.Y + this.Height;
    }

    constructor(x: number, y: number, width: number, height: number) {
        this.X = x;
        this.Y = y;
        this.Width = width;
        this.Height = height;
    }

    public Inflate(width: number, height: number) {
        this.X -= width;
        this.Y -= height;
        this.Width += width * 2;
        this.Height += height * 2;
    }

    public IntersectsWith(rect: Rectangle): boolean {
        return !((this.X >= rect.Right) || (this.Right <= rect.X) ||
            (this.Y >= rect.Bottom) || (this.Bottom <= rect.Y));
    }

    public Contains(x: number, y: number): boolean {
        return ((x >= this.X) && (x < this.Right) &&
            (y >= this.Y) && (y < this.Bottom));
    }

    public Clone(): Rectangle {
        return new Rectangle(this.X, this.Y, this.Width, this.Height);
    }

    //===============Static Helpers===============
    public static Union(a: Rectangle, b: Rectangle): Rectangle {
        let left = Math.min(a.X, b.X);
        let top = Math.min(a.Y, b.Y);
        let right = Math.max(a.Right, b.Right);
        let bottom = Math.max(a.Bottom, b.Bottom);

        return new Rectangle(left, top, right - left, bottom - top);
    }
}