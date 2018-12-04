> Markdown说明：本文档使用 Typora 编写，如格式出现错误，请尝试使用 Typora 打开本文档
>
> 作者：张小富
>
> 创建时间：2018-12-01

# Basic.js函数文档

Basic.js文件为整个项目的基础函数库，函数库内的绝大多数函数是所有页面共有的，在任何一个页面均可以使用的。

Basic.js文件为页面优化完善函数库，与其他js文件区别在于Basic.js文件函数均有 公有、基础 等特性。

详细函数说明如下：

## 1：getUrlParam函数

> 此函数采用jQuery方式封装，便于使用`$.`方式调用，便于扩展jQuery方式

`全局函数`

getUrlParam函数用于获取URL地址中的参数，一个可以获取一个参数值，用法如下：

**函数接收值：**

| 参数名 | 必填 | 数据类型            | 描述                                            |
| ------ | ---- | ------------------- | ----------------------------------------------- |
| name   | 是   | string              | URL中需要获取的参数名                           |
| site   | 否   | [number,object,“…”] | 标记需要捕获哪个位置的参数中的URL，默认当前窗口 |

- site参数默认值说明：

  site参数默认有两种形式定位（如下表格），当site参数无效时默认获取当前所在窗口的URL参数

  | 值     | 数据类型 | 描述                            |
  | ------ | -------- | ------------------------------- |
  | 1      | number   | 定位到父级窗口，获取URL中的参数 |
  | window | object   | 定位到指定窗口，获取URL中的参数 |

  > 当site为object类型的值时必须是window或者window对象下的子框架的对象，否则参数无效

**函数调用示例：**

  ```javascript
  //页面URL: www.domain.com?p=go 框架URL：www.domain.com/index?p=do
  //页面中调用
  $.getUrlParam("p")//go
  $.getUrlParam("p",top.frames[0])//do
  //框架中调用
  $.getUrlParam("p")//do
  $.getUrlParam("p",1)//go
  $.getUrlParam("p",top)//go
  ```


**函数返回值：**

- 当可以获取到所需的相关参数时，函数会返回URL中对应的参数值（string类型）
- 当无法获取到所需的相关参数时，函数会返回null(object类型)

## 2：addTableMessage函数

addTableMessage函数用于向表格中指定的数据列hover时添加提示信息框，并且支持自定义淡入淡出时间控制。

只有当TABLE中data的数据中含有messages属性值时Message函数才会起作用，否则此设置函数无效。

**函数接收值：**

| 参数名  | 数据类型       | 描述                                      | 必填 | 默认值 |
| ------- | -------------- | ----------------------------------------- | ---- | ------ |
| num     | number         | 设定显示Message信息的列                   | 是   | 无     |
| obj     | object         | TABLE组件默认返回参数，obj.data表示行数据 | 是   | 无     |
| timeIn  | number，string | Message信息淡入动画是时间                 | 否   | 500ms  |
| timeOut | number，string | Message信息淡出动画是时间                 | 否   | 100ms  |

**函数调用示例：**

```javascript
//table.render参数"done"中
addTableMessage(1,obj);//TABLE的第一列数据显示Message
addTableMessage(4,obj,600,200);//TABLE的第四列数据显示Message,600ms淡入动画，200ms淡出动画
```

**函数返回值：**

当函数的参数传递错误时会返回错误说明。

## 3：$.cookie函数

$.cookie函数使用jQuery形式操作页面cookie（增加、获取、删除）

**函数接收值：**

| 参数名  | 必填 | 数据类型 | 描述                 |
| ------- | ---- | -------- | -------------------- |
| name    | 是   | string   | 需要操作的cookie名   |
| value   | 否   | 任意     | 需要增加的cookie值   |
| options | 否   | object   | 其他可操作cookie参数 |

- cookie操作说明：

  增加：当`name` `value`项已填写的时候默认为增加cookie（options为额外控制项，不填则默认）

  获取：当只有`name`项已填写时则默认为获取cookie值

  删除：需要删除cookie时直接将value项置为 `null` 即可

- option说明(增加cookie时有效)：

  | 参数名  | 数据类型       | 描述                                              |
  | ------- | -------------- | ------------------------------------------------- |
  | expires | Number \| Date | cookie数据有效期（单位：天）                      |
  | path    | String         | cookie路径，用于设置可以获取cookie的顶级目录      |
  | domain  | String         | cookie创建页面域名                                |
  | secure  | Boolean        | 如果为true，则cookie传输会以安全协议传输（HTTPS） |

  > option参数以JSON格式传输，无顺序

**函数调用示例：**

```javascript
$.cookie("f", 10, { expires: 1, domain: 'localhost' });
//创建一个名称为 f ,值为 10 ，有效期 1天 ，页面域名localhost的cookie
```

**函数返回值：**

只有当函数增加cookie时函数才会有返回值，返回值为需要获取的cookie名对应的cookie值4

## 4：markPage函数

markPage函数用于创建页面加载效果，可以自定义显示文字。

此函数需要在<body>内最开始的位置引入，遮罩会在设定好的时间（time参数）后自动消失，当页面加载完毕遮罩也会消失。

> 理论上此函数可以加载在任何页面的<body>内，但是实际测试发现只有只在index.html加效果最好

**函数接收值：**

| 参数值 | 必填 | 描述                 | 默认值             | 数据类型 |
| ------ | ---- | -------------------- | ------------------ | -------- |
| text   | 否   | 页面加载时的提示文字 | “页面急速加载中！” | String   |
| time   | 否   | 遮罩默认消失时间     | 3000               | Number   |

> 为兼容手机端，提示文字不易过多

函数调用示例：**

```javascript
markPage();
markPage("马上就加载好了！");
```

**函数返回值：**

此函数没有任何返回值

## 5：frame_all函数

frame_all函数为所有二级框架内页面共有函数，当页面不为框架内页面时，此函数无效。

frame_all函数是多函数聚合，其中包含多种函数，是一个可扩展函数。

函数可以接收String数据也可以接收Object数据，允许任意多个值的传递。

### 1：backPage函数

