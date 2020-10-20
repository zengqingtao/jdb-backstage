<template>
  <el-container>
    <el-main>
      <el-card class="box-card">
        <div slot="header">
          <el-row type="flex" justify="space-between">
            <el-col>
              <h4>今日收入</h4>
            </el-col>
            <el-col>
              <el-button class="floatR" type="primary" size="small" plain @click="modalStatus = true">高级查询 ></el-button>
            </el-col>
          </el-row>
        </div>
        <el-tabs type="card" v-model="activeName">
          <el-tab-pane label="表格" name="0">
          </el-tab-pane>
          <el-tab-pane label="图表" name="1">
          </el-tab-pane>
        </el-tabs>
        <el-table :data="tableData" v-if="activeName === '0'">
          <el-table-column prop="date">
          </el-table-column>
          <el-table-column label="会员费收入">
            <template slot-scope="scope">
              <span>{{ scope.row.memberIncome }}</span>
              <span v-if="scope.$index === 0">
                <span v-if="memberIncomeUpOrDown === 1" class="el-icon-caret-top red"></span>
                <span v-else-if="memberIncomeUpOrDown === 2" class="el-icon-caret-bottom"></span>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="活动发布量">
            <template slot-scope="scope">
              <span>{{ scope.row.activityNum }}</span>
              <span v-if="scope.$index === 0">
                <span v-if="activityNumUpOrDown === 1" class="el-icon-caret-top red"></span>
                <span v-else-if="activityNumUpOrDown === 2" class="el-icon-caret-bottom"></span>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="新增押金收入">
            <template slot-scope="scope">
              <span>{{ scope.row.depositIncome }}</span>
              <span v-if="scope.$index === 0">
                <span v-if="depositIncomeUpOrDown === 1" class="el-icon-caret-top red"></span>
                <span v-else-if="depositIncomeUpOrDown === 2" class="el-icon-caret-bottom"></span>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="新增余额收入">
            <template slot-scope="scope">
              <span>{{ scope.row.accountIncome }}</span>
              <span v-if="scope.$index === 0">
                <span v-if="accountIncomeUpOrDown === 1" class="el-icon-caret-top red"></span>
                <span v-else-if="accountIncomeUpOrDown === 2" class="el-icon-caret-bottom"></span>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <el-row v-else-if="activeName === '1'" type="flex" justify="space-between" align="top">
          <el-col class="text-right">
            <el-radio-group style="margin-top: -3px" v-model="type" size="medium" @change="pageTableChartData">
              <el-radio-button label="最近7天"></el-radio-button>
              <el-radio-button label="最近15天"></el-radio-button>
              <el-radio-button label="最近30天"></el-radio-button>
            </el-radio-group>
            <el-date-picker
              class="mg-l-20 mg-t-10"
              v-model="changeTime"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              placeholder="请输入要查询充值时间"
              size="medium"
              @change="pageTableChartData"
              clearable>
            </el-date-picker>
          </el-col>
        </el-row>
        <ve-line v-if="activeName === '1'" :data="chartData" :settings="chartSettings"></ve-line>
      </el-card>

      <el-card class="box-card mg-t-20">
        <div slot="header">
          <h4>数据监测</h4>
        </div>
        <el-row type="flex" justify="center">
          <el-col class="text-center" v-for="(item, index) of memberCount" :key="index">
            <img :src='item.img'>
            <div class="w220">
              <p>{{ item.title }}</p>
              <p>
                <ICountUp :endVal="item.val || 0"/>
              </p>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <el-card class="box-card mg-t-20">
        <div slot="header">
          <h4>商家活动数据</h4>
        </div>
        <el-row class="main3" type="flex" justify="space-between">
          <el-col v-for="(item, index) of activityCount" :key="index">
            <h1>{{ item.val || 0 }}</h1>
            <p>{{ item.title }}</p>
          </el-col>
        </el-row>
      </el-card>

      <el-row type="flex" class="main4 mg-t-20">
        <el-card class="box-card boxSwitch">
          <div slot="header">
            <h4>待处理信息</h4>
          </div>
          <el-row>
            <el-col class="font14">
              <span class="gray">店铺绑定审核：</span>
              <span class="bold unLine">
                <span @click="initSideBarActive('/SkbManage/ShopInfo', {authStatus: '1'})">未审核（{{ waitToDealBindShopCount.notVerifyCount || 0 }}）</span>
                <span @click="initSideBarActive('/SkbManage/ShopInfo', {authStatus: '2'})" class="mg-l-10">通过（{{ waitToDealBindShopCount.passCount || 0 }}）</span>
                <span @click="initSideBarActive('/SkbManage/ShopInfo', {authStatus: '3'})" class="mg-l-10">驳回（{{waitToDealBindShopCount.refuseCount || 0 }}）</span>
              </span>
            </el-col>
            <el-col class="font14 mg-t-20">
              <span class="gray">客户预留信息：</span>
              <span class="bold unLine">
                <span @click="initSideBarActive('/SkbManage/CustomerObligate', {type: 0})">未分配（{{ waitToDealContactCount.notVerifyCount || 0 }}）</span>
                <span @click="initSideBarActive('/SkbManage/CustomerObligate', {type: 1})" class="mg-l-10">已分配（{{ waitToDealContactCount.passCount || 0 }}）</span>
              </span>
            </el-col>
            <el-col class="font14 mg-t-20">
              <span class="gray">活动发布审核：</span>
              <span class="bold unLine">
                <span @click="initSideBarActive('/SkbManage/ItemReview', {activeName: '0'})">未审核（{{ waitToDealActivityCount.notVerifyCount || 0 }}）</span>
                <span @click="initSideBarActive('/SkbManage/ItemReview', {activeName: '1'})" class="mg-l-10">通过（{{ waitToDealActivityCount.passCount || 0 }}）</span>
                <span @click="initSideBarActive('/SkbManage/ItemReview', {activeName: '2'})" class="mg-l-10">驳回（{{ waitToDealActivityCount.refuseCount || 0 }}）</span>
              </span>
            </el-col>
            <el-col class="font14 mg-t-20">
              <span class="gray">申请结算审核：</span>
              <span class="bold unLine">
                <span @click="initSideBarActive('/SkbManage/Settlement', {status: '0'})">未审核（{{ waitToDealApplyFinishCount.notVerifyCount || 0 }}）</span>
                <span @click="initSideBarActive('/SkbManage/Settlement', {status: '1'})" class="mg-l-10">通过（{{ waitToDealApplyFinishCount.passCount || 0 }}）</span>
                <span @click="initSideBarActive('/SkbManage/Settlement', {status: '2'})" class="mg-l-10">驳回（{{ waitToDealApplyFinishCount.refuseCount || 0 }}）</span>
              </span>
            </el-col>
          </el-row>
        </el-card>

        <el-card class="box-card" style="flex: 1;margin-left: 20px">
          <div slot="header">
            <h4>详情监控数据</h4>
          </div>
          <el-row class="around-right-box" type="flex" justify="space-around">
            <el-row type="flex" justify="center" align="middle" v-for="(item, index) of activityDetail" :key="index">
              <el-col>
                <img :src="item.img ">
              </el-col>
              <el-col>
                <p>{{ item.val || 0 }}</p>
                <p>{{ item.title }}</p>
              </el-col>
            </el-row>
          </el-row>
        </el-card>
      </el-row>

      <el-row type="flex" class="main4 mg-t-20">
        <el-card class="box-card boxSwitch">
          <div slot="header">
            <h4>数据详情</h4>
          </div>
          <h5><span class="markPointer"></span>会员信息</h5>
          <el-row type="flex" class="font14">
            <el-col>
              <p>会员数量：{{ memberCountInfo.memberCount || 0 }}</p>
              <p>PLUS会员：{{ memberCountInfo.plusMemberCount || 0 }}</p>
              <p>今天新增会员数：{{ memberCountInfo.todayMemberCount || 0 }}</p>
            </el-col>
            <el-col>
              <p>免费会员：{{ memberCountInfo.freeMemberCount || 0 }}</p>
              <p>累计会员费收入：{{ memberCountInfo.memberMoney || 0 }}</p>
              <p>近七天新增会员数：{{ memberCountInfo.sevenDayMemberCount || 0 }}</p>
            </el-col>
          </el-row>

          <h5><span class="markPointer"></span>店铺信息</h5>
          <el-row type="flex" class="font14">
            <el-col :span="14">店铺数：{{ bindShopCount.bindsShopCount }}</el-col>
            <el-col>免费会员绑定店铺数：{{ bindShopCount.freeMemberCount }}</el-col>
            <el-col>付费会员绑定店铺数：{{ bindShopCount.plusMemberCount }}</el-col>
          </el-row>
          <p class="font14">付费会员绑定店铺情况：</p>
          <el-row class="tagBox font14" type="flex">
            <el-col v-for="(item, index) in bindShopCount.plusMemberBindShopRate" :key="index">{{ index + 1 }}个店铺（{{ item }}）</el-col>
          </el-row>

          <p class="font14">类目绑定频率：</p>
          <el-row class="tagBox font14" type="flex">
            <el-col v-for="(item, index) of bindShopCategoryRate" :key="index">{{ `${item.title}(${item.val})` }}</el-col>
          </el-row>
        </el-card>

        <el-card class="box-card" style="flex: 1;margin-left: 20px">
          <div slot="header">
            <h4>创造余额收入前6的用户</h4>
          </div>
          <el-row class="around-right-box2" type="flex">
            <el-col v-for="(item, index) in FirstIncomeData" :key="index">
              <el-row class="box-content">
                <h4>{{ item.jdbAccount }}（{{ item.source }}）</h4>
                <el-col>注册时间：<span>{{ item.registerTime }}</span></el-col>
                <el-col>开通会员：<span>{{ item.memberTime }}</span></el-col>
                <el-col>发布累计次数：<span>{{ item.activityCount }}次</span></el-col>
                <el-col>发布累计金额：<span>{{ item.activityMoney }}元</span></el-col>
                <el-col>创造余额收入：<span>{{ item.income }}元</span></el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-card>
      </el-row>

      <el-card class="box-card mg-t-20">
        <div slot="header">
          <h4>活动发布统计</h4>
        </div>
        <h5><span class="markPointer"></span>活动发布价格分布：</h5>
        <el-row class="svgList" type="flex" justify="space-around">
          <SvgProgress @LoadTableFn="LoadActivityTableFn" v-for="(item, index) of activityPriceCounts" :key="index" :title="item.price" :circleValue="item.rate" :content="`${item.activityCount}个活动,累计${item.tryCount}份`" />
        </el-row>
      </el-card>
    </el-main>

    <el-dialog title="高级查询" :visible.sync="modalStatus" width="35%" center :close-on-click-modal="false" @close="closeModalFn">
      <el-row type="flex" justify="center">
        <el-form label-width="100px" size="small">
          <el-form-item label="请选择时间段:">
            <el-date-picker
              v-model="dateTime"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              placeholder="请输入要查询充值时间"
              @change="pageTable"
              clearable>
            </el-date-picker>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row v-if="searchData && searchData.length > 0">
        <hr />
        <el-col class="text-center">以下为查询结果：</el-col>
        <el-col>
          <el-table :data="searchData">
            <el-table-column prop="memberIncome" label="会员费收入">
            </el-table-column>
            <el-table-column prop="activityNum" label="活动发布量">
            </el-table-column>
            <el-table-column prop="depositIncome" label="新增押金收入">
            </el-table-column>
            <el-table-column prop="accountIncome" label="新增余额收入">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog title="活动发布价格分布" :visible.sync="activityModalStatus" width="35%" center :close-on-click-modal="false" @close="closeModalFn">
      <el-table :data="activityTableData" height="450">
        <el-table-column prop="jdbAccount" label="账号">
        </el-table-column>
        <el-table-column prop="title" label="活动名称">
        </el-table-column>
        <el-table-column prop="price" label="活动下单价">
        </el-table-column>
      </el-table>
      <el-row type="flex" class="row-bg"justify="end">
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
    </el-dialog>

  </el-container>
