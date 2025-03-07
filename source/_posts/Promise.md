---
title: 深入理解Promise
date: 2024-12-13
categories:
  - 教程
tags:
  - Promise
  - 入门
cover: /img/promise.png
---
# 深入理解 JavaScript Promise：从入门到精通
## 前言
Promise 是 JavaScript 中处理异步操作的核心机制，它的出现让我们告别了回调地狱，使异步代码更加清晰和易于维护。本文将深入探讨 Promise 的方方面面，从基础概念到高级应用，帮助你全面掌握这一重要特性。

## 目录
- [1. Promise 基础](#1-promise-基础)
- [2. Promise 状态](#2-promise-状态)
- [3. Promise 方法](#3-promise-方法)
- [4. 错误处理](#4-错误处理)
- [5. Promise 链式调用](#5-promise-链式调用)
- [6. Promise 静态方法](#6-promise-静态方法)
- [7. async/await](#7-asyncawait)
- [8. 实际应用场景](#8-实际应用场景)
- [9. 最佳实践](#9-最佳实践)
- [10. 常见问题和陷阱](#10-常见问题和陷阱)
- [11. 更多实际应用场景](#11-更多实际应用场景)
- [12. 详细错误处理指南](#12-详细错误处理指南)
- [13. 性能优化最佳实践](#13-性能优化最佳实践)
- [14. 补充最佳实践建议](#14-补充最佳实践建议)

## 1. Promise 基础

### 1.1 什么是 Promise？
Promise 是异步编程的一种解决方案，比传统的回调函数更加优雅。它是一个代表了异步操作最终完成或失败的对象。通过 Promise，我们可以用同步操作的流程写法来处理异步操作，避免了回调函数层层嵌套的问题。

### 1.2 基本语法
Promise 的基本语法非常简单，让我们通过一个例子来了解：

```javascript
const promise = new Promise((resolve, reject) => {
    // 异步操作
    if (/* 操作成功 */) {
        resolve(value);  // 成功时调用
    } else {
        reject(error);   // 失败时调用
    }
});
```

这个构造函数接收一个执行器（executor）函数作为参数，该函数会立即执行。执行器函数接收两个参数：resolve 和 reject，它们是由 JavaScript 引擎提供的函数。

### 1.3 基本用法
Promise 对象创建后，我们可以通过它的方法来处理异步操作的结果：

```javascript
promise
    .then(result => {
        // 处理成功情况
        console.log('成功：', result);
    })
    .catch(error => {
        // 处理错误情况
        console.log('错误：', error);
    })
    .finally(() => {
        // 总是执行
        console.log('操作完成');
    });
```

这种链式调用的方式使得异步操作的流程更加清晰，代码更易于理解和维护。

## 2. Promise 状态

Promise 的状态是它的核心特性之一，理解 Promise 的状态对于正确使用它至关重要。

### 2.1 三种状态
Promise 有且仅有三种状态：
- **pending（进行中）**：初始状态，既不是成功，也不是失败
- **fulfilled（已成功）**：操作成功完成
- **rejected（已失败）**：操作失败

### 2.2 状态转换
Promise 的状态转换是单向的，一旦状态改变，就不会再变。这种特性称为"状态的不可逆性"。

```javascript
// 状态转换示例
const successPromise = new Promise(resolve => {
    setTimeout(() => {
        resolve('成功');  // pending -> fulfilled
    }, 1000);
});

const failedPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject('失败');   // pending -> rejected
    }, 1000);
});
```

### 2.3 状态的不可逆性
一旦 Promise 的状态改变，后续的状态修改操作将被忽略：

```javascript
const promise = new Promise((resolve, reject) => {
    resolve('成功');    // 状态变为 fulfilled
    reject('失败');     // 这行代码会被忽略
    resolve('再次成功'); // 这行代码也会被忽略
});
```

## 3. Promise 方法

Promise 提供了几个关键的实例方法，让我们能够优雅地处理异步操作的结果。

### 3.1 then() 方法
`then()` 是最常用的 Promise 方法，它可以接收两个回调函数：

```javascript
promise.then(
    result => {
        // 处理成功的情况
        console.log('成功：', result);
    },
    error => {
        // 处理失败的情况（可选）
        console.log('失败：', error);
    }
);
```

### 3.2 catch() 方法
`catch()` 方法用于处理 Promise 中的错误，它是 `.then(null, rejection)` 的语法糖：

```javascript
promise.catch(error => {
    // 处理错误
    console.error('发生错误：', error);
});
```

### 3.3 finally() 方法
`finally()` 方法用于指定无论 Promise 对象最后状态如何，都会执行的操作：

```javascript
promise.finally(() => {
    // 清理工作
    console.log('Promise 已完成');
});
```

## 4. 错误处理

### 4.1 错误捕获方式
```javascript
// 方式 1：使用 catch
promise
    .then(result => {})
    .catch(error => {});

// 方式 2：使用 then 的第二个参数
promise.then(
    result => {},
    error => {}
);
```

### 4.2 错误处理逻辑
```javascript
promise
    .then(result => {
        throw new Error('error');
    })
    .catch(error => {
        // 1. 返回普通值 - 恢复到 fulfilled 状态
        return 'recovered';
        
        // 2. 抛出错误 - 继续 rejected 状态
        throw error;
        
        // 3. 返回 rejected promise - 继续 rejected 状态
        return Promise.reject(error);
    });
```

## 5. Promise 链式调用

### 5.1 基本链式调用
```javascript
promise
    .then(step1)
    .then(step2)
    .then(step3)
    .catch(handleError);
```

### 5.2 值的传递
```javascript
Promise.resolve(1)
    .then(x => x + 1)     // 2
    .then(x => x * 2)     // 4
    .then(console.log);   // 输出: 4
```

### 5.3 Promise 链中的错误处理
```javascript
fetchUser()
    .then(user => {
        if (!user.id) throw new Error('Invalid user');
        return fetchProfile(user.id);
    })
    .then(profile => {
        return updateProfile(profile);
    })
    .catch(error => {
        // 处理任何步骤中的错误
    });
```

## 6. Promise 静态方法

### 6.1 Promise.resolve()
```javascript
// 创建一个立即 resolve 的 Promise
const resolved = Promise.resolve(value);
```

### 6.2 Promise.reject()
```javascript
// 创建一个立即 reject 的 Promise
const rejected = Promise.reject(error);
```

### 6.3 Promise.all()
```javascript
// 等待所有 Promise 完成
Promise.all([promise1, promise2, promise3])
    .then(results => {
        // results 是一个数组，包含所有 Promise 的结果
    });
```

### 6.4 Promise.race()
```javascript
// 返回最先完成的 Promise 结果
Promise.race([promise1, promise2])
    .then(firstResult => {
        // firstResult 是最先完成的 Promise 的结果
    });
```

### 6.5 Promise.allSettled()
```javascript
// 等待所有 Promise 完成（无论成功或失败）
Promise.allSettled([promise1, promise2])
    .then(results => {
        // results 包含所有 Promise 的状态和结果
    });
```

## 7. async/await

### 7.1 基本用法
```javascript
async function fetchData() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}
```

### 7.2 与 Promise 的关系
```javascript
// Promise 方式
function fetchData() {
    return fetch(url)
        .then(response => response.json())
        .catch(error => console.error(error));
}

// async/await 方式
async function fetchData() {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}
```

## 8. 实际应用场景

### 8.1 API 请求
```javascript
function fetchUserData(userId) {
    return fetch(`/api/users/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching user:', error);
            return null;
        });
}
```

### 8.2 并行请求
```javascript
async function fetchAllData() {
    try {
        const [users, posts, comments] = await Promise.all([
            fetchUsers(),
            fetchPosts(),
            fetchComments()
        ]);
        return { users, posts, comments };
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
```

### 8.3 串行请求
```javascript
async function fetchUserAndPosts(userId) {
    try {
        const user = await fetchUser(userId);
        const posts = await fetchUserPosts(user.id);
        return { user, posts };
    } catch (error) {
        console.error('Error:', error);
    }
}
```

## 9. 最佳实践

### 9.1 错误处理
```javascript
async function handleAsyncOperation() {
    try {
        const result = await asyncOperation();
        return result;
    } catch (error) {
        // 记录错误
        logError(error);
        // 返回默认值或重新抛出
        throw error;
    } finally {
        // 清理工作
        cleanup();
    }
}
```

### 9.2 Promise 超时处理
```javascript
function timeoutPromise(promise, timeout) {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), timeout)
        )
    ]);
}
```

### 9.3 取消操作
```javascript
function createCancellablePromise(promise) {
    let isCancelled = false;

    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then(
            value => isCancelled ? reject('Cancelled') : resolve(value),
            error => isCancelled ? reject('Cancelled') : reject(error)
        );
    });

    return {
        promise: wrappedPromise,
        cancel: () => { isCancelled = true; }
    };
}
```

## 10. 常见问题和陷阱

### 10.1 Promise 执行顺序
```javascript
// ❌ 错误理解：认为 Promise 中的所有操作都是异步的
console.log('1');
Promise.resolve().then(() => console.log('2'));
setTimeout(() => console.log('3'), 0);
console.log('4');
// 输出: 1, 4, 2, 3

// ⚠️ 特别注意：Promise 中的同步和异步操作
console.log('开始');
new Promise((resolve, reject) => {
    console.log('同步代码1'); // Promise 构造函数中的代码是同步执行的
    resolve('同步代码2');     // resolve/reject 是同步执行的
    console.log('同步代码3'); // 这行也会同步执行
}).then(msg => {
    console.log('异步微任务1'); // then 回调是异步微任务
}).then(() => {
    console.log('异步微任务2'); // 链式调用的 then 也是异步微任务
});
console.log('结束');

// 输出顺序：
// 开始
// 同步代码1
// 同步代码2
// 同步代码3
// 结束
// 异步微任务1
// 异步微任务2

// 更复杂的执行顺序示例
console.log('script start');

setTimeout(() => {
    console.log('setTimeout'); // 宏任务
}, 0);

Promise.resolve('Promise 1')
    .then(msg => {
        console.log(msg); // 微任务
        return 'Promise 2';
    })
    .then(msg => {
        console.log(msg); // 微任务
    });

Promise.resolve('Promise 3')
    .then(msg => {
        console.log(msg); // 微任务
    });

console.log('script end');

// 输出顺序：
// script start
// script end
// Promise 1
// Promise 3
// Promise 2
// setTimeout
```

### 10.1.1 Promise 中的同步和异步操作

1. **同步执行的部分**：
   - Promise 构造函数中的代码
   - resolve() 或 reject() 的调用
   - 直接在 Promise 中的代码

2. **异步微任务**：
   - .then() 的回调
   - .catch() 的回调
   - .finally() 的回调

3. **执行顺序规则**：
   ```javascript
   // 示例：混合同步和异步操作
   console.log('1 - 同步');
   
   new Promise((resolve) => {
       console.log('2 - 同步');
       resolve('3 - 同步');
       console.log('4 - 同步');
   })
   .then(msg => {
       console.log('5 - 异步微任务');
       return new Promise(resolve => {
           console.log('6 - 同步');
           resolve('7 - 同步');
       });
   })
   .then(msg => {
       console.log('8 - 异步微任务');
   });

   setTimeout(() => {
       console.log('9 - 异步宏任务');
   }, 0);

   console.log('10 - 同步');

   // 输出顺序：
   // 1 - 同步
   // 2 - 同步
   // 4 - 同步
   // 10 - 同步
   // 5 - 异步微任务
   // 6 - 同步
   // 8 - 异步微任务
   // 9 - 异步宏任务
   ```

4. **注意事项**：
   - Promise 构造函数是同步执行的
   - resolve/reject 的调用是同步的，但其触发的 then/catch 是异步的
   - 微任务优先于宏任务执行
   - 同一轮事件循环中的微任务会在下一个宏任务之前执行完

5. **实际应用示例**：
   ```javascript
   async function example() {
       console.log('1 - 同步');
       
       const p = new Promise(resolve => {
           console.log('2 - 同步');
           resolve('3 - 同步');
       });

       console.log('4 - 同步');
       
       await p; // await 后面的代码会被转换成 then 的回调（微任务）
       
       console.log('5 - 异步');
   }

   example();
   console.log('6 - 同步');

   // 输出顺序：
   // 1 - 同步
   // 2 - 同步
   // 4 - 同步
   // 6 - 同步
   // 5 - 异步
   ```

### 10.2 Promise 错误处理
```javascript
// 错误示例
promise.then(success).catch(error).then(next);

// 正确示例
promise
    .then(success)
    .then(next)
    .catch(error);
```

### 10.3 内存泄漏
```javascript
// 避免这样
const promise = new Promise(() => {
    // 永远不会 resolve 或 reject
});

// 建议这样
const promise = new Promise((resolve, reject) => {
    // 添加超时处理
    setTimeout(() => reject(new Error('Timeout')), 5000);
});
```

### 10.4 Promise 嵌套
```javascript
// 避免嵌套
fetchUser().then(user => {
    fetchPosts(user.id).then(posts => {
        fetchComments(posts[0].id).then(comments => {
            // 处理数据
        });
    });
});

// 使用链式调用
fetchUser()
    .then(user => fetchPosts(user.id))
    .then(posts => fetchComments(posts[0].id))
    .then(comments => {
        // 处理数据
    });
```

### 10.5 常见易错点和特别提示

#### 1. Promise 构造函数中的代码立即执行
```javascript
// ❌ 错误理解：认为 Promise 中的代码是异步执行
console.log('开始');
new Promise((resolve, reject) => {
    console.log('Promise 内部');
    resolve('完成');
});
console.log('结束');
// 实际输出：
// 开始
// Promise 内部
// 结束
```

#### 2. resolve/reject 后的代码仍会执行
```javascript
// ❌ 错误示例
new Promise((resolve, reject) => {
    resolve('完成');
    console.log('这里仍会执行'); // 这行代码会执行
    return; // 显式返回也无法阻止后续代码执行
});

// ✅ 正确做法
new Promise((resolve, reject) => {
    if (condition) {
        return resolve('完成'); // 使用 return 来确保后续代码不执行
    }
    // 其他代码
});
```

#### 3. then/catch 返回值的问题
```javascript
// 3.1 错误恢复模式
// ❌ 错误理解：认为错误一旦发生，后续的 then 都不会执行
new Promise((resolve, reject) => {
    reject("initial error");
})
.then(
    result => {
        console.log("不会执行");
    },
    error => {
        console.log("捕获错误:", error);
        return "recovered";  // 返回普通值，Promise 变为 fulfilled 状态
    }
)
.then(result => {
    console.log("会执行，值为:", result); // 会执行，因为上一个 then 返回了正常值
})
.catch(error => {
    console.log("不会执行，因为错误已经被处理"); // 不会执行
});

// 3.2 错误传播模式
// ❌ 错误理解：认为使用了 catch 就一定能捕获所有错误
new Promise((resolve, reject) => {
    reject("error1");
})
.then(
    result => console.log("不会执行"),
    error => {
        console.log("捕获 error1");
        throw "error2";  // 抛出新错误，Promise 变为 rejected 状态
    }
)
.then(
    result => console.log("不会执行"),
    error => {
        console.log("捕获 error2");
        return Promise.reject("error3");  // 返回 rejected promise
    }
)
.then(
    result => console.log("不会执行"),
    error => {
        console.log("捕获 error3");
        // 没有返回值，默认返回 undefined，Promise 变为 fulfilled 状态
    }
)
.then(
    result => console.log("会执行"),
    error => console.log("不会执行")
);

// 3.3 Promise 状态转换规则
// ✅ 正确理解：Promise 状态转换取决于返回值
new Promise((resolve, reject) => {
    reject("error");
})
.then(
    null,
    error => {
        // 情况1：返回普通值（包括 undefined）
        return "normal";  // Promise 变为 fulfilled 状态

        // 情况2：抛出错误
        throw new Error();  // Promise 变为 rejected 状态

        // 情况3：返回 resolved 的 Promise
        return Promise.resolve("ok");  // Promise 变为 fulfilled 状态

        // 情况4：返回 rejected 的 Promise
        return Promise.reject("fail");  // Promise 变为 rejected 状态

        // 情况5：不返回任何值
        // 默认返回 undefined，Promise 变为 fulfilled 状态
    }
);

// 3.4 错误处理最佳实践
// ✅ 推荐做法：根据错误类型决定是恢复还是继续传播
async function handleError() {
    try {
        await riskyOperation();
    } catch (error) {
        if (error.isRecoverable) {
            // 可恢复错误，返回默认值
            return defaultValue;
        } else {
            // 不可恢复错误，继续传播
            throw error;
        }
    }
}

// 3.5 注意事项总结：
// 1. then 的第二个参数（错误处理函数）只处理当前 Promise 的错误
// 2. 错误处理函数的返回值决定了下一个 Promise 的状态
// 3. 返回普通值会将 Promise 转为 fulfilled 状态
// 4. 抛出错误或返回 rejected Promise 会将 Promise 转为 rejected 状态
// 5. 不返回值默认返回 undefined，Promise 变为 fulfilled 状态
```

#### 4. Promise.all 的错误处理
```javascript
// ❌ 错误用法：未考虑部分 Promise 失败的情况
Promise.all([promise1, promise2, promise3])
    .then(results => {
        // 如果任何一个 Promise 失败，这里都不会执行
    });

// ✅ 正确做法：为每个 Promise 添加错误处理
Promise.all([
    promise1.catch(err => ({ error: err })),
    promise2.catch(err => ({ error: err })),
    promise3.catch(err => ({ error: err }))
])
.then(results => {
    // 即使部分 Promise 失败，这里也会执行
    results.forEach(result => {
        if (result.error) {
            // 处理错误情况
        }
    });
});
```

#### 5. async/await 常见错误
```javascript
// ❌ 错误：在普通函数中使用 await
function getData() {
    const data = await fetchData(); // 语法错误
}

// ❌ 错误：忘记错误处理
async function getData() {
    const data = await fetchData(); // 如果出错，将导致未捕获的异常
}

// ✅ 正确做法
async function getData() {
    try {
        const data = await fetchData();
        return data;
    } catch (error) {
        console.error('Error:', error);
        // 处理错误
    }
}
```

#### 6. 特别提示

1. **Promise 状态变化**
   - Promise 状态一旦改变就不可逆
   - 只有 pending 状态可以变为 fulfilled 或 rejected
   - 状态变化后的值不可变

2. **链式调用注意事项**
   - 每个 then/catch 都返回新的 Promise
   - 返回值会被自动包装成 Promise
   - 没有显式返回值时，默认返回 undefined

3. **错误处理最佳实践**
   - 总是在 Promise 链的末尾添加 catch
   - 在适当的位置使用 finally 进行清理
   - 避免在 Promise 链中静默失败

4. **async/await 使用建议**
   - 总是使用 try/catch 包裹 await
   - 注意 await 的位置，避免不必要的等待
   - 并行操作使用 Promise.all

5. **性能考虑**
   - 避免创建不必要的 Promise
   - 注意内存泄漏（未处理的 Promise）
   - 合理使用 Promise.all 进行并行处理

### 10.6 高级注意事项和陷阱

#### 1. Promise.resolve/reject 的特殊行为
```javascript
// ❌ 错误理解：认为 Promise.resolve 总是同步执行
Promise.resolve(Promise.resolve(1))  // Promise 嵌套的情况
    .then(value => console.log(value));  // 1

// ⚠️ 特别注意：传入 thenable 对象
Promise.resolve({
    then: function(resolve) {
        resolve(42);
    }
}).then(value => console.log(value));  // 42

// 注意：Promise.resolve 会展平 Promise
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(p1); // p2 和 p1 是同一个 Promise
console.log(p1 === p2); // true
```

#### 2. Promise 的并发控制
```javascript
// ❌ 错误做法：无控制地并发请求
urls.map(url => fetch(url));  // 可能导致服务器压力过大

// ✅ 正确做法：控制并发数量
async function fetchWithConcurrency(urls, concurrency = 3) {
    const results = [];
    const executing = new Set();
    
    for (const url of urls) {
        const promise = fetch(url).then(r => r.json());
        results.push(promise);
        
        executing.add(promise);
        const clean = () => executing.delete(promise);
        promise.then(clean, clean);
        
        if (executing.size >= concurrency) {
            await Promise.race(executing);
        }
    }
    
    return Promise.all(results);
}

// 使用示例
const urls = ['url1', 'url2', 'url3', 'url4', 'url5'];
fetchWithConcurrency(urls, 2)
    .then(results => console.log('所有请求完成'));
```

#### 3. 循环中的 Promise 处理
```javascript
// ❌ 错误做法：在循环中使用 await
async function wrong() {
    const urls = ['url1', 'url2', 'url3'];
    for (const url of urls) {
        await fetch(url);  // 串行执行，效率低
    }
}

// ✅ 正确做法：并行执行
async function right() {
    const urls = ['url1', 'url2', 'url3'];
    const promises = urls.map(url => fetch(url));
    const results = await Promise.all(promises);
}

// ✅ 需要按顺序执行时的正确做法
async function sequential() {
    const urls = ['url1', 'url2', 'url3'];
    const results = [];
    for (const url of urls) {
        const result = await fetch(url);
        results.push(await result.json());
    }
    return results;
}
```

#### 4. Promise 竞态问题处理
```javascript
// ❌ 潜在问题：多个请求的响应顺序不确定
let currentData;
async function fetchData(id) {
    const response = await fetch(`/api/${id}`);
    currentData = await response.json();  // 可能被后发先至的请求覆盖
}

// ✅ 正确做法：使用标记或取消机制
function createFetchWithAbort() {
    let currentController = null;
    
    return async function fetchData(id) {
        if (currentController) {
            currentController.abort();  // 取消之前的请求
        }
        
        currentController = new AbortController();
        try {
            const response = await fetch(`/api/${id}`, {
                signal: currentController.signal
            });
            return await response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                // 请求被取消，忽略错误
                return null;
            }
            throw error;
        }
    };
}

// 使用示例
const fetchWithAbort = createFetchWithAbort();
fetchWithAbort('id1');
fetchWithAbort('id2'); // id1 的请求会被取消
```

#### 5. async/await 与 Promise 混用的陷阱
```javascript
// ❌ 错误做法：混合使用可能导致错误处理混乱
async function mixed() {
    try {
        const result = await somePromise()
            .then(data => process(data))  // 这里的错误不会被 catch 捕获
            .catch(err => handle(err));
    } catch (error) {
        // 这里捕获不到 .then 中的错误
    }
}

// ✅ 正确做法：统一使用 async/await
async function consistent() {
    try {
        const data = await somePromise();
        return await process(data);
    } catch (error) {
        return handle(error);
    }
}

// ✅ 如果必须混用，确保错误处理的完整性
async function mixedButSafe() {
    try {
        return await somePromise()
            .then(async data => {
                try {
                    return await process(data);
                } catch (error) {
                    throw error; // 确保错误能被外层 catch 捕获
                }
            });
    } catch (error) {
        return handle(error);
    }
}
```

#### 6. Promise 内存泄漏的其他情况
```javascript
// ❌ 潜在问题：事件监听器中的 Promise
class DataLoader {
    constructor() {
        this.listener = this.handleData.bind(this);
        eventEmitter.on('data', this.listener);
    }
    
    async handleData(data) {
        await this.processData(data);  // 如果组件被销毁，这个 Promise 可能永远挂着
    }
}

// ✅ 正确做法：确保清理
class DataLoader {
    constructor() {
        this.abortController = new AbortController();
        this.listener = this.handleData.bind(this);
        eventEmitter.on('data', this.listener);
    }
    
    async handleData(data) {
        if (this.abortController.signal.aborted) return;
        await this.processData(data);
    }
    
    destroy() {
        this.abortController.abort();
        eventEmitter.off('data', this.listener);
    }
}

// 在 React 组件中的使用示例
useEffect(() => {
    const loader = new DataLoader();
    return () => loader.destroy(); // 清理函数
}, []);
```

#### 7. 特殊场景的注意事项

1. **Promise 链中的值传递**：
```javascript
// ❌ 错误做法：没有正确传递值
promise
    .then(value => {
        process(value);
        // 没有返回值，下一个 then 将收到 undefined
    })
    .then(value => {
        // value 是 undefined
    });

// ✅ 正确做法：确保正确传递值
promise
    .then(value => {
        process(value);
        return value; // 显式返回需要传递的值
    })
    .then(value => {
        // value 是上一步返回的值
    });
```

2. **Promise 的错误恢复链**：
```javascript
// ✅ 高级错误恢复模式
fetchData()
    .catch(error => {
        if (error.type === 'network') {
            return fetchFromCache(); // 尝试从缓存获取
        }
        throw error; // 其他错误继续传播
    })
    .catch(error => {
        if (error.type === 'cache') {
            return fetchFromBackup(); // 尝试从备份获取
        }
        throw error;
    })
    .catch(error => {
        return defaultValue; // 最后的降级处理
    });
```

3. **条件 Promise 执行**：
```javascript
// ✅ 根据条件决定是否执行 Promise
async function conditionalFetch(condition) {
    if (!condition) {
        return null;
    }
    
    try {
        const response = await fetch('/api/data');
        return await response.json();
    } catch (error) {
        console.error('Fetch failed:', error);
        return null;
    }
}
```

## 参考资料
- [MDN Promise 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [JavaScript Promise 规范](https://promisesaplus.com/)
- [ECMAScript Promise 规范](https://tc39.es/ecma262/#sec-promise-objects)

## 11. 更多实际应用场景

### 11.1 文件上传与进度监控
```javascript
function uploadFileWithProgress(file, onProgress) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('file', file);

        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                const progress = (event.loaded / event.total) * 100;
                onProgress(progress);
            }
        });

        xhr.addEventListener('load', () => resolve(xhr.response));
        xhr.addEventListener('error', () => reject(new Error('Upload failed')));
        xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));

        xhr.open('POST', '/api/upload');
        xhr.send(formData);
    });
}

