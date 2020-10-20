<template>
  <el-container>
    <el-main class="main">
      <el-tabs v-model="activeIndex" type="card">
        <el-row type="flex" justify="end">
          <el-form ref="form" :model="searchForm" label-width="45px" inline>
            <el-form-item label="订单号" v-if="activeIndex !== '2'" class="text-length-four normal-input">
              <el-input v-model="searchForm.pid" placeholder="请输入订单号" size="small"></el-input>
            </el-form-item>
            <el-form-item label="任务编号" v-if="activeIndex !== '2'" class="text-length-four normal-input">
              <el-input v-model="searchForm.taskId" placeholder="请输入任务编号" size="small"></el-input>
            </el-form-item>
            <el-form-item label="完成状态" v-if="activeIndex === '1'" class="text-length-four">
              <el-select
                v-model="searchForm.finishStatus"
                placeholder="请选择"
                @change="selectChange"
                size="small"
              >
                <el-option
                  v-for="item in finishStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="账号" class="normal-input">
              <el-input v-model="searchForm.username" placeholder="请输入京店宝账号" size="small"></el-input>
            </el-form-item>
            <el-form-item label="平台" v-if="activeIndex !== '3'" >
              <el-select
                v-model="searchForm.plant"
                placeholder="请选择"
                @change="selectChange('plant')"
                size="small"
              >
                <el-option
                  v-for="item in plantOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="activeIndex === '1' ? '订单类型':'任务类型'" v-if="activeIndex !== '3'" class="text-length-four">
              <el-select
                v-model="searchForm.taskType"
                placeholder="请选择"
                @change="selectChange"
                size="small"
                clearable
              >
                <el-option
                  v-for="item in taskTypeIptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="供应商状态" v-if="activeIndex === '1'" class="power-status">
              <el-select
                v-model="searchForm.powerStatus"
                placeholder="请选择"
                @change="selectChange"
                size="small"
              >
                <el-option
                  v-for="item in powerStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任务编号" v-if="activeIndex === '2'" class="text-length-four">
              <el-input v-model="taskId" placeholder="任务编号" size="small"></el-input>
            </el-form-item>
            <el-form-item label="任务状态" v-if="activeIndex === '2'" class="text-length-four">
              <el-select
                v-model="searchForm.taskStatus"
                placeholder="请选择"
                @change="selectChange"
                size="small"
              >
                <el-option
                  v-for="item in taskStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="activeIndex === '2' ? '发布日期':'执行日期'" class="text-length-four">
              <el-date-picker
                v-model="searchForm.date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                size="small"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchFun" size="small">查询</el-button>
              <el-button type="primary" @click="copyTaskFun" size="small" v-if="activeIndex === '3'">一键复制</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <el-tab-pane label="订单" name="1">
          <FlowTaskTable
            :tableData="tableData"
            :tabIndex="activeIndex"
            :key="tableKey"
            @toTaskByTaskId="toTaskByTaskId"
          ></FlowTaskTable>
        </el-tab-pane>
        <el-tab-pane label="任务" name="2">
          <FlowTaskTable :tableData="tableData" :tabIndex="activeIndex" :key="tableKey"></FlowTaskTable>
        </el-tab-pane>
        
        <el-tab-pane label="异常任务" name="3">
          <FlowTaskTable :tableData="tableData" tabIndex="6" :key="tableKey" @toTaskByTaskId="toTaskByTaskId"></FlowTaskTable>
        </el-tab-pane>
      </el-tabs>

      <el-row
        type="flex"
        class="row-bg"
        justify="end"
        v-if="pagination.totalCount > pagination.size"
      >
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.page"
          :page-sizes="[10,20,50]"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.totalCount"
        ></el-pagination>
      </el-row>
    </el-main>
  </el-container>
</template>
<script>
import FlowTaskTable from "./FlowTaskTable";
import rqbManage from "api/rqbManage";

