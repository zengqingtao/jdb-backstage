<template>
  <el-container class="main">
    <el-header class="header">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="6"></el-col>
        <el-col :span="7" :offset="5" class="text-right">
          <el-input v-model="search" placeholder="请输入商品标题、订单号、京东账号" size="small" clearable></el-input>
          <el-button type="primary" size="small" @click="searchFn">查询</el-button>
        </el-col>
      </el-row>
    </el-header>

    <el-tabs type="card" v-model="activeName" @tab-click="tabSwitch">
      <el-tab-pane label="未审核" name="0"></el-tab-pane>
      <el-tab-pane label="审核通过" name="1"></el-tab-pane>
      <el-tab-pane label="审核不通过" name="2"></el-tab-pane>
    </el-tabs>

    <el-main>
      <el-table :data="tableData">
        <el-table-column label="商品">
          <template slot-scope="scope">
            <div>
              <img class="itemImg" :src="scope.row.img">
            </div>
            <a tag="div" class="overText" :href="scope.row.url" target="_Blank">{{ scope.row.title }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="orderNumber" label="订单号">
        </el-table-column>
        <el-table-column prop="jdAccount" label="京东账号">
        </el-table-column>
        <el-table-column :width="150" label="订单截图">
          <template slot-scope="scope">
            <el-row class="mg-b-10">
              <el-button type="primary" plain size="mini" @click="imgModalFn(scope.row, 1, 1)">第一次订单截图</el-button>
            </el-row>
            <el-row class="mg-b-10">
              <el-button type="primary" plain size="mini" @click="imgModalFn(scope.row, 1, 2)">第二次订单截图</el-button>
            </el-row>
            <el-row>
              <el-button type="primary" plain size="mini" @click="imgModalFn(scope.row, 1, 3)">第三次订单截图</el-button>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column :width="150" label="好评截图">
          <template slot-scope="scope">
            <el-row class="mg-b-10">
              <el-button type="primary" plain size="mini" @click="imgModalFn(scope.row, 2, 1)">第一次评价截图</el-button>
            </el-row>
            <el-row class="mg-b-10">
              <el-button type="primary" plain size="mini" @click="imgModalFn(scope.row, 2, 2)">第二次评价截图</el-button>
            </el-row>
            <el-row>
              <el-button type="primary" plain size="mini" @click="imgModalFn(scope.row, 2, 3)">第三次评价截图</el-button>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="cashBack" label="返现金额">
        </el-table-column>
        <el-table-column prop="postage" label="邮费">
        </el-table-column>
        <el-table-column width="150" label="商家备注">
          <template slot-scope="scope">
            <div v-html="scope.row.remarks"></div>
          </template>
        </el-table-column>
        <el-table-column label="审核">
          <template slot-scope="scope">
            <el-row v-if="scope.row.status === 0">
              <div class="mg-b-10">
                <el-button type="primary" plain size="mini" @click="PassOrReject(scope.row.id, 1)">通过</el-button>
              </div>
              <div>
                <el-button type="primary" plain size="mini" @click="PassOrReject(scope.row.id, 2)">不通过</el-button>
              </div>
            </el-row>
            <el-row v-else-if="scope.row.status === 1">通过</el-row>
            <el-row v-else-if="scope.row.status === 2">不通过</el-row>
          </template>
        </el-table-column>
        <el-table-column prop="reviewRemarks" label="审核备注">
        </el-table-column>
        <el-table-column width="100" label="操作时间">
          <template  slot-scope="scope">
            {{ scope.row.changeTime? changeTimeFn(scope.row.changeTime) : null }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作人">
        </el-table-column>
      </el-table>
      <el-row type="flex" class="row-bg"justify="end">
        <el-col class="page">
          <el-pagination
            v-show="page.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.pageNo"
            :page-sizes="[10, 20, 50]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total">
          </el-pagination>
        </el-col>
      </el-row>
    </el-main>

    <el-dialog :title="modalType === 1 ? '审核通过' : '审核拒绝'" :visible.sync="modalStatus" width="30%" center :close-on-click-modal="false" @close="closeModalFn">
      <el-form ref="form" :model="form" label-width="55px">
        <el-form-item label="备注:" prop="reviewRemarks" :rules="[ { required: true, message: '备注不能为空'}]">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="form.reviewRemarks" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submitFn" :loading="btnStatus">确定</el-button>
        <el-button type="primary" size="small" plain @click="modalStatus = false">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="ModalTitle" :visible.sync="imageModalStatus" width="35%" center :close-on-click-modal="false">
      <el-carousel height="500" ref="carousel" trigger="click" indicator-position="outside" :autoplay="false"  @change="handleChange">
        <el-carousel-item name="index" v-for="(item, index) in imageArry" :key="index">
          <img :src="item">
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </el-container>
</template>

<script>
import Try from 'api/try'
import untils from 'js/untils'
import { mapState } from 'vuex'

export default {
  name: 'Details',
  data () {
    return {
      imageIndex: 1,
      btnStatus: false,
      imageArry: [],
      imageModalType: 1,
      imageModalStatus: false,
      modalId: '',
      modalType: 1,
      modalStatus: false,
      form: {
        reviewRemarks: ''
      },
      tryId: '',
      activeName: '0',
      search: '',
      tableData: [], // 表格数据
      page: { // 分页数据
        pageNo: 1,
        pageSize: 10,
        total: null
      },
    }
  },
  computed: {
    ...mapState(['jdb_userInfo']),
    ModalTitle () {
      if (this.imageModalType === 1) {
        if (this.imageIndex === 1) {
          return '第一次订单截图'
        } else if (this.imageIndex === 2) {
          return '第二次订单截图'
        } else {
          return '第三次订单截图'
        }
      } else {
        if (this.imageIndex === 1) {
          return '第一次评价截图'
        } else if (this.imageIndex === 2) {
          return '第二次评价截图'
        } else {
          return '第三次评价截图'
        }
      }
    }
  },
  methods: {
    handleChange (val) {
      this.imageIndex = val + 1
    },
    changeTimeFn (val) {
      return untils.formatTime(val)
    },
    pageLoad () {
      Try.listTryReview({ tryId: this.tryId, type: this.activeName, search: this.search, page: this.page.pageNo, size: this.page.pageSize }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data
          this.page.pageNo = res.page
          this.page.total = res.allCount
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
    handleSizeChange (val) {
      this.page.pageSize = val
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
      this.modalId = ''
      this.modalType = 1
      this.modalStatus = false
      this.form.reviewRemarks = ''
    },
    PassOrReject (id, status) {
      this.modalId = id
      this.modalType = status
      this.modalStatus = true
    },
    submitFn () {
      const status = this.modalType
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnStatus = true
          Try.tryReview({ userId: this.userInfo.id, id: this.modalId, status, reviewRemarks: this.form.reviewRemarks }).then(res => {
            if (res.code === 200) {
              this.closeModalFn()
              this.pageLoad()
              this.$message({
                message: status === 1 ? '审批通过成功！': '审批拒绝成功！',
                type: 'success',
              })
            }
            this.btnStatus = false
          })
        }
      })
    },

    imgModalFn (row, type, index) {
      this.imageIndex = index
      setTimeout(()=>{
        this.$nextTick(() => {
          this.$refs.carousel.setActiveItem(index - 1)
        })
      },200)
      this.imageModalStatus = true
      this.imageModalType = type
      let arry = this.imageArry = []
      if (type === 1) {
        arry.push(row.oneScreenshot, row.twoScreenshot, row.threeScreenshot)
      } else {
        arry.push(row.onePraise, row.twoPraise, row.threePraise)
      }
      this.imageArry = arry
    }
  },
  created () {
    this.tryId = this.$route.query.id
  },
  mounted () {
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
      .titleImg {
        text-align: center;
      }
      .el-main {
        padding-top: 0 !important;
      }
      .el-input {
        width: 75%;
        margin-right: 10px;
      }
    }
    .parent-main {
      .child-main {
        margin: 20px;
      }
    }
    .itemImg {
      width: 80px;
      height: 80px;
    }
    .el-button--mini.is-plain {
      min-width: 68px !important;
    }
  }
  /deep/ .el-dialog__body {
    height: 600px;
    overflow: auto;
    /deep/ .el-carousel__container {
      height: 600px;
    }
    .el-carousel__item {
      height: 600px;
      text-align: center;
      img {
        width: 350px;
        max-height: 600px;
      }
    }
  }
  .overText {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    word-break: break-all;
  }
</style>