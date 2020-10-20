<template>
  <el-dialog title="查看图片123" :visible.sync="modalStatus" :width="imgWidth" center :close-on-click-modal="false" @close="closeModalFn">
    <el-carousel class="center" :initial-index="imagesInx" :height="imgHeight + 'px'" ref="carousel" trigger="click" indicator-position="outside" :autoplay="false" @change="changeImages">
      <el-carousel-item name="index" v-for="(item, index) in imageArray" :key="index">
        <img ref="imgItem" :src="item" @load="imgLoad()">
      </el-carousel-item>
    </el-carousel>
  </el-dialog>
</template>

<script>
export default {
  name: 'carousel',
  props: {
    imageStatus: Boolean,
    imageArray: Array,
    imagesInx: Number
  },
  data () {
    return {
      imgWidth: '',
      imgHeight: '',
    }
  },
  computed: {
    modalStatus: {
      get () {
        return this.imageStatus
      },
      set (newValue) {
        return newValue
      }
    }
  },
  methods: {
    closeModalFn () {
      this.$emit('closeImageModal')
    },
    imgLoad () {
      this.imgWidth = this.$refs.imgItem[this.imagesInx].width.toString()
      this.imgHeight = this.$refs.imgItem[this.imagesInx].height.toString()
    },
    changeImages (val) {
      this.imgWidth = this.$refs.imgItem[val].width.toString()
      this.imgHeight = this.$refs.imgItem[val].height.toString()
    },
  }
}
</script>

<style lang="css" scoped>
  .center {
    text-align: center;
  }
</style>
