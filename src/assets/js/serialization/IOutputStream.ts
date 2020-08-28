interface IOutputStream {
    WriteByte(v: number): void;

    WriteInt32(v: number): void;
}

export default IOutputStream;