</template>

<script>
import ICountUp from 'vue-countup-v2'
import SvgProgress from '../../../components/SvgProgress'
import testGuest from 'api/testGuest'
import EventBus from 'js/eventbus'

export default {
  name: 'ProductSKB',
  components: { ICountUp, SvgProgress },
  data() {
    return {
      modalStatus: false,
      activityModalStatus: false,
      activeName: '0',
      dateTime: [],
      searchData: [],
      chartSettings: {
        labelMap: {
          memberIncome: '会员费收入',
          activityNum: '活动发布量',
          depositIncome: '新增押金收入',
          accountIncome: '新增余额收入',
        }
      },
      chartData: {
        columns: [],
        rows: []
      },
      tableData: [],
      memberCount: [
        {title: '开通会员未绑定店铺数量', img: require('../../../assets/img/num1.png'), val: 0},
        {title: '绑定失败未重新绑定数量', img: require('../../../assets/img/num2.png'), val: 0},
        {title: '绑定成功未发布数量', img: require('../../../assets/img/num3.png'), val: 0},
      ],
      activityCount: [
        { title: '待支付', val: 0 },
        { title: '待审核', val: 0 },
        { title: '进行中', val: 0 },
        { title: '已结算', val: 0 },
        { title: '已驳回', val: 0 },
        { title: '已发完', val: 0 }
      ],
      activityDetail: [
        {title: '活动总份数', img: require('../../../assets/img/around1.png'), val: 0},
        {title: '活动总申请数', img: require('../../../assets/img/around2.png'), val: 0},
        {title: '活动总下单数', img: require('../../../assets/img/around3.png'), val: 0},
        {title: '活动总返款数', img: require('../../../assets/img/around4.png'), val: 0},
        {title: '活动总取消资格数', img: require('../../../assets/img/around5.png'), val: 0},
      ],
      type: '最近15天',
      changeTime: [],
      bindShopCategoryRate: [
        {title: '服装鞋包', val: 0},
        {title: '手机数码', val: 0},
        {title: '家用电器', val: 0},
        {title: '美妆饰品', val: 0},
        {title: '母婴用品', val: 0},
        {title: '百货建材', val: 0},
        {title: '美食特产', val: 0},
        {title: '运动户外', val: 0},
        {title: '文化娱乐', val: 0},
        {title: '日用家居', val: 0},
      ],
      waitToDealBindShopCount: {},
      waitToDealContactCount: {},
      waitToDealActivityCount: {},
      waitToDealApplyFinishCount: {},
      memberCountInfo: {}, // 会员信息
      bindShopCount: {}, // 店铺统计信息
      activityPriceCounts: {}, // 活动价格发布统计
      FirstIncomeData: [], // 前六统计店铺
      activityTableData: [], // 活动统计列表数据
      price: '',
      page: {
        pageNo: 1,
        total: null
      }
    }
  },
  computed: {
    memberIncomeUpOrDown () {
      if (!this.tableData) return 0
      const Boolean = this.tableData[0].memberIncome > this.tableData[1].memberIncome ? 1 : this.tableData[0].memberIncome < this.tableData[1].memberIncome ? 2 : 0
      return Boolean
    },
    accountIncomeUpOrDown () {
      if (!this.tableData) return 0
      const Boolean = this.tableData[0].accountIncome > this.tableData[1].accountIncome ? 1 : this.tableData[0].accountIncome < this.tableData[1].accountIncome ? 2 : 0
      return Boolean
    },
    activityNumUpOrDown () {
      if (!this.tableData) return 0
      const Boolean = this.tableData[0].activityNum > this.tableData[1].activityNum ? 1 : this.tableData[0].activityNum < this.tableData[1].activityNum ? 2 : 0
      return Boolean
    },
    depositIncomeUpOrDown () {
      if (!this.tableData) return 0
      const Boolean = this.tableData[0].depositIncome > this.tableData[1].depositIncome ? 1 : this.tableData[0].depositIncome < this.tableData[1].depositIncome ? 2 : 0
      return Boolean
    },
  },
  methods: {
    initSideBarActive (path, query) {
      EventBus.$emit('initSideBarActive', path)
      this.$router.push({ path, query })
    },
    async LoadActivityTableFn (price) {
      this.price = price
      const min = parseFloat(this.price)
      const max = this.price.indexOf('~') !== -1 ? parseFloat(this.price.substr(this.price.indexOf('~') + 1, this.price.length - 1)) : -1
      const res = await testGuest.listOrderSimpleByPrice({ page: this.page.pageNo, min, max })
      if (res.code === 200) {
        this.activityTableData = res.data.results
        this.page.pageNo = res.data.pageNo
        this.page.total = res.data.totalCount
      } else {
        this.activityTableData = []
        this.page.pageNo = 1
        this.page.total = null
      }
      this.activityModalStatus = true
    },
    handleCurrentChange (val) {
      this.page.pageNo = val
      this.LoadActivityTableFn(this.price)
    },
    closeModalFn () {
      this.modalStatus = this.activityModalStatus = false
      this.activityTableData = []
      this.dateTime = []
      this.searchData = []
      this.price = ''
    },
    async pageTable () {
      const [startTime, endTime] = this.dateTime && this.dateTime.length === 2 ? this.dateTime : ['', '']
      const res = await testGuest.countIncome({ startTime, endTime })
      !this.modalStatus ? this.tableData = res.data : this.searchData = res.data
    },
    async pageTableChartData () {
      const type = this.type === '最近7天' ? 1 : this.type === '最近15天' ? 2 : 3
      const [startTime, endTime] = this.changeTime && this.changeTime.length === 2 ? this.changeTime : ['', '']
      const res = await testGuest.listLast15DaysDayIncome({ type, startTime, endTime })
      this.chartData.columns = ['date', ...Object.keys(res.data[0]).filter(item => item !== 'date')]
      this.chartData.rows = res.data
    },
    async pageHeaderData () {
      const res = await testGuest.getMemberAndActivityTaskCount()
      const memberCountArr = Object.values(res.data.memberCountVO)
      const activityCountArr = Object.values(res.data.activityCountVO)
      const activityDetailArr = Object.values(res.data.activityDetailVO)
      this.memberCount.map((item, index) => item.val = memberCountArr[index])
      this.activityCount.map((item, index) => item.val = activityCountArr[index])
      this.activityDetail.map((item, index) => item.val = activityDetailArr[index])
    },
    async FirstIncomeList () {
      const res = await testGuest.getFirstIncomeList()
      this.FirstIncomeData = res.data
    },
    async getMemberShopCount () {
      const { data } = await testGuest.getCompositeMemberShopCount()
      const { activityPriceCounts, bindShopCount: bindShopCounts, memberCount, waitToDeal } = data
      const { activityCount, applyFinishCount, contactCount, bindShopCount } = waitToDeal
      const { bindShopCategoryRate } = bindShopCounts
      const Price = ['0~20元', '21~50元', '51~100元', '101~150元', '151~300元', '301元及以上']
      this.bindShopCategoryRate.map((item, index) => item.val = bindShopCategoryRate[index])
      this.waitToDealBindShopCount = bindShopCount
      this.waitToDealContactCount = contactCount
      this.waitToDealActivityCount = activityCount
      this.waitToDealApplyFinishCount = applyFinishCount
      this.memberCountInfo = memberCount
      this.bindShopCount = bindShopCounts
      this.activityPriceCounts = activityPriceCounts
      this.activityPriceCounts.map((item, index) => item.price = Price[index])
    }
  },
  created () {
    this.pageTable()
    this.pageHeaderData()
    this.pageTableChartData()
    this.FirstIncomeList()
    this.getMemberShopCount()
  }
}
</script>