// 使用示例
const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', async (e) => {
    try {
        const file = e.target.files[0];
        await uploadFileWithProgress(file, (progress) => {
            console.log(`Upload progress: ${progress}%`);
        });
        console.log('Upload complete');
    } catch (error) {
        console.error('Upload error:', error);
    }
});
```

### 11.2 带重试机制的API请求
```javascript
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await delay(Math.pow(2, i) * 1000); // 指数退避
            console.log(`Retrying... (${i + 1}/${maxRetries})`);
        }
    }
}

// 使用示例
fetchWithRetry('/api/data')
    .then(data => console.log('Success:', data))
    .catch(error => console.error('Final error:', error));
```

### 11.3 资源预加载
```javascript
class ResourcePreloader {
    constructor() {
        this.cache = new Map();
    }

    preload(url) {
        if (this.cache.has(url)) {
            return Promise.resolve(this.cache.get(url));
        }

        const promise = fetch(url)
            .then(response => response.json())
            .then(data => {
                this.cache.set(url, data);
                return data;
            });

        this.cache.set(url, promise);
        return promise;
    }

    get(url) {
        return this.cache.get(url) || this.preload(url);
    }
}

// 使用示例
const preloader = new ResourcePreloader();
// 预加载资源
preloader.preload('/api/user/1');
preloader.preload('/api/user/2');

