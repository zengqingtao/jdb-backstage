<!--京挑客白名单---->
<template>
  <div class="container">
    <div class="top-add-btn">
      <el-button type="primary" size="small" @click="isShowDialog = true">添加白名单</el-button>
    </div>
    <el-table :data="tableData" v-loading="tableLoading">
      <el-table-column label="登录手机号" prop="jdbAccount" width="450"></el-table-column>
      <el-table-column label="添加时间" prop="createTime" width="350"></el-table-column>
      <el-table-column></el-table-column>
    </el-table>
    <div class="el-pagination" v-if="pagination.total>pagination.size">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="pagination.page"
        :page-size="pagination.size"
        :total="pagination.total"
        layout="total, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <el-dialog
      :visible.sync="isShowDialog"
      :center="true"
      :close-on-click-modal="false"
      width="560px"
      class="dialog"
    >
      <div class="inp-box">
        <span class="label-required">*</span>
        <span>登录手机号：</span>
        <el-input placeholder="请输入登录手机号" v-model="account" @focus="errTips = ''"></el-input>
      </div>
      <div class="err-tips">{{errTips}}</div>
      <div class="btn-group">
        <el-button type="primary" @click="addAccount">添加</el-button>
        <el-button @click="isShowDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import wlielist from '../../../api/wlielist'
export default {
  data() {
    return {
      tableData: [],
      pagination: {
        page: 1,
        size: 10,
        total: null
      },
      tableLoading: true,
      isShowDialog: false,
      account: '',
      errTips: ''
    }
  },
  watch: {
    isShowDialog() {
      if (!this.isShowDialog) {
        this.errTips = ''
      }
    }
  },
  mounted() {
    console.log('111')
    this.getJingPickGuestList()
  },
  methods: {
    getJingPickGuestList() {
      let params = {
        page: this.pagination.page,
        size: this.pagination.size
      }
      wlielist.listJtkWhiteList(params).then((res) => {
        this.tableLoading = false
        if (res.code === 200) {
          this.tableData = res.data.results
          this.pagination.total = res.data.totalCount
        }
      })
    },
    async addAccount() {
      if (!this.account) return (this.errTips = '登录手机号不能为空')
      let params = { jdbPhone: this.account }
      wlielist.checkJdbUserByPhone(params).then((res) => {
        if (res.code === 200) {
          this.addJtkWhiteList({ jdbAccount: params.jdbPhone })
        } else {
          this.errTips = res.msg
        }
      })
    },
    addJtkWhiteList(params) {
      wlielist.addJtkWhiteList(params).then((res) => {
        if (res.code === 200) {
          this.isShowDialog = false
          this.getJingPickGuestList()
          this.$message.success('添加成功')
        } else {
          this.errTips = res.msg
        }
      })
    },
    handleCurrentChange(currentPage) {
      this.pagination.page = currentPage
      this.getJingPickGuestList()
    }
  }
}
</script>
<style lang="scss" scoped>
.top-add-btn {
  margin: 30px 0 20px 60px;
}
.el-pagination {
  text-align: center;
  padding-top: 10px;
}
.dialog {
  /deep/ .el-dialog__header {
    padding: 0;
  }

  .inp-box {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 20px;
    /deep/ .el-input {
      width: 350px;
    }
    /deep/ .el-input__inner {
      height: 30px;
    }
    .label-required {
      color: #e30213;
    }
  }
  .btn-group {
    display: flex;
    justify-content: center;
    padding-top: 10px;
    .el-button {
      width: 120px;
      height: 30px;
      padding: 0;
    }
  }
  .err-tips {
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #e30213;
    padding-top: 5px;
  }
}
</style>