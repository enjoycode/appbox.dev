/* eslint-disable */

/** 还原对象引用关系 */
function resolveObjRef(root) {
    const idProp = 'ID'
    const refProp = '$R'
    const typeProp = '$T'
    var objrefs = {}

    function walk(it) {
        if (typeof it !== 'object' || !it || it instanceof Date) {
            return
        }

        if (Array.isArray(it)) {
            for (let i = 0; i < it.length; i++) {
                walk(it[i])
            }
        } else {
            // 先加入字典表
            if (it[typeProp] && it[idProp]) {
                objrefs[it[typeProp] + it[idProp]] = it
            }
            // 循环处理所有属性
            for (const key in it) {
                if (it[key] && typeof it[key] === 'object' && it[key][refProp]) { // 是引用对象
                    it[key] = objrefs[it[key][refProp]]
                } else {
                    walk(it[key])
                }
            }
        }
    }

    walk(root)
    return root
}

/** 解决对象引用关系，注意:返回新对象实例 */
function solveObjRef(root) {
    const idProp = 'ID'
    const refProp = '$R'
    const typeProp = '$T'
    var objrefs = []

    function walk(it) {
        if (typeof it !== 'object' || !it || it instanceof Date) {
            return it
        }

        if (Array.isArray(it)) {
            var target = []
            for (let i = 0; i < it.length; i++) {
                target.push(walk(it[i]))
            }
            return target
        } else {
            var target = {}
            // 先加入字典表
            if (it[typeProp] && it[idProp]) {
                objrefs.push(it)
            }
            for (const key in it) {
                if (it.hasOwnProperty(key)) {
                    if (it[key] && typeof it[key] === 'object' && it[key][typeProp] && it[key][idProp]) { // 是引用对象
                        var existed = false
                        for (let i = 0; i < objrefs.length; i++) {
                            if (objrefs[i] === it[key]) {
                                existed = true; break;
                            }
                        }
                        if (existed) {
                            target[key] = { $R: it[key][typeProp] + it[key][idProp] }
                        } else {
                            target[key] = walk(it[key])
                        }
                    } else {
                        target[key] = walk(it[key])
                    }
                }
            }
            return target
        }
    }

    return walk(root)
}

function fromRefJson(str) {
    var obj = JSON.parse(str)
    resolveObjRef(obj)
    return obj
}

function toRefJson(root) {
    var obj = solveObjRef(root)
    return JSON.stringify(obj)
}

export default {
    fromRefJson: fromRefJson,
    toRefJson: toRefJson,
    solveObjRef: solveObjRef,
    resolveObjRef: resolveObjRef,
    /** 移除Entity实例的所有EntityRef及EntitySet引用，返回新对象 */
    detachEntityRefs(source) {
        if (typeof source !== 'object' || !source) {
            return source
        }

        var target = {}
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                if (Array.isArray(source[key])) {
                    target[key] = []
                } else if (typeof source[key] === 'object' && key !== 'Base') { // 忽略继承的基类实例
                    target[key] = null
                } else {
                    target[key] = source[key]
                }
            }
        }
        return target
    }
}