import Runtime from '@/assets/js/Runtime';
import IChannel from '@/assets/js/Channel/IChannel';
import IInputStream from '@/assets/js/Serialization/IInputStream';
import {EntityMemberType, DataFieldType} from '@/assets/js/EntityMemberType';
import * as Long from 'long';

export interface IMemberInfo {
    Id: number;
    Name: string;
    FieldName: string;
    MemberType: EntityMemberType;   //成员类型
    FieldType: DataFieldType;       //字段类型
}

export class EntityModelInfo {
    private readonly storeType: number;
    private readonly members: IMemberInfo[];

    private constructor(storeType: number, members: IMemberInfo[]) {
        this.storeType = storeType;
        this.members = members;
    }

    public get StoreType(): number {
        return this.storeType;
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
                FieldType: fieldType,
                FieldName: '#' + name
            };
            members.push(member);
        }
        return new EntityModelInfo(storeType, members);
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
        let res: EntityModelInfo = await channel.invoke('sys.System.GetModelInfo', [id]);
        this.models[id] = res;
        return res;
    }

}
