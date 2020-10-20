<template>
  <section class="app-main">
    <Breadcrumb></Breadcrumb>
    <transition name="fade" mode="out-in">
      <!-- <router-view :key="key"></router-view> -->
      <router-view></router-view>
    </transition>
  </section>
</template>

<script>
import Breadcrumb from './Breadcrumb'

export default {
  name: 'AppMain',
  components: { Breadcrumb }
};
</script>

<style lang="scss">
  .app-main {
    margin-top: 100px;
    padding-bottom: 20px;
  }
</style>
