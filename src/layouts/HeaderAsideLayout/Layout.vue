<template>
  <div class="app-wrapper" >
    <nav-bar></nav-bar>
    <side-bar class="sidebar-container"></side-bar>
    <div class="main-container" @click="hideMenuFn">
      <app-main></app-main>
    </div>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
import { NavBar, SideBar, AppMain } from './components';
import EventBus from 'js/eventbus';

export default {
  name: 'layout',
  components: {
    NavBar,
    SideBar,
    AppMain,
  },
  methods: {
    hideMenuFn() {
      EventBus.$emit('hideMenu')
    }
  }
};
</script>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  &:after {
    content: "";
    display: table;
    clear: both;
  }
}

.main-container {
  margin-left: 64px;
  min-height: 100vh;
  transition: margin-left 0.2s;
  background-color: #f0f2f5;
}
.el-backtop {
  right: 15px!important;
}
</style>
