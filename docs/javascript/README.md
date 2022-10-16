# JavaScript

## 1.简述对闭包的理解，以及其优缺点

闭包：函数执行产生一个不被释放的私有的上下文，这样不仅保护里面的私有变量不受污染，而且还可以把这些信息存储下来「保护+保存」

1. 理论知识：  
   根据 v8 执行机制，函数执行时产生 `私有上下文EC（Execution Context ）`，进栈执行，声明的变量都保存在 `变量对象AO（Active Object）`中，首先`初始化作用域链`、`形参赋值`、`变量提升`以及`代码执行`，正常情况下代码执行完`出栈释放`，但是由于`浏览器垃圾回收机制`，导致当前上下文中的某个变量被上下文之外的东西占用，不能被释放，这样就形成了`闭包`，所以说私有变量不受外面干扰和污染，另一方面也把这些东西保存下来了，这也是闭包的两大作用吧，保存和保护。
2. 结合实战
   闭包在项目中无时无刻不存在，在项目中经常使用，举例（如循环绑定事件。。。）
3. 深入研究
   之前研究 JS，基于闭包能实现很多的函数技巧，如 JS 高级编程技巧：单例模式（工具方法库）、惰性思想、柯理化、compose 组合函数
4. 插件和源码
   JQ 源码里也有用到闭包（工厂函数），Lodash 源码、Redux 源码，类库和组件的封装。。。

`综述`：  
所以我认为闭包就是 JS 底层的机制，在开发过程中无时无刻不在使用，但是闭包消耗的内存比较大，所以要合理使用。。。

## 2.for 循环和 forEach 的区别

1. for 循环代表的是命令是编程、forEach 代表的是函数式编程；
2. forEach 其实就是把数组迭代的操作步骤封装好，这样我们应用起来会更加方便；我之前研究过 forEach 等数组常见方法的源码，forEach 内部是依次迭代数组每一项，每一次迭代把传递的回调函数执行，把迭代的内容及索引传递给回调函数....直到整个数组都迭代完毕才结束，不支持中间以任何形式跳过或者结束迭代操作！！而 for 循环是命令式编程，所有的操作步骤自己可以管控，想啥时候结束就结束，想咋循环就咋循环；
3. 我在项目开发的时候，一般应用的都是 forEach，这样可以提高我的开发效率，减少代码的冗余！！但是遇到一些需要灵活迭代的需求，则自己基于 for 循环操作！！

```js
Array.prototype.forEach = function forEach(callback) {
  for (let i = 0; i < this.length; i++) {
    callback(this[i], i);
  }
};
```

## 3.let const 和 var 的区别

`和GO的关系`  
`变量提升`  
`重复声明`  
`块级作用域`  
`暂时性死区`

1. let 不存在变量提升,不允许在定义之前使用
2. let 不允许重复声明「不论当前上下文中，基于何种方式声明过这个变量，都不允许基于 let 再次声明」
3. 在全局上下文中，基于 var/function 声明的变量，是给 window(GO)设置的全局属性；基于 let/const 声明的变量是放在 VO(G)中的，和 GO 没有任何的关系；
4. let 会产生块级上下文
5. let 的暂时性死区问题

   ```js
   console.log(typeof a);
   // "undefined" 基于typeof检测一个未被声明的变量，结果不会抱错，而是"undefined"

   console.log(typeof a);
   // Uncaught ReferenceError: Cannot access 'a' before initialization
   let a = 100;
   ```

6. 基于 const 声明的变量，后期不允许更改其指针指向（也就是不能重新赋值为其他的值）;

```js
const a; // Uncaught SyntaxError: Missing initializer in const declaration

const a = 12;
a = 13; // Uncaught TypeError: Assignment to constant variable

const obj = { name: 'abc' };
obj.name = 'edf';
console.log(obj); // {name: 'edf'}
```

## 4.防抖和节流

公用函数

```js
const clearTimer = (timer) => {
  timer ? clearTimeout(timer) : "";
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
      !immediate ? fn.apply(this, params) : "";
    }, wait);
    if (now) return fn.apply(this, params);
  };
};
```

节流：“降频”，用户频繁进行某项操作的时候，降低默认的触发频率

