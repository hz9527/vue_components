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
// normal list
[
  { // 数据栏
    flex: Number, // 宽度分配，默认1
    className: String, // 列class 默认''
    align: String, // 列文字对其方式， 枚举 left center right 默认 center
    defaultIndex: Number, // 默认下标
    list: Array // 列数据 item String Object {name: xx, value: xx}
  },
  { // 分隔栏
    flex: Number,
    className: String,
    align: String, // 列文字对其方式， 枚举 left center right 默认 center
    content: String // 分隔栏内容
  }
]
// childList
[
  {
    flex: Number,
    className: String,
    align: String,
    name: String,
    defaultIndex: Number,
    parentName: [String, null],
    data: [
      {
        parent: [value, null, Array],
        defaultIndex: Number,
        list: Array // item String Object {name: xx, value: xx}
      }
    ]
  }
]
```
1. list属性中每一项对应着picker中每一列，分为间隔列，普通列与联动列三种
2. 每一列都支持flex className align
3. 数据列（间隔列，普通列）list是一个数组，即某一列数据，每一项为字符串或对象，对象为{name: xx, value: xx}
4. 数据列还有可选的defaultIndex，为默认展示项下标，默认为0

**联动列**  
1. 每一项中name与parentName，name为该列name，不可重复，以判断父子关系，无子列表项也需要定义该字段，无parent则parentName为null
2. data为该列可选择的列表，如一个省市区联动列表，省的data为一个长度为1的数组，如有3个省，那么市列表为长度为3的数组，依此类推
3. data中每一项是一个对象，每一项有parent defaultIndex list属性，parent对应list属性该项对应的parentName中data选中值，可以是数组或value，虽然list属性每一项都可以定义defaultIndex，但data中项定义defaultIndex优先级更高，list与普通列一致

```javaScript
[
  {
    name: 'province', // 作为子列表查询依据，子列parentName为province，这也意味着联动列不需要按照正序排列
    parentName: null, // 无父列
    data: [
      {
        parent: null, // 父列中选中数据
        list: [{name: '北京', value: 'beijing'}, {name: '湖北', value: 'hubei'}]
      }
    ]
  },
  {
    content: '-'
  },
  {
    name: 'city', // 作为子列表查询依据，子列parentName为city
    parentName: 'province', // 父列name为province
    defaultIndex: 1, // 默认选中本列数据中下标为1数据
    data: [
      {
        parent: 'beijing', // 父列选中值为beijing或value为beijing 为防止重名，建议使用name value方式
        defaultIndex: 0, // 展示此列时默认显示 东城
        list: ['东城', '西城', '朝阳', '海淀'] // 当父列选中beijing时本列为此列表
      },
      {
        parent: 'hubei', // 父列选中值为hubei或value为hubei
        list: ['武汉', '黄冈'] // 当父列选中beijing时本列为此列表，默认显示 黄冈 因为defaultIndex为1
      }
    ]
  },
  {
    content: '-'
  },
  {
    name: 'district', // 虽然没有子列但是请命名一个name
    parentName: 'city', // 父列name为city
    data: [
      {
        parent: ['东城', '西城', '朝阳', '海淀'], // 支持数组形式，当父列选择数组中值时展示该list
        list: []
      },
      {
        parent: '武汉', // 父列选中值为武汉或value为武汉，展示此列
        list: ['武昌', '汉阳', '洪山', '青山']
      },
      {
        parent: '黄冈',
        list: ['黄州', '罗田', '浠水', '团风']
      }
    ]
  }
]
```

#### 关于choose
choose为选中项，且初次不作校验，每一项代表下标，保持与list长度一致，因此间隔列值为－1
```javaScript
[
  {index: 1}, // 普通列 {index: Number} or Number
  {dataIndex: 1, index: 1}, // 联动列 dataIndex对应data中展示列下标，index对应展示列下标
  -1, // 间隔列
  1 // 普通列
]
```

### 关于事件
|事件名|触发时机|参数列表|
|---|---|---|
|choose|某列列表滑动结束触发|值列数组{name, value, index}|


### 关于插槽
|接口名|作用|数据类型|
|---|---|---|

### 完整示例
> 参考示例
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
