import IOutputStream from './IOutputStream';
import { Utf8Encode } from "./Utf8";
import PayloadType from './PayloadType';

export default class BinSerializer {

    private readonly stream: IOutputStream;

    constructor(stream: IOutputStream) {
        this.stream = stream;
    }

    public Serialize(obj: any) {
        if (obj == null || obj == undefined) {
            this.stream.WriteUInt8(PayloadType.Null);
            return;
        } else if (typeof obj === "boolean") {
            this.stream.WriteUInt8(obj === false ? PayloadType.BooleanFalse : PayloadType.BooleanTrue);
        } else if (typeof obj === "number") {
            this.SerializeNumber(obj);
        } else if (typeof obj === "string") {
            this.stream.WriteUInt8(PayloadType.String);
            this.WriteString(obj);
        } else if (Array.isArray(obj)) {
            throw new Error("未实现");
        } else {
            throw new Error("未实现");
        }
    }

    private SerializeNumber(num: number) {
        if (Number.isSafeInteger(num)) {
            //TODO: 暂全部按有符号处理以适应Java, 且暂只分int32, int64
            if (num >= -2147483648 && num <= 2147483647) {
                this.stream.WriteUInt8(PayloadType.Int32);
                this.stream.WriteInt32(num);
            } else {
                this.stream.WriteUInt8(PayloadType.Int64);
                this.stream.WriteInt64(num);
            }
        } else {
            //TODO: 暂按Double处理
            this.stream.WriteInt64(num);
        }
    }

    public WriteByte(v: number) {
        this.stream.WriteUInt8(v);
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
                this.stream.WriteUInt8(temp);
            } else {
                temp = temp & 0x7F;
                this.stream.WriteUInt8(temp);
                break;
            }
        } while (true);
    }

}