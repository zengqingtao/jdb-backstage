<template>
  <el-container>
    <el-main class="main">
      <el-tabs type="card" v-model="moduleId" @tab-click="tabSwitch">
        <el-tab-pane v-for="item in parentModule" :key="item.id" :label="item.name" :name="item.id.toString()"></el-tab-pane>
      </el-tabs>

      <el-header class="header">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="6">
          </el-col>
          <el-col :span="7" :offset="5" class="text-right">
            <el-select class="mg-r-5 mg-b-5" v-model="authStatus" clearable placeholder="请选择" size="small">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button type="primary" size="small" @click="search">查询</el-button>
          </el-col>
        </el-row>
      </el-header>

      <el-row>
        <el-col>
          <el-table :data="tableData">
            <el-table-column prop="createTime" label="提交时间">
            </el-table-column>
            <el-table-column label="模块">
              <template slot-scope="scope">
                <div v-if="scope.row.tableModuleName.length > 0" v-for="(item, index) in scope.row.tableModuleName" :key="index">{{ item }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="提交内容">
            </el-table-column>
            <el-table-column prop="username" label="提交用户">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div v-if="scope.row.authStatus === 1">
                  <el-button type="primary" plain size="mini" @click="handleFeedback(2, scope.row.id)">采纳</el-button>
                  <el-button type="primary" plain size="mini" @click="handleFeedback(3, scope.row.id)">不采纳</el-button>
                </div>
                <div v-else-if="scope.row.authStatus === 2">已采纳</div>
                <div v-else-if="scope.row.authStatus === 3">不采纳</div>
              </template>
            </el-table-column>
            <el-table-column label="处理时间">
              <template slot-scope="scope">
                {{ scope.row.updateTime && scope.row.authStatus !== 1 ? scope.row.updateTime : '' }}
              </template>
            </el-table-column>
            <el-table-column label="备注">
              <template slot-scope="scope">
                <div v-if="scope.row.authStatus === 2">赠送京币：{{ scope.row.jdNum }}</div>
                <div v-if="scope.row.authStatus === 2 || scope.row.authStatus === 3">反馈意见：{{ scope.row.authContent }}</div>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <el-row type="flex" class="row-bg" justify="end">
        <el-col class="page">
          <el-pagination
            v-show="page.total"
            @current-change="handleCurrentChange"
            :current-page="page.pageNo"
            :page-size="20"
            layout="total, prev, pager, next, jumper"
            :total="page.total">
          </el-pagination>
        </el-col>
      </el-row>
    </el-main>

    <el-dialog title="反馈意见" :visible.sync="modalStatus" width="30%" center :close-on-click-modal="false" @close="closeModalFn">
      <el-form ref="form" label-width="75px">
        <el-form-item label="反馈意见:">
          <el-input type="textarea" :rows="4" placeholder="请填写反馈意见" v-model="content" clearable></el-input>
        </el-form-item>
        <el-form-item label="赠送京币:" v-show="feedBackStatus === 2">
          <el-input type="text" placeholder="赠送京币(5~30)" v-model="jbNum" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="btnStatus" @click="submit">提交</el-button>
        <el-button type="primary" size="small" plain @click="modalStatus = false">取消</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import { getJdbProductModule, getFeedbackList, authFeedback } from '../../../api/feedback'
import { mapState } from 'vuex'

let vmData = {
  authStatus: '',
  options: [
    {
      label: '未处理',
      value: '1'
    },
    {
      label: '采纳',
      value: '2'
    },
    {
      label: '未采纳',
      value: '3'
    },
  ],
  moduleId: '1',
  moduleName: '',
  parentModule: [],
  tableData: [],
  page: {
    pageNo: 1,
    total: null
  },
  feedBackId: '',
  feedBackStatus: null,
  modalStatus: false,
  content: '',
  jbNum: '',
  btnStatus: false
}
export default {
  name: 'FeedBackList',
  data () {
    return vmData
  },
  computed: {
    ...mapState(['jdb_userInfo']),
  },
  methods: {
    closeModalFn () {
      vmData.content = ''
      vmData.jbNum = ''
      vmData.btnStatus = false
    },
    tabSwitch (val) {
      vmData.page.pageNo = 1
      vmData.moduleName = val.label
      vmData.authStatus = ''
      this.getList()
    },
    search () {
      vmData.page.pageNo = 1
      this.getList()
    },
    getList () {
      getFeedbackList({ userId: this.jdb_userInfo.id, moduleId: Number(vmData.moduleId), page: vmData.page.pageNo, authStatus: vmData.authStatus }).then(res => {
        if (res.code === 200) {
          vmData.tableData = res.data.results
          vmData.page.pageNo = res.data.pageNo
          vmData.page.total = res.data.totalCount
          vmData.tableData.forEach(item => {
            item.tableModuleName = []
            if (item.moduleNames.length > 0) {
              item.moduleNames.forEach(data => {
                item.tableModuleName.push(`${vmData.moduleName}-${data}`)
              })
            } else {
              item.tableModuleName.push(vmData.moduleName)
            }
          })
        } else {
          vmData.tableData = []
          vmData.page.pageNo = 1
          vmData.page.total = null
        }
      })
    },
    handleCurrentChange (val) {
      vmData.page.pageNo = val
      this.getList()
    },
    handleFeedback (status,id) {
      vmData.modalStatus = true
      vmData.feedBackId = id
      vmData.feedBackStatus = status
    },
    submit () {
      if (Number(vmData.feedBackStatus) === 2) {
        if (vmData.jbNum && Number(vmData.jbNum) > 0) {
          vmData.btnStatus = true
          authFeedback({ userId: this.jdb_userInfo.id, authType: vmData.feedBackStatus, id: vmData.feedBackId, content: vmData.content, jbNum: vmData.jbNum }).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '提交成功！',
                type: 'success',
              });
              vmData.modalStatus = false
              this.getList()
            } else {
              this.$message({
                message: res.msg,
                type: 'error',
              });
              vmData.btnStatus = false
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '赠送京币金额必须大于0'
          })
        }
      } else if (Number(vmData.feedBackStatus) === 3) {
        vmData.btnStatus = true
        authFeedback({ userId: this.jdb_userInfo.id, authType: vmData.feedBackStatus, id: vmData.feedBackId, content: vmData.content, jbNum: vmData.jbNum }).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '提交成功！',
              type: 'success',
            });
            vmData.modalStatus = false
            this.getList()
          } else {
            this.$message.error(res.msg)
            vmData.btnStatus = false
          }
        })
      }
    },
    Mounted () {
      const tabs = () => {
        return new Promise((resolve => {
          getJdbProductModule({ parentId: 0 }).then(res => {
            if (res.code === 200 && res.data.length > 0) {
              vmData.parentModule = res.data
              vmData.moduleId = res.data[0].id.toString()
              vmData.moduleName = vmData.parentModule[0].name
              resolve(res)
            }
          })
        }))
      }
      const list = () => {
        return new Promise((resolve => {
          resolve(this.getList())
        }))
      }
      tabs().then(res => {
        if (res.code === 200 && vmData.moduleName !== '') {
          return list()
        }
      })
    }
  },
  mounted () {
    this.Mounted()
  },
  destroyed () {
    Object.assign(this.$data, {
      authStatus: '',
      options: [
        {
          label: '未处理',
          value: '1'
        },
        {
          label: '采纳',
          value: '2'
        },
        {
          label: '未采纳',
          value: '3'
        },
      ],
      moduleId: '1',
      moduleName: '',
      parentModule: [],
      tableData: [],
      page: {
        pageNo: 1,
        total: null
      },
      feedBackId: '',
      feedBackStatus: null,
      modalStatus: false,
      content: '',
      jbNum: '',
      btnStatus: false
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
    .parent-main {
      .child-main {
        margin: 20px;
      }
    }
  }
</style>
