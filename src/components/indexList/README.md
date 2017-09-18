## indexList组件使用说明
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
> indexList是带索引的列表，如通讯录，地址列表等

使用时只需要引用indexList组件即可，组件为页面级组件，因此内部会计算高度以撑满屏幕，当文档流中前面有dom会减去其高度，但下方有dom就不会减去，因此尽量不要在组件后放置dom，以免indexList内部可以滚动，外部也可以滚动

##### 使用场景
地址列表，联系人列表等

### 基本示例
```html
<index-list :list='cityList' />
```

### 关于接口
|接口名|作用|数据类型|是否必须|默认值|备注|
|---|---|---|---|---|---|
|list|列表内容|Array|是|[]|需与keyConf配合使用|
|keyConf|定义list内字段，可以理解为list内每一项需要有id，name，pinyin字段|Object|否|{id: 'id',name: 'name',pinyin: 'pinyin',division: ''}|division为拼音分隔符，可以为函数或字符串，表示拼音中间隔，如xi$an为$，用于排序（如lang$zhong lan$zhou，无分隔符阆中会排在兰州前，但有分隔符则会是兰州排在阆中前）|
|maxHeight|右侧索引列表最高高度|Number|否|20|单位px，右侧索引会计算一个平均高度，若该高度大于maxHeight则使用maxHeight，否则使用计算出的高度|
|headClass|列表索引头className|String|否|''|注意样式覆盖|
|itemClass|列表项className|String|否|''|注意样式覆盖|
|indexClass|索引列表className|String|否|''||

### 关于事件
|事件名|触发时机|参数列表|
|---|---|---|
|chooseItem|点击选中列表中某一项|{[id]: item.id, [name]: item.name}|

### 关于插槽
|插槽名|作用|备注|
|---|---|---|
|head|头部插槽|-|
|foot|底部插槽|- |
> 本组件是页面级组件，因此提供头部和底部插槽

### 完整示例
> 注：template内组件属性，事件对应props及events内示例

template:
```html
<index-list :list='list' :keyConf='keyConf' :maxHeight='maxHeight' :itemClass='itemClass' @chooseItem='chooseItem'>
  <div class="head" slot='head'>
    head
  </div>
  <div class="foot" slot='foot'>
    foot
  </div>
</index-list>
```

props:
```javaScript
data () {
  return {
    list: [
      {
        cityId: 1,
        cityName: '北京',
        pinyin: 'beijing'
      }
    ],
    keyConf: {
      id: 'cityId', // 告知组件每项唯一标识字段是cityId
      name: 'cityName' // 告知组件每项名字字段为cityName
    },
    maxHeight: 25,
    itemClass: 'my-item'
  }
}
```

events:
```javaScript
methods: {
  chooseItem (v) {
    console.log(v) // {cityName: '北京', cityId: 1}
  }
}
```


### 其他
索引项暂时未做粘性布局兼容，暂时不支持搜索
