<template>
  <el-container>
    <el-main class="main">
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane label="未审核" name="1">
          <el-header class="header">
            <el-row type="flex" class="row-bg" justify="end">
              <el-col :span="7" class="text-right">
                <el-input v-model="phone" placeholder="请输入查询的手机号" size="small" clearable></el-input>
                <el-button type="primary" size="small" @click="Search">查询</el-button>
              </el-col>
            </el-row>
          </el-header>
          <el-main>
            <el-table :data="noReviewData">
              <el-table-column label="序号" align="center" width="80">
                <template slot-scope="scope">
                  {{ scope.$index + 1 + page.pageSize * (page.pageNo - 1) }}
                </template>
              </el-table-column>
              <el-table-column prop="phone" label="手机号">
              </el-table-column>
              <el-table-column prop="wechatId" label="微信号">
              </el-table-column>
              <el-table-column label="注册时间">
                <template slot-scope="scope">
                  {{ scope.row.createDate ? time(scope.row.createDate) : '' }}
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" plain size="mini" @click="Pass(scope.row.phone)">通过</el-button>
                  <el-button type="primary" plain size="mini" @click="rejectModal(scope.row.phone)">不通过</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
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
        </el-tab-pane>
        <el-tab-pane label="审核通过" name="2">
          <el-header class="header">
            <el-row type="flex" class="row-bg" justify="end">
              <el-col :span="7" class="text-right">
                <el-input v-model="phone" placeholder="请输入查询的手机号" size="small" clearable></el-input>
                <el-button type="primary" size="small" @click="Search">查询</el-button>
              </el-col>
            </el-row>
          </el-header>
          <el-main>
            <el-table :data="reviewData">
              <el-table-column label="序号" align="center" width="80">
                <template slot-scope="scope">
                  {{ scope.$index + 1 + page2.pageSize * (page2.pageNo - 1) }}
                </template>
              </el-table-column>
              <el-table-column prop="phone" label="手机号">
              </el-table-column>
              <el-table-column prop="wechatId" label="微信号">
              </el-table-column>
              <el-table-column label="注册时间">
                <template slot-scope="scope">
                  {{ scope.row.createDate ? time(scope.row.createDate) : '' }}
                </template>
              </el-table-column>
              <el-table-column label="审核时间">
                <template slot-scope="scope">
                  {{ scope.row.checkDate ? time(scope.row.checkDate) : '' }}
                </template>
              </el-table-column>
              <el-table-column prop="invatationCode" label="邀请码">
              </el-table-column>
            </el-table>
          </el-main>
          <el-row type="flex" class="row-bg" justify="end">
            <el-col class="page">
              <el-pagination
                v-show="page2.total"
                @size-change="handleSizeChange2"
                @current-change="handleCurrentChange2"
                :current-page="page2.pageNo"
                :page-sizes="[10, 20, 50]"
                :page-size="page2.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="page2.total">
              </el-pagination>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="审核未通过" name="3">
          <el-header class="header">
            <el-row type="flex" class="row-bg" justify="end">
              <el-col :span="7" class="text-right">
                <el-input v-model="phone" placeholder="请输入查询的手机号" size="small" clearable></el-input>
                <el-button type="primary" size="small" @click="Search">查询</el-button>
              </el-col>
            </el-row>
          </el-header>
          <el-main>
            <el-main>
              <el-table :data="NotReviewData">
                <el-table-column label="序号" align="center" width="80">
                  <template slot-scope="scope">
                    {{ scope.$index + 1 + page3.pageSize * (page3.pageNo - 1) }}
                  </template>
                </el-table-column>
                <el-table-column prop="phone" label="手机号">
                </el-table-column>
                <el-table-column prop="wechatId" label="微信号">
                </el-table-column>
                <el-table-column label="注册时间">
                  <template slot-scope="scope">
                    {{ scope.row.createDate ? time(scope.row.createDate) : '' }}
                  </template>
                </el-table-column>
                <el-table-column label="审核时间">
                  <template slot-scope="scope">
                    {{ scope.row.checkDate ? time(scope.row.checkDate) : '' }}
                  </template>
                </el-table-column>
                <el-table-column prop="checkMsg" label="不通过原因">
                </el-table-column>
              </el-table>
            </el-main>
          </el-main>
          <el-row type="flex" class="row-bg"justify="end">
            <el-col class="page">
              <el-pagination
                v-show="page3.total"
                @size-change="handleSizeChange3"
                @current-change="handleCurrentChange3"
                :current-page="page3.pageNo"
                :page-sizes="[10, 20, 50]"
                :page-size="page3.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="page3.total">
              </el-pagination>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-main>


    <el-dialog title="审核拒绝" :visible.sync="modalStatus" width="30%" center :close-on-click-modal="false" @close="closeModalFn">
      <el-form ref="form" :model="form" label-width="90px">
        <el-form-item label="拒绝理由:" prop="checkMsg" :rules="[ { required: true, message: '拒绝理由不能为空'}]">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="form.checkMsg" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="rejectFn">确定</el-button>
        <el-button type="primary" size="small" plain @click="modalStatus = false">取消</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
  import cps from '@/api/cps'
  import untils from '@/assets/js/untils'

  let vmData = {
    userPhone: '', // 用户手机号
    phone: '', // 搜索手机号
    activeName: '1', // Tab页选项
    modalStatus: false,
    noReviewData: [], // 未审核列表
    reviewData: [], // 审核通过列表
    NotReviewData: [], // 审核未通过列表
    form: {
      checkMsg: '', // 拒绝理由
    },
    page: {
      pageNo: 1,
      pageSize: 10,
      total: null
    },
    page2: {
      pageNo: 1,
      pageSize: 10,
      total: null
    },
    page3: {
      pageNo: 1,
      pageSize: 10,
      total: null
    }
  }

  const noReviewList = () => { // 未审核列表
    cps.cpsNoReview({ page: vmData.page.pageNo, size: vmData.page.pageSize }).then(res => {
      if (res && res.code === 200) {
        vmData.noReviewData = res.data
        vmData.page.pageNo = res.page
        vmData.page.total = res.allCount
      } else {
        vmData.noReviewData = []
        vmData.page.pageNo = 1
        vmData.page.total = null
      }
    })
  }

  const reviewList = () => { // 已通过审核列表
    cps.cpsReview({ page: vmData.page2.pageNo, size: vmData.page2.pageSize }).then(res => {
      if (res && res.code === 200) {
        vmData.reviewData = res.data
        vmData.page2.pageNo = res.page
        vmData.page2.total = res.allCount
      } else {
        vmData.reviewData = []
        vmData.page2.pageNo = 1
        vmData.page2.total = null
      }
    })
  }

  const reviewNotPassList = () => { // 未通过审核列表
    cps.cpsNoPassReview({ page: vmData.page3.pageNo, size: vmData.page3.pageSize }).then(res => {
      if (res && res.code === 200) {
        vmData.NotReviewData = res.data
        vmData.page3.pageNo = res.page
        vmData.page3.total = res.allCount
      } else {
        vmData.NotReviewData = []
        vmData.page3.pageNo = 1
        vmData.page3.total = null
      }
    })
  }

  const searchPhone = () => { // 根据手机号查询列表
    let status = vmData.activeName === '1' ? 1 : vmData.activeName === '2' ? 2 : 0
    cps.cpsByPhone({ status, phone: vmData.phone }).then(res => {
      if (res && res.code === 200) {
        let list = []
        list.push(res.data)
        if (vmData.activeName === '1') {
          vmData.noReviewData = list
          vmData.page.pageNo = 1
          vmData.page.total = list.length
        } else if (vmData.activeName === '2') {
          vmData.reviewData = list
          vmData.page2.pageNo = 1
          vmData.page2.total = list.length
        } else if (vmData.activeName === '3') {
          vmData.NotReviewData = list
          vmData.page3.pageNo = 1
          vmData.page3.total = list.length
        }
      } else {
        if (vmData.activeName === '1') {
          vmData.noReviewData = []
          vmData.page.pageNo = 1
          vmData.page.total = null
        } else if (vmData.activeName === '2') {
          vmData.reviewData = []
          vmData.page2.pageNo = 1
          vmData.page2.total = null
        } else if (vmData.activeName === '3') {
          vmData.NotReviewData = []
          vmData.page3.pageNo = 1
          vmData.page3.total = null
        }
      }
    })
  }

  export default {
    name: 'CpsReview',
    data () {
      return vmData
    },
    watch: {
      activeName (val) {
        vmData.phone = ''
        if (val === '1') {
          noReviewList()
        } else if (val === '2') {
          reviewList()
        } else if (val === '3') {
          reviewNotPassList()
        }
      }
    },
    methods: {
      time (val) {
        return untils.formatTime(val)
      },
      closeModalFn () {
        vmData.form.checkMsg = ''
      },
      Search () {
        if (vmData.activeName === '1') {
          vmData.page.pageNo = 1
          if (vmData.phone !== '') {
            searchPhone()
          } else {
            noReviewList()
          }
        } else if (vmData.activeName === '2') {
          vmData.page2.pageNo = 1
          if (vmData.phone !== '') {
            searchPhone()
          } else {
            reviewList()
          }
        } else if (vmData.activeName === '3') {
          vmData.page3.pageNo = 1
          if (vmData.phone !== '') {
            searchPhone()
          } else {
            reviewNotPassList()
          }
        }
      },
      Pass (userPhone) {
        cps.cpsReviewPass({ status: 2, userPhone, checkMsg: vmData.form.checkMsg }).then(res => {
          if (res && res.code === 200) {
            this.$message({
              message: '审核通过成功！',
              type: 'success',
            });
            noReviewList()
          }else{
            this.$message.error(res.msg)
          }
        })
      },
      rejectModal (userPhone) {
        vmData.modalStatus = true
        vmData.userPhone = userPhone
      },
      rejectFn () {
        this.$refs['form'].validate(valid => {
          if (valid) {
            cps.cpsReviewPass({ status: 0, userPhone: vmData.userPhone, checkMsg: vmData.form.checkMsg }).then(res => {
              if (res && res.code === 200) {
                vmData.modalStatus = false
                this.$message({
                  message: '审核拒绝成功！',
                  type: 'success',
                });
                noReviewList()
              }else{
                this.$message.error(res.msg)
              }
            })
          }
        })
      },
      handleSizeChange(val) {
        vmData.page.pageSize = val
        noReviewList()
      },
      handleCurrentChange(val) {
        vmData.page.pageNo = val
        noReviewList()
      },
      handleSizeChange2(val) {
        vmData.page2.pageSize = val
        reviewList()
      },
      handleCurrentChange2(val) {
        vmData.page2.pageNo = val
        reviewList()
      },
      handleSizeChange3(val) {
        vmData.page3.pageSize = val
        reviewNotPassList()
      },
      handleCurrentChange3(val) {
        vmData.page3.pageNo = val
        reviewNotPassList()
      }
    },
    mounted () {
      noReviewList()
      reviewList()
      reviewNotPassList()
    },
    destroyed () {
      Object.assign(this.$data, {
        userPhone: '', // 用户手机号
        phone: '', // 搜索手机号
        activeName: '1', // Tab页选项
        modalStatus: false,
        noReviewData: [], // 未审核列表
        reviewData: [], // 审核通过列表
        NotReviewData: [], // 审核未通过列表
        form: {
          checkMsg: '', // 拒绝理由
        },
        page: {
          pageNo: 1,
          pageSize: 10,
          total: null
        },
        page2: {
          pageNo: 1,
          pageSize: 10,
          total: null
        },
        page3: {
          pageNo: 1,
          pageSize: 10,
          total: null
        }
      })
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
  }
</style>