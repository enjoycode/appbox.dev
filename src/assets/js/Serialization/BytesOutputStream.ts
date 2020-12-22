import IOutputStream from './IOutputStream';
import PayloadType from '@/assets/js/Serialization/PayloadType';
import {Utf8Encode} from '@/assets/js/Serialization/Utf8';
import * as Long from 'long';
import {Entity} from '@/assets/js/Entity';

export default class BytesOutputStream implements IOutputStream {
    private pos = 0;
    private view = new DataView(new ArrayBuffer(1024));
    private bytes = new Uint8Array(this.view.buffer);

    public get Bytes() {
        return this.bytes.subarray(0, this.pos);
    }

    public async SerializeAsync(obj: any): Promise<void> {
        if (obj == null) {
            this.WriteByte(PayloadType.Null);
        } else if (typeof obj === 'boolean') {
            this.WriteByte(obj === false ? PayloadType.BooleanFalse : PayloadType.BooleanTrue);
        } else if (typeof obj === 'number') {
            this.SerializeNumber(obj);
        } else if (typeof obj === 'string') {
            this.WriteByte(PayloadType.String);
            this.WriteString(obj);
        } else if (obj instanceof Long) {
            this.WriteByte(PayloadType.Int64);
            this.WriteInt32(obj.getLowBits());
            this.WriteInt32(obj.getHighBits());
        } else if (obj instanceof Entity) {
            this.WriteByte(PayloadType.Entity);
            await obj.WriteTo(this);
        } else if (Array.isArray(obj)) {
            throw new Error('未实现');
        } else {
            throw new Error('未实现');
        }
    }

    private SerializeNumber(num: number) {
        if (Number.isSafeInteger(num)) {
            //TODO: 暂全部按有符号处理以适应Java, 且暂只分int32, int64
            if (num >= -2147483648 && num <= 2147483647) {
                this.WriteByte(PayloadType.Int32);
                this.WriteInt32(num);
            } else {
                this.WriteByte(PayloadType.Int64);
                this.WriteInt64(num);
            }
        } else {
            //TODO: 暂按Double处理
            this.WriteInt64(num);
        }
    }

    private ensureSizeToWrite(sizeToWrite: number) {
        const requiredSize = this.pos + sizeToWrite;

        if (this.view.byteLength < requiredSize) {
            this.resizeBuffer(requiredSize * 2);
        }
    }

    private resizeBuffer(newSize: number) {
        const newBuffer = new ArrayBuffer(newSize);
        const newBytes = new Uint8Array(newBuffer);
        const newView = new DataView(newBuffer);

        newBytes.set(this.bytes);

        this.view = newView;
        this.bytes = newBytes;
    }

    public Skip(size: number) {
        this.pos += size;
    }

    public WriteByte(v: number): void {
        this.ensureSizeToWrite(1);
        this.view.setUint8(this.pos, v);
        this.pos++;
    }

    public WriteInt8(v: number): void {
        this.ensureSizeToWrite(1);
        this.view.setInt8(this.pos, v);
        this.pos++;
    }

    public WriteInt16(v: number): void {
        this.ensureSizeToWrite(2);
        this.view.setInt16(this.pos, v, true);
        this.pos += 2;
    }

    public WriteInt32(v: number): void {
        this.ensureSizeToWrite(4);
        this.view.setInt32(this.pos, v, true);
        this.pos += 4;
    }

    public WriteInt64(v: number): void { //TODO:待验证
        this.ensureSizeToWrite(8);
        const high = Math.floor(v / 0x1_0000_0000);
        const low = v; // high bits are truncated by DataView
        this.view.setUint32(this.pos, high);
        this.view.setUint32(this.pos + 4, low);
        this.pos += 8;
    }

    public WriteDouble(v: number): void {
        this.ensureSizeToWrite(8);
        this.view.setFloat64(this.pos, v, true);
        this.pos += 8;
    }

    public WriteString(v?: string): void {
        if (!v) {
            this.WriteVariant(-1);
        } else {
            this.WriteVariant(v.length);
            if (v.length > 0) {
                Utf8Encode(v, this);
            }
        }
    }

    public WriteVariant(v: number): void {
        if (!Number.isInteger(v)) {
            throw new Error('must be Integer');
        }

        v = (v << 1) ^ (v >> 0x1F);

        let temp = 0;
        do {
            temp = (v & 0x7F) | 0x80;
            if ((v >>= 7) != 0) {
                this.WriteByte(temp);
            } else {
                temp = temp & 0x7F;
                this.WriteByte(temp);
                break;
            }
        } while (true);
    }

}
