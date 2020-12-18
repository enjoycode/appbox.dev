/** 映射至服务端的实体 */
import IInputStream from '@/assets/js/Serialization/IInputStream';
import {EntityModelContainer, IMemberInfo} from '@/assets/js/Serialization/EntityModelContainer';
import {DataFieldType, EntityMemberType} from '@/assets/js/EntityMemberType';
import * as Long from 'long';

export class Entity {
    private readonly _modelId: Long;

    constructor(modelId: Long) {
        this._modelId = modelId;
    }

    /** 是否新建的实例，另外标为删除的实例接受变更后也会转为新建的 */
    isNew(): boolean {
        return true; //return this.$T.charAt(0) === '0';
    }

    /** 是否已标为删除 */
    isDeleted(): boolean {
        return false; //return this.$T.charAt(0) === '3';
    }

    /** 标为已删除 */
    markDeleted() {
        // if (!this.isNew()) {
        //     this.$T = '3' + this.$T.substring(1);
        // }
    }

    /** 用于调用服务保存后同步状态 */
    acceptChanges() {
        // this.$T = '1' + this.$T.substring(1);
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
        let obj = new Entity(modelId);

        //读取成员
        let memberId: number = 0;
        let memberInfo: IMemberInfo;
        let index: number = 0;
        while (true) {
            memberId = bs.ReadInt16();
            if (memberId == 0) {
                break;
            }

            memberInfo = model.GetMemberAt(index);
            if (memberId != memberInfo.Id) {
                throw new Error('实体模型与服务端不一致，请刷新');
            }
            //根据成员类型进行相应的读取
            if (memberInfo.MemberType == EntityMemberType.DataField) {
                switch (memberInfo.FieldType) {
                    case DataFieldType.Int32:
                        this.DefineProperty(obj, memberInfo, bs.ReadInt32());
                        break;
                    case DataFieldType.String:
                        this.DefineProperty(obj, memberInfo, bs.ReadString());
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
            obj['#persistentState'] = bs.ReadByte();
            let changedCount = bs.ReadVariant();
            if (changedCount > 0) {
                throw new Error('未实现');
            }
        }

        //TODO:SysEntity读取EntityId

        return obj;
    }

    private static DefineProperty(obj: Entity, member: IMemberInfo, value: any): void {
        obj[member.FieldName] = value;
        Object.defineProperty(obj, member.Name, {
            get() {
                return obj[member.FieldName];
            },
            set(value) {
                obj[member.FieldName] = value;
            }
        });
    }

    //endregion
}
