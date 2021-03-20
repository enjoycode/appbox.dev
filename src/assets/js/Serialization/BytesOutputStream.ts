import IOutputStream from './IOutputStream';
import PayloadType from '@/assets/js/Serialization/PayloadType';
import {Utf8Encode} from '@/assets/js/Serialization/Utf8';
import Long from '@/assets/js/Long';
import {Entity} from '@/assets/js/Entity';

export default class BytesOutputStream implements IOutputStream {
    private pos = 0;
    private view = new DataView(new ArrayBuffer(1024));
    private bytes = new Uint8Array(this.view.buffer);
    private _serializedList: Entity[] = null;

    public get Bytes(): Uint8Array {
        return this.bytes.subarray(0, this.pos);
    }

    public async SerializeAsync(obj: any) {
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
            this.WriteInt32(obj.low);
            this.WriteInt32(obj.high);
        } else if (obj instanceof Entity) {
            await this.SerializeEntityAsync(obj);
        } else if (Array.isArray(obj)) {
            await this.SerializeArrayAsync(obj);
        } else {
            throw new Error('未实现');
        }
    }

    private async SerializeEntityAsync(obj: Entity) {
        if (!obj) {
            this.WriteByte(PayloadType.Null);
            return;
        }

        //判断是否已经序列化过(解决实体循环引用)
        let index = this.GetSerializedIndex(obj);
        if (index < 0) {
            this.WriteByte(PayloadType.Entity);
            await obj.WriteTo(this);
        } else {
            this.WriteByte(PayloadType.ObjectRef);
            this.WriteVariant(index);
        }
    }

    private async SerializeArrayAsync(obj: Array<any>) {
        this.WriteByte(PayloadType.Array);
        this.WriteByte(PayloadType.Object);
        this.WriteVariant(obj.length);
        for (let i = 0; i < obj.length; i++) {
            await this.SerializeAsync(obj[i]);
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

    public WriteInt64(v: number): void {
        this.ensureSizeToWrite(8);
        const high = Math.floor(v / 0x100000000);
        this.view.setUint32(this.pos, v, true); // high bits are truncated by DataView
        this.view.setUint32(this.pos + 4, high, true);
        this.pos += 8;
    }

    public WriteDouble(v: number): void {
        this.ensureSizeToWrite(8);
        this.view.setFloat64(this.pos, v, true);
        this.pos += 8;
    }

    public WriteDate(v: Date) {
        this.WriteInt64(v.getTime());
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

    public WriteAsciiString(v: string) {
        if (!v) {
            this.WriteByte(PayloadType.Null);
        } else {
            for (let i = 0; i < v.length; i++) {
                this.WriteByte(v.charCodeAt(i));
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

    private GetSerializedIndex(obj: Entity): number {
        if (!this._serializedList || this._serializedList.length == 0) {
            return -1;
        }
        for (let i = this._serializedList.length - 1; i >= 0; i--) {
            if (this._serializedList[i] === obj) {
                return i;
            }
        }
        return -1;
    }

    public AddToSerialized(obj: Entity) {
        if (!this._serializedList) {
            this._serializedList = [];
        }
        this._serializedList.push(obj);
    }

}
