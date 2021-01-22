// 处理Json循环引用

import {Entity} from '@/assets/js/Entity';

function isEntity(object): boolean {
    if (typeof object !== 'object' || object === null) {
        return false;
    }
    return object instanceof Entity;
}

export function decycle(object, replacer) {
    'use strict';
    const objects = new WeakMap(); // object to path mappings

    return (function derez(value, path) {
        let old_path; // The path of an earlier occurance of value
        let nu; // The new object or array
        if (replacer !== undefined) {
            value = replacer(value);
        }
        if (isEntity(value) || Array.isArray(value)) {
            old_path = objects.get(value);
            if (old_path !== undefined) {
                return {
                    $ref: old_path
                };
            }

            objects.set(value, path);
            if (Array.isArray(value)) {
                nu = [];
                value.forEach(function(element, i) {
                    nu[i] = derez(element, path + '[' + i + ']');
                });
            } else {
                nu = {};
                Object.keys(value).forEach(function(name) {
                    nu[name] = derez(
                        value[name],
                        path + '[' + JSON.stringify(name) + ']'
                    );
                });
            }
            return nu;
        }
        return value;
    }(object, '$'));
}

export function retrocycle($) {
    'use strict';
    const px = /^\$(?:\[(?:\d+|"(?:[^\\"\u0000-\u001f]|\\(?:[\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*")\])*$/;
    (function rez(value) {

        if (value && typeof value === 'object') {
            if (Array.isArray(value)) {
                value.forEach(function(element, i) {
                    if (typeof element === 'object' && element !== null) {
                        const path = element.$ref;
                        if (typeof path === 'string' && px.test(path)) {

                            value[i] = eval(path);
                        } else {
                            rez(element);
                        }
                    }
                });
            } else {
                Object.keys(value).forEach(function(name) {
                    const item = value[name];
                    if (typeof item === 'object' && item !== null) {
                        const path = item.$ref;
                        if (typeof path === 'string' && px.test(path)) {
                            value[name] = eval(path);
                        } else {
                            rez(item);
                        }
                    }
                });
            }
        }
    }($));
    return $;
}