// 稍后使用
async function displayUser(id) {
    const userData = await preloader.get(`/api/user/${id}`);
    // 使用预加载的数据
}
```

### 11.4 并发请求限制器
```javascript
class RequestLimiter {
    constructor(maxConcurrent = 5) {
        this.maxConcurrent = maxConcurrent;
        this.currentRequests = 0;
        this.queue = [];
    }

    async add(promiseFactory) {
        if (this.currentRequests >= this.maxConcurrent) {
            await new Promise(resolve => this.queue.push(resolve));
        }

        this.currentRequests++;
        try {
            return await promiseFactory();
        } finally {
            this.currentRequests--;
            if (this.queue.length > 0) {
                const next = this.queue.shift();
                next();
            }
        }
    }
}

// 使用示例
const limiter = new RequestLimiter(3);
const urls = Array.from({ length: 10 }, (_, i) => `/api/item/${i}`);

Promise.all(
    urls.map(url => 
        limiter.add(() => fetch(url).then(r => r.json()))
    )
).then(results => console.log('All requests completed'));
```

## 12. 详细错误处理指南

### 12.1 错误类型分类
```javascript
class NetworkError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NetworkError';
    }
}

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

class TimeoutError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TimeoutError';
    }
}

// 使用示例
async function fetchWithErrorHandling(url) {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            switch (response.status) {
                case 404:
                    throw new ValidationError('Resource not found');
                case 401:
                    throw new ValidationError('Unauthorized');
                case 503:
                    throw new NetworkError('Service unavailable');
                default:
                    throw new Error(`HTTP error! status: ${response.status}`);
            }
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ValidationError) {
            // 处理验证错误
            console.error('Validation error:', error.message);
            return null;
        } else if (error instanceof NetworkError) {
            // 处理网络错误
            console.error('Network error:', error.message);
            throw error; // 重新抛出网络错误
        } else {
            // 处理其他错误
            console.error('Unexpected error:', error);
            throw error;
        }
    }
}
```

### 12.2 全局错误处理
```javascript
class ErrorHandler {
    static handle(error) {
        if (error instanceof ValidationError) {
            // 处理验证错误
            this.handleValidationError(error);
        } else if (error instanceof NetworkError) {
            // 处理网络错误
            this.handleNetworkError(error);
        } else if (error instanceof TimeoutError) {
            // 处理超时错误
            this.handleTimeoutError(error);
        } else {
            // 处理未知错误
            this.handleUnknownError(error);
        }
    }

