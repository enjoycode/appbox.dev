import Point from '../Drawing/Point'

export interface IGeometry {
    CreatePath(): Path2D;
}

export interface IPathSegment {
    FillToPath(path: Path2D): void;
}

enum SweepDirection {
    Clockwise = 0,
    Counterclockwise = 1,
}

export default SweepDirection
