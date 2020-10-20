<template>
  <div style="paddingTop:20px">
    <el-tabs v-model="activeIndex" type="card">
      <el-tab-pane label="待处理" name="1">
        <dataBale
          :tableData="tableData"
          :activeIndex="activeIndex"
          @settleVisibleFn="settleVisibleFn"
          @detailVisibleFn="detailVisibleFn"
        ></dataBale>
      </el-tab-pane>
      <el-tab-pane label="待结算" name="2">
        <dataBale
          :tableData="tableData"
          :activeIndex="activeIndex"
          @settleVisibleFn="settleVisibleFn"
          @detailVisibleFn="detailVisibleFn"
        ></dataBale>
      </el-tab-pane>
      <el-tab-pane label="已结算" name="3">
        <dataBale
          :tableData="tableData"
          :activeIndex="activeIndex"
          @settleVisibleFn="settleVisibleFn"
          @detailVisibleFn="detailVisibleFn"
        ></dataBale>
      </el-tab-pane>
    </el-tabs>

    <el-row justify="end" type="flex" class="pagination" v-if="totalCount > 10">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-size="size"
        layout="prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </el-row>

    <el-dialog title="处理" :visible.sync="settleVisible" width="35%" center>
      <el-form label-width="150px" v-model="settleForm" ref="settleForm">
        <el-form-item label="服务费：">
          <span>{{
            settleForm.serviceFeeType === 1
              ? `${settleForm.serviceRatio}%`
              : `￥${settleForm.serviceRatio}`
          }}</span>
        </el-form-item>
        <el-form-item label="券后价：">
          <span>{{ `￥${settleForm.discountPrice}` }}</span>
        </el-form-item>
        <el-form-item label="券使用数量：" :required="true" >
          <el-input
            placeholder="券使用数量"
            size="mini"
            type="number"
            v-model="settleForm.usedCount"
            onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
          ></el-input>
        </el-form-item>
        <el-form-item label="服务费总额：">
          <span>{{`￥${totalServiceMoney}`}}</span><span class="totalServiceMoneyTips" v-if="Number(totalServiceMoney) === 0">（注：服务费总额为0时，系统会自动结算订单）</span>
        </el-form-item>
        <el-form-item
          label="附件："
          :class="{ hideAddBtn: settleForm.file.length }"
          :required="true"
        >
          <el-upload
            action="null"
            :auto-upload="false"
            list-type="picture-card"
            :limit="1"
            :file-list="settleForm.file"
            :on-change="handleChange"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="settleOrderFn" type="primary" :loading='loading'>提交</el-button>
        <el-button @click="settleVisible = false">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="查看" :visible.sync="detailVisible" width="30%" center>
      <el-form label-width="150px" v-model="detailForm">
        <el-form-item label="服务费：">
          <span>{{
            detailForm.serviceFeeType === 1
              ? `${detailForm.serviceRatio}%`
              : `￥${detailForm.serviceRatio}`
          }}</span>
        </el-form-item>
        <el-form-item label="券后价：">
          <span>{{ `￥${detailForm.discountPrice}` }}</span>
        </el-form-item>
        <el-form-item label="券使用数量：">
          <span>{{ detailForm.usedCount != null? detailForm.usedCount : '--' }}</span>
        </el-form-item>
        <el-form-item label="服务费总额：">
          <span>{{ `￥${detailForm.serviceMoney}` }}</span>
        </el-form-item>
        <el-form-item label="附件：">
          <el-image
            :src="detailForm.fileOssUrl"
            :preview-src-list="[detailForm.fileOssUrl]"
            v-if="detailForm.fileOssUrl"
          ></el-image>
          <span v-else>--</span>
        </el-form-item>
        <el-form-item label="不通过原因：">
          <span>{{ detailForm.merchantFeedback ? detailForm.merchantFeedback : '--' }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import extendManage from "api/extendManage";
import dataBale from "./dataTable";
export default {
  name: "ExamineService",
  components: {
    dataBale
  },
  data() {
    return {
      activeIndex: "1",
      tableData: [],
      page: 1,
      size: 10,
      totalCount: 0,
      settleVisible: false,
      detailVisible: false,
      settleForm: {
        file: [],
        usedCount: ""
      },
      detailForm: {},
      loading: false
    };
  },
  computed:{
    totalServiceMoney() {
      if(this.settleForm.serviceFeeType === 1) {
       return (this.settleForm.discountPrice * this.settleForm.serviceRatio * this.settleForm.usedCount * 0.01).toFixed(2)
      } else {
       return (this.settleForm.serviceRatio * this.settleForm.usedCount).toFixed(2)
      }
    }
  },
  watch: {
    activeIndex: {
      immediate: true,
      handler(val) {
        this.page = 1;
        this.tableData = [];
        this.listOperationManageGoods();
      }
    },
  },
  methods: {
    async listOperationManageGoods() {
      const params = {
        page: this.page,
        size: this.size,
        status: this.activeIndex
      };
      const { data, code } = await extendManage.listSettleOrder(params);
      const { results, pageNo, totalCount } = data;
      if (code === 200) {
        this.tableData = results;
        this.page = pageNo;
        this.totalCount = totalCount;
      } else {
        this.tableData = [];
      }
    },
    settleVisibleFn(goods) {
      this.settleForm = goods;
      this.settleForm.file = goods.fileOssUrl ? [{ name: "file", url: goods.fileOssUrl }] : []
      this.settleVisible = true;
    },
    handleChange(file, fileList) {
      this.$delete(this.settleForm, "file");
      this.$set(this.settleForm, "file", fileList);
    },
    handleRemove(file, fileList) {
      this.$delete(this.settleForm, "file");
      this.$set(this.settleForm, "file", fileList);
    },
    async settleOrderFn() {
      if(!this.settleForm.usedCount) return this.$message.error('请输入券使用数量')
      if(!this.settleForm.file.length) return this.$message.error('请上传图片')
      this.loading = true
      let params = new FormData();
      params.append("id", this.settleForm.id);
      params.append("usedCount", this.settleForm.usedCount);
      params.append("file", this.settleForm.file[0]? this.settleForm.file[0].raw : "");
      const { data, msg, code } = await extendManage.settleOrder(params);
      code ?  this.loading = false : ''
      if (code === 200) {
        this.$message.success("提交成功");
        this.settleVisible = false;
        this.listOperationManageGoods();
      }
    },
    detailVisibleFn(goods) {
      this.detailForm = goods;
      this.detailVisible = true;
    },
    handleCurrentChange(page) {
      this.page = page;
      this.listOperationManageGoods();
    },
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-textarea__inner {
  min-height: 100px !important;
}
.pagination {
  padding: 20px 50px 0 0;
}
/deep/ .el-image {
  width: 100px;
  height: 100px;
}
/deep/ .hideAddBtn .el-upload--picture-card {
  display: none;
}

/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
 
/deep/ input[type="number"] {
    -moz-appearance: textfield;
}
.totalServiceMoneyTips{
  font-size: 12px;
  color: red;
  margin-left:10px;
}
/deep/ .el-form-item {
    margin-bottom: 0;
}
/deep/ .el-input--mini .el-input__inner {
  width: 100px;
}
</style>
