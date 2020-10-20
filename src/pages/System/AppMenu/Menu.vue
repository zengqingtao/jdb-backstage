<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" class="row-bg">
        <el-col :span="6" :offset="1">菜单分类</el-col>
        <el-col :span="6">类型</el-col>
      </el-row>
    </el-header>
    <hr />
    <el-main class="main">
      <el-tree :data="treeData" default-expand-all>
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span :class="[node.label.includes('.') ? 'bold' : 'pd-l-25']"><span v-if="node.label.includes('.')" class="iconfont icon-_huaban"></span>{{ node.label }}</span>
            <span>{{ node.label.includes('.') ? '父级菜单' : '' }}</span>
          </span>
      </el-tree>
    </el-main>
  </el-container>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'AppMenu',
    computed: {
      ...mapState(['jdb_asideMenuConfig'])
    },
    data () {
      return {
        treeData: []
      }
    },
    created () {
      this.treeData = this.asideMenuConfig
      this.treeData.map(item => {
        item.label = `${item.name}.`
        item.children && item.children.length > 0 && item.children.map(child => {
          child.label = child.name
        })
      })
    }
  }
</script>

<style lang="scss" scoped>
  .header {
    padding: 30px;
  }
  .main {
    padding: 0 0 0 68px;
    .el-tree {
      width: 30%;
      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
      }
    }
  }

  .pd-l-25 {
    padding-left: 25px;
  }

  .bold {
    font-weight: bold;
  }

</style>