<template>
  <el-container>
    <el-main>
      <el-tabs class="tabs" v-model="activeName" type="card" @tab-click="pageLoad">
        <el-tab-pane label="未审核" name="1"></el-tab-pane>
        <el-tab-pane label="审核通过" name="2"></el-tab-pane>
        <el-tab-pane label="审核未通过" name="3"></el-tab-pane>
      </el-tabs>

      <el-table :data="tableData">
        <el-table-column prop="applyUserName" label="申请人">
        </el-table-column>
        <el-table-column prop="applyTime" label="申请时间">
        </el-table-column>
        <el-table-column prop="money" label="退款金额">
        </el-table-column>
        <el-table-column prop="reason" label="退款原因">
        </el-table-column>
        <el-table-column prop="orderNumber" label="订单号">
        </el-table-column>
        <el-table-column label="所选套餐">
          <template slot-scope="scope">
            <el-button type="text" @click="mealDetailFn(scope.row)">{{ scope.row.packageName }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="已提交京东审核的文章">
          <template slot-scope="scope">
            <el-button type="text" @click="loadPaperList(scope.row.orderId)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <div v-if="activeName === '1'">
              <el-button size="mini" type="primary" plain @click="listPassFn(scope.row.id)">通过</el-button>
              <el-button size="mini" type="primary" plain @click="listRejectFn(scope.row.id)">不通过</el-button>
            </div>
            <span v-else-if="activeName === '2'">通过</span>
            <div v-else>
              <div>不通过</div>
              <div>拒绝理由：{{ scope.row.remark }}</div>
            </div>
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

    <el-dialog title="已提交京东审核的文章" :visible.sync="modalPaperStatus" width="45%" center :close-on-click-modal="false" @close="closeModalFn">
      <el-card class="box-card">
        <div slot="header">
          <h4>已提交京东审核的文章</h4>
        </div>
        <el-table :data="submitData">
          <el-table-column prop="title" label="文章标题">
          </el-table-column>
          <el-table-column prop="url" label="文章链接">
            <template slot-scope="scope">
              <a :href="scope.row.url" target="_blank">{{ scope.row.url }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="提交时间">
          </el-table-column>
        </el-table>
        <el-row class="mg-t-10" type="flex" justify="end">
          <el-pagination
            v-show="submitPage.total"
            @current-change="submitPageChange"
            :current-page="submitPage.pageNo"
            :page-size="3"
            layout="total, prev, pager, next, jumper"
            :total="submitPage.total">
          </el-pagination>
        </el-row>
      </el-card>

      <el-card class="box-card mg-t-10">
        <div slot="header">
          <h4>已上线的文章</h4>
        </div>
        <el-table :data="onLineData">
          <el-table-column prop="title" label="文章标题">
          </el-table-column>
          <el-table-column prop="url" label="文章链接">
            <template slot-scope="scope">
              <a :href="scope.row.url" target="_blank">{{ scope.row.url }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="发布时间">
          </el-table-column>
        </el-table>
        <el-row class="mg-t-10" type="flex" justify="end">
          <el-pagination
            v-show="onLinePage.total"
            @current-change="onLinePageChange"
            :current-page="onLinePage.pageNo"
            :page-size="3"
            layout="total, prev, pager, next, jumper"
            :total="onLinePage.total">
          </el-pagination>
        </el-row>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" plain @click="closeModalFn">关闭</el-button>
      </span>
    </el-dialog>

    <el-dialog title="套餐详情" :visible="modalStatus" width="65%" center :close-on-click-modal="false" @close="closeModalFn">
      <mealDetail v-if="modalStatus" :applyTime='applyTime' :customDataList="customDataList" :originalCustom="originalCustom" :customNotice="customNotice" :mealPutList="mealPutList" :mealType="mealType" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" plain @click="closeModalFn">关闭</el-button>
      </span>
    </el-dialog>

  </el-container>
</template>

<script>
  import talent from 'api/talent'
  import tableMixins from 'mixins/tableMixins'
  import mealDetail from '../../../components/mealDetailTable'

  export default {
    name: 'Refund',
    mixins: [tableMixins],
    components: { mealDetail },
    data () {
      return {
        orderId: '',
        mealType: 0,
        mealPutList: [],
        customDataList: [],
        customNotice: '',
        originalCustom: false,
        modalPaperStatus: false,
        activeName: '1',
        tableData: [],
        submitData: [],
        submitPage: {
          pageNo: 1,
          total: null
        },
        onLineData: [],
        onLinePage: {
          pageNo: 1,
          total: null
        },
        applyTime:'' //订单生成时间
      }
    },
    methods: {
      async pageLoad () {
        const { code, data } = await talent.listApplyRefund({ page: this.page.pageNo, status: this.activeName })
        this.tableData = code === 200 ? data.results : []
        this.page.pageNo = code === 200 ? data.pageNo : 1
        this.page.total = code === 200 ? data.totalCount : 1
      },
      listPassFn (id) {
        this.$confirm('是否确定通过?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.passOrRefund(1, { id })
        })
      },
      rejectValidateFn(value) {
        if (value === '' || !value) return false
      },
      listRejectFn (id) {
        this.$prompt('请输入拒绝理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator: this.rejectValidateFn,
          inputErrorMessage: '拒绝理由不能为空'
        }).then(({ value }) => {
          this.passOrRefund(2, { id, remark: value })
        })
      },
      async passOrRefund (type, params) {
        const request = type === 1 ? talent.passApply : talent.refuseApply
        const { code, msg } = await request(params)
        if (code === 200) {
          this.pageLoad()
          this.$message.success(msg || '操作成功！')
        } else {
          this.$message.error(msg || '操作失败！')
        }
      },
      async mealDetailFn ({ orderId, packageId, customNumber, applyTime }) {
        this.applyTime = applyTime
        this.mealType = packageId
        if (packageId === 0 ) {
          this.mealPutList = customNumber
          await this.getOrderDetail(orderId)
        }
        this.modalStatus = true
      },
      async loadPaperList (orderId) {
        this.orderId = orderId
        await this.loadSubmitData()
        await this.loadOnLineData()
        this.modalPaperStatus = true
      },
      async loadSubmitData () {
        const { code, data } = await talent.listDarenArticle({ orderId: this.orderId, type: 1, page: this.submitPage.pageNo })
        this.submitData = code === 200 ? data.results : []
        this.submitPage.pageNo = code === 200 ? data.pageNo : 1
        this.submitPage.total = code === 200 ? data.totalCount : 1
      },
      async loadOnLineData () {
        const { code, data } = await talent.listDarenArticle({ orderId: this.orderId, type: 2, page: this.onLinePage.pageNo })
        this.onLineData = code === 200 ? data.results : []
        this.onLinePage.pageNo = code === 200 ? data.pageNo : 1
        this.onLinePage.total = code === 200 ? data.totalCount : 1
      },
      closeModalFn () {
        this.orderId = ''
        this.modalStatus = this.btnStatus = this.modalPaperStatus = false
        this.mealType = 0
        this.submitData = this.onLineData = []
        this.mealPutList = []
        this.customDataList = []
        this.customNotice = ''
        this.originalCustom = false
        this.submitPage = {
          pageNo: 1,
          total: null
        }
        this.onLinePage = {
          pageNo: 1,
          total: null
        }
      },
      submitPageChange (val) {
        this.submitPage.pageNo = val
        this.loadSubmitData()
      },
      onLinePageChange (val) {
        this.onLinePage.pageNo = val
        this.loadOnLineData()
      },
      async getOrderDetail(orderId) {
        const { code, data } = await talent.getOldCarDetail({ orderId });
        if (code === 200) {
          const { customPackage, listCustomerPackage } = data
          if(customPackage){// 这是旧的自定义数据
            this.mealPutList = customPackage.listNumber;
            this.originalCustom = true
          }else{ // 这是新的自定义数据
            this.customDataList = listCustomerPackage.list
            this.customNotice = listCustomerPackage.remarks
          }
        }
      }
    },
    created() {
      this.pageLoad()
    }
  }
</script>

<style lang="scss" scoped>
  .box-card {
    /deep/ .el-card__header {
      border-bottom: none;
    }
    /deep/ .el-card__body {
      padding: 0 20px 10px;
    }
    h4 {
      margin: 0;
    }
  }
</style>