```js
const throttle = (fn, wait = 300) => {
  let timer = null,
    previous = 0;
  return (...params) => {
    let now = +new Date();
    let remaining = wait - (now - previous);
    if (remaining <= 0) {
      timer = clearTimer(timer);
      previous = +new Date();
      fn.apply(this, params);
    } else {
      if (!timer) {
        timer = clearTimer(timer);
        previous = +new Date();
        timer = setTimeout(() => {
          fn.apply(this, params);
        }, remaining);
      }
    }
  };
};
```

## 5.Object.prototype.hasPubProperty

1. Object.prototype.hasOwnProperty：用来检测是否为私有属性  
   语法：[对象].hasOwnProperty([属性])  
   检测[属性]是否为[对象]的私有属性，是返回 TRUE，不是则返回 FALSE；只看私有中有没有(和公有不存在没关系)

2. in 操作符  
   语法：[属性] in [对象]  
   检测[属性]是否率属于这个[对象]，不论公有还是私有，只要能访问到这个属性，则结果就是 TRUE

思路 1(不准确)：

```js
Object.prototype.hasPubProperty = function hasPubProperty(attr) {
  // 思路：是对象的属性，而且还不是私有的属性，这样只能是公有属性了
  // 问题：如果attr既是私有的属性，也是公有的属性，基于这种方案检测结果是false
  return attr in this && !this.hasOwnProperty(attr);
};
```

思路 2(准确)：

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
  name: "leon",
  age: 13,
  toString() {},
};
console.log(obj.hasPubProperty("toString")); //true
```

## 6.call、apply 和 bind

Function.prototype

- call
- apply
- bind  
  所有的函数都是 Function 类的实例，所以所有函数都可以调用这三个方法；而这个三个方法都是用来改变函数中的 THIS 指向的；

call VS apply

- 都是把函数立即执行，改变函数中的 this 指向的「第一个参数是谁，就把 this 改为谁」
- 唯一区别：apply 要求把传递给函数的实参，以数组的形式管理起来「最终效果和 call 一样，也是把数组中每一项，一个个的传给函数」
- 真实项目中建议大家使用 call，因为其性能好一些「做过测试：三个及以上参数，call 的性能明显比 apply 好一些」

call VS bind

- call 是把函数立即执行，而 bind 只是预处理函数中的 this 和参数，函数此时并没有执行

`call`

```js
Function.prototype.call = function call(context, ...params) {
  if (context == null) context = window;
  if (!/^(object|function)$/.test(typeof context)) context = Object(context);
  let key = Symbol("KEY"),
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
  name: "obj",
};
let res = fn.call("leon", 10, 20);
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

## 7.跨域解决方案

- 修改本地 HOST
- JSONP
- CORS
- Proxy
- ……

### JSONP

![图片](./img/1.png)

服务端代码

```js
/*-CREATE SERVER-*/
const express = require("express"),
  app = express();
app.listen(1001, () => {
  console.log(
    `THE WEB SERVICE IS CREATED SUCCESSFULLY AND IS LISTENING TO THE PORT：1001`
  );
});

app.get("/user/list", (req, res) => {
  let { callback } = req.query;
  // callback存储的就是客户端传递的全局函数名
  let result = {
    code: 0,
    data: ["张三", "李四"],
  };
  // 返回给客户端指定的格式
  res.send(`${callback}(${JSON.stringify(result)})`);
});

/* STATIC WEB */
app.use(express.static("./"));
```

客户端处理

