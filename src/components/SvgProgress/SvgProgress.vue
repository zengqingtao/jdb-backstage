<template>
  <div class="container">
    <svg height="250" width="250">
      <circle cx="120" cy="120" r="70" fill="none" stroke="grey" stroke-width="20" stroke-linecap="round"></circle>
      <circle ref="circle" class="circle" id="J_demo2" cx="55" cy="55" r="70" fill="none" stroke="#0a9afe" stroke-width="20" stroke-dasharray="0,10000"></circle>
    </svg>
    <div class="title">
      <p>{{ title }}</p>
      <p>占比{{ circleValue }}</p>
    </div>
    <div class="font14 content" @click="LoadTableFn(title)">{{ content }}</div>
  </div>
</template>

<script>
export default {
  name: 'SvgProgress',
  props: {
    title: String,
    content: String,
    circleValue: String,
  },
  methods: {
    rotateCircle () {
      let val = parseFloat(this.circleValue).toFixed(2)
      let circleLength = Math.floor(2 * Math.PI * this.$refs.circle.getAttribute('r'))
      val = Math.max(0, val)
      val = Math.min(100, val)
      this.$refs.circle.setAttribute('stroke-dasharray','' + circleLength * val / 100 + ',10000')
    },
    LoadTableFn (title) {
      this.$emit('LoadTableFn', title)
    }
  },
  mounted () {
    this.rotateCircle()
  }
}
</script>

<style lang="scss" scoped>
  .container {
    width: 250px;
    height: 250px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .circle{
      transform-origin: 120px 55px;
      transform: rotate(-90deg);
      transition: stroke-dasharray .3s ease-in;
    }
    .title {
      width: 150px;
      height: 70px;
      position: absolute;
      top: 15px;
      left: 0;
      right: 10px;
      bottom: 0;
      margin: auto;
      p {
        font-size: 16px;
        margin: 9px 0;
        text-align: center;
        &:first-child {
          font-weight: bold;
        }
      }
    }
    .content {
      margin-top: -30px;
      text-align: center;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>