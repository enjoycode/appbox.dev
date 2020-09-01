interface IInputStream {
    ReadByte(): number;

    ReadInt32(): number;

    readonly Remaining: number;
}

export default IInputStream;