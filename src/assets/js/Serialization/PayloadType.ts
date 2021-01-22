enum PayloadType {
    Null = 0,
    BooleanTrue = 1,
    BooleanFalse = 2,
    Byte = 3,
    Char = 4,
    Decimal = 5,
    Float = 6,
    Double = 7,
    Int16 = 8,
    Int32 = 9,
    Int64 = 10,
    DateTime = 15,
    String = 16,
    Guid = 17,

    Map = 18,
    Array = 19,
    List = 20,

    /** 扩展类型 */
    ExtKnownType = 21,
    /** 对象引用 */
    ObjectRef = 22,
    /** 未知类型 */
    JsonObject = 23,
    /** 其他未知类型 */
    Object = 24,

    //----模型相关----
    // EntityModel = 50,
    EntityModelInfo = 51,

    Entity = 90,

}

export default PayloadType;