export default {
  components: { FlowTaskTable },
  beforeRouteEnter(to, from, next) {
    if (
      ["/Rqb/rqbFlow/Details","/Rqb/rqbFlow/todayTask"].includes(from.path)
    ) {
      next(vm => {
        vm.activeIndex = "2";
      });
    } else {
      next(vm=>{
        vm.activeIndex = "1"
      });
    }
  },
  data() {
    return {
      activeIndex: "",
      searchForm: {
        username: "",
        date: "",
        powerStatus: "",
        plant: "",
        taskStatus: "",
        finishStatus: 0,
        pid:'',
        taskId:'',
        taskType:''
      },
      taskId: "",
      plantOptions: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "京东"
        },
        {
          value: "2",
          label: "拼多多"
        },
        {
          value: "3",
          label: "淘宝天猫"
        }
      ],
      taskStatusOptions: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "2",
          label: "已发布"
        },
        {
          value: "3",
          label: "已放弃"
        },
        {
          value: "4",
          label: "进行中"
        },
        {
          value: "5",
          label: "已完成"
        },
        {
          value: "6",
          label: "已停止"
        },
        {
          value: "7",
          label: "今日已完成"
        },
        {
          value: "8",
          label: "未找到SKU"
        },
        {
          value: "9",
          label: "待退款"
        }
      ],
      powerStatusOptions: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "0",
          label: "定时中"
        },
        {
          value: "1",
          label: "执行中"
        },
         {
          value: "2",
          label: "暂停"
        },
        {
          value: "2",
          label: "暂停"
        },
        {
          value: "3",
          label: "异常"
        },
        {
          value: "4",
          label: "已完成"
        },
        {
          value: "5",
          label: "已取消"
        },
        {
          value: "6",
          label: "已退款"
        },
        {
          value: "7",
          label: "待执行"
        },
        {
          value: "8",
          label: "取消中"
        }
      ],
      finishStatusOptions: [
        {
          value: 0,
          label: "全部"
        },
        {
          value: 1,
          label: "<100%(放弃)"
        },
        {
          value: 2,
          label: "<100%(未完成)"
        },
        {
          value: 3,
          label: "<100%(正常)"
        },
        {
          value: 4,
          label: "完成率=100%"
        },
      ],
      taskTypeIptions:[],
      pagination: {
        page: 1,
        size: 10,
        totalCount: 0
      },
      tableData: [],
      tableKey: 0
    };
  },
  watch: {
    activeIndex: {
      handler(val) {
        this.init();
        this.tableKey++;
        if(val > 0) {
          this.handleTabFn(Number(val));
        }
      }
    },
    'searchForm.plant':{
      handler(val) {
        this.judgeTaskTypeIptions(val)
      }
    }
  },
  methods: {
    judgeTaskTypeIptions(type) {
      if(type === '1') {
        this.taskTypeIptions = [{value:5,label:'秒杀提醒'},{value:6,label:'直播观看'},{value:7,label:'商品预约'},{value:8,label:'店铺粉丝'},{value:9,label:'商品关注'},{value:10,label:'商品加购'},{value:18,label:this.activeIndex === '1'? '流量点击' :'人气排名提升'}]
      } else if(type === '2') {
        this.taskTypeIptions = [{value:11,label:'流量点击'},{value:12,label:'店铺粉丝'},{value:13,label:'商品收藏'}]
      } else if (type === '3') {
        this.taskTypeIptions = [{value:14,label:'流量点击'},{value:15,label:'店铺粉丝'},{value:16,label:'商品收藏'},{value:17,label:'商品加购'}]
      } else {
        this.taskTypeIptions = []
      }
    },
    init() {
      this.searchForm = {
        username: "",
        date: "",
        powerStatus: "",
        plant: "",
        taskStatus: "",
        finishStatus: 0,
        pid:'',
        taskId:'',
        taskType:''
      };
      this.pagination = { page: 1, size: 10, totalCount: 0 };
    },
    handleSizeChange(size) {
      this.pagination.size = size;
      this.pagination.page = 1;
      this.handleTabFn(Number(this.activeIndex));
    },
    handleCurrentChange(page) {
      this.pagination.page = page;
      this.handleTabFn(Number(this.activeIndex));
    },
    searchFun() {
      this.handleTabFn(Number(this.activeIndex));
    },
    async listManageTask() {
      this.tableKey++;
      this.tableData = []
      const params = {
        pid: this.searchForm.pid,
        taskId: this.searchForm.taskId,
        taskType: this.searchForm.taskType,
        page: this.pagination.page,
        size: this.pagination.size,
        startTime: Array.isArray(this.searchForm.date)? this.searchForm.date[0] : "",
        endTime: Array.isArray(this.searchForm.date)? this.searchForm.date[1] : "",
        status: this.searchForm.powerStatus.length > 0? Number(this.searchForm.powerStatus) : "",
        plant: this.searchForm.plant.length > 0 ? Number(this.searchForm.plant) : "",
        username: this.searchForm.username,
        finishStatus: this.searchForm.finishStatus,
      };
      let { data, code, msg } = await rqbManage.listManageTask(params);
      if (code === 200) {
        this.tableData = data.results;
        this.pagination.page = data.pageNo;
        this.pagination.totalCount = data.totalCount;
      } else {
        this.tableData = [];
        this.$message.error(msg);
      }
    },
    async listManageFlow() {
      this.tableKey++;
      this.tableData = []
      const params = {
        page: this.pagination.page,
        size: this.pagination.size,
        startTime: Array.isArray(this.searchForm.date)
          ? this.searchForm.date[0]
          : "",
        endTime: Array.isArray(this.searchForm.date)
          ? this.searchForm.date[1]
          : "",
        status: Number(this.searchForm.taskStatus) || "",
        username: this.searchForm.username,
        taskId: this.taskId,
        taskType: this.searchForm.taskType,
        plant: this.searchForm.plant.length > 0 ? Number(this.searchForm.plant) : "",
      };
      let { data, code, msg } = await rqbManage.listManageFlow(params);
      if (code === 200) {
        this.tableData = data.results;
        this.pagination.page = data.pageNo;
        this.pagination.totalCount = data.totalCount;
      } else {
        this.tableData = [];
        this.$message.error(msg);
      }
    },
    async listTaskWarn() {
      const params = {
        pid: this.searchForm.pid,
        page: this.pagination.page,
        size: this.pagination.size,
        startTime: Array.isArray(this.searchForm.date)? this.searchForm.date[0] : "",
        endTime: Array.isArray(this.searchForm.date) ? this.searchForm.date[1] : "",
        username: this.searchForm.username,
        taskId: this.searchForm.taskId,
      };
      const {data, code, msg} = await rqbManage.listTaskWarn(params)
      if (code === 200) {
        this.tableData = data.results;
        this.pagination.page = data.pageNo;
        this.pagination.totalCount = data.totalCount;
      } else {
        this.tableData = [];
        this.$message.error(msg);
      }
    },
    handleTabFn(val) {
        if(Number(val) === 1) {
          this.listManageTask();
        } else if(Number(val) === 2) {
          this.listManageFlow();
        } else {
          this.listTaskWarn()
        }
    },
    toTaskByTaskId(val) {
      this.taskId = val;
      this.activeIndex = "2";
    },
    selectChange(tag) {
      if(tag === 'plant') {
         this.searchForm.taskType = ''
      }
      this.pagination = { page: 1, size: 10, totalCount: 0 };
      this.handleTabFn(Number(this.activeIndex));
    },
    async copyTaskFun() {
      const {data, code, msg} = await rqbManage.copyTask()
      if( code === 200 ) {
        if(data) {
          const textarea = document.createElement("textarea")
        textarea.readOnly = "readonly"
        textarea.style.position = "absolute"
        textarea.style.left = "-99999px"
        textarea.value = data
        document.body.append(textarea)
        textarea.select()
        textarea.setSelectionRange(0, textarea.value.length)
        const result = document.execCommand("Copy")
        if (result) {
          this.$message.success("复制成功")
        }
        document.body.removeChild(textarea)
        this.handleTabFn(Number(this.activeIndex));
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.row-bg {
  padding: 15px 0;
}
/deep/ .el-form-item {
  margin-right: 15px;
}
/deep/ .el-select--small {
  width: 135px;
}
/deep/ .text-length-four .el-form-item__label{
  width: 70px !important;
}
/deep/ .power-status .el-form-item__label {
  width: 85px !important;
}
/deep/ .el-range-editor--small.el-input__inner {
  width: 220px;
}
/deep/ .el-range-editor--small .el-range-input {
  font-size: 12px;
}
</style>