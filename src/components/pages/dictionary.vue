<template lang="html">
  <div class="">
    <div class="btn" @click='changeData'>
      checkoutData
    </div>
    <div class="con">
      <dictionary :dealData='dealData' :data='data'/>
    </div>
  </div>
</template>

<script>
const cityList = [
  {cityId: 1, name: '北京'},
  {cityId: 2, name: '鞍山'},
  {cityId: 3, name: '成都'},
  {cityId: 4, name: '大连'},
  {cityId: 5, name: '鄂尔多斯'},
  {cityId: 6, name: '福州'},
  {cityId: 7, name: '广州'},
  {cityId: 8, name: '杭州'},
  {cityId: 9, name: '武汉'},
  {cityId: 10, name: '荆州'},
  {cityId: 11, name: '昆明'},
  {cityId: 12, name: '兰州'},
  {cityId: 13, name: '漠河'},
  {cityId: 14, name: '南京'},
  {cityId: 15, name: '普洱'},
  {cityId: 16, name: '青岛'},
  {cityId: 17, name: '日照'},
  {cityId: 18, name: '上海'},
  {cityId: 19, name: '深圳'},
  {cityId: 20, name: '天津'},
  {cityId: 21, name: '太原'},
  {cityId: 22, name: '乌鲁木齐'},
  {cityId: 23, name: '郑州'},
  {cityId: 24, name: '义乌'},
  {cityId: 25, name: '苏州'},
  {cityId: 26, name: '阆中'},
  {cityId: 27, name: '九江'},
  {cityId: 28, name: '温州'},
  {cityId: 29, name: '西安'},
  {cityId: 30, name: '宝鸡'},
  {cityId: 31, name: '济南'},
  {cityId: 32, name: '长沙'},
  {cityId: 33, name: '扬州'},
  {cityId: 34, name: '宜昌'},
  {cityId: 35, name: '石家庄'},
  {cityId: 36, name: '海口'},
  {cityId: 37, name: '佛山'},
  {cityId: 38, name: '厦门'},
  {cityId: 39, name: '锦州'},
  {cityId: 40, name: '威海'},
  {cityId: 41, name: '大理'},
  {cityId: 42, name: '桂林'},
  {cityId: 43, name: '玉林'},
  {cityId: 44, name: '张家口'},
  {cityId: 45, name: '漯河'}
]
const nameList = {
  'A': [
    {name: '安七炫', phone: '18071104950'},
    {name: '阿姨', phone: '180711049501'}
  ],
  'B': [
    {name: '爸爸', phone: '18071104952'},
    {name: '邦女郎', phone: '18071104953'}
  ],
  'C': [
    {name: '陈坤', phone: '18071104954'},
    {name: '成龙', phone: '18071104955'},
    {name: '陈赫', phone: '18071104956'},
    {name: '蔡成功', phone: '18071104957'},
    {name: '财大招生办', phone: '18071104958'},
    {name: '程咬金', phone: '18071104959'},
    {name: '陈慧琳', phone: '18071104960'}
  ],
  'D': [
    {name: '大舅', phone: '18071104961'},
    {name: '大娘', phone: '18071104962'},
    {name: '邓老师', phone: '18071104963'},
    {name: '戴不凡', phone: '18071104964'}
  ],
  'E': [
    {name: '二舅', phone: '18071104965'},
    {name: '二龙', phone: '18071104966'},
    {name: '二逼', phone: '18071104967'}
  ],
  'F': [
    {name: '范进', phone: '18071104968'},
    {name: '福叔', phone: '18071104969'},
    {name: '方世玉', phone: '18071104970'},
    {name: '房东', phone: '18071104971'}
  ],
  'H': [
    {name: '黄仲', phone: '18071104972'},
    {name: '韩梅梅', phone: '18071104973'},
    {name: '韩彩英', phone: '18071104974'},
    {name: '霍元甲', phone: '18071104975'}
  ]
}
var polyFill = {
  '厦门': 'XIA$MEN'
}
// var polyConf = {
//   '单': 'SHAN',
//   '盛': 'SHENG',
//   '区': 'OU',
//   '仇': 'QIU'
// }
// var polyFill = function (item) { // 如果需要处理将处理部分变为拼音其他部分作为汉字，如['SHAN', '雄信'] ['雄信', 'SHAN'] ['小关羽', 'SHAN', '雄信']
// // 整个API本计划将ploy处理变为结果不处理变为false，但是考虑到效率故设计为上述，本计划['SHAN', false, false]
//   if (polyConf[item[0]]) {
//     return [polyConf[item[0]], item.slice(1)]
//   }
//   return item
// }
import Dictionary from '../dictionary/index'
export default {
  components: {
    Dictionary
  },
  data () {
    return {
      data: {},
      dealData (cb, data) {
        var name = data.key === 'phone' ? 'phoneList' : 'cityList'
        var catchData = window.localStorage.getItem(name)
        var source = window.localStorage.getItem(name + 'source')
        if (catchData && source === JSON.stringify(data)) {
          console.log('from catch')
          return JSON.parse(catchData)
        } else {
          catchData = cb(data, polyFill)
          window.localStorage.setItem(name + 'source', JSON.stringify(data))
          window.localStorage.setItem(name, JSON.stringify(catchData))
          return catchData
        }
      }
    }
  },
  methods: {
    changeData () {
      if (this.data.key === 'cityId') {
        this.data = {
          key: 'phone',
          name: 'name',
          list: nameList
        }
      } else {
        this.data = {
          key: 'cityId',
          name: 'name',
          list: cityList
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.con{
  height: 5rem;
  overflow: hidden;
}
</style>
