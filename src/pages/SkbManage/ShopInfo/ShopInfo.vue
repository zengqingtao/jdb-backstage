<template>
  <el-container class="main">
    <el-header class="header">
      <el-row type="flex" justify="end">
        <el-form inline>
          <el-form-item label="用户来源:" class="mg-l-10">
            <el-select size="small" v-model="osType" placeholder="请选择" clearable>
              <el-option label="京店宝" :value="1"></el-option>
              <el-option label="京大师" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="店铺名称:" class="mg-l-10">
            <el-input class="w200" v-model="shopName" placeholder="请输入店铺名称" size="small" clearable></el-input>
          </el-form-item>
          <el-form-item label="咚咚名称:" class="mg-l-10">
            <el-input class="w200" v-model="contactName" placeholder="请输入咚咚名称" size="small" clearable></el-input>
          </el-form-item>
          <el-form-item label="账号:" class="mg-l-10">
            <el-input class="w200" v-model="jdbAccount" placeholder="请输入账号" size="small" clearable></el-input>
            <el-button type="primary" size="small" @click="searchFn">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-header>

    <el-tabs type="card" v-model="authStatus" @tab-click="tabSwitch">
      <el-tab-pane label="未审核" name="1"></el-tab-pane>
      <el-tab-pane label="通过" name="2"></el-tab-pane>
      <el-tab-pane label="驳回" name="3"></el-tab-pane>
    </el-tabs>

    <el-main>
      <el-table :data="tableData">
        <el-table-column prop="jdbAccount" label="账号">
        </el-table-column>
        <el-table-column prop="source" label="来源">
        </el-table-column>
        <el-table-column prop="typeName" label="店铺类型">
        </el-table-column>
        <el-table-column prop="shopName" label="店铺名称">
        </el-table-column>
        <el-table-column prop="contactName" label="咚咚名称">
        </el-table-column>
        <el-table-column prop="categoryName" label="所属类目">
        </el-table-column>
        <el-table-column prop="createTime" label="绑定时间">
        </el-table-column>
        <el-table-column prop="authStatus" label="状态">
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

    <el-dialog title="驳回理由" :visible.sync="modalStatus" width="30%" center :close-on-click-modal="false" @close="closeModalFn">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="驳回原因:" prop="reviewRemarks" :rules="[ { required: true, message: '驳回原因不能为空'}]">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="form.reviewRemarks" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="btnStatus" @click="FailFn">确定</el-button>
        <el-button type="primary" size="small" plain @click="modalStatus = false">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="`账号：${ DetailInfo.jdbAccount }`" :visible.sync="DetailStatus" width="30%" :close-on-click-modal="false" @close="closeDetailFn">
      <el-form label-width="80px">
        <el-form-item label="店铺类型:">
          <el-radio disabled><img src="../../../assets/img/JDicon.png"></el-radio>
        </el-form-item>
        <el-form-item label="网站地址:">
          <el-input v-model="DetailInfo.shopUrl" size="small" disabled />
        </el-form-item>
        <el-form-item label="所属类目:">
          <el-row type="flex" :gutter="10">
            <el-col>
              <el-select size="small" v-model="DetailInfo.categoryId" disabled placeholder="请选择">
                <el-option
                  v-for="item in categoryList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="店铺名称:">
          <el-input v-model="DetailInfo.shopName" size="small" disabled />
        </el-form-item>
        <el-form-item label="咚咚名称:">
          <el-input v-model="DetailInfo.contactName" size="small" disabled />
        </el-form-item>
        <el-form-item label="验证码:">
          <el-input v-model="DetailInfo.code" size="small" disabled />
        </el-form-item>
        <el-form-item label="商品链接:">
          <el-input v-model="DetailInfo.goodsUrl" size="small" disabled />
        </el-form-item>
        <el-form-item label="审核状态:">{{ DetailInfo.authStatus }}</el-form-item>
        <el-form-item v-if="DetailInfo.authCode === 3" label="驳回理由:">{{ DetailInfo.reason }}</el-form-item>
      </el-form>
      <el-row class="mg-t-10" type="flex" justify="center" v-show="DetailInfo.authCode === 1 && canAuthStatus">
        <el-button type="primary" size="small" :loading="btnStatus" @click="PassFn(DetailInfo.id)">通过</el-button>
        <el-button type="primary" size="small" :loading="btnStatus" plain @click="id = DetailInfo.id, modalStatus = true">驳回</el-button>
      </el-row>
      <el-row slot="footer" type="flex" justify="space-between">
        <el-button :disabled="!DetailInfo.lastId" type="primary" size="small" plain @click="lastDetail(DetailInfo.lastId)">上一条</el-button>
        <el-button :disabled="!DetailInfo.nextId" type="primary" size="small" plain @click="nextDetail(DetailInfo.nextId)">下一条</el-button>
      </el-row>
    </el-dialog>

  </el-container>
