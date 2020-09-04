import IOutputStream from './IOutputStream';

export default class BytesOutputStream implements IOutputStream {
    private pos = 0;
    private view = new DataView(new ArrayBuffer(1024));
    private bytes = new Uint8Array(this.view.buffer);

    public get Bytes() {
        return this.bytes.subarray(0, this.pos);
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

    public WriteUInt8(v: number): void {
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
        this.view.setInt16(this.pos, v);
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

}