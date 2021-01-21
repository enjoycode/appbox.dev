interface IOutputStream {
    WriteByte(v: number): void;

    WriteInt8(v: number): void;

    WriteInt16(v: number): void;

    WriteInt32(v: number): void;

    WriteInt64(v: number): void;

    WriteDouble(v: number): void;

    WriteDate(v: Date): void;

    WriteVariant(v: number): void;

    WriteString(v: string): void;

    /** 写入不带长度信息的ASCII或Base64字符串 */
    WriteAsciiString(v: string): void;
}

export default IOutputStream;
