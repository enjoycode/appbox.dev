import IInputStream from './IInputStream';

export default class BytesInputStream implements IInputStream {
    private pos = 0;
    private view: DataView;
    private bytes: Uint8Array;

    constructor(buffer: ArrayBuffer) {
        this.bytes = new Uint8Array(buffer);
        this.view = new DataView(buffer);
    }

    private ensureRemaining(size: number) {
        if (this.view.byteLength - this.pos < size) {
            throw new RangeError("Has no data.");
        }
    }

    public ReadByte(): number {
        this.ensureRemaining(1);
        const value = this.view.getUint8(this.pos);
        this.pos++;
        return value;
    }

}