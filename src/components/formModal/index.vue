<template>
  <transition name='modal'>
    <div class="modal" v-show='showModal' :style="{'height': height + 'px', 'top': top + 'px'}" @touchstart='touchStart' @touchmove='touchMove' @touchend='touchEnd'>
      <div class="modal-bg" data-stop='true'></div>
      <div class="modal-content" data-stop='true'>
        <div class="modal-body" data-move='true'>
          <slot name='modalHead'>
            <div class="modal-head" v-if='headText'>{{headText}}</div>
          </slot>
          <slot name='modalBody'>{{text}}</slot>
        </div>
        <div class="modal-foot" data-stop='true'>
          <div :class="['btn', index < btns.length - 1 ? 'left-border' : '']" v-for='(item, index) in btns' @click='exec(index)'>
            {{item.text}}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'modal',
    props: {
      text: String,
      headText: String,
      show: {
        type: Boolean,
        default: false
      },
      btns: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        height: 0,
        top: 0,
        touch: null,
        scrollTraget: null
      }
    },
    computed: {
      showModal () {
        if (this.show) {
          this.top = document.body.scrollTop
        }
        return this.show
      }
    },
    methods: {
      exec (index) {
        this.$emit(this.btns[index].eventName, this.btns[index].arg)
      },
      touchStart (e) {
        if (e.touches.length === 1 && this.getScroll(e.target)) {
          this.touch = e.touches[0]
        }
      },
      touchMove (e) {
        if (this.touch) {
          // 判断方向
          var moveY = e.touches[0].clientY - this.touch.clientY
          if ((moveY > 0 && this.scrollTraget.scrollTop === 0) ||
            (moveY < 0 && (this.scrollTraget.scrollTop === this.scrollTraget.scrollHeight - Number.parseFloat(window.getComputedStyle(this.scrollTraget).height)))) {
            e.preventDefault()
          }
        } else {
          e.preventDefault()
        }
      },
      touchEnd () {
        if (this.touch) {
          this.touch = null
          this.scrollTraget = null
        }
      },
      getScroll (target) {
        if (target.dataset.stop) {
          return false
        } else {
          var t = target
          var overflow = ''
          while (!t.dataset.move && overflow !== 'auto' && overflow !== 'scroll') {
            if (overflow) {
              t = t.parentNode
            }
            overflow = window.getComputedStyle(t).overflow
          }
          this.scrollTraget = t
          return !t.dataset.move
        }
      }
    },
    created () {
      this.height = window.innerHeight
    }
  }

</script>

<style lang=scss scoped>
  $bg : rgba(0,0,0,0.5);
  $fontColor: #292d33;
  $borderColor: #e0e0e0;
  $btnColor: #e6454a;
  $btnActiveColor: #f5f7fa;

  $zIndex : 100;
  $borderRadius: 2px;
  $titFontSize: 0.17rem;
  $bodyFontSize: 0.13rem;
  $btnFontSize: 0.16rem;
  $padding: 0.2rem;
  $btnHeight: 0.44rem;
  $headMargin: 0.15rem;
  $lineHeight: 0.17rem;

  @mixin border{
    position:relative;
    &:after{
      content:'';
      position:absolute;
      background: $borderColor;
      transform: scale(0.5) translate(-50%, -50%);
    }
  }
  @mixin border-bottom{
    @include border;
    &:after{
      width:200%;
      height:1px;
      bottom:0;
      left:0;
    }
  }
  @mixin border-left{
    @include border;
    &:after{
      width:1px;
      height:200%;
      top:0;
      right:0;
    }
  }
  .modal-enter-active, .modal-leave-active {
    transition: all .5s;
    .modal-content{
      transition: top .5s ease;
    }
    .modal-bg{
      transition: opacity .3s linear .2s;
    }
  }

  .modal-enter{
    .modal-bg{
      opacity: 0;
    }
    .modal-content{
      top: -50%;
    }
  }

  .modal-leave-active {
    .modal-bg{
      opacity: 0;
    }
    .modal-content{
      top: 150%;
    }
  }
  .modal{
    position: absolute;
    /*top:0;*/
    left:0;
    z-index: $zIndex;
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .modal-bg{
    position: fixed;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    background-color: $bg;
  }
  .modal-content{
    position: absolute;
    top: 50%;
    left: 50%;
    width:72%;
    transform: translate(-50%,-50%);
    background: #fff;
    border-radius: $borderRadius;
    font-size: $bodyFontSize;
    text-align: center;
    .modal-body{
      padding: $padding;
      @include border-bottom;
      line-height: $lineHeight;
      .modal-head{
        margin-bottom:$headMargin;
        font-size: $titFontSize;
      }
    }
    .modal-foot{
      height: $btnHeight;
      line-height: $btnHeight;
      font-size: $btnFontSize;
      display: flex;
      .btn{
        color: $btnColor;
        flex:1;
        &:active{
          background: $btnActiveColor;
        }
      }
      .left-border{
        @include border-left;
      }
    }
  }
</style>
