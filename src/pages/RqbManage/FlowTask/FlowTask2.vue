<template>
  <div class="my-task">
    <div class="search-doyen-top">
      <div class="flow-type-nav">
        <div class="flow-type-item" :class="{active:flowType===1}" @click="flowTypeChange(1)">任务</div>
        <div class="flow-type-item" :class="{active:flowType===2}" @click="flowTypeChange(2)">异常任务</div>
      </div>
    </div>
    <div class="search-doyen-right">
      <div class="search-right">
        <el-select v-model="serviceValue" @change="serviceTypeChange" size="mini">
          <el-option
            v-for="item in serviceList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="taskTypeValue" @change="taskTypeChange" size="mini">
          <el-option
            v-for="item in taskTypes[serviceValue]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="执行开始时间"
          end-placeholder="执行结束时间"
          size="mini"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
        <el-input class="task-sku" size="mini" v-model="sku" placeholder="商品sku/直播间ID">
          <i class="el-icon-search el-input__icon" slot="prefix"></i>
        </el-input>
        <el-input class="task-account" size="mini" v-model="jdbAccount" placeholder="登录手机号">
          <i class="el-icon-search el-input__icon" slot="prefix"></i>
        </el-input>
        <div class="search-check-btn" @click="page.pageNo = 1;getTaskList(flowType)">查询</div>
      </div>
    </div>
    <div class="flow-table">
      <el-row class="table-header">
        <el-col :span="6">链接</el-col>
        <el-col :span="4">店铺/直播间</el-col>
        <el-col :span="2">平台</el-col>
        <el-col :span="2">任务类型</el-col>
        <el-col :span="2">任务状态</el-col>
        <el-col :span="2">支付金额</el-col>
        <el-col :span="2">登录手机号</el-col>
        <el-col :span="2">归属BD</el-col>
        <el-col :span="2">操作</el-col>
      </el-row>
    </div>
    <div v-loading="tableLoading">
      <task-table-item
        v-for="(item,index) in tableData"
        :key="index"
        :data="item"
        :flowType="flowType"
      ></task-table-item>
    </div>
    <y-pagination
      :page="page"
      justify="end"
      @size-change="getTaskList(flowType)"
      @current-change="getTaskList(flowType)"
    ></y-pagination>
  </div>
</template>
<script>
import taskTableItem from './taskTableItem'
import YPagination from 'components/pagination'
import rqbManager from 'api/rqbManager'
// import { taskList } from '../../../api/myTask.js'

