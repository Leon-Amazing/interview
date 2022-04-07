# JavaScript

### 1.简述对闭包的理解，以及其优缺点
**闭包：函数执行产生一个不被释放的私有的上下文，这样不仅保护里面的私有变量不受污染，而且还可以把这些信息存储下来「保护+保存」**
1. 理论知识：  
根据 v8 执行机制，函数执行时产生 `私有上下文EC（Execution Context ）`，进栈执行，声明的变量都保存在 `变量对象AO（Active Object）`中，首先`初始化作用域链`、`形参赋值`、`变量提升`以及`代码执行`，正常情况下代码执行完`出栈释放`，但是由于`浏览器垃圾回收机制`，导致当前上下文中的某个变量被上下文之外的东西占用，不能被释放，这样就形成了`闭包`，所以说私有变量不受外面干扰和污染，另一方面也把这些东西保存下来了，这也是闭包的两大作用吧，保存和保护。
2. 结合实战
闭包在项目中无时无刻不存在，在项目中经常使用，举例（如循环绑定事件。。。）
3. 深入研究
之前研究JS，基于闭包能实现很多的函数技巧，如JS高级编程技巧：单例模式（工具方法库）、惰性思想、柯理化、compose组合函数
4. 插件和源码
JQ源码里也有用到闭包（工厂函数），Lodash源码、Redux源码，类库和组件的封装。。。  

`综述`：  
所以我认为闭包就是JS底层的机制，在开发过程中无时无刻不在使用，但是闭包消耗的内存比较大，所以要合理使用。。。


### 2.for循环和forEach的区别
1. for循环代表的是命令是编程、forEach代表的是函数式编程；
2. forEach其实就是把数组迭代的操作步骤封装好，这样我们应用起来会更加方便；我之前研究过forEach等数组常见方法的源码，forEach内部是依次迭代数组每一项，每一次迭代把传递的回调函数执行，把迭代的内容及索引传递给回调函数....直到整个数组都迭代完毕才结束，不支持中间以任何形式跳过或者结束迭代操作！！而for循环是命令式编程，所有的操作步骤自己可以管控，想啥时候结束就结束，想咋循环就咋循环；
3. 我在项目开发的时候，一般应用的都是forEach，这样可以提高我的开发效率，减少代码的冗余！！但是遇到一些需要灵活迭代的需求，则自己基于for循环操作！！
```js
Array.prototype.forEach = function forEach(callback) {
    for (let i = 0; i < this.length; i++) {
        callback(this[i], i);
    }
}; 
```


### 3.let const 和 var 的区别
`和GO的关系`  
`变量提升`  
`重复声明`  
`块级作用域`  
`暂时性死区`  
1. let不存在变量提升,不允许在定义之前使用
2. let不允许重复声明「不论当前上下文中，基于何种方式声明过这个变量，都不允许基于let再次声明」
3. 在全局上下文中，基于var/function声明的变量，是给window(GO)设置的全局属性；基于let/const声明的变量是放在VO(G)中的，和GO没有任何的关系；
4. let会产生块级上下文
5. let的暂时性死区问题
```js
console.log(typeof a); 
// "undefined" 基于typeof检测一个未被声明的变量，结果不会抱错，而是"undefined"

console.log(typeof a); 
// Uncaught ReferenceError: Cannot access 'a' before initialization
let a = 100;
```
6. 基于const声明的变量，后期不允许更改其指针指向（也就是不能重新赋值为其他的值）;
```js
const a; // Uncaught SyntaxError: Missing initializer in const declaration

const a = 12;
a = 13; // Uncaught TypeError: Assignment to constant variable

const obj = { name: 'abc' };
obj.name = 'edf';
console.log(obj); // {name: 'edf'}
```


