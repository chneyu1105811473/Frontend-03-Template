学习笔记

## 整理法，追溯法
+ 学会总结和形成知识网络，善于使用xmind
+ 一些工具的使用方法
##### 使用vim编辑文档
- 在git中 vim 文件名 进入vim模式
- 使用i进入输入模式，可正常使用键盘输入
- 使用esc键突出输入模式，进入命令模式
- 英文冒号:进入底线命令模式
- w  保存文件
- q  退出vim，需要先保存才能退出
- q! 不用保存，强制退出
- 每次执行底线命令时都需要先按英文冒号:
##### 使用xmind思维导图
- 下载xmind，选择xmind提供的模板新建
- tab：创建子节点
- enter：创建兄弟节点
- space: 在该节点输入文字

## BNF
- BNF是John Backus 在20世纪90年代提出的用以简洁描述一种编程语言的语言。
- 基本结构为：<non-terminal> ::= <replacement> non-terminal意为非终止符，就是说我们还没有定义完的东西，还可以继续由右边的replacement，也就是代替物来进一步解释、定义。
- 举个例子：在中文语法里，一个句子一般由“主语”、“谓语”和“宾语”组成，主语可以是名词或者代词，谓语一般是动词，宾语可以使形容词，名词或者代词。那么“主语”、“谓语”和“宾语”就是非终止符，因为还可以继续由“名词”、“代词”、“动词”、“形容词”等替代。
+ 例1. <句子> ::= <主语><谓语><宾语>
+ 例2. <主语> ::= <名词>|<代词>
+ 例3. <谓语>::=<动词>
+ 例4. <宾语>::=<形容词>|<名词>|<代词>
+ 例5. <代词>::=<我>
+ 例6. <动词>::=<吃>
+ 例7. <动词>::=<喜欢>
+ 例8. <名词>::=<车>
+ 例9. <名词>::=<肉>
- 如上，在::=左边的就是non-terminal非终止符，右边的就是replacement，可以是一系列的非终止符，如例1中的replacement便是后面例234左边的非终止符，也可以是终止符，如例56789的右边，找不到别的符号来进一步代替。因此，终止符永远不会出现在左边。一旦我们看到了终止符，这个描述过程就结束了。

## 一个编程题
* 输出以下代码运行结果，为什么？如果希望每隔 1s 输出一个结果，应该如何改造？注意不可改动 square 方法 
```javascript
const list = [1, 2, 3]
const square = num => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(num * num)
    }, 1000)
  })
}
function test() {
  list.forEach(async x=> {
    const res = await square(x)
    console.log(res)
  })
}
```
##### 方案一
```javascript
function test1(){
  list.reduce((acc,item)=>acc.then(async ()=>{ 
    const res = await square(item);
    console.log(res);
  }),Promise.resolve())
}
```
##### 方案二
```javascript
async function test2(){//等同于for循环
  for(let i in list){// i是角标
    const res = await square(list[i])
    console.log(res)
  }
}
```
##### 方案三
```javascript
async function test3(){
  for(let i of list){// i是值
    const res = await square(i)
    console.log(res)
  }
}
```