<style lang="scss" scoped>
  .boxSwitch {
    width: 680px;
    @media screen and (max-width: 1600px) {
      width: 490px;
    }
  }
  .box-card {
    /deep/ .el-card__header {
      border-bottom: none;
    }
    /deep/ .el-card__body {
      padding: 0 20px 10px;
    }
    /deep/ .el-tabs--card>.el-tabs__header .el-tabs__nav{
      float: right !important;
      margin-right: 150px !important;;
    }
    .floatR {
      float: right;
    }
    .w220 {
      width: 220px;
      margin: 0 auto;
      p {
        margin: 5px 0;
        text-align: left;
      }
      p:last-child {
        font-weight: bold;
        font-size: 30px;
      }
    }
    .main3 {
      .el-col {
        text-align: center;
        h1, p {
          margin: 5px 0;
        }
      }
    }
    .around-right-box {
      padding: 20px 0;
      flex-wrap: wrap;
      @media screen and (max-width: 1600px) {
        justify-content: flex-start;
      }
      .el-row {
        margin:5px 5px 0 0;
        &:last-child {
          margin-right: 0;
        }
        width: 202px;
        height: 94px;
        background-color: #edf6ff;
        border-radius: 4px;
        .el-col:first-child {
          text-align: right;
          width: 120px;
          img {
            margin-top: 12px;
          }
        }
        .el-col {
          margin-left: 10px;
          p {
            margin: 0;
          }
          p:first-child {
            color: #000000;
            font-size: 22px;
          }
          p:last-child {
            font-size: 12px;
            color: #666666;
          }
        }
      }
    }
    .around-right-box2 {
      flex-wrap: wrap;
      > .el-col {
        margin-top: 10px;
        margin-right: 10px;
        background-color: #edf6ff;
        padding: 30px;
        width: 334px;
        height: 188px;
        border-radius: 4px;
        @media screen and (max-width: 1600px) {
          &:nth-child(2n) {
            margin-right: 0;
          }
        }
        .box-content {
          h4{
            &::after {
              margin-top: 10px;
              display: block;
              content: '';
              width: 42px;
              height: 2px;
              background-color: #333333;
            }
          }
          .el-col {
            margin-top: 7px;
            font-size: 13px;
            span {
              font-weight: bold;
            }
          }
        }
      }
      > .el-col:first-child {
        background: url("../../../assets/img/No.1.png") no-repeat;
      }
      > .el-col:nth-child(2) {
        background: url("../../../assets/img/No.2.png") no-repeat;
      }
      > .el-col:nth-child(3) {
        background: url("../../../assets/img/No.3.png") no-repeat;
      }
    }
    .svgList {
      @media screen and (max-width: 1600px) {
        flex-wrap: wrap;
      }
    }
    h4 {
      margin: 0;
    }
    .red {
      color: red;
    }
    .gray {
      color: #333333;
    }
  }
  .mg-l-70 {
    margin-left: 70px;
  }
  .markPointer {
    display: inline-block;
    width: 3px;
    height: 13px;
    background-color: #3489fe;
    margin-right: 5px;
  }
  .tagBox {
    flex-wrap: wrap;
    >.el-col {
      @media screen and (max-width: 1600px) {
        margin-top: 10px;
      }
      &:nth-child(n+6) {
        margin-top: 10px;
      }
      width: 116px;
      height: 34px;
      line-height: 34px;
      background-color: #deefff;
      border-radius: 2px;
      margin-right: 10px;
      text-align: center;
      color: #333333;
    }
    >.el-col:last-child {
      margin-right: 0;
    }
  }
  .unLine {
    span {
      cursor: pointer;
    }
    span:hover {
      text-decoration: underline;
    }
  }
  h5 {
    margin: 10px 0;
  }
</style>
