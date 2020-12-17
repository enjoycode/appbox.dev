import Runtime from '@/assets/js/Runtime';
import IChannel from '@/assets/js/IChannel';
import IInputStream from '@/assets/js/serialization/IInputStream';

interface EntityMemberInfo {
    Id: number;
    Name: string;
}

export class EntityModelInfo {
    private readonly storeType: number;
    private readonly members: EntityMemberInfo[];

    private constructor(storeType: number, members: EntityMemberInfo[]) {
        this.storeType = storeType;
        this.members = members;
    }

    public GetMemberId(name: string): number {
        let member = this.members.find(m => m.Name == name);
        if (member) {
            return member.Id;
        } else {
            throw new Error('Can\'t find member: ' + name);
        }
    }

    public GetMemberName(id: number): string {
        let member = this.members.find(m => m.Id == id);
        if (member) {
            return member.Name;
        } else {
            throw new Error('Can\'t find member: ' + id);
        }
    }

    public static ReadFrom(bs: IInputStream): EntityModelInfo {
        let storeType = bs.ReadByte();
        let members: EntityMemberInfo[] = [];
        while (bs.Remaining > 0) {
            let member: EntityMemberInfo = {Id: bs.ReadInt16(), Name: bs.ReadString()};
            members.push(member);
        }
        return new EntityModelInfo(storeType, members);
    }
}

export abstract class EntityModelContainer {

    private static readonly models: Map<string, EntityModelInfo> = new Map<string, EntityModelInfo>();

    public static async GetModelAsync(id: string): Promise<EntityModelInfo> {
        const cached = this.models.get(id);
        if (cached) {
            return cached;
        }

        const channel = <IChannel> Runtime.channel;
        let res: EntityModelInfo = await channel.invoke('sys.SystemService.GetModelInfo', [id]);
        this.models[id] = res;
        return res;
    }

}
