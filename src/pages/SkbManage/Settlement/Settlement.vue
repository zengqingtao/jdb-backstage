<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" justify="end">
        <el-form inline size="small">
          <el-form-item label="用户来源:" class="mg-l-10">
            <el-select size="small" v-model="osType" placeholder="请选择" clearable>
              <el-option label="京店宝" :value="1"></el-option>
              <el-option label="京大师" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动名称:" class="mg-l-10">
            <el-input v-model="title" placeholder="请输入活动名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="店铺名称:" class="mg-l-10">
            <el-input v-model="shopName" placeholder="请输入店铺名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="账号:" class="mg-l-10">
            <el-input class="w200" v-model="jdbAccount" placeholder="请输入账号" clearable></el-input>
            <el-button type="primary" @click="searchFn">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <!--<el-row type="flex" class="row-bg" justify="space-between">-->
        <!--<el-col :span="6"></el-col>-->
        <!--<el-col :span="7" :offset="5" class="text-right">-->
          <!--<el-input v-model="search" placeholder="京店宝账号/店铺名称/活动名称" size="small" clearable></el-input>-->
          <!--<el-button type="primary" size="small" @click="searchFn">查询</el-button>-->
        <!--</el-col>-->
      <!--</el-row>-->
    </el-header>

    <el-tabs type="card" v-model="status" @tab-click="tabSwitch">
      <el-tab-pane label="未审核" name="0"></el-tab-pane>
      <el-tab-pane label="通过" name="1"></el-tab-pane>
      <el-tab-pane label="驳回" name="2"></el-tab-pane>
    </el-tabs>

    <el-main>
      <el-table :data="tableData">
        <el-table-column prop="jdbAccount" label="账号">
        </el-table-column>
        <el-table-column prop="source" label="来源">
        </el-table-column>
        <el-table-column prop="shopName" label="店铺名称">
        </el-table-column>
        <el-table-column label="活动名称">
          <template slot-scope="scope">
            <span>
              {{ scope.row.manageTitle || scope.row.title }}
              <el-popover placement="top" width="200" trigger="click" v-if="scope.row.manageTitle">
                <el-row>
                  <el-col>原标题：{{ scope.row.title }}</el-col>
                  <el-col>修改后标题：{{ scope.row.manageTitle }}</el-col>
                  <el-col>修改原因：{{ scope.row.reason }}</el-col>
                </el-row>
                <i slot="reference" class="el-icon-question pointer"></i>
              </el-popover>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="releaseTime" label="申请时间">
        </el-table-column>
        <el-table-column prop="manageVerify" label="试客宝审核">
        </el-table-column>
        <el-table-column prop="manageVerifyTime" label="审核时间1">
        </el-table-column>
        <el-table-column prop="manageVerifyRemark" label="备注1">
        </el-table-column>
        <el-table-column prop="linglaVerify" label="领啦审核">
        </el-table-column>
        <el-table-column prop="linglaVerifyTime" label="审核时间2">
        </el-table-column>
        <el-table-column prop="linglaVerifyRemark" label="备注2">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="detailShow(scope.row.id)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" class="row-bg"justify="end">
        <el-col class="page">
          <el-pagination
            v-show="page.total"
            @current-change="handleCurrentChange"
            :current-page="page.pageNo"
            layout="total, prev, pager, next, jumper"
            :total="page.total">
          </el-pagination>
        </el-col>
      </el-row>
    </el-main>

    <el-dialog title="驳回" :visible.sync="modalStatus" width="30%" center :close-on-click-modal="false" @close="closeModalFn">
      <el-form ref="form" :model="form" label-width="55px">
        <el-form-item label="备注:" prop="reviewRemarks" :rules="[{ required: true, message: '备注不能为空'}]">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="form.reviewRemarks" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="btnStatus" @click="rejectFn">确定</el-button>
        <el-button type="primary" size="small" plain @click="modalStatus = false">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="查看详情" :visible.sync="DetailStatus" width="30%" center :close-on-click-modal="false" @close="closeModalFn2">
      <el-form label-width="130px">
        <el-form-item label="活动名称:">{{ details.title }}</el-form-item>
        <el-form-item label="商品押金:">{{ details.cashPledge }}元</el-form-item>
        <el-form-item label="活动下单价:">{{ details.orderPrice }}元</el-form-item>
        <el-form-item label="增值服务费用:">{{ details.seniorFee }}元</el-form-item>
        <el-form-item label="增值服务项目数:">{{ details.seniorCount }}个</el-form-item>
        <el-form-item label="活动总份数:">{{ details.totalNum }}份</el-form-item>
        <el-form-item label="完成份数:">{{ details.completeNum }}份</el-form-item>
        <el-form-item label="已下单未完成份数:">{{ details.reservedNum }}份（预留金额{{ details.reservedFee }}元）</el-form-item>
        <el-form-item label="结算份数:">{{ details.settlementNum }}份（结算金额{{ details.settlementFee }}元）</el-form-item>
        <el-form-item label="备注信息:">{{ details.remark }}</el-form-item>
      </el-form>
      <el-form label-width="130px">
        <el-form-item label="试客宝审批状态:">{{ orderVerifyVO.manageVerifyCode === 0 ? '未审核' : orderVerifyVO.manageVerifyCode === 1 ? '已通过' : '已驳回' }}</el-form-item>
        <el-form-item label="试客宝驳回理由:" v-if="orderVerifyVO.manageVerifyCode === 2">{{ orderVerifyVO.manageVerifyRemark }}</el-form-item>
        <el-form-item label="领啦审核状态:">{{ orderVerifyVO.linglaVerifyCode === 0 ? '未审核' : orderVerifyVO.linglaVerifyCode === 1 ? '已通过' : '已驳回' }}</el-form-item>
        <el-form-item label="领啦驳回理由:" v-if="orderVerifyVO.linglaVerifyCode === 2">{{ orderVerifyVO.linglaVerifyRemark }}</el-form-item>
      </el-form>
      <el-row class="mg-t-10" type="flex" justify="center" v-if="orderVerifyVO.manageVerifyCode === 0 && canAuthStatus">
        <el-button type="primary" size="small" :loading="btnStatus" @click="passFn(details.id)">通过</el-button>
        <el-button type="primary" size="small" :loading="btnStatus" plain @click="modalStatus = true">驳回</el-button>
      </el-row>
      <el-row slot="footer" type="flex" justify="space-between">
        <el-button type="primary" size="small" plain :disabled="!details.lastId" @click="detailShow(details.lastId)">上一条</el-button>
        <el-button type="primary" size="small" plain :disabled="!details.nextId" @click="detailShow(details.nextId)">下一条</el-button>
      </el-row>
    </el-dialog>

  </el-container>