```js
(function () {
  // 检测是否为纯粹对象
  const isPlainObject = function isPlainObject(obj) {
    let proto, Ctor;
    if (!obj || Object.prototype.toString.call(obj) !== "[object Object]")
      return false;
    proto = Object.getPrototypeOf(obj);
    if (!proto) return true;
    Ctor = proto.hasOwnProperty("constructor") && proto.constructor;
    return typeof Ctor === "function" && Ctor === Object;
  };

  // 把普通对象变为URLENCODED格式字符串
  const stringify = function stringify(obj) {
    let str = ``,
      keys = Object.keys(obj).concat(Object.getOwnPropertySymbols(obj));
    keys.forEach((key) => {
      str += `&${key}=${obj[key]}`;
    });
    return str.substring(1);
  };

  /* 封装JSONP函数 */
  const jsonp = function jsonp(url, config) {
    return new Promise((resolve, reject) => {
      // 初始化参数
      if (typeof url !== "string") throw new TypeError("url is not a string!");
      if (!isPlainObject(config)) config = {};
      config = Object.assign(
        {
          params: null,
          jsonp: "callback",
        },
        config
      );

      // 创建一个全局函数
      let f_name = `jsonp${+new Date()}`;
      window[f_name] = (value) => {
        // 请求成功
        resolve(value);
        delete window[f_name];
        document.body.removeChild(script);
      };

      // 处理URL「拼接问号参数 & 拼接函数名」
      let params = config.params;
      if (params) {
        if (isPlainObject(params)) params = stringify(params);
        url += `${url.includes("?") ? "&" : "?"}${params}`;
      }
      url += `${url.includes("?") ? "&" : "?"}${config.jsonp}=${f_name}`;

      // 发送请求
      let script = document.createElement("script");
      script.src = url;
      script.onerror = (err) => {
        // 请求失败
        reject(err);
      };
      document.body.appendChild(script);
    });
  };

  /* 暴露API */
  if (typeof module === "object" && typeof module.exports === "object")
    module.exports = jsonp;
  if (typeof window !== "undefined") window.jsonp = jsonp;
})();
```

JSONP 测试代码

```js
<script>
    (function () {
        window['fn'] = function fn(result) {
            console.log(result);
        };
    })();
</script>
<script src="https://www.baidu.com/sugrec?prod=pc&wd=标题&cb=fn"></script>

<script src="jsonp.js"></script>
    <script>
    jsonp('https://www.baidu.com/sugrec', {
        params: {
            prod: 'pc',
            wd: '哈哈哈'
        },
        jsonp: 'cb'
    }).then(value => {
        console.log(value);
    });

    jsonp('http://127.0.0.1:1001/user/list').then(value => {
        console.log(value);
    });
</script>
```

### CORS

服务器端代码

```js
/*-CREATE SERVER-*/
const express = require("express"),
  app = express();
app.listen(1001, () => {
  console.log(
    `THE WEB SERVICE IS CREATED SUCCESSFULLY AND IS LISTENING TO THE PORT：1001`
  );
});

/*-MIDDLE WARE-*/
// 设置白名单
let safeList = [
  "http://127.0.0.1:5500",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:8080",
];
app.use((req, res, next) => {
  let origin = req.headers.origin || req.headers.referer || "";
  origin = origin.replace(/\/$/g, "");
  origin = !safeList.includes(origin) ? "" : origin;
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length,Authorization, Accept,X-Requested-With"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "PUT,POST,GET,DELETE,OPTIONS,HEAD"
  );
  req.method === "OPTIONS" ? res.send("OK") : next();
});

/*-API-*/
app.get("/list", (req, res) => {
  res.send({
    code: 0,
    message: "zhufeng",
  });
});

/* STATIC WEB */
app.use(express.static("./"));
```

客户端

```js
axios
  .get("http://127.0.0.1:1001/list", {
    withCredentials: true,
  })
  .then((response) => {
    console.log(response);
  });
```

### Proxy

服务端

```js
/*-CREATE SERVER-*/
const express = require("express"),
  app = express();
app.listen(1001, () => {
  console.log(
    `THE WEB SERVICE IS CREATED SUCCESSFULLY AND IS LISTENING TO THE PORT：1001`
  );
});

// 代理
const request = require("request");
app.get("/asimov/subscriptions/recommended_collections", (req, res) => {
  let jianURL = `https://www.jianshu.com${req.url}`;
  req.pipe(request(jianURL)).pipe(res);
});

/* STATIC WEB */
app.use(express.static("./"));
```

客户端

```js
axios.get("/asimov/subscriptions/recommended_collections").then((response) => {
  console.log(response.data);
});
```

## 8.实现并发管控

方法一：基于创造多个工作区，实现并发管控

```js
// 模拟数据请求
const delay = function delay(interval) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(interval);
    }, interval);
  });
};

// 任务列表:数组、数组中每一项是个函数，函数执行就是发送一个请求(返回promise实例)
let tasks = [
  () => {
    return delay(1000);
  },
  () => {
    return delay(1001);
  },
  () => {
    return delay(1002);
  },
  () => {
    return delay(1003);
  },
  () => {
    return delay(1004);
  },
  () => {
    return delay(1005);
  },
  () => {
    return delay(1006);
  },
];

