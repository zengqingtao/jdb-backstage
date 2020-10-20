<template>
  <div class="task-area">
    <div class="task-info">
      <p class="title">
        <span>任务信息</span>
      </p>
      <div class="content">
        <div
          v-for="(taskInfoProp,index) in taskInfoProps"
          :key="taskInfoProp.label"
          :class="{'width_1': (index + 1) % 3 === 1, 'width_2': (index + 1)  % 3 === 2, 'width_3': (index + 1) % 3 === 0}"
        >
          <template v-if="istaskDetailInfo(taskInfoProp.prop)">
            <p class="label">{{taskInfoProp.label}}</p>
            <el-tooltip
              v-if="taskInfoProp.prop.includes('Url')"
              :content="renderTaskInfo(taskInfoProp.prop)"
              placement="top-end"
              effect="light"
            >
              <a
                class="value-a"
                :href="renderTaskInfo(taskInfoProp.prop)"
                target="_blank"
                rel="noopener"
              >
                <p class="value">{{renderTaskInfo(taskInfoProp.prop)}}</p>
              </a>
            </el-tooltip>
            <p v-else class="value">{{renderTaskInfo(taskInfoProp.prop)}}</p>
          </template>
        </div>
      </div>
    </div>
    <div class="chidren-task">
      <el-table :data="tableData" stripe>
        <el-table-column
          v-for="tableDataProp in tableDataProps"
          :key="tableDataProp.prop"
          :prop="tableDataProp.prop"
          :label="tableDataProp.label"
          align="center"
        >
          <template slot-scope="scope">
            <div v-if="tableDataProp.html" v-html="scope.row[tableDataProp.prop]"></div>
            <div v-else>{{scope.row[tableDataProp.prop]}}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <y-pagination
      :page="page"
      justify="end"
      layout="prev, pager, next"
      @current-change="dayTaskList"
    ></y-pagination>
  </div>
</template>

<script>
import taskAreaAddItem from '../js/taskAreaAddItem.js'
import taskTableAreaItem from '../js/taskTableAreaItem.js'
import EventBus from 'js/eventbus.js'
import YPagination from 'components/pagination'
import rqbManager from 'api/rqbManager'

