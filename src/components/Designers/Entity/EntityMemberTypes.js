// 用于根据存储类型获取可用的实体成员类型列表

export default function (storeType) {
    if (storeType === 'Sql') {
        return [
            { text: 'DataField', value: 0 },
            // {text: 'EntityRefDisplayText', value: 1},
            { text: 'EntityRef', value: 2 },
            { text: 'EntitySet', value: 3 },
            // {text: 'AggregationRefField', value: 4},
            // {text: 'Formula', value: 5},
            // {text: 'Aggregate', value: 6},
            { text: 'AutoNumber', value: 7 }// ,
            // {text: 'Tracker', value: 8},
            // {text: 'Attached', value: 9},
            // {text: 'ImageRef', value: 10}
        ]
    } else if (storeType === 'Table') {
        return [
            { text: 'DataField', value: 0 },
            { text: 'FieldSet', value: 11 }
        ]
    } else {
        return [
            { text: 'DataField', value: 0 }
        ]
    }
}


