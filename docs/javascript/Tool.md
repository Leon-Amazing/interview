## 常用方法工具库

```js{9,15,20,29,39,47,56,100,122}
(function () {
    "use strict";

    const getProto = Object.getPrototypeOf,
        class2type = {},
        toString = class2type.toString,
        hasOwn = class2type.hasOwnProperty;

    // 检测是否为函数
    const isFunction = function isFunction(obj) {
        return typeof obj === "function" && typeof obj.nodeType !== "number" &&
            typeof obj.item !== "function";
    };

    // 检测是否为window对象
    const isWindow = function isWindow(obj) {
        return obj != null && obj === obj.window;
    };

    // 通用检测数据类型的办法，返回结果：字符串、含小写的数据类型
    const toType = function toType(obj) {
        let reg = /^\[object (.+)\]$/;
        if (obj == null) return obj + "";
        return typeof obj === "object" || typeof obj === "function" ?
            reg.exec(toString.call(obj))[1].toLowerCase() :
            typeof obj;
    };

    // 检测是否为标准普通对象(纯粹对象)
    const isPlainObject = function isPlainObject(obj) {
        let proto, Ctor;
        if (!obj || toString.call(obj) !== "[object Object]") return false;
        proto = getProto(obj);
        if (!proto) return true;
        Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
        return typeof Ctor === "function" && Ctor === Object;
    };

    // 检测是否为空对象
    const isEmptyObject = function isEmptyObject(obj) {
        if (obj == null || !/^(object|function)$/.test(typeof obj)) return false;
        let keys = Object.getOwnPropertyNames(obj);
        if (typeof Symbol !== "undefined") keys = keys.concat(Object.getOwnPropertySymbols(obj));
        return keys.length === 0;
    };

    // 检测是否为数组或者类数组
    const isArrayLike = function isArrayLike(obj) {
        let length = !!obj && "length" in obj && obj.length,
            type = toType(obj);
        if (isFunction(obj) || isWindow(obj)) return false;
        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && (length - 1) in obj;
    };

    // 函数防抖 &节流
    const clearTimer = function clearTimer(timer) {
        if (timer !== null) clearTimeout(timer);
        return null;
    };
    const debounce = function debounce(func, wait, immediate) {
        if (typeof func !== "function") throw new TypeError("func is not a function!");
        if (typeof wait === "boolean") immediate = wait;
        if (typeof wait !== "number") wait = 300;
        if (typeof immediate !== "boolean") immediate = false;
        let timer = null;
        return function operate(...params) {
            let now = !timer && immediate;
            timer = clearTimer(timer);
            timer = setTimeout(() => {
                timer = clearTimer(timer);
                if (!immediate) func.apply(this, params);
            }, wait);
            if (now) return func.apply(this, params);
        };
    };
    const throttle = function throttle(func, wait) {
        if (typeof func !== "function") throw new TypeError("func is not a function!");
        if (typeof wait !== "number") wait = 300;
        let timer = null,
            previous = 0;
        return function operate(...params) {
            let now = +new Date(),
                remaining = wait - (now - previous);
            if (remaining <= 0) {
                timer = clearTimer(timer);
                previous = +new Date();
                return func.apply(this, params);
            }
            if (!timer) {
                timer = setTimeout(() => {
                    timer = clearTimer(timer);
                    previous = +new Date();
                    func.apply(this, params);
                }, remaining);
            }
        };
    };

    // 迭代方法:迭代数组、类数组、对象(支持回调函数返回false结束循环)
    const each = function each(obj, callback) {
        if (obj == null || !/^object$/.test(typeof obj)) throw new TypeError("obj must be an object/array/likeArray");
        if (typeof callback !== "function") throw new TypeError("callback is not a function");
        let item, keys, key;
        if (isArrayLike(obj)) {
            for (let i = 0; i < obj.length; i++) {
                item = obj[i];
                if (callback.call(item, item, i) === false) break;
            }
        } else {
            keys = Object.getOwnPropertyNames(obj);
            if (typeof Symbol !== "undefined") keys = keys.concat(Object.getOwnPropertySymbols(obj));
            for (let i = 0; i < keys.length; i++) {
                key = keys[i];
                item = obj[key];
                if (callback.call(item, item, key) === false) break;
            }
        }
        return obj;
    };

    // 数组/对象的深浅拷贝&深浅合并
    const clone = function clone(obj, deep, exist) {
        if (obj == null) return obj;
        if (typeof deep !== "boolean") deep = false;
        let ctor = obj.constructor,
            type = toType(obj),
            isArray = Array.isArray(obj),
            isObject = isPlainObject(obj),
            result;
        // 其他类型值的处理
        if (/^(regexp|date)$/i.test(type)) return new ctor(obj);
        if (/^(error)$/i.test(type)) return new ctor(obj.message);
        if (typeof obj === "function") {
            return function (...params) {
                return obj.call(this, ...params);
            };
        }
        if (!isArray && !isObject) return obj;
        // 避免套娃出现死递归
        if (!Array.isArray(exist)) exist = [];
        if (exist.indexOf(obj) > -1) return obj;
        exist.push(obj);
        // 如果是数组&纯粹对象
        result = new ctor();
        each(obj, (value, key) => {
            if (deep) {
                result[key] = clone(value, deep, exist);
                return;
            }
            result[key] = value;
        });
        return result;
    };
    const merge = function merge() {
        let options,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            exist = arguments[length - 1],
            deep = false;
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[i] || {};
            i++;
        }
        if (target == null || (typeof target !== "object" && !isFunction(target))) target = {};
        // 防止死递归
        Array.isArray(exist) && exist.isExist ? length-- : (exist = [], exist.isExist = true);
        for (; i < length; i++) {
            options = arguments[i];
            if (options == null) continue;
            if (exist.indexOf(options) > -1) return options;
            exist.push(options);
            each(options, (copy, name) => {
                let copyIsArray = Array.isArray(copy),
                    copyIsObject = isPlainObject(copy),
                    src = target[name];
                if (deep && copy && (copyIsArray || copyIsObject)) {
                    if (copyIsArray && !Array.isArray(src)) src = [];
                    if (copyIsObject && !isPlainObject(src)) src = {};
                    target[name] = merge(deep, src, copy, exist);
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            });
        }
        return target;
    };

    /* 暴露API */
    const utils = {
        version: '1.0.0',
        debounce,
        throttle,
        isFunction,
        isWindow,
        toType,
        isPlainObject,
        isEmptyObject,
        isArrayLike,
        each,
        clone,
        merge
    };
    if (typeof module === "object" && typeof module.exports === "object") module.exports = utils;
    if (typeof window !== "undefined") window.utils = utils;
})();
```