export default {
  components: {
    YPagination
  },
  props: {},
  data() {
    return {
      taskInfoProps: [
        {
          label: '商品链接：',
          prop: 'skuUrl'
        },
        {
          label: '店铺名称：',
          prop: 'shopName'
        },
        {
          label: '任务编号：',
          prop: 'id'
        },
        {
          label: '平台：',
          prop: 'platformStr'
        },
        {
          label: '任务类型：',
          prop: 'taskTypeStr'
        },
        // 插入
        {
          label: '停留时间：',
          prop: 'stayTypeStr'
        },
        {
          label: '货比三家：',
          prop: 'compareStr'
        },
        {
          label: '浏览评价：',
          prop: 'visitCommentStr'
        },
        {
          label: '浏览副宝贝：',
          prop: 'visitOtherStr'
        },
        {
          label: 'PV:UV浏览比：',
          prop: 'pvUvStr'
        }
      ],
      taskDetailInfo: {},
      numberArray: taskAreaAddItem,
      tableDataProps: [
        {
          label: '子任务编号',
          prop: 'id'
        },
        {
          label: '执行时间',
          prop: 'date'
        },
        {
          label: '金额',
          prop: 'money'
        },
        {
          label: '子任务状态',
          prop: 'statusStr'
        },
        {
          label: '退款状态',
          prop: 'refundStatusStr'
        },
        {
          label: '退款时间',
          prop: 'refundTime',
          html: true
        },
        {
          label: '退款金额',
          prop: 'refundMoney'
        }
      ],
      numberTableItem: taskTableAreaItem,
      tableData: [],
      page: {
        total: 0,
        pageNo: 1,
        pageSize: 10
      },
      query: {
        ...this.$route.query
      },
      noShowIncrementTypeNums: [2, 4],
      noShowKeywordNums: [1]
    }
  },
  computed: {
    istaskDetailInfo() {
      const taskDetailInfo = this.taskDetailInfo
      return function (prop) {
        if (Array.isArray(prop)) {
          let isExit = true
          prop.map((item) => {
            isExit = ![undefined, null].includes(taskDetailInfo[item])
          })
          return isExit
        } else {
          // console.log('typeof', taskDetailInfo[prop], taskDetailInfo[prop] === null)
          return ![undefined, null].includes(taskDetailInfo[prop])
        }
      }
    },
    renderTaskInfo() {
      const taskDetailInfo = this.taskDetailInfo
      return function (prop) {
        // console.log('renderTaskInfo array prop', prop)
        if (Array.isArray(prop)) {
          const res = prop.map((item) => taskDetailInfo[item])
          return res[0] + '/' + res[1]
        } else {
          return taskDetailInfo[prop]
        }
      }
    }
  },
  watch: {},
  created() {
    this.reset()
  },
  mounted() {
    const menuPath = this.$route.path.substr(
      0,
      this.$route.path.lastIndexOf('/')
    )
    console.log('detail this.$route.path menuPath', this.$route.path, menuPath)
    EventBus.$emit('initSideBarActive', menuPath)
  },
  methods: {
    reset() {
      this.popDetail()
      this.dayTaskList()
    },
    async popDetail() {
      console.log('popDetail query', this.query)
      const { platform, taskType, taskId } = this.query
      const sendData = { taskId }
      const results = await rqbManager.getPopDetail(sendData)
      const { code, data, msg } = results
      if (code !== 200) return
      const {
        executeType,
        enterType,
        executeDate,
        priceInternal,
        shortUrl,
        jdLiveType,
        stayTypeStr
      } = data

      const numberArray = this.numberArrayHandle(
        priceInternal,
        JSON.parse(JSON.stringify(this.numberArray[platform][taskType])),
        this.noShowIncrementTypeNums,
        this.noShowKeywordNums,
        executeType,
        enterType,
        executeDate
      )
      console.log('numberArrayHandle', numberArray)

      const taskInfoProps = this.taskInfoPropsHandle(
        JSON.parse(JSON.stringify(this.taskInfoProps)),
        numberArray,
        shortUrl,
        jdLiveType,
        stayTypeStr
      )
      this.taskInfoProps = taskInfoProps

      this.taskDetailInfo = data
      console.log('taskDetail', data)
      this.setTableDataProps(platform, taskType)
    },
    //处理模板taskInfoProps 加入taskAreaAddItem.js文件某个类型的数组 加入短连接 直播间信息 判断模板的停留时间
    taskInfoPropsHandle(
      taskInfoProps,
      numberArray,
      shortUrl,
      jdLiveType,
      stayTypeStr
    ) {
      if (shortUrl !== undefined) {
        const addObj = {
          label: '短连接：',
          prop: 'shortUrl'
        }
        taskInfoProps.splice(1, 0, addObj)
      }
      taskInfoProps.splice(5, 0, ...numberArray)
      if (jdLiveType !== undefined) {
        jdLiveType === 1 && taskInfoProps.splice(0, 2)
        const liveInfoArray = [
          {
            label: '直播间链接：',
            prop: 'liveUrl'
          },
          {
            label: '直播间名称：',
            prop: 'liveName'
          }
        ]
        taskInfoProps.splice(0, 0, ...liveInfoArray)
      }
      [null, undefined].includes(stayTypeStr) && taskInfoProps.splice(-5, 1)
      return taskInfoProps
    },
    //处理taskAreaAddItem.js文件中某个类型的数组 关键价格 递增量 关键词 时间或者日期
    numberArrayHandle(
      priceInternal,
      numberArray,
      noShowIncrementTypeNums,
      noShowKeywordNums,
      executeType,
      enterType,
      executeDate
    ) {
      // 关键卡价格
      if (priceInternal !== undefined && priceInternal.includes('null')) {
        numberArray.splice(-1, 1)
      }
      if (noShowIncrementTypeNums.includes(executeType)) {
        let index = 0
        for (let value of numberArray) {
          if (value.prop === 'incrementTypeStr') {
            numberArray.splice(index, 1)
            break
          }
          index++
        }
      }
      if (noShowKeywordNums.includes(enterType)) {
        let index = 0
        for (let value of numberArray) {
          if (value.prop === 'keyword') {
            numberArray.splice(index, 1)
            break
          }
          index++
        }
      }
      if (executeDate.includes(':')) {
        numberArray.push({
          label: '开始执行时间：',
          prop: 'executeDate'
        })
      } else {
        numberArray.push({
          label: '执行日期：',
          prop: 'executeDate'
        })
      }
      return numberArray
    },
    setTableDataProps(platform, taskType) {
      const numberSingleList = this.numberTableItem[platform][taskType].map(
        (item) => {
          const { label, prop } = item
          return {
            label,
            prop: prop[1]
          }
        }
      )
      this.tableDataProps.splice(2, 0, ...numberSingleList)
    },
    dayTaskList() {
      const { platform, taskType, taskId } = this.query
      const sendData = {
        taskId,
        page: this.page.pageNo,
        size: this.page.pageSize
      }
      rqbManager.listDateTask(sendData).then((res) => {
        const { code, data, msg } = res
        console.log('listDateTask', data)
        if (code === 200) {
          this.page.total = data.totalCount
          this.setRenderTableData(platform, taskType, data.results)
        }
      })
    },
    setRenderTableData(platform, taskType, results) {
      console.log('renderTableData', results)
      // 注意数组不能解析，要转下
      let tableData = JSON.parse(JSON.stringify({ results: results })).results
      console.log(
        'this.numberTableItem[platform][taskType]',
        this.numberTableItem[platform][taskType]
      )
      // console.log('tableData', tableData)
      this.numberTableItem[platform][taskType].map((item) => {
        tableData.map((tableItem) => {
          if (!['', null].includes(tableItem.refundTime)) {
            tableItem.refundTime = tableItem.refundTime.replace(' ', '<br/>')
          }
          if (tableItem[item.prop[0]] === undefined) return
          const synthesisVal =
            tableItem[item.prop[0]] + '/' + tableItem[item.prop[1]]
          tableItem[item.prop[1]] = synthesisVal
        })
      })
      this.tableData = tableData
      console.log('tableData', tableData)
    }
  }
}
</script>

