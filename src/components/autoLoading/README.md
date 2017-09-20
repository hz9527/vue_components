## autoLoading(原生)组件使用说明
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
> autoLoading是在页面滑倒顶部下拉可以触发刷新，滑倒底部可以请求新数据的组件

下拉刷新和触底加载关键在于触发问题，本组件使用的系统滑动，下拉使用translate，触底则是scroll事件，虽然scroll事件不能及时触发但够用了。  
本组件是一个页面级组件，因此内部会计算高度以撑满屏幕，当文档流中前面有dom会减去其高度，但下方有dom就不会减去，因此尽量不要在组件后放置dom，以免indexList内部可以滚动，外部也可以滚动

##### 使用场景
1. 下拉刷新
2. 触底加载

### 基本示例
```html
<auto-loading :loading='loading' :canLoad='canLoad'>
  <div class='item' v-for='item in list' :key='item.id'>
    {{item.text}}
  </div>
</auto-loading>
```

### 关于接口
|接口名|作用|数据类型|是否必须|默认值|备注|
|loadType|加载类型，可以使用下拉刷新（refresh），触底自动加载（preload），两者都使用（all）|String|否|all|不同模式可以配合触发临界值|
|loading|是否正在加载数据|Boolean|是|false|在更新完列表后需要计算最大滑动距离来更新触底临界点|
|canLoad|是否能加载更多数据|Boolean|否|true|在触底加载时如果此值为false将不再触发preload事件，并显示没有更多数据|
|pullLoadHeight|下拉刷新下拉临界点，超过该临界点才触发refresh事件|Number|否|50|单位px|
|preLoadHeight|触底加载在距离列表底部该高度即可触发proload事件，即在还未触底就可加载|Number|否|150|单位px|

### 关于事件
|事件名|触发时机|参数列表|
|---|---|---|
|pullState|下拉距离与临界值比较状态变化时，如默认下拉刷新，超过后为释放刷新|0 or 1 0表示继续下拉， 1表示释放 ，与该插槽配合使用|
|refresh|用户touchEnd时下拉距离超过临界值触发|无|
|needMore|在加载完数据，发现列表高度未撑满容器触发|无|
|preload|触底距离临界高度触发|无|

### 关于插槽
|插槽名|作用|备注|
|---|---|---|
|head|固定在滑动容器顶部|无|
|foot|固定在滑动容器底部|无|
|pull|绝对定位在容器上方|脱离文档流，默认 继续下拉刷新 释放刷新|
|pull-loading|在滑动容器顶部|在文档流内 默认 加载中|
|noMore|在滑动容器底部|在文档流内 默认 我也是有底线的|
|preload|绝对定位在滑动容器底部|脱离文档流 默认 旋转|
|list-foot|滑动容器最底部|在文档流内|

### 完整示例
> 注：template内组件属性，事件对应props及events内示例

template:
```html
<auto-loading :loadType='"all"' :loading='loading' :canLoad='canLoad'
  :pullLoadHeight='pullLoadHeight' :preLoadHeight='preLoadHeight'
  @refresh='refresh' @preload='load' @needMore='load'>
  <div slot='head' class='head'>使用AlloyTouch库实现的autoLoading</div>
  <div slot='list' class="item" v-for='item in list' :key='item.id'>
    {{item.text}}
  </div>
</auto-loading>
```

props:
```javaScript
data () {
  return {
    list: [], // 列表
    loading: false, // 是否正在加载
    canLoad: true, // 是否能加载更多
    pullLoadHeight: 100, // 下拉距离超过100px才触发下拉刷新
    preLoadHeight: 200, // 下滑距离底部200px就触发preload事件
    _page: 0
  }
}
```

events:
```javaScript
methods: {
  refresh () {
    this.loading = true
    var preNow = Date.now()
    this._page = 1
    axios.get(getList, {params: {page: this._page, pagesize: 20}})
    .then(res => {
      if (res.code === 0) {
        var time = Date.now() - preNow
        time = time > 1500 ? 0 : 1500 - time // 加载中延迟
        setTimeout(() => {
          this.list = res.data
          this.loading = false
        }, time)
      }
    })
  },
  load () {
    this.loading = true
    this._page++
    axios.get(getList, {params: {page: this._page, pagesize: 20}})
    .then(res => {
      if (res.code === 0) {
        if (res.data.length === 20) {
          this.list = this.list.concat(res.data)
        } else {
          this.canLoad = false
        }
        this.loading = false
      }
    })
  }
}
```


### 其他
