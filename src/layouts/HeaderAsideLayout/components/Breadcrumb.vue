<template>
  <el-row class="pd-l-25" type="flex" align="middle">
    <span class="iconfont icon-buoumaotubiao23"></span>
    <span class="font14">当前位置：</span>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: currentPath, query }"><span class="pointer normal" @click="clear">{{ currentName }}</span></el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: childPath, query }" v-if="sonName"><span class="pointer normal" @click="clear">{{ childName }}</span></el-breadcrumb-item>
      <el-breadcrumb-item v-if="childName && !sonName">{{ childName }}</el-breadcrumb-item>
      <el-breadcrumb-item v-if="sonName">{{ sonName }}</el-breadcrumb-item>
    </el-breadcrumb>
  </el-row>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'

  export default {
    name: 'Breadcrumb',
    computed: {
      ...mapState(['currentName', 'currentPath', 'childName', 'query','sonName','childPath'])
    },
    methods: {
      ...mapMutations(['clearChild']),
      clear() {
        this.clearChild()
      }
    }
  }
</script>

<style scoped lang="scss">
  span {
    color: #303133;
  }
  /deep/.el-breadcrumb {
    margin: 0;
    font-size: 14px !important;
    color: #303133 !important;
    /deep/.el-breadcrumb__item:last-child .el-breadcrumb__inner, .el-breadcrumb__item:last-child .el-breadcrumb__inner a, .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover, .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover {
      font-size: 14px !important;
      color: #303133 !important;
      font-weight: normal !important;
    }
  }
</style>