<template>
  <el-container>
    <el-main class="main">
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane label="未审核" name="1">
          <el-header class="header">
            <el-row type="flex" class="row-bg" justify="end">
              <el-col :span="7" class="text-right">
                <el-input v-model="name" placeholder="请输入要查询的达人号" size="small" clearable></el-input>
                <el-button type="primary" size="small" @click="Search">查询</el-button>
              </el-col>
            </el-row>
          </el-header>
          <el-main>
            <el-table :data="noReviewData">
              <el-table-column label="头像">
                <template slot-scope="scope">
                  <img :src="scope.row.avatarUrl" width="39" height="39">
                </template>
              </el-table-column>
              <el-table-column prop="name" label="达人号">
              </el-table-column>
              <el-table-column prop="domain" label="所属领域">
              </el-table-column>
              <el-table-column label="拥有渠道">
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.channel" :key="index">{{ item.channelName }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="添加时间">
              </el-table-column>
              <el-table-column prop="description" label="达人描述">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-row class="mg-b-5">
                    <el-button type="primary" plain size="mini" @click="Pass(scope.row.id)">通过</el-button>
                  </el-row>
                  <el-row>
                    <el-button type="primary" plain size="mini" @click="rejectModal(scope.row.id)">不通过</el-button>
                  </el-row>
                </template>
              </el-table-column>
              <!--<el-table-column prop="authTime" label="操作时间">-->
              <!--</el-table-column>-->
            </el-table>
          </el-main>
          <el-row type="flex" class="row-bg" justify="end">
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
                <el-input v-model="name" placeholder="请输入要查询的达人号" size="small" clearable></el-input>
                <el-button type="primary" size="small" @click="Search">查询</el-button>
              </el-col>
            </el-row>
          </el-header>
          <el-main>
            <el-table :data="reviewData">
              <el-table-column label="头像">
                <template slot-scope="scope">
                  <img :src="scope.row.avatarUrl" width="39" height="39">
                </template>
              </el-table-column>
              <el-table-column prop="name" label="达人号">
              </el-table-column>
              <el-table-column prop="domain" label="所属领域">
              </el-table-column>
              <el-table-column label="拥有渠道">
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.channel" :key="index">{{ item.channelName }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="添加时间">
              </el-table-column>
              <el-table-column prop="description" label="达人描述">
              </el-table-column>
            </el-table>
          </el-main>
          <el-row type="flex" class="row-bg"justify="end">
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
                <el-input v-model="name" placeholder="请输入要查询的达人号" size="small" clearable></el-input>
                <el-button type="primary" size="small" @click="Search">查询</el-button>
              </el-col>
            </el-row>
          </el-header>
          <el-main>
            <el-table :data="noPassData">
              <el-table-column label="头像">
                <template slot-scope="scope">
                  <img :src="scope.row.avatarUrl" width="39" height="39">
                </template>
              </el-table-column>
              <el-table-column prop="name" label="达人号">
              </el-table-column>
              <el-table-column prop="domain" label="所属领域">
              </el-table-column>
              <el-table-column label="拥有渠道">
                <template slot-scope="scope">
                  <div v-for="(item, index) in scope.row.channel" :key="index">{{ item.channelName }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="添加时间">
              </el-table-column>
              <el-table-column prop="description" label="达人描述">
              </el-table-column>
              <el-table-column prop="reason" label="备注">
              </el-table-column>
            </el-table>
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
        <el-form-item label="拒绝理由:" prop="reason" :rules="[ { required: true, message: '拒绝理由不能为空'}]">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="form.reason" clearable></el-input>
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
import talent from '@/api/talent'

let vmData = {
  id: '', // 登录用户ID
  name: '', // 搜索达人号
  activeName: '1', // Tab页选项
  modalStatus: false,
  noReviewData: [],
  reviewData: [],
  noPassData: [],
  form: {
    reason: '', // 拒绝理由
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
  talent.noReview({ page: vmData.page.pageNo, name: vmData.name }).then(res => {
    if (res && res.code === 200) {
      vmData.noReviewData = res.data.results
      vmData.page.pageNo = res.data.pageNo
      vmData.page.total = res.data.totalCount
    } else {
      vmData.noReviewData = []
      vmData.page.pageNo = 1
      vmData.page.total = null
    }
  })
}

const reviewList = () => { // 已审核列表
  talent.review({ page: vmData.page2.pageNo, name: vmData.name }).then(res => {
    if (res && res.code === 200) {
      vmData.reviewData = res.data.results
      vmData.page2.pageNo = res.data.pageNo
      vmData.page2.total = res.data.totalCount
    } else {
      vmData.reviewData = []
      vmData.page2.pageNo = 1
      vmData.page2.total = null
    }
  })
}

const noPassReview = () => {
  talent.noPassReview({ page: vmData.page3.pageNo, name: vmData.name }).then(res => {
    if (res && res.code === 200) {
      vmData.noPassData = res.data.results
      vmData.page3.pageNo = res.data.pageNo
      vmData.page3.total = res.data.totalCount
    } else {
      vmData.noPassData = []
      vmData.page3.pageNo = 1
      vmData.page3.total = null
    }
  })
}

export default {
  name: 'Audits',
  data () {
    return vmData
  },
  watch: {
    activeName (val) {
      vmData.name = ''
      if (val === '1') {
        noReviewList()
      } else if (val === '2') {
        reviewList()
      } else if (val === '3') {
        noPassReview()
      }
    }
  },
  methods: {
    closeModalFn () {
      vmData.form.reason = ''
    },
    Search () {
      if (vmData.activeName === '1') {
        vmData.page.pageNo = 1
        noReviewList()
      } else if (vmData.activeName === '2') {
        vmData.page2.pageNo = 1
        reviewList()
      } else if (vmData.activeName === '3') {
        vmData.page3.pageNo = 1
        noPassReview()
      }
    },
    Pass (id) {
      talent.reviewPass({ status: 2, id, reason: vmData.form.reason }).then(res => {
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
    rejectModal (id) {
      vmData.modalStatus = true
      vmData.id = id
    },
    rejectFn () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          talent.reviewPass({ status: 3, id: vmData.id, reason: vmData.form.reason }).then(res => {
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
      noPassReview()
    },
    handleCurrentChange3(val) {
      vmData.page3.pageNo = val
      noPassReview()
    }
  },
  mounted () {
    noReviewList()
    reviewList()
    noPassReview()
  },
  destroyed () {
    Object.assign(this.$data, {
      id: '', // 登录用户ID
      name: '', // 搜索达人号
      activeName: '1', // Tab页选项
      modalStatus: false,
      noReviewData: [],
      reviewData: [],
      noPassData: [],
      form: {
        reason: '', // 拒绝理由
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
    .el-button--mini.is-plain {
      min-width: 68px !important;
    }
  }
</style>