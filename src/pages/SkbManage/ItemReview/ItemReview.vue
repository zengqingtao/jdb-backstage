<template>
  <el-container class="main">
    <el-header class="header">
      <el-row type="flex" justify="end">
        <el-form inline>
          <el-form-item label="用户来源:">
            <el-select size="small" v-model="osType" placeholder="请选择" clearable>
              <el-option label="京店宝" :value="1"></el-option>
              <el-option label="京大师" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动名称:">
            <el-input class="w200" v-model="title" placeholder="请输入活动名称" size="small" clearable></el-input>
          </el-form-item>
          <el-form-item label="店铺名称:">
            <el-input class="w200" v-model="shopName" placeholder="请输入店铺名称" size="small" clearable></el-input>
          </el-form-item>
          <el-form-item label="账号:">
            <el-input class="w200" v-model="jdbAccount" placeholder="请输入账号" size="small" clearable></el-input>
            <el-button type="primary" size="small" @click="searchFn">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-header>

    <el-tabs type="card" v-model="activeName" @tab-click="tabSwitch">
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
        <el-table-column prop="releaseTime" label="发布时间">
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
            <el-button type="text" size="small" @click="linkDetails(scope.row.id)">查看详情</el-button>
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
        <el-form-item label="备注:" prop="reviewRemarks" :rules="[{required: true, message: '备注不能为空'}]">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="form.reviewRemarks" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="btnStatus">确定</el-button>
        <el-button type="primary" size="small" plain @click="modalStatus = false">取消</el-button>
      </span>
    </el-dialog>

  </el-container>
</template>

<script>
import { mapMutations } from 'vuex'
import testGuest from 'api/testGuest'

export default {
  name: 'ItemReview',
  data () {
    return {
      osType: '',
      btnStatus: false,
      modalStatus: false,
      form: {
        reviewRemarks: ''
      },
      activeName: '0',
      title: '',
      shopName: '',
      jdbAccount: '',
      tableData: [],
      page: {
        pageNo: 1,
        total: null
      },
    }
  },
  methods: {
    ...mapMutations(['initQuery']),
    pageLoad () {
      testGuest.getShikeOrderListForManage({ osType: this.osType, page: this.page.pageNo, status: this.activeName, title: this.title, shopName: this.shopName, jdbAccount: this.jdbAccount }).then(res => {
        if (res.code === 200) {
          this.page.pageNo = res.data.pageNo
          this.tableData = res.data.results
          this.page.total = res.data.totalCount
        } else {
          this.page.pageNo = 1
          this.tableData = []
          this.page.total = null
        }
      })
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
      this.modalStatus = false
      this.form.reviewRemarks = ''
    },
    linkDetails (id) {
      let query = { pageNo: this.page.pageNo }
      this.initQuery(query)
      this.$router.push({ path: '/SkbManage/ItemReview/Details', query: { id, title: this.title, shopName: this.shopName, jdbAccount: this.jdbAccount, status: this.activeName, osType: this.osType  } })
    }
  },
  mounted () {
    this.activeName = this.$route.query.activeName ? this.$route.query.activeName : this.activeName
    this.pageLoad()
  }
}
</script>

<style lang="scss" scoped>
  .main {
    padding: 30px 0 0 0;
    .el-tabs__item.is-active {
      background-color: #3489fe;
    }
    .header {
      height: auto !important;
      .el-main {
        padding-top: 0 !important;
      }
      .el-input {
        width: 75%;
        margin-right: 10px;
      }
      .w200 {
        width: 200px;
      }
    }
    .el-button--mini.is-plain {
      min-width: 68px !important;
    }
  }
</style>