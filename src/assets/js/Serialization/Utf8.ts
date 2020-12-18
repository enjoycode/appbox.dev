import IOutputStream from './IOutputStream';
import IInputStream from './IInputStream';

const CHUNK_SIZE = 0x1_000;

/**
 * 计算编码后的字节数
 */
export function Utf8Count(str: string): number {
    const strLength = str.length;

    let byteLength = 0;
    let pos = 0;
    while (pos < strLength) {
        let value = str.charCodeAt(pos++);

        if ((value & 0xffffff80) === 0) {
            // 1-byte
            byteLength++;
            continue;
        } else if ((value & 0xfffff800) === 0) {
            // 2-bytes
            byteLength += 2;
        } else {
            // handle surrogate pair
            if (value >= 0xd800 && value <= 0xdbff) {
                // high surrogate
                if (pos < strLength) {
                    const extra = str.charCodeAt(pos);
                    if ((extra & 0xfc00) === 0xdc00) {
                        ++pos;
                        value = ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
                    }
                }
            }

            if ((value & 0xffff0000) === 0) {
                // 3-byte
                byteLength += 3;
            } else {
                // 4-byte
                byteLength += 4;
            }
        }
    }
    return byteLength;
}

export function Utf8Encode(str: string, output: IOutputStream): void {
    const strLength = str.length;
    let pos = 0;
    while (pos < strLength) {
        let value = str.charCodeAt(pos++);

        if ((value & 0xffffff80) === 0) {
            // 1-byte
            output.WriteByte(value);
            continue;
        } else if ((value & 0xfffff800) === 0) {
            // 2-bytes
            output.WriteByte(((value >> 6) & 0x1f) | 0xc0);
        } else {
            // handle surrogate pair
            if (value >= 0xd800 && value <= 0xdbff) {
                // high surrogate
                if (pos < strLength) {
                    const extra = str.charCodeAt(pos);
                    if ((extra & 0xfc00) === 0xdc00) {
                        ++pos;
                        value = ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
                    }
                }
            }

            if ((value & 0xffff0000) === 0) {
                // 3-byte
                output.WriteByte(((value >> 12) & 0x0f) | 0xe0);
                output.WriteByte(((value >> 6) & 0x3f) | 0x80);
            } else {
                // 4-byte
                output.WriteByte(((value >> 18) & 0x07) | 0xf0);
                output.WriteByte(((value >> 12) & 0x3f) | 0x80);
                output.WriteByte(((value >> 6) & 0x3f) | 0x80);
            }
        }

        output.WriteByte((value & 0x3f) | 0x80);
    }
}

export function Utf8Decode(input: IInputStream, charLength: number): string {
    //TODO:优化
    let count = 0; //已读取的字符数
    const units: Array<number> = [];
    let result = "";

    while (true) {
        //退出条件
        if (charLength < 0) {
            if (input.Remaining <= 0) {
                break;
            }
        } else {
            if (count + units.length >= charLength) {
                break;
            }
        }

        const byte1 = input.ReadByte();
        if ((byte1 & 0x80) === 0) {
            // 1 byte
            units.push(byte1);
        } else if ((byte1 & 0xe0) === 0xc0) {
            // 2 bytes
            const byte2 = input.ReadByte() & 0x3f;
            units.push(((byte1 & 0x1f) << 6) | byte2);
        } else if ((byte1 & 0xf0) === 0xe0) {
            // 3 bytes
            const byte2 = input.ReadByte() & 0x3f;
            const byte3 = input.ReadByte() & 0x3f;
            units.push(((byte1 & 0x1f) << 12) | (byte2 << 6) | byte3);
        } else if ((byte1 & 0xf8) === 0xf0) {
            // 4 bytes
            const byte2 = input.ReadByte() & 0x3f;
            const byte3 = input.ReadByte() & 0x3f;
            const byte4 = input.ReadByte() & 0x3f;
            let unit = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0c) | (byte3 << 0x06) | byte4;
            if (unit > 0xffff) {
                unit -= 0x10000;
                units.push(((unit >>> 10) & 0x3ff) | 0xd800);
                unit = 0xdc00 | (unit & 0x3ff);
            }
            units.push(unit);
        } else {
            units.push(byte1);
        }

        if (units.length >= CHUNK_SIZE) {
            result += String.fromCharCode(...units);
            count += units.length;
            units.length = 0;
        }
    }

    if (units.length > 0) {
        result += String.fromCharCode(...units);
    }

    return result;
}