/**
 * createRequest:实现并发管控
 * @param {Array} tasks 需要并发的任务列表(每项都是函数,函数执行发送请求,返回promise实例)
 * @param {Number} limit 需要限制并发的数量(默认值：2)
 * @returns {Promise} 返回一个promise实例,当所有任务都成功后,实例为fulfilled,值是每一个请求成功的结果
 */
const createRequest = function createRequest(tasks, limit) {
  //init params
  if (!Array.isArray(tasks)) throw new TypeError("tasks is not an array");
  if (isNaN(+limit)) limit = 2;
  limit = limit < 1 ? 1 : limit > tasks.length ? tasks.length : limit;

  //限制几个并发，就需要创造几个工作区
  let works = new Array(limit).fill(null),
    values = [],
    index = 0;
  works = works.map(() => {
    return new Promise((resolve) => {
      //去任务列表中获取一个任务，拿到工作区执行；当此任务执行完，继续去任务列表处拿任务...
      const next = async () => {
        let prevIndex = index,
          task = tasks[index++],
          value;
        if (typeof task === "undefined") {
          //任务列表中已经没有任务了,当前工作区已经处理完成
          resolve();
          return;
        }
        try {
          value = await task();
          values[prevIndex] = value;
        } catch (_) {
          values[prevIndex] = null;
        }
        next();
      };
      next();
    });
  });

  //所有工作区的promise都是成功态,则证明请求都发送完成了
  return Promise.all(works).then(() => values);
};

createRequest(tasks).then((values) => {
  console.log("请求都完成：", values);
  // 请求都完成： (7) [1000, 1001, 1002, 1003, 1004, 1005, 1006]
});
```

方法二：利用队列和 runing 记录正在运行的任务等方式，控制并发执行

```js
// 模拟数据请求
const delay = function delay(interval) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // if (interval === 1003) reject('xxx');
      resolve(interval);
    }, interval);
  });
};

// 任务列表:数组、数组中每一项是个函数，函数执行就是发送一个请求(返回promise实例)
let tasks = [
  () => {
    return delay(1000);
  },
  () => {
    return delay(1001);
  },
  () => {
    return delay(1002);
  },
  () => {
    return delay(1003);
  },
  () => {
    return delay(1004);
  },
  () => {
    return delay(1005);
  },
  () => {
    return delay(1006);
  },
];

class TaskQueue {
  constructor(tasks, limit, onComplete) {
    // 把信息挂载到实例上，方便在其它的方法中基于实例获取
    let self = this;
    self.tasks = tasks;
    self.limit = limit;
    self.onComplete = onComplete;
    self.queue = []; //存放任务的队列
    self.runing = 0; //记录正在运行的任务数量
    self.index = 0; //记录取出任务的索引
    self.values = []; //记录每个任务完成的结果
  }
  pushStack(task) {
    // 把任务存储到队列中
    let self = this;
    self.queue.push(task);
    self.next();
  }
  async next() {
    // 核心方法:根据runing控制哪些任务执行
    let self = this,
      { tasks, limit, onComplete, queue, runing, values, index } = self;
    // 如果运行的任务数小于并发限制，而且能够取出对应的任务:取出对应任务并且去发送
    if (runing < limit && index <= tasks.length - 1) {
      self.runing++;
      let prevIndex = index,
        task = queue[self.index++],
        value;
      try {
        value = await task();
        values[prevIndex] = value;
      } catch (err) {
        values[prevIndex] = null;
      }
      self.runing--;
      self.runing === 0 ? onComplete(values) : self.next();
    }
  }
}
const createRequest = function createRequest(tasks, limit, onComplete) {
  if (!Array.isArray(tasks)) throw new TypeError("tasks must be an array");
  if (typeof limit === "function") onComplete = limit;
  limit = +limit;
  if (isNaN(limit)) limit = 2;
  if (typeof onComplete !== "function") onComplete = Function.prototype;
  // 把任务列表中的任务，依次存放到任务队列中
  let TQ = new TaskQueue(tasks, limit, onComplete);
  tasks.forEach((task) => {
    TQ.pushStack(task);
  });
};

createRequest(tasks, (values) => {
  console.log(`所有请求都成功`, values);
});
```
