interface IOutputStream {
    WriteUInt8(v: number): void;

    WriteInt8(v: number): void;

    WriteInt16(v: number): void;

    WriteInt32(v: number): void;

    WriteInt64(v: number): void;

    WriteDouble(v: number): void;
}

export default IOutputStream;