import IInputStream from './IInputStream';
import PayloadType from './PayloadType';

interface ITypeDeserializer {
    (bs: BinDeserializer): any;
}

const knownTypes: Map<PayloadType, ITypeDeserializer> = new Map<PayloadType, ITypeDeserializer>([
    [PayloadType.EntityModel, (bs) => null],
]);

export default class BinDeserializer {
    private readonly stream: IInputStream;

    constructor(stream: IInputStream) {
        this.stream = stream;
    }

    public Deserialize(): any {
        let payloadType = this.stream.ReadByte();
        if (payloadType == PayloadType.Null) {
            return null;
        } else if (payloadType == PayloadType.BooleanTrue) {
            return true;
        } else if (payloadType == PayloadType.BooleanFalse) {
            return false;
        } else if (payloadType == PayloadType.ObjectRef) {
            throw new Error("Not implemented.");
        }

        let deserializer = knownTypes.get(payloadType);
        if (deserializer) {
            return deserializer(this);
        }
        throw new Error("未实现的类型:" + payloadType.toString());
    }
}