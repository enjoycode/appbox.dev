import Long from '@/assets/js/Long';
import {Entity} from '@/assets/js/Entity';

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

    /** 添加已反序列化列表，用于解决实体循环引用 */
    AddToDeserialized(obj: Entity): void;
}

export default IInputStream;
