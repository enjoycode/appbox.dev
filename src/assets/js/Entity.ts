/** 映射至服务端的实体 */
import IInputStream from '@/assets/js/Serialization/IInputStream';
import {EntityModelContainer, EntityModelInfo, IMemberInfo} from '@/assets/js/Serialization/EntityModelContainer';
import {DataFieldType, EntityMemberType} from '@/assets/js/EntityMemberType';
import * as Long from 'long';
import IOutputStream from '@/assets/js/Serialization/IOutputStream';
import PayloadType from '@/assets/js/Serialization/PayloadType';

export class Entity {
    public static readonly PS = 'PersistentState';
    private _modelInfo: EntityModelInfo | string; //暂字符串表示由前端创建的实例

    constructor(modelInfo: EntityModelInfo | string) {
        this._modelInfo = modelInfo;
    }

    /** 是否新建的实例，另外标为删除的实例接受变更后也会转为新建的 */
    isNew(): boolean {
        if (this[Entity.PS]) {
            return this[Entity.PS] == 0;
        }
        return true;
    }

    /** 是否已标为删除 */
    isDeleted(): boolean {
        if (this[Entity.PS]) {
            return this[Entity.PS] == 3;
        }
        return false;
    }

    /** 标为已删除 */
    markDeleted() {
        if (this[Entity.PS]) {
            return this[Entity.PS] = 3;
        }
    }

    /** 用于调用服务保存后同步状态 */
    acceptChanges() {
        if (this[Entity.PS]) {
            this[Entity.PS] = 1;
        }
        //TODO:如果由前端创建的转换返回成后端格式
        //TODO:继续处理EntityRef及EntitySet
    }

    /** 返回移除所有导航属性的拷贝 */
    detachNavigations() {
        //TODO:改为设置开关，以便序列化时是否附带导航属性
    }

    //region ====Serialization====
    public static async ReadFrom(bs: IInputStream): Promise<Entity> {
        let modelId = bs.ReadInt64();
        let model = await EntityModelContainer.GetModelAsync(modelId);
        let obj = Object.create(model.Entity);

        //读取成员
        let memberId: number = 0;
        let memberInfo: IMemberInfo;
        while (true) {
            memberId = bs.ReadInt16();
            if (memberId == 0) {
                break;
            }

            memberInfo = model.GetMember(memberId);
            if (!memberInfo) {
                throw new Error('无法找到成员，实体模型与服务端不一致，请刷新');
            }
            //根据成员类型进行相应的读取
            if (memberInfo.MemberType == EntityMemberType.DataField) {
                switch (memberInfo.FieldType) {
                    case DataFieldType.Boolean:
                        obj[memberInfo.Name] = bs.ReadByte() == 1;
                        break;
                    case DataFieldType.Byte:
                        obj[memberInfo.Name] = bs.ReadByte();
                        break;
                    case DataFieldType.Int16:
                        obj[memberInfo.Name] = bs.ReadInt16();
                        break;
                    case DataFieldType.Int32:
                        obj[memberInfo.Name] = bs.ReadInt32();
                        break;
                    case DataFieldType.Int64:
                        obj[memberInfo.Name] = bs.ReadInt64();
                        break;
                    case DataFieldType.String:
                        obj[memberInfo.Name] = bs.ReadString();
                        break;
                    default:
                        throw new Error('未实现读取实体Field: ' + memberInfo.FieldType);
                }
            } else if (memberInfo.MemberType == EntityMemberType.EntityRef) {
                obj[memberInfo.Name] = await Entity.ReadFrom(bs);
            } else if (memberInfo.MemberType == EntityMemberType.EntitySet) {
                let count = bs.ReadVariant();
                let list = [];
                for (let i = 0; i < count; i++) {
                    list.push(await Entity.ReadFrom(bs));
                }
                obj[memberInfo.Name] = list;
            } else {
                throw new Error('未实现读取实体成员类型: ' + memberInfo.MemberType);
            }
        }

        //读取DBEntity属性
        if (model.StoreType > 0) {
            obj[Entity.PS] = bs.ReadByte();
            let changedCount = bs.ReadVariant();
            if (changedCount > 0) {
                throw new Error('未实现读取实体变更成员列表');
            }
            //读取匿名扩展字段
            let extFields = bs.ReadVariant();
            if (extFields > 0) {
                for (let i = 0; i < extFields; i++) {
                    let fieldName = bs.ReadString();
                    obj[fieldName] = await bs.DeserializeAsync();
                }
            }
        }

        //TODO:SysEntity读取EntityId

        return obj;
    }

    public async WriteTo(bs: IOutputStream): Promise<void> {
        if (typeof this._modelInfo == 'string') {
            let id: Long = Long.fromString(this._modelInfo, true);
            this._modelInfo = await EntityModelContainer.GetModelAsync(id);
        }
        //model id
        bs.WriteInt32(this._modelInfo.Id.getLowBits());
        bs.WriteInt32(this._modelInfo.Id.getHighBits());
        //实体成员
        for (const m of this._modelInfo.Members) {
            //根据成员类型进行相应的写入
            if (m.MemberType == EntityMemberType.DataField) {
                let fieldValue = this[m.Name];
                if (fieldValue) {
                    bs.WriteInt16(m.Id);
                    switch (m.FieldType) {
                        case DataFieldType.Int32:
                            bs.WriteInt32(fieldValue);
                            break;
                        case DataFieldType.String:
                            bs.WriteString(fieldValue);
                            break;
                        default:
                            throw new Error('未实现写入实体Field: ' + m.FieldType);
                    }
                } else {
                    //TODO:暂写入null值，应判断是否改变
                    bs.WriteInt16(m.Id);
                    bs.WriteByte(PayloadType.Null);
                }
            } else {
                throw new Error('未实现');
            }
        }
        bs.WriteInt16(0); //end members

        //写入DBEntity属性
        if (this._modelInfo.StoreType > 0) {
            bs.WriteByte(this[Entity.PS]);
            //TODO:写入变更成员列表
            bs.WriteVariant(-1);
            //暂不考虑写入扩展信息
            bs.WriteVariant(0);
        }
    }

    //endregion
}
