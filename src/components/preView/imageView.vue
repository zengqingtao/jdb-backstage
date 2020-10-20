<template>
  <div class="mask">
    <div class="img-box">
      <img :src="previewList[index]" :style="imgStyle" />
    </div>
    <div class="actions">
      <div class="action-bottom">
        <i class="el-icon-arrow-left icon" v-if="isArrow" @click="changeImgIndex(0)"></i>
        <i class="el-icon-arrow-right icon" v-if="isArrow" @click="changeImgIndex(1)"></i>
        <i class="el-icon-zoom-out icon" @click="handleActions('zoom-out')"></i>
        <i class="el-icon-zoom-in icon" @click="handleActions('zoom-in')"></i>
        <i class="el-icon-c-scale-to-original icon" @click="handleActions('zoom-recovery')"></i>
        <i class="el-icon-close icon" @click="close"></i>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      scale: 1,
      index: this.currentIndex,
      wheelName: ""
    };
  },
  props: {
    previewList: {
      type: Array,
      default: () => []
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    changeImgIndex(flag) {
      if (flag) {
        this.index === this.previewList.length - 1
          ? (this.index = 0)
          : this.index++;
      } else {
        this.index === 0
          ? (this.index = this.previewList.length - 1)
          : this.index--;
      }
    },
    handleActions(tag, rate = 0.2) {
      const action = {
        "zoom-out": () => {
          if (this.scale < 0.6) return;
          this.scale = Number(this.scale - rate);
        },
        "zoom-in": () => {
          this.scale = Number(this.scale + rate);
        },
        "zoom-recovery": () => {
          if ((this.scale = 1)) return;
          this.scale = 1;
        }
      };
      action[tag]();
    },
    handleScroll(e) {
      const delta = e.wheelDelta ? e.wheelDelta : -e.detail;
      if (delta > 0) {
        this.handleActions("zoom-in", 0.15);
      } else {
        this.handleActions("zoom-out", 0.15);
      }
    },
    isFirefox() {
      return window.navigator.userAgent.match(/firefox/i);
    },
    close() {
      this.$emit("closeModel");
    },
    throttle(func, wait) {
      var context, args;
      var previous = 0;
      return function() {
        var now = +new Date();
        context = this;
        args = arguments;
        if (now - previous > wait) {
          func.apply(context, args);
          previous = now;
        }
      };
    }
  },
  computed: {
    isArrow() {
      return this.previewList.length > 1;
    },
    imgStyle() {
      const style = {
        transform: `scale(${this.scale})`,
        transition: "transform .3s"
      };
      return style;
    }
  },
  mounted() {
    this.wheelName = this.isFirefox() ? "DOMMouseScroll" : "mousewheel";
    window.addEventListener(this.wheelName, this.throttle(this.handleScroll,200), false);
  },
  destroyed() {
    window.removeEventListener(this.wheelName, this.handleScroll);
  }
};
</script>
<style lang="scss" scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  .img-box {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
  .actions {
    left: 50%;
    bottom: 30px;
    transform: translateX(-50%);
    width: 282px;
    height: 44px;
    padding: 0 23px;
    background-color: #606266;
    border-color: #fff;
    border-radius: 22px;
    position: absolute;
    .action-bottom {
      width: 100%;
      height: 100%;
      text-align: justify;
      cursor: default;
      font-size: 23px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
    .icon {
      cursor: pointer;
    }
  }
  .arrow-left {
    left: 30px;
  }
  .arrow-right {
    right: 30px;
  }
}
</style>