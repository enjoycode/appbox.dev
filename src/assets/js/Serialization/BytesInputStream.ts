import IInputStream from './IInputStream';
import * as Long from 'long';
import PayloadType from '@/assets/js/Serialization/PayloadType';
import {EntityModelInfo} from '@/assets/js/Serialization/EntityModelContainer';
import {Utf8Decode} from '@/assets/js/Serialization/Utf8';
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
        let base64    = ''
        const encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

        let buffer = this.bytes.slice(this.pos, this.pos + 16);
        const byteLength = buffer.byteLength;
        const byteRemainder = byteLength % 3;
        const mainLength = byteLength - byteRemainder;

        let a, b, c, d;
        let chunk;

        // Main loop deals with bytes in chunks of 3
        for (let i = 0; i < mainLength; i = i + 3) {
            // Combine the three bytes into a single integer
            chunk = (buffer[i] << 16) | (buffer[i + 1] << 8) | buffer[i + 2]

            // Use bitmasks to extract 6-bit segments from the triplet
            a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
            b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
            c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
            d = chunk & 63               // 63       = 2^6 - 1

            // Convert the raw binary segments to the appropriate ASCII encoding
            base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
        }

        // Deal with the remaining bytes and padding
        if (byteRemainder == 1) {
            chunk = buffer[mainLength]

            a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

            // Set the 4 least significant bits to zero
            b = (chunk & 3)   << 4 // 3   = 2^2 - 1

            base64 += encodings[a] + encodings[b] + '=='
        } else if (byteRemainder == 2) {
            chunk = (buffer[mainLength] << 8) | buffer[mainLength + 1]

            a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
            b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

            // Set the 2 least significant bits to zero
            c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

            base64 += encodings[a] + encodings[b] + encodings[c] + '='
        }

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
