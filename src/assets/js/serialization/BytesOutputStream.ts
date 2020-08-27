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

    public WriteByte(v: number): void {
        // if (!Number.isInteger(v) || v < 0 || v > 255) {
        //     throw new Error("Must be uint8");
        // }
        this.ensureSizeToWrite(1);
        this.view.setUint8(this.pos, v);
        this.pos++;
    }

}