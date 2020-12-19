/** 映射至服务端的实体 */
import IInputStream from '@/assets/js/Serialization/IInputStream';
import {EntityModelContainer, IMemberInfo} from '@/assets/js/Serialization/EntityModelContainer';
import {DataFieldType, EntityMemberType} from '@/assets/js/EntityMemberType';
import * as Long from 'long';

export class Entity {
    private static readonly PS = '#PersistentState';
    private readonly _modelId: Long | string; //暂字符串表示由前端创建的实例

    constructor(modelId: Long | string) {
        this._modelId = modelId;
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
        //TODO:继续处理EntityRef及EntitySet
    }

    /** 返回移除所有导航属性的拷贝 */
    detachNavigations() {
        //TODO:
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
                    case DataFieldType.Int32:
                        obj[memberInfo.Name] = bs.ReadInt32();
                        break;
                    case DataFieldType.String:
                        obj[memberInfo.Name] = bs.ReadString();
                        break;
                    default:
                        throw new Error('未实现');
                }
            } else {
                throw new Error('未实现');
            }
        }

        //读取DBEntity属性
        if (model.StoreType > 0) {
            obj['#PersistentState'] = bs.ReadByte();
            let changedCount = bs.ReadVariant();
            if (changedCount > 0) {
                throw new Error('未实现');
            }
        }

        //TODO:SysEntity读取EntityId

        return obj;
    }

    //endregion
}
