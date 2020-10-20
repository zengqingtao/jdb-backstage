<template>
  <router-view />
</template>

<script>
import member from "./api/member";
import { mapState,mapMutations } from "vuex";
export default {
  computed: {
    ...mapState(["jdb_token"])
  },
  mounted() {
    if(this.jdb_token){
      this.getMenuList()
    }
  },
  methods: {
    ...mapMutations(["initMenuList"]),
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
      this.initMenuList(menuList);
    },
  }
};
</script>

