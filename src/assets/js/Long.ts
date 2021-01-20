/**
 * wasm optimizations, to do native i64 multiplication and divide
 */
let wasm: any = null;

try {
    wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([
        0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11
    ])), {}).exports;
} catch (e) {
    // no wasm support :(
}

const TWO_PWR_16_DBL = 1 << 16;
const TWO_PWR_24_DBL = 1 << 24;
const TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
const TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
const TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
const pow_dbl = Math.pow; // Used 4 times (4*8 to 15+4)

export default class Long {
    public readonly low: number;
    public readonly high: number;
    public readonly unsigned: boolean;
    private readonly __isLong__ = true;

    /** A cache of the Long representations of small integer values. */
    private static INT_CACHE = {};
    /** A cache of the Long representations of small unsigned integer values. */
    private static UINT_CACHE = {};

    public static readonly ZERO: Long = Long.fromInt(0);
    public static readonly UZERO: Long = Long.fromInt(0, true);
    public static readonly ONE = Long.fromInt(1);
    public static readonly UONE = Long.fromInt(1, true);
    public static readonly NEG_ONE = Long.fromInt(-1);
    public static readonly MAX_VALUE: Long = Long.fromBits(0xFFFFFFFF | 0, 0x7FFFFFFF | 0, false);
    public static readonly MAX_UNSIGNED_VALUE = Long.fromBits(0xFFFFFFFF | 0, 0xFFFFFFFF | 0, true);
    public static readonly MIN_VALUE = Long.fromBits(0, 0x80000000 | 0, false);

    private static readonly TWO_PWR_24 = Long.fromInt(TWO_PWR_24_DBL);

    /**
     * Constructs a 64 bit two's-complement integer,
     * given its low and high 32 bit values as signed integers.
     * See the from* functions below for more convenient ways of constructing Longs.
     */
    constructor(low: number, high?: number, unsigned?: boolean) {
        this.low = low | 0; //The low 32 bits as a signed value.
        this.high = high | 0; //The high 32 bits as a signed value.
        this.unsigned = !!unsigned;
    }

    public static isLong(obj: any): boolean {
        return (obj && obj['__isLong__']) === true;
    }

    //region ====fromXXX====
    /**
     * Returns a Long representing the 64 bit integer that
     * comes by concatenating the given low and high bits.
     * Each is assumed to use 32 bits.
     */
    public static fromBits(lowBits: number, highBits: number, unsigned?: boolean): Long {
        return new Long(lowBits, highBits, unsigned);
    }

    /** Returns a Long representing the given 32 bit integer value. */
    public static fromInt(value: number, unsigned?: boolean): Long {
        let obj, cachedObj, cache;
        if (unsigned) {
            value >>>= 0;
            if (cache = (0 <= value && value < 256)) {
                cachedObj = (Long.UINT_CACHE)[value];
                if (cachedObj) {
                    return cachedObj;
                }
            }
            obj = Long.fromBits(value, (value | 0) < 0 ? -1 : 0, true);
            if (cache) {
                (Long.UINT_CACHE)[value] = obj;
            }
            return obj;
        } else {
            value |= 0;
            if (cache = (-128 <= value && value < 128)) {
                cachedObj = (Long.INT_CACHE)[value];
                if (cachedObj) {
                    return cachedObj;
                }
            }
            obj = Long.fromBits(value, value < 0 ? -1 : 0, false);
            if (cache) {
                (Long.INT_CACHE)[value] = obj;
            }
            return obj;
        }
    }

    /**
     * Returns a Long representing the given value,
     * provided that it is a finite number. Otherwise, zero is returned.
     */
    public static fromNumber(value: number, unsigned?: boolean): Long {
        if (isNaN(value)) {
            return unsigned ? Long.UZERO : Long.ZERO;
        }
        if (unsigned) {
            if (value < 0) {
                return Long.UZERO;
            }
            if (value >= TWO_PWR_64_DBL) {
                return Long.MAX_UNSIGNED_VALUE;
            }
        } else {
            if (value <= -TWO_PWR_63_DBL) {
                return Long.MIN_VALUE;
            }
            if (value + 1 >= TWO_PWR_63_DBL) {
                return Long.MAX_VALUE;
            }
        }
        if (value < 0) {
            return Long.fromNumber(-value, unsigned).neg();
        }
        return Long.fromBits((value % TWO_PWR_32_DBL) | 0, (value / TWO_PWR_32_DBL) | 0, unsigned);

    }

