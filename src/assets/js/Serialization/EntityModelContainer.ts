import Runtime from '@/assets/js/Runtime';
import IChannel from '@/assets/js/Channel/IChannel';
import IInputStream from '@/assets/js/Serialization/IInputStream';
import {EntityMemberType, DataFieldType} from '@/assets/js/EntityMemberType';
import * as Long from 'long';
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

    private constructor(storeType: number, members: IMemberInfo[]) {
        this.storeType = storeType;
        this.members = members;
    }

    public get StoreType(): number {
        return this.storeType;
    }

    public get Entity(): object {
        return this.entity;
    }

    public InitTempEntity(modelId: Long): void {
        if (this.entity)
            return;
        let obj = new Entity(modelId);
        for (const m of this.members) {
            EntityModelInfo.DefineProperty(obj, m.Name);
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
        obj[fieldName] = undefined;
        Object.defineProperty(obj, name, {
            get() {
                return obj[fieldName];
            },
            set(value) {
                obj[fieldName] = value;
            }
        });
    }

}

export abstract class EntityModelContainer {

    private static readonly models: Map<Long, EntityModelInfo> = new Map<string, EntityModelInfo>();

    public static async GetModelAsync(id: Long): Promise<EntityModelInfo> {
        const cached = this.models.get(id);
        if (cached) {
            return cached;
        }

        const channel = <IChannel> Runtime.channel;
        let model: EntityModelInfo = await channel.invoke('sys.System.GetModelInfo', [id]);
        model.InitTempEntity(id);
        this.models[id] = model;
        return model;
    }

}
