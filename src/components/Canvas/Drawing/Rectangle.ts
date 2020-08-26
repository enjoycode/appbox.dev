export default class Rectangle {
    public X: number;
    public Y: number;
    public Width: number;
    public Height: number;

    public get Right(): number { return this.X + this.Width; }

    public get Bottom(): number { return this.Y + this.Height; }

    constructor(x: number, y: number, width: number, height: number) {
        this.X = x;
        this.Y = y;
        this.Width = width;
        this.Height = height;
    }

    public EqualsTo(other: Rectangle): boolean {
        return this.X === other.X && this.Y === other.Y
            && this.Width === other.Width && this.Height === other.Height;
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

    private IntersectsWithInclusive(r: Rectangle): boolean {
        return !((this.X > r.Right) || (this.Right < r.X) ||
            (this.Y > r.Bottom) || (this.Bottom < r.Y));
    }

    public Contains(x: number, y: number): boolean {
        return ((x >= this.X) && (x < this.Right) &&
            (y >= this.Y) && (y < this.Bottom));
    }

    public Clone(): Rectangle {
        return new Rectangle(this.X, this.Y, this.Width, this.Height);
    }

    public CopyFrom(from: Rectangle): void {
        this.X = from.X;
        this.Y = from.Y;
        this.Width = from.Width;
        this.Height = from.Height;
    }

    //===============Static Helpers===============
    public static Union(a: Rectangle, b: Rectangle): Rectangle {
        let left = Math.min(a.X, b.X);
        let top = Math.min(a.Y, b.Y);
        let right = Math.max(a.Right, b.Right);
        let bottom = Math.max(a.Bottom, b.Bottom);

        return new Rectangle(left, top, right - left, bottom - top);
    }

    public static Intersect(a: Rectangle, b: Rectangle): Rectangle {
        if (!a.IntersectsWithInclusive(b)) {
            return new Rectangle(0, 0, 0, 0);
        }

        let x = Math.max(a.X, b.X);
        let y = Math.max(a.Y, b.Y);
        let right = Math.min(a.Right, b.Right);
        let bottom = Math.min(a.Bottom, b.Bottom);
        return new Rectangle(x, y, right - x, bottom - y);
    }
}