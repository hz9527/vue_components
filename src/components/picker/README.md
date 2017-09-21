## picker组件使用说明
#### 目录
[1.基本介绍](#基本介绍)  
[2.基本示例](#基本示例)  
[3.关于接口](#关于接口)  
[4.关于事件](#关于事件)  
[5.关于插槽](#关于插槽)  
[6.完整示例](#完整示例)  
[7.其他](#其他)  

### 基本介绍
##### 简介
> picker组件，功能等效于PC端下拉列表，在移动端主要表现是从底部弹出一个可滑动的面板

本组件滑动效果使用了AlloyTouch库（更改了部分源码）

##### 使用场景
选择枚举列表中某项，如省市区，时间选择等


### 基本示例
```html
<picker :list='list' />
```

### 关于接口
|接口名|作用|数据类型|是否必须|默认值|备注|
|---|---|---|---|---|---|
|list|传入列表数据|Array|是|[]| [详情](#关于list) |
|choose|选择项列表|Array|否|[]| [详情](#关于choose) |
|limitMethods|校验数据|[Function, Boolean]|否|false|备注|
|showLine|展示的列数|Number|否|5|必须为奇数|
|itemHeight|每列高度|Number|否|30|单位px|
|showHead|是否展示取消 确认按钮|Boolean|否|false|取消会恢复默认值或choose值，确认会触发confirm事件|
|showBg|是否显示背景（渐变）|Boolean|否|false||

#### 关于list
list属性是使用本组件的核心，主要分两种，一种是普通列表，一种是联动列表，为保持接口一致，两者区别主要在于list与data及parent，parentName上区别
```javaScript

```
#### 关于choose

### 关于事件
|接口名|作用|数据类型|是否必须|
|---|---|---|---|

### 关于插槽
|接口名|作用|数据类型|
|---|---|---|

### 完整示例
> 注：template内组件属性，事件对应props及events内示例

template:
```html

```

props:
```javaScript
```

events:
```javaScript
```


### 其他