<style lang="scss" scoped>
$theme-color: #3489fe;
.task-area {
  width: 90%;
  min-width: 1200px;
  padding: 0 20px;
  p {
    margin: 0;
  }
  .task-info {
    color: #333333;
    background: white;
    margin-top: 16px;
    padding: 16px 32px 25px;
    box-shadow: 0px 3px 24px 0px rgba(200, 200, 200, 0.22);
    border-radius: 10px;
    .title {
      font-weight: bold;
      font-size: 18px;
      /deep/ .el-button--text {
        color: white;
        background-color: $theme-color;
        border-radius: 13px;
        padding: 12px 16px;
        margin-left: 10px;
      }
    }
    .content {
      margin-top: 20px;
      font-size: 14px;
      display: flex;
      flex-wrap: wrap;
      div {
        line-height: 200%;
        .label {
          float: left;
        }
        .value-a {
          outline: 0;
        }
        .value-a p {
          color: #333333;
          outline: 0;
        }
        .value-a:hover p {
          color: $theme-color;
        }
        .value-a:visited,
        :active {
          color: #333333;
        }
        .value-a p:focus {
          color: #333333;
          border: 0;
        }
        .value {
          float: left;
          max-width: 375px;
          height: 30px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        &.width_1 {
          width: 40%;
        }
        &.width_2 {
          width: 30%;
        }
        &.width_3 {
          width: 30%;
          .value {
            float: left;
            max-width: 185px;
            height: 30px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }

  /deep/ .chidren-task {
    margin-top: 16px;
    background: white;
    border-radius: 10px;
    .el-table {
      td,
      th {
        border-bottom: 0px;
        color: #333333;
      }
      .el-table__header-wrapper {
        padding: 0 20px;
        thead {
          font-weight: bold;
        }
        table {
          width: auto !important;
        }
      }
      tr.el-table__row td {
        background: #f8f8f8;
      }
      tr.el-table__row--striped td {
        background: white;
      }
      .el-table__body-wrapper {
        padding: 16px 20px;
        box-shadow: inset 0px 3px 24px 0px rgba(200, 200, 200, 0.22);
        table {
          width: auto !important;
        }
      }
    }
  }
  .paging {
    margin: 20px 0;
  }
}
</style>
