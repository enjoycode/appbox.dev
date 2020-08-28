import IOutputStream from './IOutputStream';
import { Utf8Encode } from "./Utf8";

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
                Utf8Encode(v, this.stream);
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

}