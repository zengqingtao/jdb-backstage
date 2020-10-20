<template>
  <el-container>
    <el-main class="main">
      <el-tabs type="card" v-model="activeName" @tab-click="tabFn">
        <el-tab-pane label="人气排名提升" name="0"></el-tab-pane>
        <el-tab-pane label="更多服务" name="1"></el-tab-pane>
        <el-tab-pane label="拼多多" name="2"></el-tab-pane>
        <el-tab-pane label="淘宝天猫" name="3"></el-tab-pane>
      </el-tabs>

      <el-row v-if="activeName === '0'">
        <el-row class="mg-t-10">
          <el-col>
            <b>新韵</b>
          </el-col>
          <el-col>
            <ve-line :data="chartData2" :settings="baseSettings"></ve-line>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-table :data="tableData2">
              <el-table-column prop="date" label="日期"></el-table-column>
              <el-table-column prop="flowCount" label="流量发布量"></el-table-column>
              <el-table-column prop="flowSuccessCount" label="流量完成量"></el-table-column>
              <el-table-column label="流量完成率">
                <template slot-scope="scope">
                  <div class="Ratio">{{ scope.row.flowRatio || '' }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="popCount" label="人气发布量"></el-table-column>
              <el-table-column prop="popSuccessCount" label="人气完成量"></el-table-column>
              <el-table-column label="人气完成率">
                <template slot-scope="scope">
                  <div class="Ratio">{{ scope.row.popRatio || '' }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="end">
          <el-col class="page">
            <el-pagination
              v-if="page2.total"
              @current-change="handleCurrentChange2"
              :current-page="page2.pageNo"
              layout="total, prev, pager, next, jumper"
              :total="page2.total"
            ></el-pagination>
          </el-col>
        </el-row>
      </el-row>

      <el-row v-else-if="activeName === '1'">
        <el-row class="mg-t-20">
          <el-col>
            <ve-line :data="moreChartData" :settings="moreSettings"></ve-line>
          </el-col>
        </el-row>

        <el-tabs type="card" v-model="childTabs" @tab-click="childTabFn">
          <el-tab-pane label="秒杀提醒" name="5"></el-tab-pane>
          <el-tab-pane label="直播观看" name="6"></el-tab-pane>
          <el-tab-pane label="商品预约" name="7"></el-tab-pane>
          <el-tab-pane label="店铺粉丝" name="8"></el-tab-pane>
          <el-tab-pane label="商品关注" name="9"></el-tab-pane>
          <el-tab-pane label="商品加购" name="10"></el-tab-pane>
          <el-tab-pane label="京挑客" name="19"></el-tab-pane>
          <el-tab-pane label="京东快车" name="20"></el-tab-pane>
        </el-tabs>

        <el-table :data="moreData">
          <el-table-column prop="date" label="日期"></el-table-column>
          <el-table-column
            prop="totalCount"
            :label="moreLabel[this.childTabs].totalCount"
          ></el-table-column>
          <el-table-column
            prop="finishCount"
            :label="moreLabel[this.childTabs].finishCount"
          ></el-table-column>
          <el-table-column prop="rate" :label="moreLabel[this.childTabs].rate">
            <template slot-scope="scope">{{ scope.row.rate }}%</template>
          </el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
        </el-table>

        <el-row type="flex" class="row-bg" justify="end">
          <el-col class="page">
            <el-pagination
              v-if="morePage.total"
              @current-change="moreCurrentChange"
              :current-page="morePage.pageNo"
              layout="total, prev, pager, next, jumper"
              :total="morePage.total"
            ></el-pagination>
          </el-col>
        </el-row>
      </el-row>

      <el-row v-else-if="activeName === '2'">
        <el-row class="mg-t-20">
          <el-col>
            <ve-line :data="pddChartData" :settings="pddSettings"></ve-line>
          </el-col>
        </el-row>

        <el-tabs type="card" v-model="childTabs" @tab-click="childTabFn">
          <el-tab-pane label="流量点击" name="11"></el-tab-pane>
          <el-tab-pane label="店铺粉丝" name="12"></el-tab-pane>
          <el-tab-pane label="商品收藏" name="13"></el-tab-pane>
        </el-tabs>

        <el-table :data="moreData">
          <el-table-column prop="date" label="日期"></el-table-column>
          <el-table-column
            prop="totalCount"
            :label="moreLabel[this.childTabs].totalCount"
          ></el-table-column>
          <el-table-column
            prop="finishCount"
            :label="moreLabel[this.childTabs].finishCount"
          ></el-table-column>
          <el-table-column prop="rate" :label="moreLabel[this.childTabs].rate">
            <template slot-scope="scope">{{ scope.row.rate }}%</template>
          </el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
        </el-table>

        <el-row type="flex" class="row-bg" justify="end">
          <el-col class="page">
            <el-pagination
              v-if="morePage.total"
              @current-change="moreCurrentChange"
              :current-page="morePage.pageNo"
              layout="total, prev, pager, next, jumper"
              :total="morePage.total"
            ></el-pagination>
          </el-col>
        </el-row>
      </el-row>

      <el-row v-else-if="activeName === '3'">
        <el-row class="mg-t-20">
          <el-col>
            <ve-line :data="tMAllChartData" :settings="tMAllSettings"></ve-line>
          </el-col>
        </el-row>
        <el-tabs type="card" v-model="childTabs" @tab-click="childTabFn">
          <el-tab-pane label="流量点击" name="14"></el-tab-pane>
          <el-tab-pane label="店铺粉丝" name="15"></el-tab-pane>
          <el-tab-pane label="商品收藏" name="16"></el-tab-pane>
          <el-tab-pane label="商品加购" name="17"></el-tab-pane>
        </el-tabs>
        <el-table :data="moreData">
          <el-table-column prop="date" label="日期"></el-table-column>
          <el-table-column
            prop="totalCount"
            :label="moreLabel[this.childTabs].totalCount"
          ></el-table-column>
          <el-table-column
            prop="finishCount"
            :label="moreLabel[this.childTabs].finishCount"
          ></el-table-column>
          <el-table-column prop="rate" :label="moreLabel[this.childTabs].rate">
            <template slot-scope="scope">{{ scope.row.rate }}%</template>
          </el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
        </el-table>
        <el-row type="flex" class="row-bg" justify="end">
          <el-col class="page">
            <el-pagination
              v-if="morePage.total"
              @current-change="moreCurrentChange"
              :current-page="morePage.pageNo"
              layout="total, prev, pager, next, jumper"
              :total="morePage.total"
            ></el-pagination>
          </el-col>
        </el-row>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import report from "api/report";

export default {
  name: "ProductRQB",
  data() {
    return {
      activeName: "0",
      childTabs: "5",
      baseSettings: {
        labelMap: {
          flowCount: "流量发布量",
          flowSuccessCount: "流量完成量",
          popCount: "人气发布量",
          popSuccessCount: "人气完成量"
        }
      },
      chartData: {
        columns: [
          "date",
          "flowCount",
          "flowSuccessCount",
          "popCount",
          "popSuccessCount"
        ],
        rows: []
      },
      tableData: [],
      page: {
        pageNo: 1,
        total: null
      },
      chartData2: {
        columns: [
          "date",
          "flowCount",
          "flowSuccessCount",
          "popCount",
          "popSuccessCount"
        ],
        rows: []
      },
      tableData2: [],
      page2: {
        pageNo: 1,
        total: null
      },
      moreSettings: {
        labelMap: {
          pop5Total: "秒杀提醒发布量",
          pop5Finish: "秒杀提醒完成量",
          pop6Total: "直播观看发布量",
          pop6Finish: "直播观看完成量",
          pop7Total: "商品预约发布量",
          pop7Finish: "商品预约完成量",
          pop8Total: "店铺粉丝发布量",
          pop8Finish: "店铺粉丝完成量",
          pop9Total: "商品关注发布量",
          pop9Finish: "商品关注完成量",
          pop10Total: "商品加购发布量",
          pop10Finish: "商品加购完成量",
          pop11Total: "京挑客发布量",
          pop11Finish: "京挑客完成量",
          pop12Total: "京东快车发布量",
          pop12Finish: "京东快车完成量"
        }
      },
      moreChartData: {
        columns: [
          "date",
          "pop5Total",
          "pop5Finish",
          "pop6Total",
          "pop6Finish",
          "pop7Total",
          "pop7Finish",
          "pop8Total",
          "pop8Finish",
          "pop9Total",
          "pop9Finish",
          "pop10Total",
          "pop10Finish",
          "pop11Total",
          "pop11Finish",
          "pop12Total",
          "pop12Finish",
        ],
        rows: []
      },
      moreLabel: {
        5:{
          totalCount: "秒杀提醒发布量",
          finishCount: "秒杀提醒完成量",
          rate: "秒杀提醒完成率"
        },
        6:{
          totalCount: "直播观看发布量",
          finishCount: "直播观看完成量",
          rate: "直播观看完成率"
        },
        7:{
          totalCount: "商品预约发布量",
          finishCount: "商品预约完成量",
          rate: "商品预约完成率"
        },
        8:{
          totalCount: "店铺粉丝发布量",
          finishCount: "店铺粉丝完成量",
          rate: "店铺粉丝完成率"
        },
        9:{
          totalCount: "商品关注发布量",
          finishCount: "商品关注完成量",
          rate: "商品关注完成率"
        },
        10:{
          totalCount: "商品加购发布量",
          finishCount: "商品加购完成量",
          rate: "商品加购完成率"
        },
        11:{
          totalCount: "流量点击发布量",
          finishCount: "流量点击完成量",
          rate: "流量点击完成率"
        },
        12:{
          totalCount: "店铺粉丝发布量",
          finishCount: "店铺粉丝完成量",
          rate: "店铺粉丝完成率"
        },
        13:{
          totalCount: "商品收藏发布量",
          finishCount: "商品收藏完成量",
          rate: "商品收藏完成率"
        },
        14:{
          totalCount: "流量点击发布量",
          finishCount: "流量点击完成量",
          rate: "流量点击完成率"
        },
        15:{
          totalCount: "店铺粉丝发布量",
          finishCount: "店铺粉丝完成量",
          rate: "店铺粉丝完成率"
        },
        16:{
          totalCount: "商品收藏发布量",
          finishCount: "商品收藏完成量",
          rate: "商品收藏完成率"
        },
        17:{
          totalCount: "商品加购发布量",
          finishCount: "商品加购完成量",
          rate: "商品加购完成率"
        },
        
        19:{
          totalCount: "京挑客发布量",
          finishCount: "京挑客完成量",
          rate: "京挑客完成率"
        },
        20:{
          totalCount: "京东快车发布量",
          finishCount: "京东快车完成量",
          rate: "京东快车完成率"
        }
    },
      moreData: [],
      morePage: {
        pageNo: 1,
        total: null
      },

      pddSettings: {
        labelMap: {
          pop1Total: "流量点击发布量",
          pop1Finish: "流量点击完成量",
          pop2Total: "店铺粉丝发布量",
          pop2Finish: "店铺粉丝完成量",
          pop3Total: "商品收藏发布量",
          pop3Finish: "商品收藏完成量"
        }
      },
      pddChartData: {
        columns: [
          "date",
          "pop1Total",
          "pop1Finish",
          "pop2Total",
          "pop2Finish",
          "pop3Total",
          "pop3Finish"
        ],
        rows: []
      },

      tMAllSettings: {
        labelMap: {
          pop1Total: "流量点击发布量",
          pop1Finish: "流量点击完成量",
          pop2Total: "店铺粉丝发布量",
          pop2Finish: "店铺粉丝完成量",
          pop3Total: "商品收藏发布量",
          pop3Finish: "商品收藏完成量",
          pop4Total: "商品加购发布量",
          pop4Finish: "商品加购完成量"
        }
      },
      tMAllChartData: {
        columns: [
          "date",
          "pop1Total",
          "pop1Finish",
          "pop2Total",
          "pop2Finish",
          "pop3Total",
          "pop3Finish",
          "pop4Total",
          "pop4Finish"
        ],
        rows: []
      }
    };
  },
  methods: {
    tabFn(val) {
      if (val.name === "0") {
        this.loadBaseChart2();
        this.loadBaseTableData2();
      } else {
        this.morePage.pageNo = 1;
        this.loadPowerChart(val.name);
        this.childTabs =
          Number(val.name) === 1
            ? "5"
            : Number(val.name) === 2
            ? "11"
            : Number(val.name) === 3
            ? "14"
            : "5";
        this.loadPowerData();
      }
    },
    childTabFn() {
      this.morePage.pageNo = 1;
      this.loadPowerData();
    },

    async loadBaseChart2() {
      const res = await report.get15DaysDailyCount({ type: 3 });
      if (res.code === 200) {
        res.data = res.data.reverse();
        this.chartData2.rows = res.data;
      } else {
        this.chartData2.rows = [];
      }
    },
    async loadBaseTableData2() {
      const res = await report.getFlowDailyCount({
        page: this.page2.pageNo,
        type: 3
      });
      this.tableData2 = res.code === 200 ? res.data.results : [];
      this.page2.pageNo = res.code === 200 ? res.data.pageNo : 1;
      this.page2.total = res.code === 200 ? res.data.totalCount : null;
    },
    handleCurrentChange2(val) {
      this.page2.pageNo = val;
      this.loadBaseTableData2();
    },

    async loadPowerChart(type) {
      const res = await report.get15DayPowerTaskDailyCount({ type });
      if (res.code === 200) {
        res.data = res.data.reverse();
        const actions = {
          1: () => {
            this.moreChartData.rows = res.data;
          },
          2: () => {
            this.pddChartData.rows = res.data;
          },
          3: () => {
            this.tMAllChartData.rows = res.data;
          }
        };
        actions[type].call(this);
      } else {
        const actions = {
          1: () => {
            this.moreChartData.rows = [];
          },
          2: () => {
            this.pddChartData.rows = [];
          },
          3: () => {
            this.tMAllChartData.rows = [];
          }
        };
        actions[type].call(this);
      }
    },
    async loadPowerData() {
      const res = await report.listDailyCountByType({
        page: this.morePage.pageNo,
        type: this.childTabs
      });
      if (res.code === 200) {
        this.moreData = res.data.results;
        this.morePage.pageNo = res.data.pageNo;
        this.morePage.total = res.data.totalCount;
      } else {
        this.moreData = [];
        this.morePage.pageNo = 1;
        this.morePage.total = null;
      }
    },
    moreCurrentChange(val) {
      this.morePage.pageNo = val;
      this.loadPowerData();
    }
  },
  created() {
    this.loadBaseChart2();
    this.loadBaseTableData2();
  }
};
</script>

<style lang="scss" scoped>
</style>
