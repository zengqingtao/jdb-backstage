<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" justify="space-between">
        <el-col :span="8">
          <el-button type="primary" size="small" plain @click="modalStatus = true">新增比例关系</el-button>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="tableData">
        <el-table-column prop="createTime" label="生效时间"></el-table-column>
        <el-table-column prop="jbhRatio" label="一期供应商比例"></el-table-column>
        <el-table-column prop="powerRatio" label="三期供应商比例"></el-table-column>
        <el-table-column prop="manage" label="操作人"></el-table-column>
      </el-table>
      <el-row type="flex" class="row-bg" justify="end">
        <el-col class="page">
          <el-pagination
            v-show="page.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.pageNo"
            layout="total, prev, pager, next, jumper"
            :total="page.total"
          ></el-pagination>
        </el-col>
      </el-row>
    </el-main>

    <el-dialog
      title="新增比例关系"
      :visible.sync="modalStatus"
      width="35%"
      center
      @close="closeModalFn"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" size="small" label-width="100px">
        <el-form-item
          label="一期供应商:"
          prop="ratio"
          :rules="[{validator: checkRatio, trigger: 'blur'}]"
        >
          <el-input class="w250" clearable v-model.number="form.ratio"></el-input>
          <span>%</span>
        </el-form-item>
        <el-form-item>
          <div class="gray">
            <div>新增的比例关系，将立即生效。</div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="btnStatus" @click="submitFn">确定</el-button>
        <el-button type="primary" size="small" plain @click="closeModalFn">关闭</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import tableMixins from "mixins/tableMixins";
import report from "api/report";

export default {
  name: "Proportion",
  mixins: [tableMixins],
  data() {
    return {
      form: {
        ratio: ""
      }
    };
  },
  methods: {
    checkRatio(rule, value, callback) {
      if (value === "") {
        callback(new Error("一期供应商比例不能为空"));
      } else if (value < 0 || value > 100) {
        callback(new Error("一期供应商比例必须大于等于0或小于等于100%"));
      } else if (!Number.isInteger(value)) {
        callback(new Error("比例只能为正整数"));
      } else {
        callback();
      }
    },
    async pageLoad() {
      const res = await report.listAllocateRatio({ page: this.page.pageNo });
      if (res.code === 200) {
        this.tableData = res.data.results;
        this.page.pageNo = res.data.pageNo;
        this.page.total = res.data.totalCount;
      } else {
        this.tableData = [];
        this.page.pageNo = 1;
        this.page.total = null;
      }
    },
    handleCurrentChange(page) {
      this.$set(this.page, "pageNo", page);
      this.pageLoad();
    },
    submitFn() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.btnStatus = true;
          const { code, msg } = await report.setJbhAllocateRatio(this.form);
          this.btnStatus = false;
          if (code === 200) {
            this.closeModalFn();
            this.pageLoad();
            this.$message.success("新增成功");
          } else {
            this.$message.error(msg || "新增失败");
          }
        }
      });
    },
    closeModalFn() {
      this.btnStatus = this.modalStatus = false;
      this.form.ratio = "";
    }
  },
  created() {
    this.pageLoad();
  }
};
</script>

<style lang="scss" scoped>
.header {
  padding: 30px;
  margin-bottom: 20px;
  .el-input {
    width: 75%;
    margin-right: 10px;
  }
}
.w250 {
  width: 90%;
}

.gray {
  color: #999999;
}
</style>