### 4.防抖和节流
公用函数
```js
const clearTimer = (timer) => {
    timer ? clearTimeout(timer) : '';
    return null;
};
```
防抖：用户频繁进行某项操作的时候，只识别一次「自定义频繁的规则、自定义触发边界...」
```js
const debounce = (fn, wait = 300, immediate = false) => {
    let timer = null;
    return (...params) => {
        let now = !timer && immediate;
        timer = clearTimer(timer);
        timer = setTimeout(() => {
            timer = clearTimer(timer);
            !immediate ? fn.apply(this, params) : '';
        }, wait)
        if (now) return fn.apply(this, params);
    }
}
```
节流：“降频”，用户频繁进行某项操作的时候，降低默认的触发频率
```js
const throttle = (fn, wait = 300) => {
    let timer = null,
        previous = 0;
    return (...params) => {
        let now = +new Date;
        let remaining = wait - (now - previous);
        if (remaining <= 0) {
            timer = clearTimer(timer);
            previous = +new Date;
            fn.apply(this, params);
        } else {
            if (!timer) {
                timer = clearTimer(timer);
                previous = +new Date;
                timer = setTimeout(() => {
                    fn.apply(this, params);
                }, remaining);
            }
        }
    }
}
```


### 5.Object.prototype.hasPubProperty
1. Object.prototype.hasOwnProperty：用来检测是否为私有属性  
语法：[对象].hasOwnProperty([属性])  
检测[属性]是否为[对象]的私有属性，是返回TRUE，不是则返回FALSE；只看私有中有没有(和公有不存在没关系)

2. in操作符  
语法：[属性] in [对象]  
检测[属性]是否率属于这个[对象]，不论公有还是私有，只要能访问到这个属性，则结果就是TRUE

思路1(不准确)：
```js
Object.prototype.hasPubProperty = function hasPubProperty(attr) {
    // 思路：是对象的属性，而且还不是私有的属性，这样只能是公有属性了
    // 问题：如果attr既是私有的属性，也是公有的属性，基于这种方案检测结果是false
    return (attr in this) && !this.hasOwnProperty(attr); 
}
```

思路2(准确)：
```js
Object.prototype.hasPubProperty = function hasPubProperty(attr) {
    // this->obj要处理的对象  attr->'toString'要检测的属性
    // 思路：跳过私有属性的查找，直接在公有属性中查找，看看是否存在
    // Object.getPrototypeOf([实例对象])：
    // 获取当前实例对象的原型对象(或者获取“实例对象.__proto__”)
    let proto = Object.getPrototypeOf(this);
    while (proto) {
        if (proto.hasOwnProperty(attr)) return true;
        proto = Object.getPrototypeOf(proto);
    }
    return false;
};
let obj = {
    name: 'leon',
    age: 13,
    toString() { }
};
console.log(obj.hasPubProperty('toString')); //true
```


### 6.call、apply和bind
Function.prototype
+ call
+ apply
+ bind  
所有的函数都是Function类的实例，所以所有函数都可以调用这三个方法；而这个三个方法都是用来改变函数中的THIS指向的；

call VS apply
+ 都是把函数立即执行，改变函数中的this指向的「第一个参数是谁，就把this改为谁」
+ 唯一区别：apply要求把传递给函数的实参，以数组的形式管理起来「最终效果和call一样，也是把数组中每一项，一个个的传给函数」
+ 真实项目中建议大家使用call，因为其性能好一些「做过测试：三个及以上参数，call的性能明显比apply好一些」

call VS bind
+ call是把函数立即执行，而bind只是预处理函数中的this和参数，函数此时并没有执行

`call`
```js
Function.prototype.call = function call(context, ...params) {
    if (context == null) context = window;
    if (!/^(object|function)$/.test(typeof context)) context = Object(context);
    let key = Symbol('KEY'),
        result;
    context[key] = this;
    result = context[key](...params);
    Reflect.deleteProperty(context, key);
    return result;
};
const fn = function fn(x, y) {
    console.log(this, x, y);
    return x + y;
};
let obj = {
    name: 'obj'
};
let res = fn.call('leon', 10, 20);
console.log(res);
```

`bind`
```js
Function.prototype.bind = function bind(context, ...params) {
    return (...args) => {
        params = params.concat(args);
        return this.call(context, ...params);
    };
};
```