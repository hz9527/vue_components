<template>
  <div class='page' @touchstart='touchStart' @touchmove='touchMove' @touchend='touchEnd' :style="{ 'transform': 'translate(0, ' + translate + 'px)' }">
    <div class="pull" v-show='translate > 0' :style="{'height': translate + 'px'}">
      <div v-show='!loadState'>
        <slot name='topPull'>
          <div class="pull-item">继续下拉刷新</div>
        </slot>
      </div>
      <div v-show='loadState'>
        <slot name='topLay'>
          <div class="pull-item">释放刷新</div>
        </slot>
      </div>
    </div>
    <div class="loading" v-show='loadingShow && catchState == "pullTop"'>
      <slot name='topLoad'>
        <div class="loading-more"></div>
      </slot>
    </div>
    <!-- <div :class="[translate > loadHeight ? 'arrow-top' : 'arrow-bottom']" ></div> -->
    <slot name='list'></slot>

    <div class="pull pull-bottom" v-show='translate < 0' :style="{'height': -translate + 'px'}">
      <div v-show='!loadState'>
        <slot name='bottomPull'>
          <div class="pull-item">继续上拉刷新</div>
        </slot>
      </div>
      <div v-show='loadState'>
        <slot name='bottomLay'>
          <div class="pull-item">释放刷新</div>
        </slot>
      </div>
    </div>
    <div ref='pullDown' class="loading" v-show='loadingShow && catchState == "pullDown"'>
      <slot name='bottomLoad'>
        <div class="loading-more"></div>
      </slot>
    </div>
    <!-- <div :class="[translate > loadHeight * -1 ? 'arrow-top' : 'arrow-bottom']" v-show='translate < 0'></div> -->
  </div>
</template>

<script type="text/babel">
export default {
  props: {
    type: {
      type: String,
      default: 'all'
    },
    loadingShow: {
      type: Boolean,
      default: false
    },
    loadHeight: {
      type: Number,
      default: 40
    },
    moveTime: {
      type: Number,
      default: 300
    },
    testTag: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    loadingShow (v) {
      if (!v) {
        this.catchState = ''
        this.bottomHeight = 0
      }
    }
  },
  data () {
    return {
      scrollTag: null,
      maxScroll: -1,
      touch: null,
      state: '',
      catchState: '',
      loadState: false,
      translate: 0,
      bottomHeight: 0,
      startTime: 0
    }
  },
  methods: {
    touchStart (e) {
      if (!this.catchState && e.touches.length === 1) {
        this.touch = e.touches[0]
        if (!this.scrollTag || this.testTag) {
          this.getTag()
        }
      }
    },
    touchMove (e) {
      if (this.state) {
        e.preventDefault()
        var height = e.touches[0].clientY - this.touch.clientY
        var coeff = Math.abs(height) > 10 ? 2 / Math.log(Math.abs(height)) : 1
        this.translate = height * coeff
        if (Math.abs(this.translate) > this.loadHeight) {
          this.loadState = true
        }
      } else if (this.touch && ((this.scrollTag.scrollTop <= 0 && this.type !== 'bottom') ||
        (this.type !== 'top' && this.scrollTag.scrollTop > 0))) {
        var moveX = e.touches[0].clientX - this.touch.clientX
        var moveY = e.touches[0].clientY - this.touch.clientY
        if (Math.abs(moveX) < Math.abs(moveY / 2)) {
          if (moveY > 0 && this.scrollTag.scrollTop <= 0) {
            this.initPull('pullTop', e.touches[0])
          } else if (moveY < 0) {
            if (this.scrollTag.scrollTop === this.maxScroll) {
              // this.touch = e.touches[0]
              // this.state = 'pullDown'
              this.initPull('pullDown', e.touches[0])
            } else {
              this.maxScroll = this.scrollTag.scrollTop
            }
          }
        }
      }
    },
    touchEnd (e) {
      if (this.loadState && Date.now() - this.startTime >= this.moveTime) {
        // emit event
        this.catchState = this.state
        this.$emit('loading', this.state)
        if (this.state === 'pullDown') {
          var that = this
          setTimeout(function () {
            that.bottomHeight = that.$refs.pullDown.offsetHeight
            that.scrollTag.scrollTop += that.bottomHeight
          }, 0)
        }
      }
      if (this.state) {
        this.state === 'pullDown' && (this.maxScroll = -1)
        this.touch = null
        this.state = ''
        this.loadState = false
        this.translate = 0
      }
    },
    getTag () {
      var target = this.$el
      var overFlow = ''
      while (target.scrollHeight === target.offsetHeight && target.nodeName !== 'BODY' && (overFlow !== 'auto' || overFlow !== 'scroll')) {
        if (overFlow) {
          target = target.parentNode
        }
        overFlow = window.getComputedStyle(target).overflow
      }
      this.scrollTag = target
    },
    initPull (type, touch) {
      this.touch = touch
      this.state = type
      this.startTime = Date.now()
    }
  }
}
</script>

