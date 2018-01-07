<template lang="html">
  <div class="page">
    <div class="hz-head">
      <router-link to="/">&lt;  index</router-link>
    </div>
    <Upload class='upload' :load='load' name='test1'
      :img='test1Img'/>
    <Upload class='upload' :load='load' name='test2'
      :maxSize='10000000'
      :img='test2Img'/>
  </div>
</template>

<script>
import Upload from '../../components/uploadImg/index'
// https://img.alicdn.com/bao/uploaded/TB1qimQIpXXXXXbXFXXSutbFXXX.jpg
const Load = {
  type: 'file', // file or base64
  handler (file) {
    return 'test'
  }
}
export default {
  data () {
    return {
      load: Load,
      test1Img: '',
      test2Img: ''
    }
  },
  mounted () {
    setTimeout(() => {
      this.test2Img = '//img.alicdn.com/bao/uploaded/TB1qimQIpXXXXXbXFXXSutbFXXX.jpg'
    })
  },
  components: {Upload}
}
</script>

<style lang="scss" scoped>
@import '../common_style/common.scss';
.upload {
  margin: 5px;
}
</style>
