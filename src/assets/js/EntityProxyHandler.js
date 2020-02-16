// 暂没使用，浏览器支持有问题，且暂无好方法检测已经是Proxy对象

// export default {
//     get(target, key, receiver) {
//         console.log('get', key)
//         // 递归创建并返回
//         if (typeof target[key] === 'object' && target[key] !== null) {
//             return new Proxy(target[key], handler)
//         }
//         return Reflect.get(target, key, receiver)
//     },
//     set(target, key, value, receiver) {
//         console.log('set', key, value)
//         return Reflect.set(target, key, value, receiver)
//     }
// }