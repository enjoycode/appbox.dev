import IInputStream from './IInputStream';

export default class BytesInputStream implements IInputStream {
    private pos = 0;
    private view: DataView;
    private bytes: Uint8Array;

    constructor(buffer: ArrayBuffer) {
        this.bytes = new Uint8Array(buffer);
        this.view = new DataView(buffer);
    }

    /**
     * 剩余字节数
     */
    public get Remaining(): number {
        return this.view.byteLength - this.pos;
    }

    private ensureRemaining(size: number) {
        if (this.view.byteLength - this.pos < size) {
            throw new RangeError("Has no data.");
        }
    }

    public ReadUInt8(): number {
        this.ensureRemaining(1);
        const value = this.view.getUint8(this.pos);
        this.pos++;
        return value;
    }

    public ReadInt32(): number {
        this.ensureRemaining(4);
        const value = this.view.getInt32(this.pos, true);
        this.pos += 4;
        return value;
    }

}