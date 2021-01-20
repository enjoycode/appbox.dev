import Runtime from '@/assets/js/Runtime';
import IChannel from '@/assets/js/Channel/IChannel';
import IInputStream from '@/assets/js/Serialization/IInputStream';
import {EntityMemberType, DataFieldType} from '@/assets/js/EntityMemberType';
import Long from '@/assets/js/Long';
import {Entity} from '@/assets/js/Entity';

export interface IMemberInfo {
    Id: number;
    Name: string;
    MemberType: EntityMemberType;   //成员类型
    FieldType: DataFieldType;       //字段类型
}

export class EntityModelInfo {
    private readonly storeType: number;
    private readonly members: IMemberInfo[];
    private entity: Entity;
    private id: Long;

    private constructor(storeType: number, members: IMemberInfo[]) {
        this.storeType = storeType;
        this.members = members;
    }

    public get Id(): Long {
        return this.id;
    }

    public get StoreType(): number {
        return this.storeType;
    }

    public get Entity(): object {
        return this.entity;
    }

    public get Members(): IMemberInfo[] {
        return this.members;
    }

    public InitTempEntity(modelId: Long): void {
        if (this.entity) {
            return;
        }
        this.id = modelId;
        let obj = new Entity(this);
        for (const m of this.members) {
            EntityModelInfo.DefineProperty(obj, m.Name);
        }
        if (this.storeType > 0) {
            EntityModelInfo.DefineProperty(obj, Entity.PS); //TODO: readonly
        }
        Object.seal(obj);
        this.entity = obj;
    }

    public GetMember(id: number): IMemberInfo {
        //TODO:binarySearch
        return this.members.find(m => m.Id == id);
    }

    public static ReadFrom(bs: IInputStream): EntityModelInfo {
        let storeType = bs.ReadByte();
        let members: IMemberInfo[] = [];
        while (bs.Remaining > 0) {
            let id = bs.ReadInt16();
            let type = bs.ReadByte();
            let fieldType = bs.ReadByte();
            let name = bs.ReadString();
            let member: IMemberInfo = {
                Id: id,
                Name: name,
                MemberType: type,
                FieldType: fieldType
            };

            members.push(member);
        }
        return new EntityModelInfo(storeType, members);
    }

    private static DefineProperty(obj: object, name: string): void {
        let fieldName = '#' + name;
        Object.defineProperty(obj, fieldName, {
            writable: true,
            enumerable: false
        });

        Object.defineProperty(obj, name, {
            configurable: false,
            enumerable: true,
            get() {
                return this[fieldName];
            },
            set(value) {
                this[fieldName] = value;
            }
        });
    }

}

export abstract class EntityModelContainer {

    //TODO:LRU cache
    private static readonly models: EntityModelInfo[] = [];

    public static async GetModelAsync(id: Long): Promise<EntityModelInfo> {
        let cached = this.models.find(m => m.Id.eq(id));
        if (cached) {
            return cached;
        }

        const channel = <IChannel> Runtime.channel;
        let model: EntityModelInfo = await channel.invoke('sys.System.GetModelInfo', [id]);
        model.InitTempEntity(id);
        this.models.push(model);
        return model;
    }

}