    static handleValidationError(error) {
        console.error('Validation Error:', error.message);
        // 显示用户友好的错误消息
    }

    static handleNetworkError(error) {
        console.error('Network Error:', error.message);
        // 尝试重新连接
    }

    static handleTimeoutError(error) {
        console.error('Timeout Error:', error.message);
        // 提示用户重试
    }

    static handleUnknownError(error) {
        console.error('Unknown Error:', error);
        // 记录错误并通知开发团队
    }
}

// 使用示例
window.addEventListener('unhandledrejection', event => {
    ErrorHandler.handle(event.reason);
});
```

## 13. 性能优化最佳实践

### 13.1 Promise 批处理
```javascript
class PromiseBatcher {
    constructor(batchSize = 100, interval = 50) {
        this.batchSize = batchSize;
        this.interval = interval;
        this.queue = [];
        this.pending = false;
    }

    add(item) {
        return new Promise((resolve, reject) => {
            this.queue.push({ item, resolve, reject });
            this.process();
        });
    }

    async process() {
        if (this.pending || this.queue.length === 0) return;
        this.pending = true;

        await new Promise(resolve => setTimeout(resolve, this.interval));

        const batch = this.queue.splice(0, this.batchSize);
        const items = batch.map(({ item }) => item);

        try {
            const results = await this.processBatch(items);
            batch.forEach(({ resolve }, index) => resolve(results[index]));
        } catch (error) {
            batch.forEach(({ reject }) => reject(error));
        }

        this.pending = false;
        if (this.queue.length > 0) {
            this.process();
        }
    }