    /**
     * Returns a Long representation of the given string,
     * written using the specified radix.
     */
    public static fromString(str: string, unsigned?: boolean | number, radix?: number): Long {
        if (str.length === 0) {
            throw Error('empty string');
        }
        if (str === 'NaN' || str === 'Infinity' || str === '+Infinity' || str === '-Infinity') {
            return Long.ZERO;
        }
        if (typeof unsigned === 'number') {
            // For goog.math.long compatibility
            radix = unsigned,
                unsigned = false;
        } else {
            unsigned = !!unsigned;
        }
        radix = radix || 10;
        if (radix < 2 || 36 < radix) {
            throw RangeError('radix');
        }

        let p;
        if ((p = str.indexOf('-')) > 0) {
            throw Error('interior hyphen');
        } else if (p === 0) {
            return Long.fromString(str.substring(1), unsigned, radix).neg();
        }

        // Do several (8) digits each time through the loop, so as to
        // minimize the calls to the very expensive emulated div.
        const radixToPower = Long.fromNumber(pow_dbl(radix, 8));

        let result = Long.ZERO;
        for (let i = 0; i < str.length; i += 8) {
            const size = Math.min(8, str.length - i),
                value = parseInt(str.substring(i, i + size), radix);
            if (size < 8) {
                const power = Long.fromNumber(pow_dbl(radix, size));
                result = result.mul(power).add(Long.fromNumber(value));
            } else {
                result = result.mul(radixToPower);
                result = result.add(Long.fromNumber(value));
            }
        }
        (<any> result).unsigned = unsigned;
        return result;
    }

    /** Converts the specified value to a Long. */
    public static fromValue(val: Long | number | string | { low: number, high: number, unsigned: boolean }, unsigned?: boolean): Long {
        if (typeof val === 'number') {
            return Long.fromNumber(val, unsigned);
        }
        if (typeof val === 'string') {
            return Long.fromString(val, unsigned);
        }
        // Throws for non-objects, converts non-instanceof Long:
        return Long.fromBits(val.low, val.high, typeof unsigned === 'boolean' ? unsigned : val.unsigned);
    }

    /** Creates a Long from its byte representation. */
    public static fromBytes(bytes: number[], unsigned?: boolean, le?: boolean): Long {
        return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
    }

    /** Creates a Long from its little endian byte representation. */
    public static fromBytesLE(bytes: number[], unsigned?: boolean): Long {
        return new Long(
            bytes[0] |
            bytes[1] << 8 |
            bytes[2] << 16 |
            bytes[3] << 24,
            bytes[4] |
            bytes[5] << 8 |
            bytes[6] << 16 |
            bytes[7] << 24,
            unsigned
        );
    }

    /** Creates a Long from its big endian byte representation. */
    public static fromBytesBE(bytes: number[], unsigned?: boolean): Long {
        return new Long(
            bytes[4] << 24 |
            bytes[5] << 16 |
            bytes[6] << 8 |
            bytes[7],
            bytes[0] << 24 |
            bytes[1] << 16 |
            bytes[2] << 8 |
            bytes[3],
            unsigned
        );
    }

    //endregion

    //region ====toXXX====
    /** Converts the Long to a 32 bit integer, assuming it is a 32 bit integer. */
    public toInt(): number {
        return this.unsigned ? this.low >>> 0 : this.low;
    }

    /**
     * Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).
     */
    public toNumber(): number {
        if (this.unsigned) {
            return ((this.high >>> 0) * TWO_PWR_32_DBL) + (this.low >>> 0);
        }
        return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
    }

