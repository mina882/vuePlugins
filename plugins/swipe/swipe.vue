<template>
  <div
    class="swipe-wrap"
    @touchstart="touchStartSwipe($event)"
    @touchmove="touchMoveSwipe($event)"
    @touchend="touchEndSwipe($event)"
  >
    <slot></slot>
    <template v-if="swipeButton&&pageSize>1">
      <button
        class="left"
        @touchstart.stop="directionHandle(1)"
        @touchend.stop="touchendButtonHandle(1)"
        @mousedown.stop="directionHandle(1)"
        @mouseup.stop="touchendButtonHandle(1)"
      >&lt;</button>
      <button
        class="right"
        @touchstart.stop="directionHandle(2)"
        @touchend.stop="touchendButtonHandle(2)"
        @mousedown.stop="directionHandle(1)"
        @mouseup.stop="touchendButtonHandle(2)"
      >&gt;</button>
    </template>
    <div class="indicator">
      <span :style="{width:perWidth}"></span>
    </div>
  </div>
</template>
<style lang="less" scoped>
.transform-none {
  -webkit-transform: none;
  transform: none;
}
.swipe-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  & > div {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    transform: translateX(-100%);
    -webkit-transform: translateX(-100%);
    &.act {
      z-index: 1;
    }
    &.indicator {
      width: 50%;
      top: auto;
      bottom: 2%;
      left: 25%;
      height: 5px;
      background: rgba(255, 255, 255, 0.4);
      z-index: 100;
      .transform-none();
      span {
        position: absolute;
        top: 0;
        left: 0;
        width: 30%;
        height: 100%;
        background: #fff;
        transition: width 1s;
      }
    }
    &.act,
    &:first-child {
      .transform-none();
    }
  }
  button {
    @butdis: 5%;
    position: absolute;
    top: 50%;
    left: @butdis;
    transform: translateY(-50%);
    width: 30px;
    height: 30px;
    border-radius: 30px;
    background: rgba(255, 255, 255, 0.8);
    border: 0;
    z-index: 2;
    &.right {
      left: auto;
      right: @butdis;
    }
  }
}
</style>
<script>
export default {
  name: "swipe",
  props: {
    startIndex: {
      type: Number,
      default: 0
    },
    loop: {
      type: Boolean,
      default: false
    },
    swipeButton: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      swipeItem: [],
      pageSize: 0,
      pageWidth: 0,
      curIndex: this.startIndex,
      pages: [],
      speed: 500,
      isMove: true,
      setInter: null,
      startX: 0,
      moveX: 0,
      disX: 0,
      direction: 0,
      lastTime: Date.now(),
      stopLoop: true,
      endFlag: false
    };
  },
  computed: {
    perWidth() {
      return Math.round(((this.curIndex + 1) / this.pageSize) * 100) + "%";
    }
  },
  methods: {
    initPage() {
      this.pages = this.$children.filter(
        child => child.$options.name === "SwipeItem"
      );
      this.pageSize = this.pages.length;
      this.pageWidth = this.$el.offsetWidth;
      //切换swipe
      this.swipeData();
    },
    swipeData() {
      //切换页面
      this.pages.forEach((child, index) => {
        child.actItem(index);
        child.setTranslate(index);
      });
    },
    directionHandle(direction) {
      this.isSwipeLoop(false); //暂时停止循环
      this.disX = 0;
      this.direction = direction;
      this.swipedDirection();
    },
    swipedDirection() {
      //direction表示移动方向，1为左，2为右
      if (!this.isMove) return false;
      this.isMove = false;
      if (this.direction == 1) {
        //向左滑动
        this.curIndex--;
        if (this.curIndex < 0) this.curIndex = this.pageSize - 1;
      } else {
        //向右滑动
        this.curIndex++;
        if (this.curIndex >= this.pageSize) this.curIndex = 0;
      }
      this.swipeData();
    },
    swipeLoop() {
      //循环播放页面
      if (!this.stopLoop) return false;
      let nowTime = Date.now();
      if (nowTime - this.lastTime >= this.speed * 2) {
        this.swipedDirection();
        this.lastTime = nowTime;
      }
      this.requsetTime = requestAnimationFrame(this.swipeLoop);
    },
    isSwipeLoop(loopFlag) {
      //是否循环播放页面
      if (this.loop) {
        this.stopLoop = loopFlag;
        loopFlag && this.swipeLoop();
      }
    },
    touchendButtonHandle() {
      //点击按钮切换动画
      this.isSwipeLoop(true);
    },
    touchStartSwipe(evt) {
      //开始滑动页面
      if (this.endFlag) return false;
      this.isSwipeLoop(false);
      let touches = evt.targetTouches[0];
      this.startX = touches.pageX;
      this.disX = 0;
    },
    touchMoveSwipe(evt) {
      //手指滑动页面
      if (this.endFlag) return false;
      let touches = evt.targetTouches[0];
      this.moveX = touches.pageX;
      this.disX = this.moveX - this.startX;
      this.pages.forEach((child, index) => {
        child.touchMoveSwipe(index, this.disX);
      });
    },
    touchEndSwipe() {
      //结束滑动页面
      this.endFlag = true;
      this.direction = this.disX > 0 ? 1 : 2;
      if (Math.abs(this.disX) >= Math.round(this.pageWidth / 3)) {
        //若大于等于页面宽度一半就翻页
        this.swipedDirection();
      } else {
        this.pages.forEach((child, index) => {
          child.touchEndSwipe(index);
        });
      }
      this.isSwipeLoop(true);
    },
    resizePage() {
      //更改窗口尺寸时
      window.addEventListener("resize", () => {
        this.$nextTick(() => {
          this.pageWidth = this.$el.offsetWidth;
          this.swipeData();
        });
      });
    }
  },
  mounted() {
    this.initPage();
    //是否需要循环页面
    if (this.loop) {
      this.direction = 2;
      this.swipeLoop();
    }
    this.resizePage();
  }
};
</script>