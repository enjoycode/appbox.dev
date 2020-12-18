import * as Long from 'long';

interface IInputStream {

    readonly Remaining: number;

    DeserializeAsync(): Promise<any>;

    ReadByte(): number;

    ReadInt16(): number;

    ReadInt32(): number;

    ReadInt64(): Long;

    ReadVariant(): number;

    ReadString(): string;

}

export default IInputStream;
