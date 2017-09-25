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
> datePicker 是一个页面级日历选择组件，可以选单个时间也可以选择时间段

##### 使用场景
日历选择，在酒旅类业务中比较常用


### 基本示例
```html
<date-picker />
```

### 关于接口
|接口名|作用|数据类型|是否必须|默认值|备注|
|---|---|---|---|---|---|
|dateConf|设置日历，如长度，开始时间结束时间，时间点还是时间段，是否显示今天等|Object|否|今天开始一年，选择时间段，今天显示为‘今天’{length: Number, start: '2017/10/01', end: '2018/09/10', today: '当天', type: 'point/time'}|可配置部分，其他自动填充默认值|
|chooseStart|如果是选择时间段，第一次点击是否是选择开始时间|Boolean|否|true||
|startTime|开始时间|[String, null]|否|null|格式为 yyyy/m/d|
|endTime|结束时间|[String, null]|否|null|格式为 yyyy/m/d|
|computedText|选中日期（包括区间）内文字|Function|否|return ''|参数为选择项状态及日期|
|computedInfo|每个日期的信息项|Function|否|return ''|参数为time start end|
|computedValid|当前日期是否能被选中|Function|否|return true|参数为 time|
|classConf|配置class|Object|否|全部为''|未配置项自动填充''|
#### 关于dateConf
#### 关于时间有效性计算
#### 关于classConf

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