</template>

<script>
import testGuest from 'api/testGuest'

export default {
  name: 'ShopInfo',
  data () {
    return {
      canAuthStatus: false,
      osType: '',
      id: '',
      DetailStatus: false,
      btnStatus: false,
      modalStatus: false,
      authStatus: '1',
      shopName: '',
      contactName: '',
      jdbAccount: '',
      tableData: [], // 表格数据
      DetailInfo: {},
      form: {
        reviewRemarks: ''
      },
      page: { // 分页数据
        pageNo: 1,
        total: null
      },
      categoryList: [
        {
          id: 1,
          label: '服装鞋包'
        },
        {
          id: 2,
          label: '手机数码'
        },
        {
          id: 3,
          label: '家用电器'
        },
        {
          id: 4,
          label: '美妆饰品'
        },
        {
          id: 5,
          label: '母婴用品'
        },
        {
          id: 6,
          label: '百货建材'
        },
        {
          id: 7,
          label: '美食特产'
        },
        {
          id: 8,
          label: '运动户外'
        },
        {
          id: 9,
          label: '文化娱乐'
        },
        {
          id: 10,
          label: '日用家居'
        }
      ]
    }
  },
  methods: {
    async getCanAuthStatus () {
      const res = await testGuest.canAuth()
      this.canAuthStatus = res
    },
    pageLoad () {
      testGuest.getBindShopList({ osType: this.osType, page: this.page.pageNo, authStatus: this.authStatus, jdbAccount	: this.jdbAccount, shopName: this.shopName, contactName: this.contactName }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.results
          this.page.pageNo = res.data.pageNo
          this.page.total = res.data.totalCount
        } else {
          this.tableData = []
          this.page.pageNo = 1
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
    closeDetailFn () {
      this.DetailStatus = false
      this.id = ''
      this.DetailInfo = {}
    },
    detailShow (id) {
      this.DetailStatus = true
      testGuest.getBindShopDetailById({ id, osType: this.osType, authStatus: this.authStatus, jdbAccount	: this.jdbAccount, shopName: this.shopName, contactName: this.contactName }).then(res => {
        if (res.code === 200) {
          this.DetailInfo = res.data
        } else {
          this.DetailInfo = {}
        }
      })
    },
    nextDetail (id) {
      testGuest.getBindShopDetailById({ id, osType: this.osType, authStatus: this.authStatus, jdbAccount	: this.jdbAccount, shopName: this.shopName, contactName: this.contactName }).then(res => {
        if (res.code === 200) {
          this.DetailInfo = res.data
        } else {
          this.DetailInfo = {}
        }
      })
    },
    lastDetail (id) {
      testGuest.getBindShopDetailById({ id, osType: this.osType, authStatus: this.authStatus, jdbAccount	: this.jdbAccount, shopName: this.shopName, contactName: this.contactName }).then(res => {
        if (res.code === 200) {
          this.DetailInfo = res.data
        } else {
          this.DetailInfo = {}
        }
      })
    },
    PassFn (id) {
      this.btnStatus = true
      testGuest.authPass({ id }).then(res => {
        this.btnStatus = false
        if (res.code === 200) {
          this.$message({
            message: '审核通过成功！',
            type: 'success',
          })
          this.detailShow(id)
          this.pageLoad()
        } else {
          this.$message({
            message: res.msg,
            type: 'error',
          })
        }
      })
    },
    FailFn () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnStatus = true
          testGuest.authFail({ id: this.id, reason: this.form.reviewRemarks }).then(res => {
            this.closeModalFn()
            this.btnStatus = false
            if (res.code === 200) {
              this.$message({
                message: '审核驳回成功！',
                type: 'success',
              })
              this.detailShow(this.id)
              this.pageLoad()
            } else {
              this.$message({
                message: res.msg,
                type: 'error',
              })
            }
          })
        }
      })
    },
  },
  created () {
    this.authStatus = this.$route.query.authStatus ? this.$route.query.authStatus : this.authStatus
    this.pageLoad()
    this.getCanAuthStatus()
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
    }
    .el-button--mini.is-plain {
      min-width: 68px !important;
    }
    .el-dialog {
      .el-form-item {
        padding: 0 5%;
        margin-bottom: 10px;
      }
    }
  }
  /deep/ .el-input.is-disabled .el-input__inner {
    color: #606266;
    cursor: text;
  }
  .w200 {
    width: 200px !important;
  }
</style>
