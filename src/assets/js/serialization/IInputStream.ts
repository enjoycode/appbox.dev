interface IInputStream {
    ReadUInt8(): number;

    ReadInt32(): number;

    readonly Remaining: number;
}

export default IInputStream;