    /**
     * Converts the Long to a string written in the specified radix.
     * @param radix Radix (2-36), defaults to 10
     */
    public toString(radix?: number): string {
        radix = radix || 10;
        if (radix < 2 || 36 < radix) {
            throw RangeError('radix');
        }
        if (this.isZero()) {
            return '0';
        }
        if (this.isNegative()) { // Unsigned Longs are never negative
            if (this.eq(Long.MIN_VALUE)) {
                // We need to change the Long value before it can be negated, so we remove
                // the bottom-most digit in this base and then recurse to do the rest.
                const radixLong = Long.fromNumber(radix),
                    div = this.div(radixLong),
                    rem1 = div.mul(radixLong).sub(this);
                return div.toString(radix) + rem1.toInt().toString(radix);
            } else {
                return '-' + this.neg().toString(radix);
            }
        }

        // Do several (6) digits each time through the loop, so as to
        // minimize the calls to the very expensive emulated div.
        let radixToPower = Long.fromNumber(pow_dbl(radix, 6), this.unsigned);
        let rem: Long = this;
        let result = '';
        while (true) {
            let remDiv = rem.div(radixToPower),
                intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0,
                digits = intval.toString(radix);
            rem = remDiv;
            if (rem.isZero()) {
                return digits + result;
            } else {
                while (digits.length < 6) {
                    digits = '0' + digits;
                }
                result = '' + digits + result;
            }
        }
    }

    /** Converts this Long to signed. */
    public toSigned(): Long {
        if (!this.unsigned) {
            return this;
        }
        return Long.fromBits(this.low, this.high, false);
    }

    /** Converts this Long to unsigned. */
    public toUnsigned(): Long {
        if (this.unsigned) {
            return this;
        }
        return Long.fromBits(this.low, this.high, true);
    }

    /** Converts this Long to its byte representation. */
    public toBytes(le?: boolean): number[] {
        return le ? this.toBytesLE() : this.toBytesBE();
    }

    /** Converts this Long to its little endian byte representation. */
    public toBytesLE(): number[] {
        const hi = this.high,
            lo = this.low;
        return [
            lo & 0xff,
            lo >>> 8 & 0xff,
            lo >>> 16 & 0xff,
            lo >>> 24,
            hi & 0xff,
            hi >>> 8 & 0xff,
            hi >>> 16 & 0xff,
            hi >>> 24
        ];
    }

    /** Converts this Long to its big endian byte representation. */
    public toBytesBE(): number[] {
        const hi = this.high,
            lo = this.low;
        return [
            hi >>> 24,
            hi >>> 16 & 0xff,
            hi >>> 8 & 0xff,
            hi & 0xff,
            lo >>> 24,
            lo >>> 16 & 0xff,
            lo >>> 8 & 0xff,
            lo & 0xff
        ];
    }

    public toJSON(): string {
        return this.toString();
    }

    //endregion

    //region ====getXXX====
    /** Gets the high 32 bits as a signed integer. */
    public getHighBits(): number { //TODO: remove
        return this.high;
    }

    /** Gets the high 32 bits as an unsigned integer. */
    public getHighBitsUnsigned(): number {
        return this.high >>> 0;
    }

    /** Gets the low 32 bits as a signed integer. */
    public getLowBits(): number { //TODO: remove
        return this.low;
    }

    /** Gets the low 32 bits as an unsigned integer. */
    public getLowBitsUnsigned(): number {
        return this.low >>> 0;
    }

