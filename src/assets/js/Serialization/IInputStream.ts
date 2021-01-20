import Long from '@/assets/js/Long';

interface IInputStream {

    readonly Remaining: number;

    DeserializeAsync(): Promise<any>;

    ReadByte(): number;

    ReadInt16(): number;

    ReadInt32(): number;

    ReadInt64(): Long;

    ReadVariant(): number;

    ReadDate(): Date;

    ReadString(): string;

    ReadEntityId(): string; //TODO:暂转换为Base64

    ReadBinary(): string; //TODO:暂转换为Base64

}

export default IInputStream;
