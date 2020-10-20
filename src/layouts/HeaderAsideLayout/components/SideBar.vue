<template>
  <scroll-bar>
    <div class="logo">
      <img src="../../../assets/img/logo.png" />
    </div>
    <el-menu
      :unique-opened="onlyOpened"
      mode="vertical"
      :show-timeout="200"
      text-color="hsla(0, 0%, 100%, .65)"
      active-text-color="#409EFF"
      :default-active="active"
      :collapse="!collapse"
    >
      <template v-for="(item, index) in this.newMenu">
        <router-link v-if="!item.children" :to="item.path" :key="item.name">
          <el-menu-item @click="saveActive" :index="index.toString()">
            <i v-if="item.icon" :class="item.icon"></i>
            <span v-if="item.name" slot="title">{{item.name}}</span>
          </el-menu-item>
        </router-link>

        <el-submenu v-else :index="index.toString()" :key="item.name" :show-timeout="9999999999999">
          <template slot="title">
            <i v-if="item && item.icon" :class="item.icon"></i>
            <span v-if="item && item.name" slot="title">{{item.name}}</span>
          </template>
          <template v-for="(child, i) in item.children" v-if="!child.hidden">
            <router-link :to="item.path + child.path" :key="child.name">
              <el-menu-item
                @click="saveActive($event); linkFn(child.name, item.path, child.path)"
                :index="`${index.toString()}-${i.toString()}`"
              >
                <span v-if="child && child.name" slot="title">{{child.name}}</span>
              </el-menu-item>
            </router-link>
          </template>
        </el-submenu>
      </template>
    </el-menu>
  </scroll-bar>
</template>

<script>
import ScrollBar from './ScrollBar'
import { mapState, mapMutations } from 'vuex'
import EventBus from 'js/eventbus'

export default {
  components: { ScrollBar },
  name: 'SideBar',
  data() {
    return {
      collapse: false,
      onlyOpened: true,
      active: '' // 默认选中
    }
  },
  computed: {
    ...mapState(['jdb_asideMenuConfig']),
    newMenu() {
      return this.jdb_asideMenuConfig.filter((item) => item.name !== '搜索书生')
    }
  },
  methods: {
    ...mapMutations(['initBreadcrumb', 'clearChild']),
    saveActive(obj) {
      console.log('saveActive', obj)
      this.active = obj.index
    },
    linkFn(name, parentPath, childPath) {
      const path = parentPath + childPath
      let current = { name, path }
      this.initBreadcrumb(current)
      this.clearChild()
    },
    //面包屑和左侧路由激活
    initBaseSideBar() {
      let that = this
      const currentRoute = this.$router.currentRoute.path
      if (this.jdb_asideMenuConfig && this.jdb_asideMenuConfig.length > 0) {
        this.jdb_asideMenuConfig.forEach((item, index) => {
          if (item.children && item.children.length > 0) {
            item.children.forEach((data, i) => {
              if (currentRoute === item.path + data.path) {
                let currentName = item.children.filter(
                  (child) => child.path === data.path
                )
                let current = {
                  name: currentName[0].name,
                  path: currentRoute
                }
                this.initBreadcrumb(current)
                that.active = `${index}-${i}`
              }
            })
          } else {
            if (currentRoute === item.path) {
              let current = {
                name: item.name,
                path: currentRoute
              }
              this.initBreadcrumb(current)
              that.active = `${index}`
            }
          }
        })
      }
    }
  },
  mounted() {
    this.initBaseSideBar()
    EventBus.$on('initSideBarActive', (path) => {
      // console.log('path', path)
      const parentIndex = path.indexOf('/')
      const childIndex = path.lastIndexOf('/')
      const parentPath = path.substr(parentIndex, childIndex)
      const childPath = path.substr(childIndex, path.length)
      // console.log('parentPath childPath', parentPath, childPath)
      // console.log('jdb_asideMenuConfig', this.jdb_asideMenuConfig)
      this.jdb_asideMenuConfig.forEach((item, index) => {
        if (item.path === parentPath) {
          item.children.forEach((child, i) => {
            if (child.path === childPath) {
              let current = {
                name: child.name,
                path: parentPath + childPath
              }
              this.initBreadcrumb(current)
              this.active = `${index}-${i}`
            }
          })
        }
      })
    })
    EventBus.$on('mouseIn', () => {
      this.collapse = true
    })
    EventBus.$on('mouseOut', () => {
      this.collapse = false
    })
  }
}
</script>

<style lang="scss" scoped>
.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 64px;
  line-height: 64px;
  background: #eff8ff;
  color: #3489fe;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  overflow: hidden;
}
.sidebar-container {
  background-color: #eff8ff;
  transition: width 0.28s;
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 9;
  overflow: hidden;
  a {
    display: inline-block;
    width: 100%;
  }
  .el-menu {
    background-color: #eff8ff !important;
    width: 100% !important;
    border: none;
  }
  .el-submenu .el-menu-item {
    min-width: 256px !important;
    padding-left: 48px !important;
    background-color: #eff8ff !important;
    color: #666666 !important;
    font-weight: bold;
    &:hover {
      color: black !important;
    }
  }
  .el-menu-item,
  .el-submenu .el-menu-item {
    &.is-active {
      border-left: 4px solid #3489fe;
      background-color: #def0fc !important;
      color: #3489fe !important;
    }
  }
  .el-submenu__title i {
    font-size: 16px;
    color: #666666;
  }
}
</style>