</template>
<script>
import testGuest from "../../../api/testGuest";

export default {
  name: 'Settlement',
  data () {
    return {
      canAuthStatus: false,
      osType: '',
      DetailStatus: false,
      btnStatus: false,
      modalStatus: false,
      form: {
        reviewRemarks: ''
      },
      status: '0',
      title: '',
      shopName: '',
      jdbAccount: '',
      tableData: [], // 表格数据
      details: {}, // 列表详情信息
      orderVerifyVO: {}, // 详情审核信息
      page: { // 分页数据
        pageNo: 1,
        total: null
      },
    }
  },
  methods: {
    async getCanAuthStatus () {
      const res = await testGuest.canAuth()
      this.canAuthStatus = res
    },
    async pageLoad () {
      const res = await testGuest.getManageApplyFinishOrderList({ osType: this.osType, page: this.page.pageNo, status: this.status, title: this.title, jdbAccount: this.jdbAccount, shopName: this.shopName })
      if (res.code === 200) {
        this.tableData = res.data.results
        this.page.pageNo = res.data.pageNo
        this.page.total = res.data.totalCount
      } else {
        this.tableData = []
        this.page.pageNo = 1
        this.page.total = null
      }
    },
    tabSwitch () {
      this.page.pageNo = 1
      this.pageLoad()
    },
    handleCurrentChange (val) {
      this.page.pageNo = val
      this.pageLoad()
    },
    searchFn () {
      this.page.pageNo = 1
      this.pageLoad()
    },
    closeModalFn () {
      this.btnStatus = this.modalStatus = false
      this.$refs['form'].resetFields()
    },
    closeModalFn2 () {
      this.btnStatus = this.DetailStatus = false
      this.details = {}
    },
    async detailShow (id) {
      const res = await testGuest.getManageApplyFinish({ id, osType: this.osType, status: this.status, title: this.title, jdbAccount: this.jdbAccount, shopName: this.shopName })
      if (res.code === 200) {
        this.details = res.data
        this.orderVerifyVO = res.data.orderVerifyVO
      } else {
        this.details = this.orderVerifyVO = {}
      }
      this.DetailStatus = true
    },
    passFn () {
      this.btnStatus = true
      testGuest.managePassApplyFinish({ id: this.details.id }).then(res => {
        if (res && res.code === 200) {
          this.detailShow(this.details.id)
          this.pageLoad()
          this.$message({
            message: '审核通过成功！',
            type: 'success',
          })
        } else {
          this.btnStatus = false
          this.$message({
            message: res.msg,
            type: 'error',
          })
        }
      })
    },
    rejectFn () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnStatus = true
          testGuest.manageRefuseApplyFinish({ id: this.details.id, remark: this.form.reviewRemarks}).then(res => {
            if (res && res.code === 200) {
              this.detailShow(this.details.id)
              this.closeModalFn()
              this.pageLoad()
              this.$message({
                message: '审核驳回成功！',
                type: 'success',
              })
            } else {
              this.btnStatus = false
              this.$message({
                message: res.msg,
                type: 'error',
              })
            }
          })
        }
      })
    }
  },
  created () {
    this.status = this.$route.query.status ? this.$route.query.status : this.status
    this.pageLoad()
    this.getCanAuthStatus()
  }
}
</script>


<style lang="scss" scoped>
  .header {
    padding: 30px;
    margin-bottom: 20px;
    .el-input {
      margin-right: 10px;
    }
    .w200 {
      width: 200px;
    }
  }

  .el-dialog__body {
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 100% !important;
    }
  }
  /deep/ .el-dialog {
    .el-form-item {
      padding-left: 12%;
      margin-bottom: 0;
    }
    .reson {
      line-height: 25px;
      margin-top: 5px;
      padding-left: 12%;
    }
  }
</style>
