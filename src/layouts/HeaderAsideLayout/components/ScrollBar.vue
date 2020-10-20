<template>
  <div class="scroll-container" :class="mouseIn ? 'scroll-normal' : 'scroll-mini'" ref="scrollContainer" @wheel.prevent="handleScroll" @mouseenter="handleMouseIn">
    <div class="scroll-wrapper" ref="scrollWrapper" :style="{top: top + 'px'}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import EventBus from 'js/eventbus'

const delta = 15;

export default {
  name: 'ScrollBar',
  data() {
    return {
      top: 0,
      mouseIn: false
    };
  },
  methods: {
    handleMouseIn () {
      this.mouseIn = true
      EventBus.$emit('mouseIn')
    },
    handleMouseOut () {
      this.mouseIn = false
      EventBus.$emit('mouseOut')
    },
    handleScroll(e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 3;
      const $container = this.$refs.scrollContainer;
      const $containerHeight = $container.offsetHeight;
      const $wrapper = this.$refs.scrollWrapper;
      const $wrapperHeight = $wrapper.offsetHeight;
      if (eventDelta > 0) {
        this.top = Math.min(0, this.top + eventDelta);
      } else if ($containerHeight - delta < $wrapperHeight) {
        if (this.top < -($wrapperHeight - $containerHeight + delta)) {
          this.top = this.top;
        } else {
          this.top = Math.max(this.top + eventDelta, $containerHeight - $wrapperHeight - delta);
        }
      } else {
        this.top = 0;
      }
    },
  },
  mounted() {
    EventBus.$on('hideMenu', () => {
      this.handleMouseOut()
    })
  }
};
</script>

<style lang="scss" scoped>
.scroll-container {
  height: 100%;
  background-color: #00142a;
  .scroll-wrapper {
    position: absolute;
    width: 100%;
  }
}

.scroll-normal {
  width: 200px;
}
.scroll-mini {
  width: 64px;
}
</style>
