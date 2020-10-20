<template>
  <div class="CustomerInfo">
    <div class="header">
      <div>
        <el-input
          placeholder="请输入京店宝账号"
          size="small"
          v-model="jdbAccount"
          clearable
        ></el-input>
        <el-input
          placeholder="请输入QQ号"
          size="small"
          v-model="qqCode"
          style="margin:0 15px;"
          clearable
        ></el-input>
        <el-button type="primary" @click="searchFun" size="small"
          >查询</el-button
        >
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="京店宝账号">
        <template slot-scope="scope">
          <span>{{ scope.row.jdbAccount ? scope.row.jdbAccount : `--` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户姓名">
        <template slot-scope="scope">
          <span>{{
            scope.row.contactName ? scope.row.contactName : `--`
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户电话">
        <template slot-scope="scope">
          <span>{{
            scope.row.contactPhone ? scope.row.contactPhone : `--`
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户QQ">
        <template slot-scope="scope">
          <span>{{ scope.row.qqCode ? scope.row.qqCode : `--` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户微信">
        <template slot-scope="scope">
          <span>{{ scope.row.wx ? scope.row.wx : `--` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间">
        <template slot-scope="scope">
          <span>{{
            scope.row.registerTime ? scope.row.registerTime : `--`
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人">
        <template slot-scope="scope">
          <span>{{ scope.row.manageUser ? scope.row.manageUser : `--` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="roleName !== '有品库-招商人员'">
        <template slot-scope="scope">
          <el-button type="text" @click="changeModalVisibleFn(scope.row)"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="修改客户信息"
      :visible.sync="changeModalVisible"
      width="28%"
      center
    >
      <el-form :model="form" ref="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="京店宝账号" required>
          <span>{{ form.jdbAccount }}</span>
        </el-form-item>
        <el-form-item label="客户姓名" >
          <el-input
            v-model="form.contactName"
            size="small"
            placeholder="请输入客户姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户电话" prop="contactPhone">
          <el-input
            v-model="form.contactPhone"
            size="small"
            placeholder="请输入客户电话"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户QQ" prop="qqCode">
          <el-input
            v-model="form.qqCode"
            size="small"
            placeholder="请输入客户QQ"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户微信" >
          <el-input
            v-model="form.wx"
            size="small"
            placeholder="请输入客户微信"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveFn">保 存</el-button>
        <el-button @click="changeModalVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-row justify="end" type="flex" class="pagination" v-if="totalCount > 10">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-size="size"
        layout="prev, pager, next, jumper"
        :total="totalCount"
      >
      </el-pagination> 
    </el-row>
  </div>
</template>
<script>
import extendManage from "api/extendManage";
export default {
  name: "CustomerInfo",
  data() {
    return {
      tableData: [],
      changeModalVisible: false,
      form: {
        contactName: "",
        contactPhone: "",
        merchantId: "",
        qqCode: "",
        wx: "",
        jdbAccount: ""
      },
      rules: {
        contactPhone: [
          { required: true, message: "请输入客户电话", trigger: "blur" }
        ],
        qqCode: [{ required: true, message: "请输入客户QQ", trigger: "blur" }],
      },
      page: 1,
      size: 10,
      jdbAccount: "",
      qqCode: "",
      totalCount: 0
    };
  },
  created() {
    this.listOperationMerchant();
  },
  computed: {
    roleName() {
      return this.$store.state.jdb_userInfo.role;
    }
  },
  methods: {
    async listOperationMerchant() {
      let params = {
        page: this.page,
        size: this.size,
        jdbAccount: this.jdbAccount,
        qqCode: this.qqCode
      };
      const { data, msg, code } = await extendManage.listOperationMerchant(
        params
      );
      if (code === 200) {
        this.tableData = data.results;
        this.page = data.pageNo;
        this.totalCount = data.totalCount;
      } else {
        this.tableData = [];
        this.page = 1;
        this.size = 10;
        this.totalCount = 0;
      }
    },
    handleCurrentChange(page) {
      this.page = page;
      this.listOperationMerchant();
    },
    searchFun() {
      this.page = 1;
      this.listOperationMerchant();
    },
    changeModalVisibleFn(val) {
      Object.keys(this.form).forEach(key => {
        this.form[key] = val[key];
      });
      this.changeModalVisible = true;
    },
    saveFn() {
      this.$refs["ruleForm"].validate(async valid => {
        if (valid) {
          let params = { ...this.form };
          delete params.jdbAccount;
          const { data, code } = await extendManage.updateMerchantInfo(params);
          if (code === 200) {
            this.$message.success(`修改成功`);
            this.listOperationMerchant();
            this.changeModalVisible = false;
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-form-item {
  margin-bottom: 15px;
}
.pagination {
  padding: 20px 50px 0 0;
}
.header {
  display: flex;
  justify-content: flex-end;
  div {
    width: 600px;
    display: flex;
  }
}
</style>