    async processBatch(items) {
        // 实现批处理逻辑
        return items.map(item => `Processed ${item}`);
    }
}

// 使用示例
const batcher = new PromiseBatcher();
for (let i = 0; i < 1000; i++) {
    batcher.add(i).then(result => console.log(result));
}
```

### 13.2 Promise 缓存优化
```javascript
class PromiseCache {
    constructor(ttl = 60000) { // 默认缓存时间 1 分钟
        this.cache = new Map();
        this.ttl = ttl;
    }

    async get(key, promiseFactory) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.ttl) {
            return cached.data;
        }

        const data = await promiseFactory();
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
        return data;
    }

    invalidate(key) {
        this.cache.delete(key);
    }

    clear() {
        this.cache.clear();
    }
}

// 使用示例
const cache = new PromiseCache();
async function fetchUserWithCache(userId) {
    return cache.get(
        `user_${userId}`,
        () => fetch(`/api/users/${userId}`).then(r => r.json())
    );
}
```

### 13.3 内存优化
```javascript
class MemoryEfficientPromise {
    static async batch(items, processor, batchSize = 100) {
        const results = [];
        for (let i = 0; i < items.length; i += batchSize) {
            const batch = items.slice(i, i + batchSize);
            const batchResults = await Promise.all(
                batch.map(processor)
            );
            results.push(...batchResults);
            
            // 允许垃圾回收
            await new Promise(resolve => setTimeout(resolve, 0));
        }
        return results;
    }