export default {
  components: {
    taskTableItem,
    YPagination
  },
  data() {
    return {
      flowType: 1,
      sku: '',
      date: '',
      jdbAccount: '',
      tableData: [],
      tableLoading: false,
      tableTotalCount: 0,
      serviceList: [
        { value: 0, label: '全部平台' },
        { value: 1, label: '京东' },
        { value: 2, label: '淘宝天猫' },
        { value: 3, label: '拼多多' }
      ], //平台数据
      serviceValue: 0,
      taskTypes: {
        0: [{ value: 0, label: '全部任务类型' }],
        1: [
          { value: 0, label: '全部' },
          { value: 1, label: '人气排名提升' },
          { value: 2, label: '流量点击' },
          { value: 3, label: '商品加购' },
          { value: 4, label: '商品关注' },
          { value: 5, label: '店铺关注' },
          { value: 6, label: '京东快车' },
          { value: 7, label: '京东直播' },
          { value: 8, label: '商品预约' },
          { value: 9, label: '秒杀提醒' },
          { value: 10, label: '京挑客' },
          { value: 11, label: '无痕点击' }
        ],
        2: [
          { value: 0, label: '全部' },
          { value: 1, label: '人气套餐' },
          { value: 2, label: '流量点击' },
          { value: 3, label: '商品加购' },
          { value: 4, label: '商品收藏' },
          { value: 5, label: '店铺关注' },
          { value: 12, label: '淘宝领券' }
        ],
        3: [
          { value: 0, label: '全部' },
          { value: 1, label: '人气套餐' },
          { value: 2, label: '流量点击' },
          { value: 4, label: '商品收藏' },
          { value: 5, label: '店铺关注' }
        ]
      },
      taskTypeValue: 0,
      page: {
        pageNo: 1,
        pageSize: 10,
        total: null
      },
      noResultsTime: 0
    }
  },
  created() {
    this.getTaskList(this.flowType)
  },
  methods: {
    async getTaskList(type) {
      const sendData = {
        platform: this.serviceValue,
        taskType: this.taskTypeValue,
        sku: this.sku,
        startTime: this.date ? this.date[0] : '',
        endTime: this.date ? this.date[1] : '',
        jdbAccount: this.jdbAccount,
        page: this.page.pageNo,
        size: this.page.pageSize
      }
      console.log('getTaskList sendData', sendData)
      let results = {}
      this.tableLoading = true
      type === 1 &&
        (results = await rqbManager
          .listManageTaskList(sendData)
          .catch((err) => {
            this.tableLoading = false
          }))
      type === 2 &&
        (results = await rqbManager
          .listManagePopErrorTask(sendData)
          .catch((err) => {
            this.tableLoading = false
          }))
      this.tableLoading = false
      const { code, data, msg } = results
      if (code === 200) {
        this.tableData = data.results
        this.page.total = data.totalCount
        //1.预留表单选项更改后，点击之前页面留下超过的页数查询再次查询为1的
        //2.避免连续两次获取内容为null进入死循环
        //3.避免点击查询再次请求
        // if (data.results.length === 0 && this.noResultsTime === 0 && this.page.pageNo !== 1) {
        //   this.page.pageNo = 1
        //   this.noResultsTime = 1
        //   this.getTaskList(type)
        // } else {
        //   this.noResultsTime = 0
        // }
        this.againRequest(
          data.results.length,
          'noResultsTime',
          'page.pageNo',
          'getTaskList',
          type
        )
        console.log('getTaskList results', results)
      }
    },
    // mixins 变量函数命名导致不适用每个页面的问题 转变为对象key为字符去操作this对象
    againRequest(length, noResultsTime, page, requestFn, ...fnArg) {
      // console.log('againRequest fnArg', ...fnArg)
      let pageNo = 0
      page.includes('.')
        ? (pageNo = page.split('.').reduce((x, y) => this[x][y]))
        : (pageNo = this[page])
      console.log('againRequest pageNo', pageNo)
      console.log(
        'againRequest before this[noResultsTime]',
        this[noResultsTime]
      )
      if (length === 0 && this[noResultsTime] === 0 && pageNo !== 1) {
        this[noResultsTime] = 1
        page.includes('.')
          ? page.split('.').reduce((x, y) => {
              this[x][y] = 1
            })
          : (this[page] = 1)
        this[requestFn](...fnArg)
        console.log(
          'againRequest after this[noResultsTime]',
          this[noResultsTime]
        )
      } else {
        this[noResultsTime] = 0
      }
    },
    flowTypeChange(type) {
      this.flowType = type
      this.serviceValue = 0
      this.taskTypeValue = 0
      this.date = ''
      this.sku = ''
      this.jdbAccount = ''
      this.page.pageNo = 1
      this.getTaskList(type)
    },
    serviceTypeChange(type) {
      this.sku = ''
      this.taskTypeValue = 0
    },
    taskTypeChange(type) {
      this.sku = ''
    }
  }
}
</script>
<style lang="scss" scoped>
$theme-color: #3489fe;
$boder-grey: #e4e7ed;
@mixin search-doyen-base {
  width: 100%;
  margin-top: 20px;
  display: flex;
  align-items: center;
}
@mixin search-doyen-class($class) {
  .search-doyen-#{$class} {
    @include search-doyen-base;
    @if $class == 'top' {
      border-bottom: 1px solid $boder-grey;
      .flow-type-nav {
        display: flex;
        align-items: center;
        width: 200px;
        padding-left: 20px;
        .flow-type-item {
          line-height: 40px;
          color: #666;
          font-size: 14px;
          text-align: center;
          cursor: pointer;
          user-select: none;
          box-sizing: border-box;
          border: 1px solid $boder-grey;
          border-radius: 2px;
          padding: 0 20px;
          &.active {
            background-color: $theme-color;
            color: white;
          }
          &.active:hover {
            color: white;
          }
          &:hover {
            color: $theme-color;
          }
        }
      }
    } @else if $class= 'right' {
      justify-content: flex-end;
      .search-right {
        display: flex;
        align-items: center;
        justify-content: right;
        /deep/ .el-date-editor {
          width: 230px;
          border-radius: 13px;
          margin-right: 10px;
          .el-range__close-icon {
            width: 0px;
            margin-right: 10px;
          }
        }
        /deep/ .el-select {
          width: 150px;
          margin-right: 10px;
          .el-input__inner {
            text-align: center;
            color: #333333;
            border-radius: 13px;
          }
          .is-focus {
            border-color: $theme-color;
          }
          .el-input__inner:focus {
            border-color: #c0c4cc;
          }
          .el-select__caret {
            color: #333333;
          }
        }
        /deep/ .task-sku {
          width: 160px;
          margin-right: 10px;
          .el-input__inner {
            border-radius: 13px;
          }
          .el-input__inner:focus {
            border-color: $theme-color;
          }
        }
        .task-account {
          @extend .task-sku;
        }
        .search-check-btn {
          padding: 5px 26px;
          text-align: center;
          border: 1px solid $theme-color;
          border-radius: 13px;
          color: $theme-color;
          cursor: pointer;
          margin-right: 20px;
          &:hover {
            background: $theme-color;
            color: white;
          }
        }
      }
    }
  }
}
.my-task {
  padding: 20px;
  min-width: 1200px;
  @include search-doyen-class('top');
  @include search-doyen-class('right');
  .flow-table {
    .table-header {
      line-height: 51px;
      margin-top: 10px;
      text-align: center;
      font-weight: bold;
      color: #333;
      font-size: 14px;
      border-radius: 10px 10px 0px 0px;
      /deep/ .el-input__inner {
        border: none;
        font-weight: bold;
        text-align: center;
        &::-webkit-input-placeholder {
          color: #333;
        }
        &:-ms-input-placeholder {
          color: #333;
        }
      }
      /deep/ .el-input__suffix {
        right: 50px;
        top: -2px;
        color: #666;
      }
      /deep/ .el-select .el-input .el-select__caret {
        color: #666;
      }
    }
  }
  .paging {
    margin: 20px 0;
  }
}
</style>
