/** 实体成员类型 */
export enum EntityMemberType {
    //数据字段
    DataField = 0,
    //引用对象
    EntityRef = 2,
    //子对象集
    EntitySet = 3,
}

/** 实体字段数据类型 */
export enum DataFieldType {
    EntityId = 0,
    String,
    DateTime,
    UInt16,
    Int16,
    UInt32,
    Int32,
    UInt64,
    Int64,
    Decimal,
    Boolean,
    Guid,
    Byte,
    Binary,
    Enum,
    Float,
    Double,
}