    static async stream(asyncIterable, processor) {
        const results = [];
        for await (const item of asyncIterable) {
            results.push(await processor(item));
            
            // 定期清理
            if (results.length % 1000 === 0) {
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        }
        return results;
    }
}

// 使用示例
const items = Array.from({ length: 10000 }, (_, i) => i);
MemoryEfficientPromise.batch(items, async (item) => {
    // 处理每个项目
    return item * 2;
}).then(results => console.log('Processed items:', results.length));
```

## 14. 补充最佳实践建议

### 14.1 Promise 链优化
```javascript
// ✅ 优化 Promise 链
async function optimizedChain() {
    try {
        // 1. 并行执行无依赖的 Promise
        const [data1, data2] = await Promise.all([
            fetchData1(),
            fetchData2()
        ]);

        // 2. 串行执行有依赖的 Promise
        const result1 = await processData(data1);
        const result2 = await processData(data2);

        // 3. 条件执行
        if (needsExtra(result1)) {
            await extraProcessing(result1);
        }

        return [result1, result2];
    } catch (error) {
        // 统一错误处理
        ErrorHandler.handle(error);
        throw error;
    }
}
```

### 14.2 资源管理
```javascript
class ResourceManager {
    constructor() {
        this.resources = new Map();
        this.locks = new Map();
    }

