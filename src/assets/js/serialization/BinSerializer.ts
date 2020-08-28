import IOutputStream from './IOutputStream';

export default class BinSerializer {

    private readonly stream: IOutputStream;

    constructor(stream: IOutputStream) {
        this.stream = stream;
    }

    public Serialize(obj: any) {

    }

    public WriteByte(v: number) {
        this.stream.WriteByte(v);
    }

    public WriteInt32(v: number) {
        this.stream.WriteInt32(v);
    }

    public WriteString(v?: string): void {
        if (!v) {
            this.WriteVariant(-1);
        } else {
            this.WriteVariant(v.length);
            if (v.length > 0) {
                this.WriteUtf8(v);
            }
        }
    }

    public WriteVariant(v: number): void {
        if (!Number.isInteger(v)) {
            throw new Error("must be Integer");
        }

        v = (v << 1) ^ (v >> 0x1F);

        let temp = 0;
        do {
            temp = (v & 0x7F) | 0x80;
            if ((v >>= 7) != 0) {
                this.stream.WriteByte(temp);
            } else {
                temp = temp & 0x7F;
                this.stream.WriteByte(temp);
                break;
            }
        } while (true);
    }

    private WriteUtf8(v: string): void {
        let code = 0;
        for (let i = 0; i < v.length; i++) {
            code = v.charCodeAt(i);
            if (0x00 <= code && code <= 0x7f) {
                this.stream.WriteByte(code & 0xff);
            } else if (0x80 <= code && code <= 0x7ff) {
                this.stream.WriteByte((192 | (31 & (code >> 6))) & 0xff);
                this.stream.WriteByte((128 | (63 & code)) & 0xff);
            } else if ((0x800 <= code && code <= 0xd7ff) || (0xe000 <= code && code <= 0xffff)) {
                this.stream.WriteByte((224 | (15 & (code >> 12))) & 0xff);
                this.stream.WriteByte((128 | (63 & (code >> 6))) & 0xff);
                this.stream.WriteByte((128 | (63 & code)) & 0xff);
            }
        }
    }

}