<style lang='scss' scoped>
.page{
  font-size: 0.12rem;
  .loading-more{
    height: 40px;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4Rjk5NzcxMzNGNTUxMUU2QUFCM0EwMTIwOEUwQzFEQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4Rjk5NzcxNDNGNTUxMUU2QUFCM0EwMTIwOEUwQzFEQSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjhGOTk3NzExM0Y1NTExRTZBQUIzQTAxMjA4RTBDMURBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjhGOTk3NzEyM0Y1NTExRTZBQUIzQTAxMjA4RTBDMURBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+GU0vYwAAAVRJREFUeNqc0z8oxGEcx/Hf8TvDKYVkEImEhUWJMiiDxSDJn6QMBqNkYcBisJj8HWWySzcdm34xOUkYiEUkCkn+vL/1eeq6rt8533p1d7/r+dz3+T7PRYIg8FT1WEA33rGHSTx7IZWn1yYcYwBx9MDHqpelfL32ohAXGMMbZnCeLcB18IgTdGqxVRUeQtaWIOY6KMYg7vQ5og52QgKKrFsXsIgvvc/X3uswHNJ5A/pcgFtchm1UoAsvGRaXohajaPRTvmhVy1fowJOeR1GJarShQFsdwqsb4ggOkMQUppHAte6EhS7p1CxsXesufZ35Fk6VfJRyOlafOl4b9HzaduIWMKep2/7HM+w5qoGl1wfW7Jea9aDcy6027Sgt4NbLvW7QgjMLWPlHgHU7a/OxgGVN9eePi5O68gn3Z7JLNIEN9KMdNbowMdzrGA+xi318u7RfAQYAWx5EPl7vDJsAAAAASUVORK5CYII=") center no-repeat;
    background-size: 10px;
    position: relative;
    &:after{
      content:'';
      position: absolute;
      left: 50%;
      top: 50%;
      width: 20px;
      height: 20px;
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5MTE2MzE5NjNGNTUxMUU2ODYxQ0I3RkQyNjI5NzU2MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5MTE2MzE5NzNGNTUxMUU2ODYxQ0I3RkQyNjI5NzU2MyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjkxMTYzMTk0M0Y1NTExRTY4NjFDQjdGRDI2Mjk3NTYzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjkxMTYzMTk1M0Y1NTExRTY4NjFDQjdGRDI2Mjk3NTYzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+symMnAAAA/VJREFUeNrMmU1IVFEUx+9786Fl6URTkY1hJhWVophG1KYoUCPatMhFi4o2QYvaRYs+Fi2C9kGLoE0FLSpDQbJvyAZT0Az6oCS/iBJtaCadz/5H/49e46gzNj7fgT/3vefz3d879757zzmjtbS0qEzN5XI50NTH4/H9iUSiAirCuQet2+PxXMRxBApAw9Ag1AsNQIlM+3JmCLYJUOej0WgtYDwzPFO0CFoFbeb1n1A35Cd89gAB5gPYtUgkUotT8Z7SNG1Y13U/2hfQG1x6R4+FoRyoAFoBrYXWQ8ugXdAOqAN6AoX+G9DpdJ6Bxy7BY3k4jQPqJXQV1x+MjY3Fp/m3EDUEdcn7QD6oBtoCVbNtgt7OCRBec8Nr9wBXJ+eA6nE4HCfgxVe4rnB9YkJp6Y2U3NpHPZP5C5VAh6BigqZ8WX0auIJYLNYWjcUELgpvXQbUVoEz36epOdkP6CbUKM+GtkGHpdu0AMVzgGsFUKWuaUGcH4S3zqnsm8zbG1AQ2kBv6rMCAuw+VIWJH4Tn9sJrTWr+bMAEuZFDPz0ggE7De/tkHcNxA+Da1PybDPktrp0y3GUpAd1udyHgzsJzE3MOcI3KOuuHmnksXsybAohhvSJOxNfaiTl3QVlvsjZ+5gK/+x9AeK8UgDvhvd9YSk6phTNjuankQj8JiEX4OOAi8N7TcDjcvoCAMh97uFtVTwDm5ubqANwOwBAAr6daYS02P9tyWWrFg7KkuKB+AD5PvluzHlA+mBEoH1ojgBX03usZ9lYrTQbtE4+LBXA1ATuUfayPbaETcPkCCH2wEeB3tl44TncS8JuNAEfZLhG4hKx/6QSPFlqYbY7sHONYZhyQsqOJBwPQYobpUZtwudmOC+AoLyxFRha0CWAB2186txfFBMcuttLY+nQmNorZl12siO2gAH7hSenC7Gwq1e5ayuNenWF3gHlrkQ0AfWQRpgGde18X/1htA8AatsKU0E0hTozJtHcB4bxkiBlhlwEYYMitp8qsLLQ6MnQa9RtzVmfUSkoYclttlazhCMPjVGlniDmBkVn5LP4wjJFrNscFyYm7FHLaWYZosGg+etmXi9WG7tlqM/IG75mbHpWgcR7hCtlHHvtsSqd4JF/QXeijCbJqHuDkmcfYxwf2GUurusUyxG3TcB+AjmRpyL18ljzTyT7usM+p4dYMD5K3eagm68v1/MJOMm/1M/vKJIgsUn8LmDo/hObkOZcJoPnDkZLEHi4FZdQIs6+vjIikBj1uRMIMmbwMQkq5fRkv3s6lZNYoXvP7/ZkMTz69UM7jTCzA7Sv7RfSkTh5BrZJUQ+skbYWWE9htyimMnyGGGDHN6WeIPwIMAMkTSlorSEZwAAAAAElFTkSuQmCC");
      background-size: 100% 100%;
      margin: -10px 0 0 -10px;
      animation: loading 1s infinite linear;
    }
  }
  .pull{
    overflow: hidden;
    position:relative;
    // background: #3ee;
    .pull-item{
      // background: #f55;
      height: 0.2rem;
      text-align: center;
      position: absolute;
      bottom:0;
      left: 0;
      width:100%;
    }
  }
  .pull-bottom{
    .pull-item{
      top: 0;
    }
  }
  // .arrow-top{
  //   background: #f33;
  //   height: 40px;
  // }
  // .arrow-bottom{
  //   background: #0ee;
  //   height: 40px;
  // }
  @keyframes loading {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}

</style>
