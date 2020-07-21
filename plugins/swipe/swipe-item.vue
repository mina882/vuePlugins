<template>
  <div :class="{act:isAct}" :style="itemStyle">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "SwipeItem",
  data() {
    return {
      isAct: false,
      translate: 0,
      isTransition: false
    };
  },
  computed: {
    itemStyle() {
      let translateX = `translateX(${this.translate}px)`;
      let transition = this.isTransition
        ? `transform ${this.$parent.speed}ms ease-in-out`
        : null;
      return {
        transform: translateX,
        transition: transition
      };
    }
  },
  methods: {
    actItem(index) {
      let curIndex = this.$parent.curIndex;
      this.isAct = index == curIndex;
    },
    setTranslate(index) {
      //控制页面动画
      let parent = this.$parent;
      let [pageWidth, pageSize, curIndex, direction, disX] = [
        parent.pageWidth,
        parent.pageSize,
        parent.curIndex,
        parent.direction,
        parent.disX
      ];
      let prevIndex = curIndex == 0 ? pageSize - 1 : curIndex - 1;

      if (pageSize == 2) {
        //两页面切换
        if (!direction) return false;
        if (index == curIndex) {
          let setdir = direction == 1 ? -1 : 1;
          this.translate = setdir * pageWidth + disX;
        }
        if (index == prevIndex) {
          this.translate = disX;
        }
        setTimeout(() => {
          this.isTransition = true;
          this.setTransition(direction);
          if (index == curIndex) {
            this.translate = 0;
          }
          if (index == prevIndex) {
            let setdir = direction == 1 ? -1 : 1;
            this.translate = -setdir * pageWidth;
          }
        }, 50);
      } else {
        //多页面切换
        let nextIndex = curIndex == pageSize - 1 ? 0 : curIndex + 1;
        if (index == curIndex) {
          this.translate = 0;
          if (direction) {
            this.isTransition = true;
          }
        }
        if (index == prevIndex) {
          this.translate = -pageWidth;
          direction == 2 && (this.isTransition = true);
        }
        if (index == nextIndex) {
          this.translate = pageWidth;
          direction == 1 && (this.isTransition = true);
        }
        this.setTransition(direction);
      }
    },
    touchMoveSwipe(index, disX) {
      let parent = this.$parent;
      let [pageWidth, pageSize, curIndex] = [
        parent.pageWidth,
        parent.pageSize,
        parent.curIndex,
        parent.direction
      ];
      //滑动页面时处理
      let prevIndex = curIndex == 0 ? pageSize - 1 : curIndex - 1;
      let nextIndex = curIndex == pageSize - 1 ? 0 : curIndex + 1;
      this.isTransition = false;
      if (index == curIndex) {
        this.translate = disX;
      }
      if (disX < 0) {
        let prevId = pageSize == 2 ? prevIndex : nextIndex;
        if (index == prevId) {
          this.translate = pageWidth + disX;
        }
      } else {
        if (index == prevIndex) {
          this.translate = -pageWidth + disX;
        }
      }
    },
    touchEndSwipe(index) {
      let parent = this.$parent;
      let [pageWidth, pageSize, curIndex, direction] = [
        parent.pageWidth,
        parent.pageSize,
        parent.curIndex,
        parent.direction
      ];
      let prevIndex = curIndex == 0 ? pageSize - 1 : curIndex - 1;
      let nextIndex = curIndex == pageSize - 1 ? 0 : curIndex + 1;
      //若小于页面宽度一半就返回原页
      this.isTransition = true;
      if (index == curIndex) {
        this.translate = 0;
      }
      if (pageSize == 2) {
        let reverse = direction == 1 ? -1 : 1;
        if (index == prevIndex) {
          this.translate = reverse * pageWidth;
        }
      } else {
        if (index == nextIndex) {
          this.translate = pageWidth;
        }
        if (index == prevIndex) {
          this.translate = -pageWidth;
        }
      }
      this.setTransition(direction);
    },
    setTransition(direction) {
      //处理transition
      let setTime = null;
      if (!direction) return false;
      clearTimeout(setTime);
      setTime = setTimeout(() => {
        this.isTransition = false;
        this.$parent.isMove = true;
        this.$parent.endFlag = false;
      }, this.$parent.speed);
    }
  }
};
</script>