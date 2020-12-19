interface IOutputStream {
    WriteByte(v: number): void;

    WriteInt8(v: number): void;

    WriteInt16(v: number): void;

    WriteInt32(v: number): void;

    WriteInt64(v: number): void;

    WriteDouble(v: number): void;

    WriteVariant(v: number): void;

    WriteString(v: string): void;
}

export default IOutputStream;
