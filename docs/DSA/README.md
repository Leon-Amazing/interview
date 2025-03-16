# 数据结构与算法

### 1.栈

[20.有效的括号](https://leetcode.cn/problems/valid-parentheses/description/)

![图片](./img/6.png)

### 2.队列

[933.最近的请求次数](https://leetcode.cn/problems/number-of-recent-calls/)

![图片](./img/9.png)

### 3.链表

[237.删除链表中的节点](https://leetcode.cn/problems/delete-node-in-a-linked-list/)

![图片](./img/12.png)

[206.反转链表](https://leetcode.cn/problems/reverse-linked-list/)

![图片](./img/13.png)

[2.两数相加](https://leetcode.cn/problems/add-two-numbers/)

![图片](./img/14.png)

[83.删除排序链表中的重复元素](https://leetcode.cn/problems/remove-duplicates-from-sorted-list/)

![图片](./img/15.png)

[141.环形链表](https://leetcode.cn/problems/linked-list-cycle/)

![图片](./img/16.png)

**前端与链表：JS 中的原型链**

![图片](./img/17.png)

![图片](./img/18.png)

![图片](./img/19.png)

**instanceof 的原理，并用代码实现。**

![图片](./img/20.png)

**前端与链表：使用链表指针获取 JSON 的节点值**

```js
const json = {
  a: { b: { c: 1 } },
  d: { e: 2 }
};

const path = ['a', 'b', 'c'];

let p = json;
path.forEach(k => {
  p = p[k];
});
```

### 4.集合

[349.两个数组的交集](https://leetcode.cn/problems/intersection-of-two-arrays/)

![图片](./img/22.png)

### 5.字典

[349.两个数组的交集](https://leetcode.cn/problems/intersection-of-two-arrays/)

![图片](./img/25.png)

[20.有效的括号](https://leetcode.cn/problems/valid-parentheses/description/)

![图片](./img/26.png)

[1.两数之和](https://leetcode.cn/problems/two-sum/)

![图片](./img/27.png)

[3.无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)

![图片](./img/28.png)

[76.最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/)

![图片](./img/29.png)

### 6.树

[104.二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)

![图片](./img/38.png)

[111.二叉树的最小深度](https://leetcode.cn/problems/minimum-depth-of-binary-tree/)

![图片](./img/39.png)

[102. 二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/description/)

![图片](./img/40.png)

![图片](./img/41.png)

[94. 二叉树的中序遍历](https://leetcode.cn/problems/binary-tree-inorder-traversal/)

![图片](./img/42.png)

[112. 路径总和](https://leetcode.cn/problems/path-sum/)

![图片](./img/43.png)

**前端与树:遍历 JSON 的所有节点值**

```js
const json = {
  a: { b: { c: 1 } },
  d: [1, 2]
};

const dfs = (n, path) => {
  console.log(n, path);
  Object.keys(n).forEach(k => {
    dfs(n[k], path.concat(k));
  });
};

dfs(json, []);
```

**前端与树:渲染 Antd 的树组件**

![图片](./img/44.png)

### 7.图

[65. 有效数字](https://leetcode.cn/problems/valid-number/description/)

![图片](./img/50.png) ![图片](./img/51.png)

[417. 太平洋大西洋水流问题](https://leetcode.cn/problems/pacific-atlantic-water-flow/)

![图片](./img/52.png) ![图片](./img/53.png)

[133. 克隆图](https://leetcode.cn/problems/clone-graph/)

![图片](./img/54.png) ![图片](./img/55.png)

### 8.堆

[215.数组中的第 K 个最大元素](https://leetcode.cn/problems/kth-largest-element-in-an-array/)

![图片](./img/58.png)

[347.前 K 个高频元素](https://leetcode.cn/problems/top-k-frequent-elements/)

![图片](./img/59.png)

[23.合井 K 个升序链表](https://leetcode.cn/problems/merge-k-sorted-lists/)

![图片](./img/60.png) ![图片](./img/61.png)

### 9.排序和搜索

[21.合并两个有序链表](https://leetcode.cn/problems/merge-two-sorted-lists/)

![图片](./img/70.png)

[374.猜数字大小](https://leetcode.cn/problems/guess-number-higher-or-lower/)

![图片](./img/71.png)

### 10.分而治之(思想)

[374.猜数字大小](https://leetcode.cn/problems/guess-number-higher-or-lower/)

![图片](./img/73.png)

[226. 翻转二叉树](https://leetcode.cn/problems/invert-binary-tree/)

![图片](./img/74.png)

[100. 相同的树](https://leetcode.cn/problems/same-tree/)

![图片](./img/75.png)

[101. 对称二叉树](https://leetcode.cn/problems/symmetric-tree/)

![图片](./img/76.png)

### 11.动态规划(思想)

[70. 爬楼梯](https://leetcode.cn/problems/climbing-stairs/)

![图片](./img/78.png)

[198. 打家劫舍](https://leetcode.cn/problems/house-robber/)

![图片](./img/79.png)

### 12.贪心算法(思想)

[455. 分发饼干](https://leetcode.cn/problems/assign-cookies/description/)

![图片](./img/81.png)

[122. 买卖股票的最佳时机 II](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii/)

![图片](./img/82.png)

### 13.回溯算法(思想)

[46. 全排列](https://leetcode.cn/problems/permutations/description/)

![图片](./img/84.png)

[78. 子集](https://leetcode.cn/problems/subsets/)

![图片](./img/85.png)