    async acquire(key) {
        if (this.locks.has(key)) {
            await this.locks.get(key);
        }

        const lock = new Promise(resolve => {
            this.locks.set(key, resolve);
        });

        try {
            if (!this.resources.has(key)) {
                const resource = await this.createResource(key);
                this.resources.set(key, resource);
            }
            return this.resources.get(key);
        } finally {
            this.locks.delete(key);
            lock.resolve();
        }
    }

    async release(key) {
        if (this.resources.has(key)) {
            const resource = this.resources.get(key);
            await this.cleanupResource(resource);
            this.resources.delete(key);
        }
    }

    async createResource(key) {
        // 实现资源创建逻辑
    }

    async cleanupResource(resource) {
        // 实现资源清理逻辑
    }
}
```

### 14.3 监控和日志
```javascript
class PromiseMonitor {
    constructor() {
        this.metrics = {
            total: 0,
            success: 0,
            failure: 0,
            timing: []
        };
    }

    async track(promise, metadata = {}) {
        const startTime = Date.now();
        this.metrics.total++;

        try {
            const result = await promise;
            this.metrics.success++;
            this.recordTiming(startTime, metadata);
            return result;
        } catch (error) {
            this.metrics.failure++;
            this.recordError(error, metadata);
            throw error;
        }
    }

