<template>
  <el-container>
    <el-tabs class="tabs" v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="数据统计" name="1"></el-tab-pane>
      <el-tab-pane label="中奖明细" name="2"></el-tab-pane>
    </el-tabs>

    <el-header class="header">
      <el-row type="flex" justify="space-between" v-if="activeName === '1'">
        <el-col :span="2"></el-col>
        <el-form inline size="small">
          <el-form-item class="mg-l-10">
            <el-input clearable v-model="search" placeholder="京店宝账号"></el-input>
            <el-button type="primary" size="small" @click="searchFn">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row type="flex" justify="space-between" v-else-if="activeName === '2'">
        <el-col :span="2"></el-col>
        <el-form inline size="small">
          <el-form-item class="mg-l-10">
            <el-date-picker
              v-model="date"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              placeholder="请输入查询时间"
              size="small"
              clearable
            ></el-date-picker>
          </el-form-item>
          <el-form-item class="mg-l-10">
            <el-select clearable v-model="post" placeholder="请选择派发情况">
              <el-option label="未派发" value="0"></el-option>
              <el-option label="已派发" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="mg-l-10">
            <el-input clearable v-model="phone" placeholder="手机号"></el-input>
            <el-button type="primary" size="small" @click="searchFn">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="tableData" @sort-change="mySortable" v-show="activeName === '1'">
        <el-table-column prop="account" label="京店宝账号"></el-table-column>
        <el-table-column sortable="custom" prop="add0" label="今天新增">
          <template slot-scope="scope">
            <span>{{ scope.row.add0 }}币</span>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="add7" label="近7天新增">
          <template slot-scope="scope">
            <span>{{ scope.row.add7 }}币</span>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="add15" label="近15天新增">
          <template slot-scope="scope">
            <span>{{ scope.row.add15 }}币</span>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="add30" label="近30天新增">
          <template slot-scope="scope">
            <span>{{ scope.row.add30 }}币</span>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="add90" label="近3月新增">
          <template slot-scope="scope">
            <span>{{ scope.row.add90 }}币</span>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="addAll" label="累计新增">
          <template slot-scope="scope">
            <span>{{ scope.row.addAll }}币</span>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="signIn" label="签到次数">
          <template slot-scope="scope">
            <span>{{ scope.row.signIn }}次</span>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="turntableNumber" label="抽奖次数">
          <template slot-scope="scope">
            <span>{{ scope.row.turntableNumber }}次</span>
          </template>
        </el-table-column>
      </el-table>

      <el-table :data="drawData" v-show="activeName === '2'">
        <el-table-column prop="date" label="中奖日期"></el-table-column>
        <el-table-column prop="phone" label="中奖手机号"></el-table-column>
        <el-table-column prop="prize" label="中奖内容"></el-table-column>
        <el-table-column prop="post" label="派发情况"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.post === '未派发'" @click="postFn(scope.row.id)">派发</el-button>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作人"></el-table-column>
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
          :total="page.total"
        ></el-pagination>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
import tableMixins from "mixins/tableMixins";
import turntable from "api/turntable";

export default {
  name: "DrawRule",
  mixins: [tableMixins],
  data() {
    return {
      activeName: "1",
      date: [], // 时间
      post: "", // 派发情况
      phone: "", // 手机号
      type: "",
      orderBy: "",
      drawData: []
    };
  },
  methods: {
    postFn(id) {
      this.$confirm("是否确认派发?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        turntable
          .postPrize({ id:id, manageId: this.$store.state.jdb_userInfo.id })
          .then(res => {
            if (res.code === 200) {
              this.$message.success("派发成功!");
              this.pageLoad();
            } else {
              this.$message.error(res.msg || "派发失败!");
            }
          });
      });
    },
    mySortable(params) {
      const { prop, order } = params;
      const arr = [
        "add0",
        "add7",
        "add15",
        "add30",
        "add90",
        "addAll",
        "signIn",
        "turntableNumber"
      ];
      this.orderBy = order ? (order === "descending" ? 0 : 1) : "";
      this.type =
        arr.findIndex(item => item === prop) !== -1
          ? arr.findIndex(item => item === prop)
          : "";
      this.pageLoad();
    },
    async pageLoad() {
      if (this.activeName === "1") {
        const { allCount, data, page } = await turntable.turntableList({
          page: this.page.pageNo,
          size: this.page.pageSize,
          search: this.search,
          type: this.type,
          orderBy: this.orderBy
        });
        this.page = { ...this.page, pageNo: page, total: allCount };
        this.tableData = data;
      } else {
        const [startTime, endTime] =
          this.date && this.date.length === 2 ? this.date : ["", ""];
        const { allCount, data, page } = await turntable.listDrawPrizeForManage(
          {
            page: this.page.pageNo,
            size: this.page.pageSize,
            startTime,
            endTime,
            post: this.post,
            phone: this.phone
          }
        );
        this.page = { ...this.page, pageNo: page, total: allCount };
        this.drawData = data;
      }
    },
    handleClick() {
      this.page.pageNo = 1;
      this.pageLoad();
    }
  },
  created() {
    this.pageLoad();
  }
};
</script>

<style lang="scss" scoped>
.tabs {
  margin-top: 20px;
}
.header {
  .el-input {
    width: 75%;
    margin-right: 10px;
  }
}
</style>
