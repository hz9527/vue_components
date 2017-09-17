## swiper组件使用说明
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
> swiper是一个轮播图或类似banner组件。

组件需要引用swiper组件及swiperItem组件，未使用第三方插件或库，不属于页面级组件，因此其组件高度依赖于内部dom高度，宽度依赖于父容器宽度，动画计算使用的timeout，至于为什么不使用nextTick或requireAnimationFrame，个人认为没必要，不需要那么流畅。设置每帧为30ms

##### 使用场景
1. 轮播图
2. 选择列表（如，现在有一系列汽车需要供用户选择，一般是上面会有一个横排的车型列表，下面是车型图片，可以滑动图片选择车型也可以点击车型列表选择）

### 基本示例
```html
<swiper @change='change'>
  <swiper-item v-for='item in list' :key='item.id' slot='item'>
    <div :style="{backgroundImage: item.src}"></div>
  </swiper-item>
</swiper>
```

### 关于接口
|接口名|作用|数据类型|是否必须|默认值|备注|
|---|---|---|---|---|---|
|autoTime|自动轮播时切换一张banner的动画时间|Number|否|500|需要autoTime与waitTime均大于0才能自动轮播且轮播数大于1|
|waitTime|自动轮播时等待开始切换动画时间|Number|否|2000|见autoTime|
|defaultIndex|默认banner下标|Number|否|0|轮播过程中可更改|
|speed|在滑动结束时会计算一个速度，若该速度小于此速度则以此速度滑动|Number|否|0.6|必须为正数，单位为px/ms|
|showIndex|是否显示banner对应下标点|Boolean|否|true|下标点绑定了点击事件|
|needUpdate|是否需要更新整个组件|Boolean|否|false|如果banner列表在轮播过程中需要更新或者因为list是异步完成的需要告知swiper，在更新完成后会触发updated事件|

### 关于事件
|事件名|触发时机|参数列表|
|---|---|---|
|updated|needUpdate属性在mounted后置为true时，需要更新swiper，通知父组件更新完成|无|
|change|当前banner下标发生变化时|新的当前banner下标|

### 关于插槽
|插槽名|作用|备注|
|---|---|---|
|item|用于放置banner|需要使用swiperItem组件，具体见示例|
|head|会在banner容器上方|无|
|other|在banner容器内|banner容器posiion为relative|
|foot|会在banner容器下方|无|

### 完整示例
> 注：template内组件属性，事件对应props及events内示例

template:
```html
<swiper :autoTime='autoTime' :waitTime='waitTime' :defaultIndex='defaultIndex'
:speed='speed' :showIndex='showIndex' :needUpdate='needUpdate'
@change='change' @updated='updated'>
  <swiper-item v-for='item in list' :key='item.id' slot='item'>
    <div :style="{backgroundImage: item.src}"></div>
  </swiper-item>
</swiper>
```

props:
```javaScript
data () {
  return {
    autoTime: 300, // 自动轮播时，切换动画会持续300ms
    waitTime: 5000, // 自动轮播时，会等待5000ms再切换
    defaultIndex: 2, // 默认展示第三张轮播图
    speed: 0.8, // touchEnd后会最小滑动速度为0.8px／ms
    showIndex: false, // 不展示轮播图对应的小圆点
    needUpdate: false // 是否需要更新swiper
  }
}
```

events:
```javaScript
methods: {
  change (ind) {
    console.log(ind) // 当前banner下标
  },
  updated () {
    this.needUpdate = false // 在轮播过程中或异步加载banner列表时需要通知swiper（将needUpdate置为true），当swiper更新完成后触发
  }
}
```


### 其他
使用defaultIndex更改当前banner下标没有动画效果  
