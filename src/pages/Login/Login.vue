<template>
  <div></div>
</template>

<script>
import member from "@/api/member";
import { mapMutations } from "vuex";

export default {
  name: "UserLogin",
  data() {
    return {
      firstPath: "" // 根据后端返回的权限获取进入页面后第一个跳转的路径
    };
  },
  methods: {
    ...mapMutations(["initLoginInfo", "initToken", "initMenuList"]),
    firstRouter(MenuConfig) {
      // 序列化路由寻找第一个默认路由
      MenuConfig.forEach((item, index) => {
        if (item.children && item.children.length > 0 && index === 0) {
          this.firstPath = item.path + item.children[0].path;
        } else if (index === 0) {
          this.firstPath = item.path;
        }
      });
    },
    async getUserInfo() {
      const res = await member.getUserInfo();
      if (res.code == 200) {
        let info = {};
        info.userInfo = {};
        info.userInfo.id = res.data.userId;
        info.userInfo.name = res.data.userName;
        this.initLoginInfo(info);
      }
    },
    async getMenuList() {
      let menuList = [];
      let NoPermissionPath = [
        {
          icon: "iconfont icon-quanxianguanli",
          name: "权限不足",
          operationList: [],
          path: "/NoPermission"
        }
      ];
      let params = {
        source: "jingdianbao_system"
      };
      const res = await member.getMenuList(params);
      if (res.code == 200) {
        menuList = res.data;
        if (!menuList.length) {
          menuList = NoPermissionPath;
        }
      }else{
        menuList = NoPermissionPath
      }
      this.loadUrl(menuList)
    },
    loadUrl(menuList) {
      this.initMenuList(menuList);
      let url = location.href;
      url = url.split("?")[0];
      location.replace(url);
      location.reload();
    }
  },
  mounted() {
    let query = window.location.href;
    query = query.split("?")[1];
    if (query) {
      let token = query.split("=")[1];
      this.initToken(token);
      this.getUserInfo();
      this.getMenuList();
      return;
    }
    if (
      !query &&
      localStorage.jdb_token &&
      localStorage.jdb_userInfo &&
      localStorage.jdb_menu
    ) {
      if (localStorage.jdb_menu == "[]") {
        return this.$message.info("暂无权限");
      }
      this.firstRouter(this.$store.state.jdb_asideMenuConfig);
      this.$router.push({ path: this.firstPath });
    } else {
      let url = process.env.VUE_APP_AUTH + "?source=" + location.href;
      window.location.replace(url);
    }
  }
};
</script>