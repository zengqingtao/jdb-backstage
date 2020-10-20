<template>
  <div class="v-preview">
    <div @click="showPreview($event)" class="slot-box" ref="slot-box">
      <slot>
        <el-image :src="previewList[currentIndex]" alt />
      </slot>
    </div>
    <img-view
      v-if="previewList.length && previewToggle"
      :currentIndex="currentIndex"
      :previewList="previewList"
      @closeModel='previewToggle=false'
    ></img-view>
  </div>
</template>
<script>
import imgView from "./imageView";
export default {
  components: {
    imgView
  },
  data() {
    return {
      previewToggle: false,
      currentIndex: 0
    };
  },
  props: {
    previewList: {
      type: Array,
      default: () => []
    },
  },
  watch:{
    previewToggle:{
      immediate: true,
      handler(val){
        val ? document.body.classList.add('ban-scroll') : document.body.classList.remove('ban-scroll')
      }
    }
  },
  methods: {
    showPreview(e) {
      if(e.srcElement.tagName === 'IMG') {
        this.currentIndex = this.previewList.findIndex(item=> item === e.srcElement.src)
      }
      this.previewToggle = true;
    },
  }
};
</script>
<style lang="scss">
.v-preview {
  display: flex;
  justify-content: center;
  .slot-box {
    cursor: pointer;
    width: 100%;
  }
}
.ban-scroll{
  overflow: hidden!important;
}
</style>