    recordTiming(startTime, metadata) {
        const duration = Date.now() - startTime;
        this.metrics.timing.push({
            duration,
            ...metadata,
            timestamp: new Date()
        });
    }

    recordError(error, metadata) {
        console.error('Promise Error:', {
            error: error.message,
            stack: error.stack,
            ...metadata,
            timestamp: new Date()
        });
    }

    getMetrics() {
        return {
            ...this.metrics,
            successRate: this.metrics.success / this.metrics.total,
            averageDuration: this.calculateAverageDuration()
        };
    }

    calculateAverageDuration() {
        if (this.metrics.timing.length === 0) return 0;
        const sum = this.metrics.timing.reduce((acc, { duration }) => acc + duration, 0);
        return sum / this.metrics.timing.length;
    }
}

// 使用示例
const monitor = new PromiseMonitor();
async function monitoredOperation() {
    return monitor.track(
        fetch('/api/data'),
        { operation: 'fetchData', priority: 'high' }
    );
}
```

### 14.4 测试最佳实践
```javascript
// Promise 测试辅助函数
class PromiseTestUtils {
    static async expectResolve(promise) {
        let error;
        try {
            await promise;
        } catch (e) {
            error = e;
        }
        expect(error).toBeUndefined();
    }

    static async expectReject(promise) {
        let error;
        try {
            await promise;
        } catch (e) {
            error = e;
        }
        expect(error).toBeDefined();
    }

    static createDeferred() {
        let resolve, reject;
        const promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        return { promise, resolve, reject };
    }
}

// 测试示例
describe('Promise Tests', () => {
    it('should handle successful operations', async () => {
        const { promise, resolve } = PromiseTestUtils.createDeferred();
        setTimeout(() => resolve('success'), 100);
        await PromiseTestUtils.expectResolve(promise);
    });

    it('should handle failures', async () => {
        const { promise, reject } = PromiseTestUtils.createDeferred();
        setTimeout(() => reject(new Error('fail')), 100);
        await PromiseTestUtils.expectReject(promise);
    });
});
```