    /**
     * Gets the number of bits needed to represent the absolute value of this Long.
     */
    public getNumBitsAbs(): number {
        let bit;
        if (this.isNegative()) // Unsigned Longs are never negative
        {
            return this.eq(Long.MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
        }
        const val = this.high != 0 ? this.high : this.low;
        for (bit = 31; bit > 0; bit--) {
            if ((val & (1 << bit)) != 0) {
                break;
            }
        }
        return this.high != 0 ? bit + 33 : bit + 1;
    }

    //endregion

    //region ====isXXXX====
    /** Tests if this Long's value equals zero. */
    public isZero(): boolean {
        return this.high === 0 && this.low === 0;
    }

    /** Tests if this Long's value is negative. */
    public isNegative(): boolean {
        return !this.unsigned && this.high < 0;
    }

    /** Tests if this Long's value is positive. */
    public isPositive(): boolean {
        return this.unsigned || this.high >= 0;
    }

    /** Tests if this Long's value is odd. */
    public isOdd(): boolean {
        return (this.low & 1) === 1;
    }

    /** Tests if this Long's value is even. */
    public isEven(): boolean {
        return (this.low & 1) === 0;
    }

    //endregion

    //region ====Compare====
    /** Tests if this Long's value equals the specified's. */
    public eq(other: Long | number | string): boolean {
        let o: Long = !Long.isLong(other) ? Long.fromValue(other) : <Long> other;
        if (this.unsigned !== o.unsigned && (this.high >>> 31) === 1 && (o.high >>> 31) === 1) {
            return false;
        }
        return this.high === o.high && this.low === o.low;
    }

    /** Tests if this Long's value differs from the specified's. */
    public ne(other: Long | number | string): boolean {
        return !this.eq(other);
    }

    /** Tests if this Long's value is less than the specified's. */
    public lt(other: Long | number | string): boolean {
        return this.comp(other) < 0;
    }

    /** Tests if this Long's value is less than or equal the specified's. */
    public le(other: Long | number | string): boolean {
        return this.comp(other) <= 0;
    }

    /** Tests if this Long's value is greater than the specified's. */
    public gt(other: Long | number | string): boolean {
        return this.comp(other) > 0;
    }

    /** Tests if this Long's value is greater than or equal the specified's. */
    public ge(other: Long | number | string): boolean {
        return this.comp(other) >= 0;
    }

    /** Compares this Long's value with the specified's. */
    public comp(other: Long | number | string): number {
        let o: Long = !Long.isLong(other) ? Long.fromValue(other) : <Long> other;
        if (this.eq(o)) {
            return 0;
        }
        const thisNeg = this.isNegative(),
            otherNeg = o.isNegative();
        if (thisNeg && !otherNeg) {
            return -1;
        }
        if (!thisNeg && otherNeg) {
            return 1;
        }
        // At this point the sign bits are the same
        if (!this.unsigned) {
            return this.sub(o).isNegative() ? -1 : 1;
        }
        // Both are positive if at least one is unsigned
        return (o.high >>> 0) > (this.high >>> 0) || (o.high === this.high && (o.low >>> 0) > (this.low >>> 0)) ? -1 : 1;
    }

    //endregion

    //region ====Operators====
    /** Negates this Long's value. */
    public neg(): Long {
        if (!this.unsigned && this.eq(Long.MIN_VALUE)) {
            return Long.MIN_VALUE;
        }
        return this.not().add(Long.ONE);
    }

    /** Returns the sum of this and the specified Long. */
    public add(addend: number | Long | string): Long {
        let v: Long = !Long.isLong(addend) ? Long.fromValue(addend) : <Long> addend;

        // Divide each number into 4 chunks of 16 bits, and then sum the chunks.
        const a48 = this.high >>> 16;
        const a32 = this.high & 0xFFFF;
        const a16 = this.low >>> 16;
        const a00 = this.low & 0xFFFF;

        const b48 = v.high >>> 16;
        const b32 = v.high & 0xFFFF;
        const b16 = v.low >>> 16;
        const b00 = v.low & 0xFFFF;

        let c48 = 0, c32 = 0, c16 = 0, c00 = 0;
        c00 += a00 + b00;
        c16 += c00 >>> 16;
        c00 &= 0xFFFF;
        c16 += a16 + b16;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c32 += a32 + b32;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c48 += a48 + b48;
        c48 &= 0xFFFF;
        return Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
    }

    /** Returns the difference of this and the specified Long. */
    public sub(subtrahend: number | Long | string): Long {
        if (!Long.isLong(subtrahend)) {
            subtrahend = Long.fromValue(subtrahend);
        }
        return this.add((<Long> subtrahend).neg());
    }

    /** Returns the product of this and the specified Long. */
    public mul(multiplier: Long | number | string): Long {
        if (this.isZero()) {
            return Long.ZERO;
        }

        let v: Long = !Long.isLong(multiplier) ? Long.fromValue(multiplier) : <Long> multiplier;
        if (v.isZero()) {
            return Long.ZERO;
        }

        // use wasm support if present
        if (wasm) {
            let low = wasm.mul(this.low, this.high, v.low, v.high);
            return Long.fromBits(low, wasm.get_high(), this.unsigned);
        }

        if (this.eq(Long.MIN_VALUE)) {
            return v.isOdd() ? Long.MIN_VALUE : Long.ZERO;
        }
        if (v.eq(Long.MIN_VALUE)) {
            return this.isOdd() ? Long.MIN_VALUE : Long.ZERO;
        }

        if (this.isNegative()) {
            if (v.isNegative()) {
                return this.neg().mul(v.neg());
            } else {
                return this.neg().mul(v).neg();
            }
        } else if (v.isNegative()) {
            return this.mul(v.neg()).neg();
        }

        // If both longs are small, use float multiplication
        if (this.lt(Long.TWO_PWR_24) && v.lt(Long.TWO_PWR_24)) {
            return Long.fromNumber(this.toNumber() * v.toNumber(), this.unsigned);
        }

        // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
        // We can skip products that would overflow.

        const a48 = this.high >>> 16;
        const a32 = this.high & 0xFFFF;
        const a16 = this.low >>> 16;
        const a00 = this.low & 0xFFFF;

        const b48 = v.high >>> 16;
        const b32 = v.high & 0xFFFF;
        const b16 = v.low >>> 16;
        const b00 = v.low & 0xFFFF;

        let c48 = 0, c32 = 0, c16 = 0, c00 = 0;
        c00 += a00 * b00;
        c16 += c00 >>> 16;
        c00 &= 0xFFFF;
        c16 += a16 * b00;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c16 += a00 * b16;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c32 += a32 * b00;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c32 += a16 * b16;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c32 += a00 * b32;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
        c48 &= 0xFFFF;
        return Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
    }

    /** Returns this Long divided by the specified. */
    public div(divisor: Long | number | string): Long {
        let v: Long = !Long.isLong(divisor) ? Long.fromValue(divisor) : <Long> divisor;
        if (v.isZero()) {
            throw Error('division by zero');
        }
        if (this.isZero()) {
            return this.unsigned ? Long.UZERO : Long.ZERO;
        }

        // use wasm support if present
        if (wasm) {
            // guard against signed division overflow: the largest
            // negative number / -1 would be 1 larger than the largest
            // positive number, due to two's complement.
            if (!this.unsigned &&
                this.high === -0x80000000 &&
                v.low === -1 && v.high === -1) {
                // be consistent with non-wasm code path
                return this;
            }
            const low = (this.unsigned ? wasm.div_u : wasm.div_s)(
                this.low,
                this.high,
                v.low,
                v.high
            );
            return Long.fromBits(low, wasm.get_high(), this.unsigned);
        }

        let approx, rem, res;
        if (!this.unsigned) {
            // This section is only relevant for signed longs and is derived from the
            // closure library as a whole.
            if (this.eq(Long.MIN_VALUE)) {
                if (v.eq(Long.ONE) || v.eq(Long.NEG_ONE)) {
                    return Long.MIN_VALUE;
                }// recall that -MIN_VALUE == MIN_VALUE
                else if (v.eq(Long.MIN_VALUE)) {
                    return Long.ONE;
                } else {
                    // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
                    const halfThis = this.shr(1);
                    approx = halfThis.div(v).shl(1);
                    if (approx.eq(Long.ZERO)) {
                        return v.isNegative() ? Long.ONE : Long.NEG_ONE;
                    } else {
                        rem = this.sub(v.mul(approx));
                        res = approx.add(rem.div(v));
                        return res;
                    }
                }
            } else if (v.eq(Long.MIN_VALUE)) {
                return this.unsigned ? Long.UZERO : Long.ZERO;
            }
            if (this.isNegative()) {
                if (v.isNegative()) {
                    return this.neg().div(v.neg());
                }
                return this.neg().div(v).neg();
            } else if (v.isNegative()) {
                return this.div(v.neg()).neg();
            }
            res = Long.ZERO;
        } else {
            // The algorithm below has not been made for unsigned longs. It's therefore
            // required to take special care of the MSB prior to running it.
            if (!v.unsigned) {
                v = v.toUnsigned();
            }
            if (v.gt(this)) {
                return Long.UZERO;
            }
            if (v.gt(this.shru(1))) // 15 >>> 1 = 7 ; with divisor = 8 ; true
            {
                return Long.UONE;
            }
            res = Long.UZERO;
        }

        // Repeat the following until the remainder is less than other:  find a
        // floating-point that approximates remainder / other *from below*, add this
        // into the result, and subtract it from the remainder.  It is critical that
        // the approximate value is less than or equal to the real value so that the
        // remainder never becomes negative.
        rem = this;
        while (rem.gte(v)) {
            // Approximate the result of division. This may be a little greater or
            // smaller than the actual value.
            approx = Math.max(1, Math.floor(rem.toNumber() / v.toNumber()));

            // We will tweak the approximate result by changing it in the 48-th digit or
            // the smallest non-fractional digit, whichever is larger.
            let log2 = Math.ceil(Math.log(approx) / Math.LN2),
                delta = (log2 <= 48) ? 1 : pow_dbl(2, log2 - 48),

                // Decrease the approximation until it is smaller than the remainder.  Note
                // that if it is too large, the product overflows and is negative.
                approxRes = Long.fromNumber(approx),
                approxRem = approxRes.mul(v);
            while (approxRem.isNegative() || approxRem.gt(rem)) {
                approx -= delta;
                approxRes = Long.fromNumber(approx, this.unsigned);
                approxRem = approxRes.mul(v);
            }

            // We know the answer can't be zero... and actually, zero would cause
            // infinite recursion since we would make no progress.
            if (approxRes.isZero()) {
                approxRes = Long.ONE;
            }

            res = res.add(approxRes);
            rem = rem.sub(approxRem);
        }
        return res;
    }

    /** Returns this Long modulo the specified. */
    public mod(divisor: Long | number | string): Long {
        let v: Long = !Long.isLong(divisor) ? Long.fromValue(divisor) : <Long> divisor;

        // use wasm support if present
        if (wasm) {
            const low = (this.unsigned ? wasm.rem_u : wasm.rem_s)(
                this.low,
                this.high,
                v.low,
                v.high
            );
            return Long.fromBits(low, wasm.get_high(), this.unsigned);
        }

        return this.sub(this.div(v).mul(v));
    }

    /** Returns the bitwise NOT of this Long. */
    public not(): Long {
        return Long.fromBits(~this.low, ~this.high, this.unsigned);
    }

    /** Returns the bitwise AND of this Long and the specified. */
    public and(other: Long | number | string): Long {
        let v: Long = !Long.isLong(other) ? Long.fromValue(other) : <Long> other;
        return Long.fromBits(this.low & v.low, this.high & v.high, this.unsigned);
    }

    /** Returns the bitwise OR of this Long and the specified. */
    public or(other: Long | number | string): Long {
        let v: Long = !Long.isLong(other) ? Long.fromValue(other) : <Long> other;
        return Long.fromBits(this.low & v.low, this.high & v.high, this.unsigned);
    }

    /** Returns the bitwise XOR of this Long and the given one. */
    public xor(other: Long | number | string): Long {
        let v: Long = !Long.isLong(other) ? Long.fromValue(other) : <Long> other;
        return Long.fromBits(this.low ^ v.low, this.high ^ v.high, this.unsigned);
    }

    /** Returns this Long with bits shifted to the left by the given amount. */
    public shl(numBits: number | Long): Long {
        let bits: number = Long.isLong(numBits) ? (<Long> numBits).toInt() : <number> numBits;
        if ((bits &= 63) === 0) {
            return this;
        } else if (bits < 32) {
            return Long.fromBits(this.low << bits, (this.high << bits) | (this.low >>> (32 - bits)), this.unsigned);
        } else {
            return Long.fromBits(0, this.low << (bits - 32), this.unsigned);
        }
    }

    /** Returns this Long with bits arithmetically shifted to the right by the given amount. */
    public shr(numBits: number | Long): Long {
        let bits: number = Long.isLong(numBits) ? (<Long> numBits).toInt() : <number> numBits;
        if ((bits &= 63) === 0) {
            return this;
        } else if (bits < 32) {
            return Long.fromBits((this.low >>> bits) | (this.high << (32 - bits)), this.high >> bits, this.unsigned);
        } else {
            return Long.fromBits(this.high >> (bits - 32), this.high >= 0 ? 0 : -1, this.unsigned);
        }
    }

    /** Returns this Long with bits logically shifted to the right by the given amount. */
    public shru(numBits: number | Long): Long {
        let bits: number = Long.isLong(numBits) ? (<Long> numBits).toInt() : <number> numBits;
        bits &= 63;
        if (bits === 0) {
            return this;
        } else {
            const high = this.high;
            if (bits < 32) {
                const low = this.low;
                return Long.fromBits((low >>> bits) | (high << (32 - bits)), high >>> bits, this.unsigned);
            } else if (bits === 32) {
                return Long.fromBits(high, 0, this.unsigned);
            } else {
                return Long.fromBits(high >>> (bits - 32), 0, this.unsigned);
            }
        }
    }

    //endregion

}
