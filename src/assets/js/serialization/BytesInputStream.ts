import IInputStream from './IInputStream';
import PayloadType from '@/assets/js/serialization/PayloadType';
import {EntityModelInfo} from '@/assets/js/serialization/EntityModelContainer';
import {Utf8Decode} from '@/assets/js/serialization/Utf8';

export default class BytesInputStream implements IInputStream {
    private pos = 0;
    private view: DataView;
    private bytes: Uint8Array;

    constructor(buffer: ArrayBuffer) {
        this.bytes = new Uint8Array(buffer);
        this.view = new DataView(buffer);
    }

    public async DeserializeAsync(): Promise<any> {
        const payloadType = this.ReadByte();
        switch (payloadType) {
            case PayloadType.Null:
                return null;
            case PayloadType.BooleanTrue:
                return true;
            case PayloadType.BooleanFalse:
                return false;
            case PayloadType.String:
                return this.ReadString();
            case PayloadType.UnknownType:
                return this.ReadJsonObject();
            case PayloadType.EntityModelInfo:
                return EntityModelInfo.ReadFrom(this);
            default:
                throw new Error('未实现的类型: ' + payloadType.toString());
        }
    }

    /** 剩余字节数 */
    public get Remaining(): number {
        return this.view.byteLength - this.pos;
    }

    private ensureRemaining(size: number) {
        if (this.view.byteLength - this.pos < size) {
            throw new RangeError('Has no data.');
        }
    }

    public ReadByte(): number {
        this.ensureRemaining(1);
        const value = this.view.getUint8(this.pos);
        this.pos++;
        return value;
    }

    public ReadInt16(): number {
        this.ensureRemaining(2);
        const value = this.view.getInt16(this.pos, true);
        this.pos += 2;
        return value;
    }

    public ReadInt32(): number {
        this.ensureRemaining(4);
        const value = this.view.getInt32(this.pos, true);
        this.pos += 4;
        return value;
    }

    private ReadJsonObject(): any {
        let jsonString = Utf8Decode(this, -1);
        return JSON.parse(jsonString); //TODO: 优化直接从Stream转换
    }

    public ReadVariant(): number {
        let data = this.ReadNativeVariant();
        return -(data & 1) ^ ((data >> 1) & 0x7fffffff);
    }

    private ReadNativeVariant(): number {
        let data = this.ReadByte();
        if ((data & 0x80) == 0) {
            return data;
        }
        data &= 0x7F;
        let num2 = this.ReadByte();
        data |= (num2 & 0x7F) << 7;
        if ((num2 & 0x80) == 0) {
            return data;
        }
        num2 = this.ReadByte();
        data |= (num2 & 0x7F) << 14;
        if ((num2 & 0x80) == 0) {
            return data;
        }
        num2 = this.ReadByte();
        data |= (num2 & 0x7F) << 0x15;
        if ((num2 & 0x80) == 0) {
            return data;
        }
        num2 = this.ReadByte();
        data |= num2 << 0x1C;
        if ((num2 & 240) != 0) {
            throw new Error('out of range');
        }
        return data;
    }

    public ReadString(): string {
        let chars = this.ReadVariant();
        return Utf8Decode(this, chars);
    }

}
