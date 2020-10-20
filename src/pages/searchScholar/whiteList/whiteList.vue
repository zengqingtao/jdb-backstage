<!--搜索书生白名单-->
<template>
  <div class="whiteList-container">
    <el-button class="addWhiteListBtn" type="primary" @click="addWhiteListDialogVisible=true">添加白名单</el-button>
    <el-table :data="tableData">
      <el-table-column label="京店宝账号" prop="account"></el-table-column>
      <el-table-column label="添加时间" prop="createTime"></el-table-column>
      <el-table-column label="有效时间" prop="vaildTime"></el-table-column>
    </el-table>
    <el-pagination
      v-if="pagination.total>pagination.size"
      class="pagination"
      :current-page="pagination.page"
      :page-size="pagination.size"
      :total="pagination.total"
      @current-change="changeCurrentPage"
    ></el-pagination>
    <el-dialog
      :visible.sync="addWhiteListDialogVisible"
      :close-on-click-modal="false"
      width="500px"
      center
    >
      <div class="account-box">
        <div class="label">
          <span class="star">*</span>京店宝账号：
        </div>
        <el-input v-model="form.JDBAccount" placeholder="请输入京店宝账号"></el-input>
      </div>
      <div class="validDays-box">
        <div class="label">
          <span class="star">*</span>有效天数：
        </div>
        <el-input v-model="form.validDays" placeholder="请输入有效天数"></el-input>
      </div>
      <div class="error-tips">{{errorTips}}</div>
      <div class="footer-button-box">
        <el-button type="primary" @click="addWhiteList">添加</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import searchScholar from "../../../api/searchScholar";
export default {
  data() {
    return {
      tableData: [],
      pagination: {
        page: 1,
        size: 2,
        total: null,
      },
      addWhiteListDialogVisible: false,
      form: {
        JDBAccount: "",
        validDays: "",
      },
      errorTips: "",
    };
  },
  mounted() {
    this.getWhiteList();
  },
  methods: {
    getWhiteList() {
      let params = {
        pageNo: this.pagination.page,
        pageSize: this.pagination.size,
      };
      searchScholar.getSaWhiteListList(params).then((res) => {
        if (res.code === 200) {
          this.pagination.total = res.data.totalCount;
          this.tableData = res.data.results;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    changeCurrentPage(currentPage) {
      this.pagination.page = currentPage;
      this.getWhiteList();
    },
    validate() {
      let reg = /^\+?[1-9]\d*$/;
      if (this.form.JDBAccount == "") {
        this.errorTips = "京店宝不能为空";
      } else if (!/^1[3456789]\d{9}$/.test(this.form.JDBAccount)) {
        this.errorTips = "京店宝账号不存在";
      } else if (this.form.validDays == "") {
        this.errorTips = "请输入有效天数";
      } else if (!reg.test(this.form.validDays)) {
        this.errorTips = "有效天数必须是大于0的整数";
      } else {
        this.errorTips = "";
      }
    },
    async addWhiteList() {
      await this.validate();
      if (this.errorTips !== "") return;
      let params = {
        account: this.form.JDBAccount,
        day: this.form.validDays,
      };
      searchScholar.addWhiteList(params).then((res) => {
        if (res.code === 200) {
          this.addWhiteListDialogVisible = false;
          this.getWhiteList();
          this.$message.success("添加成功");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    closeDialog() {
      this.addWhiteListDialogVisible = false;
      this.form = {
        JDBAccount: "",
        validDays: "",
      };
      this.errorTips = "";
    },
  },
};
</script>
<style lang="scss" scoped>
.whiteList-container {
  padding: 30px;
  .addWhiteListBtn {
    margin-bottom: 20px;
  }
  .pagination {
    text-align: center;
    margin: 20px;
  }
  /deep/ .el-dialog {
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 30px 50px 20px;
    }
    .account-box {
      margin-bottom: 15px;
    }
    .account-box,
    .validDays-box {
      display: flex;
      align-items: center;
      .label {
        width: 120px;
        text-align: right;
        .star {
          color: #f56c6c;
        }
      }
    }
    .footer-button-box {
      display: flex;
      justify-content: center;
      button {
        width: 80px;
        height: 30px;
        padding: 0;
      }
    }
    .error-tips {
      height: 36px;
      text-align: center;
      padding: 10px;
      color: #f56c6c;
    }
  }
}
</style>