<template>
  <el-menu class="navbar" mode="horizontal" default-active="1">
    <div class="logo">
      <img src="../../../assets/img/logo.png" />
    </div>
    <!--<el-menu-item index="1">首页</el-menu-item>-->
    <div class="user-profile-container" trigger="click">
      <div class="user-profile-content">
        <el-dropdown>
          <div class="user-profile-body">
            <el-button type="primary" size="small">{{ this.jdb_userInfo.name }}</el-button>
          </div>
          <el-dropdown-menu class="user-dropdown" slot="dropdown">
            <el-dropdown-item>
              <span style="display:block;" @click="logout">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <el-dialog
      title="找回密码"
      :visible="modalStatus"
      width="25%"
      center
      top="27vh"
      @close="closeModalFn"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <el-form ref="form" :model="form" label-width="85px" status-icon :rules="rules">
        <el-form-item label="用户名:">
          <el-input
            v-model="form.name"
            disabled
            placeholder="请输入用户名"
            size="small"
            style="width: 100% !important;"
          ></el-input>
        </el-form-item>
        <el-form-item label="旧密码:" prop="oldPassword">
          <el-input
            type="password"
            v-model="form.oldPassword"
            placeholder="请输入旧密码"
            clearable
            size="small"
            style="width: 100% !important;"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码:" prop="newPassword">
          <el-input
            type="password"
            v-model="form.newPassword"
            placeholder="请输入新密码"
            clearable
            size="small"
            style="width: 100% !important;"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码:" prop="confirmPassword">
          <el-input
            type="password"
            v-model="form.confirmPassword"
            placeholder="请再次输入新密码"
            clearable
            size="small"
            style="width: 100% !important;"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changePassword">确认</el-button>
      </span>
    </el-dialog>
  </el-menu>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import member from "@/api/member";

export default {
  name: "NavBar",
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("二次确认密码不能为空!"));
      } else if (value !== this.form.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      modalStatus: false,
      form: {
        name: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      },
      rules: {
        oldPassword: [
          { required: true, message: "旧密码不能为空", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "新密码不能为空", trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, validator: validatePass, trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    ...mapState(["jdb_userInfo"])
  },
  methods: {
    ...mapMutations(["clearLoginInfo"]),
    logout() {
      member.quit({ name: this.jdb_userInfo.name }).then(res => {
        if (res && res.code === 200) {
          this.$message({
            message: "退出成功",
            type: "success"
          });
          localStorage.removeItem("jdb_token");
          localStorage.removeItem("jdb_userInfo");
          localStorage.removeItem("jdb_menu");
          this.clearLoginInfo();
          this.$router.push({ path: "/" });
        }
      });
    },
    showModalFn() {
      this.modalStatus = true;
      this.form.name = this.jdb_userInfo.name;
    },
    closeModalFn() {
      this.modalStatus = false;
      this.form = {
        name: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      };
    },
    changePassword() {
      // 修改密码(已登录)
      let that = this;
      this.$refs["form"].validate(valid => {
        if (valid) {
          member
            .changePassword({
              name: that.form.name,
              oldPassword: that.form.oldPassword,
              newPassword: that.form.newPassword
            })
            .then(res => {
              if (res && res.code === 200) {
                that.modalStatus = false;
                that.form = {
                  name: "",
                  oldPassword: "",
                  newPassword: "",
                  confirmPassword: ""
                };
                that.$message({
                  message: "修改成功，请重新登录",
                  type: "success"
                });
                member.quit({ name: this.jdb_userInfo.name }).then(res => {
                  if (res && res.code === 200) {
                    localStorage.removeItem("jdb_token");
                    localStorage.removeItem("jdb_userInfo");
                    localStorage.removeItem("jdb_menu");
                    this.clearLoginInfo();
                    this.$router.push({ path: "/" });
                  }
                });
              }
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  background-color: #eff8ff;
  z-index: 10;
  .logo {
    margin: 15px 60px 0 20px;
    float: left;
    height: 54px;
    overflow: hidden;
  }
  .el-menu-item.is-active {
    font-size: 20px;
    font-weight: bold;
    color: #3489fe;
    border-bottom-width: 4px;
    border-radius: 2px;
    padding: 0;
    &:hover {
      background-color: #eff8ff;
    }
  }
  .user-profile-container {
    position: absolute;
    right: 20px;
    cursor: pointer;
    .user-profile-content {
      display: flex;
      padding: 20px 0;
    }
    .menu-icons {
      display: flex;
      align-items: center;
      .menu-icon {
        padding: 0 12px;
        .icon {
          display: inline-block;
          font-size: 18px;
          text-align: center;
        }
      }
    }
    .user-profile-body {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding-right: 14px;
    }
    .user-avatar {
      width: 24px;
      height: 24px;
      margin: 0 8px 0 12px;
      border-radius: 4px;
    }
    .user-name {
      color: rgba(0, 0, 0, 0.65);
    }
    .user-department {
      font-size: 12px;
      color: rgba(102, 102, 102, 0.65);
    }
    .el-icon-caret-bottom {
      position: absolute;
      right: 0;
      top: 13px;
      font-size: 12px;
    }
  }
}
</style>

