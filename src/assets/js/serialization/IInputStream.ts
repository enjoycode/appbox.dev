interface IInputStream {

    readonly Remaining: number;

    DeserializeAsync(): Promise<any>;

    ReadByte(): number;

    ReadInt16(): number;

    ReadInt32(): number;

    ReadString(): string;

}

export default IInputStream;
