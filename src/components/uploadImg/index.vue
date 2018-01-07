<template lang="html">
  <div class="upload-con">
    <div class="choose-img" v-show='state === 0'>
      <div class="btn btn-line file-btn">
        请选择图片
        <slot>
          <input type="file" :accept='acceptObject.accept' @change='chooseFile' ref='file' />
        </slot>
      </div>
    </div>
    <div class="btn btn-line" v-show='hasPaste'>粘贴图片</div>
    <div class="choosed-img" v-show='state !== 0'>
      <div class="con-left">
        <img :src="src" alt="加载失败" />
      </div>
      <div class="con-right">
        <div class="btn btn-line" v-show='state === 2'>上传图片</div>
        <div class="btn btn-line" v-show='state === 4'>复制图片</div>
        <div class="btn btn-line" v-show='state === 2 || state === 4'>删除</div>
      </div>
    </div>
  </div>
</template>

<script>
import {addImg} from './utils'
export default {
  props: { // maxSize size load hasPaste img
    name: { // group name is required
      type: String,
      default: 'uploadImg'
    },
    group: {
      type: [Boolean, String],
      default: true // String will as module false will not cache
    },
    maxSize: {
      type: Number,
      default: 100000 // 100kb 0
    },
    size: {
      type: [Object, Function],
      default () {
        return null // check if function arg is width height null {width, height}
      }
    },
    load: Object, // required
    hasPaste: {
      type: Boolean,
      default: false
    },
    img: {
      type: String,
      default: ''
    },
    acceptObject: {
      type: Object,
      default () {
        return {
          accept: '.png, .jpg, .jpeg',
          check (name) {
            return /\.(png|jpg|jpeg)/.test(name)
          }
        }
      }
    }
  },
  data () {
    return {
      src: '', // base64 or url
      state: 0 // 0 none 1 parse file 2 loac 3 loading 4 loaded
    }
  },
  watch: {
    img: {
      immediate: true,
      handler (src) {
        if (this.acceptObject.check(src)) {
          this.addImg(src, true)
        }
      }
    }
  },
  methods: {
    chooseFile (e) {
      if (this.state === 0 && e.target.files && e.target.files[0]) {
        let file = e.target.files[0]
        if (this.maxSize && file.size > this.maxSize) {
          // emit warn
        } else {
          this.addImg(file)
        }
      } else {
        // emit warn
      }
    },
    addImg (file, isUrl = false) {
      this.state = 0
      addImg(this.group, this.name, file, this.size, isUrl)
        .then(res => {
          if (this.$refs.file) {
            this.$refs.file.value = ''
          } else {
            // solt emit clean input
          }
          if (res.code === 0) {
            this.state = res.data.isUrl ? 4 : 2
            this.src = res.data.src
          } else {
            this.state = 0
            // emit res.msg
          }
          console.log(res)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-con {
  display: inline-block;
  width: 150px;
  height: 80px;
  .btn {
    display: inline-block;
    padding: 5px 10px;
    cursor: pointer;
    text-align: center;
    border-radius: 3px;
  }
  .btn-line {
    border: 1px solid #ccc;
  }
  .file-btn {
    position: relative;
    input[type='file'] {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
}
</style>
