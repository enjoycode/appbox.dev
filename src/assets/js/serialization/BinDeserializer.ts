import IInputStream from './IInputStream';
import PayloadType from './PayloadType';
import { Utf8Decode } from './Utf8';

interface ITypeDeserializer {
    (bs: BinDeserializer): any;
}

const knownTypes: Map<PayloadType, ITypeDeserializer> = new Map<PayloadType, ITypeDeserializer>([
    [PayloadType.EntityModel, bs => null],
    [PayloadType.String, bs => bs.ReadString()],
]);

export default class BinDeserializer {
    private readonly stream: IInputStream;

    constructor(stream: IInputStream) {
        this.stream = stream;
    }

    public Deserialize(): any {
        let payloadType = this.stream.ReadByte();
        if (payloadType == PayloadType.Null) {
            return null;
        } else if (payloadType == PayloadType.BooleanTrue) {
            return true;
        } else if (payloadType == PayloadType.BooleanFalse) {
            return false;
        } else if (payloadType == PayloadType.ObjectRef) {
            throw new Error("Not implemented.");
        } else if (payloadType == PayloadType.UnknownType) { //对应服务端的JsonResult
            let jsonString = Utf8Decode(this.stream, -1);
            return JSON.parse(jsonString); //TODO: 优化直接从Stream转换
        }

        let deserializer = knownTypes.get(payloadType);
        if (deserializer) {
            return deserializer(this);
        }
        throw new Error("未实现的类型:" + payloadType.toString());
    }

    public ReadByte(): number {
        return this.stream.ReadByte();
    }

    public ReadInt32(): number {
        return this.stream.ReadInt32();
    }

    public ReadVariant(): number {
        let data = this.ReadNativeVariant();
        return -(data & 1) ^ ((data >> 1) & 0x7fffffff);
    }

    private ReadNativeVariant(): number {
        let data = this.stream.ReadByte();
        if ((data & 0x80) == 0) {
            return data;
        }
        data &= 0x7F;
        let num2 = this.stream.ReadByte();
        data |= (num2 & 0x7F) << 7;
        if ((num2 & 0x80) == 0) {
            return data;
        }
        num2 = this.stream.ReadByte();
        data |= (num2 & 0x7F) << 14;
        if ((num2 & 0x80) == 0) {
            return data;
        }
        num2 = this.stream.ReadByte();
        data |= (num2 & 0x7F) << 0x15;
        if ((num2 & 0x80) == 0) {
            return data;
        }
        num2 = this.stream.ReadByte();
        data |= num2 << 0x1C;
        if ((num2 & 240) != 0) {
            throw new Error("out of range");
        }
        return data;
    }

    public ReadString(): string {
        let chars = this.ReadVariant();
        return Utf8Decode(this.stream, chars);
    }
}