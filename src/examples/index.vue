<template lang="html">
  <div class="page">
    <p class='head'>examples</p>
    <div class="content">
      <router-link class='item' v-for='item in list' :key='item.name' :to='item.path' tag='div'>
        {{item.name}} <b class='arrow'></b>
      </router-link>
    </div>
    <div class="foot">
      &copy; 2016-2017 By hz9527
    </div>
  </div>
</template>

<script>
import {routes} from '../router'
export default {
  data () {
    return {
      list: []
    }
  },
  created () {
    routes.forEach(item => {
      if ('name' in item && item.name !== 'index' && item.path.indexOf('*') === -1) {
        this.list.push(
          {
            path: item.path,
            name: item.name
          }
        )
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.page {
  height: 100%;
  font-size: 15px;
  color: #333;
  display: flex;
  flex-direction: column;
}
.head, .foot {
  flex-grow: 0;
  flex-shrink: 0;
}
.content {
  flex: 1;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  border-bottom: 1px solid #ccc;
  border-top: 1px solid #ccc;
}
.head {
  padding: 0;
  margin: 0;
  height: 0.4rem;
  line-height: 0.4rem;
  text-align: center;
}
.foot {
  height: 0.3rem;
  line-height: 0.3rem;
  text-align: center;
  background: #333;
  color: #fff;
}
.item {
  height: 0.5rem;
  line-height: 0.5rem;
  border-bottom: 1px solid #f55;
  padding: 0 0.15rem;
  box-sizing: border-box;
  b {
    float: right;
    margin-top: 0.2rem;
  }
}
.arrow {
  display: inline-block;
  width: 0.09rem;
  height: 0.09rem;
  border-top: 1px solid #ccc;
  border-right: 1px solid #ccc;
  transform: rotate(45deg);
}
</style>
