import IInputStream from './IInputStream';
import * as Long from 'long';
import PayloadType from '@/assets/js/Serialization/PayloadType';
import {EntityModelInfo} from '@/assets/js/Serialization/EntityModelContainer';
import {Utf8Decode} from '@/assets/js/Serialization/Utf8';
import {Base64Encode} from '@/assets/js/Serialization/Base64';
import {Entity} from '@/assets/js/Entity';

export default class BytesInputStream implements IInputStream {
    private pos = 0;
    private view: DataView;
    private readonly bytes: Uint8Array;

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
            case PayloadType.Int32:
                return this.ReadInt32();
            case PayloadType.Int64:
                return this.ReadInt64();
            case PayloadType.UnknownType:
                return this.ReadJsonObject();
            case PayloadType.EntityModelInfo:
                return EntityModelInfo.ReadFrom(this);
            case PayloadType.Entity:
                return await Entity.ReadFrom(this);
            case PayloadType.List:
                return await this.ReadList();
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

    public ReadInt64(): Long {
        this.ensureRemaining(8);
        const v1 = this.view.getInt32(this.pos, true);
        const v2 = this.view.getInt32(this.pos + 4, true);
        this.pos += 8;
        return new Long(v1, v2);
    }

    public ReadEntityId(): string { //TODO:暂转换为Base64
        this.ensureRemaining(16);
        let base64 = Base64Encode(this.bytes.slice(this.pos, this.pos + 16), false);
        this.pos += 16;
        return base64
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

    private async ReadList(): Promise<any[]> {
        this.ReadByte(); //Element type always = Object
        let count = this.ReadVariant();
        let list = [];
        for (let i = 0; i < count; i++) {
            list.push(await this.DeserializeAsync());
        }
        return list;
    }

}
