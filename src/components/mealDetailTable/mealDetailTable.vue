<template>
  <div class="meal-detail-group">
    <div class="meal-detail-title">套餐详情</div>
    <div class="meal-row">
      <div class="meal-row-left">方案优势</div>
      <div class="meal-row-right" v-if="!isCustom">优惠折扣，快报低至150元 预估进商详{{mealHeaderData.goodsDetailNumber}}</div>
      <div class="meal-row-right" v-else>总价折扣为：2k以下不打折，2k~5k打9.8折，5k+~10k打9.5折，10k+~20k打9折，20K以上打8.5折
        预估进商详{{mealHeaderData.goodsDetailNumber}}
      </div>
    </div>
    <div class="meal-row">
      <div class="meal-row-left">整体方案<br/>效果预估</div>
      <div class="meal-row-right">保底效果：{{mealHeaderData.minPv}}PV<span
        v-if="!isCustom">，预估效果{{mealHeaderData.estimatePv}}PV</span></div>
    </div>
    <div class="meal-table">
      <el-table :data="mealTableData" border style="width: 100%" header-row-class-name="table-header"
                :cell-style="{'font-size':'12px'}">
        <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
        <el-table-column align="center" prop="channel" label="渠道" width="90"></el-table-column>
        <el-table-column align="center" prop="context" label="内容" width="90"></el-table-column>
        <el-table-column align="center" prop="categoryRestrict" label="品类限定" width="90"
                         v-if="isCustom && !originalCustom"></el-table-column>
        <el-table-column align="center" prop="prize" label="单价" width="90"></el-table-column>
        <el-table-column align="center" prop="putNumber" label="投放篇数" width="90">
          <template slot-scope="scope">
            <input type="number" :maxlength="3"
                   @keyup="putNumberLimit(scope)"
                   :disabled="!isCustom || disabled" placeholder="请输入"
                   v-model="scope.row.putNumber"
                   class="put-input">
          </template>
        </el-table-column>
        <el-table-column align="center" prop="productNumber" label="产品数" width="90"></el-table-column>
        <el-table-column align="center" prop="indPrize" label="单项总价" width="90"
                         class-name="color-red"></el-table-column>
        <el-table-column header-align="center" prop="mealDirection" label="渠道方向"></el-table-column>
        <el-table-column align="center" prop="cycle" label="展示周期" width="90"></el-table-column>
      </el-table>
    </div>
    <div class="meal-row total">
      <div class="meal-row-left">总篇数</div>
      <div class="meal-row-right" v-if="mealTableData.length">{{mealTableData[0].allPieceNumber}}</div>
    </div>
    <div class="meal-row total">
      <div class="meal-row-left">套餐总价</div>
      <div class="meal-row-right" v-if="mealTableData.length">{{mealTableData[0].mealTotal}}</div>
    </div>
    <div class="reason-group">
      <div class="reason-text">备注：</div>
      <div class="reason-text" v-if="isCustom">{{customNotice}}</div>
      <div class="reason-text" v-for="reason in reasonList" v-if="!isCustom || originalCustom ">{{reason}}</div>
    </div>
  </div>
</template>
<script>
  /**
   * @emit change 返回用户输入的投放篇数 Array
   */
  export default {
    data() {
      return {
        mealTableData: [],
      }
    },
    props: {
      /**
       * 是否禁止输入
       */
      disabled: {
        type: Boolean,
        default: true,
      },
      /**
       * 1:1000元 2:2000元 3:5000元 4:8000元 5:10000元 6:30000元 7:50000元 0:自定义套餐
       */
      mealType: {
        type: Number,
        default: 0,
      },
      mealPutList: {
        type: Array,
        default: () => {
          return ['', '', '', '', ''];
        }
      },
      isSetData: {
        type: Boolean,
        default: false,
      },
      orderDetailFlag: { // 是否详情
        type: Boolean,
      },
      customDataList: { //新自定义数据
        type: Array
      },
      originalCustom: { // 是否以前版本数据
        type: Boolean,
        default: false
      },
      customNotice: {
        type: String
      },
      applyTime:{
        type: String
      }
    },
    computed: {
      //是否自定义套餐
      isCustom() {
        return this.mealType === 0;
      },
      mealCurrentData() {
        if (this.mealType < 0 || this.mealType > 8) throw new Error('mealType数据不正确');
        let mealTypeMap = {};
      if (this.isChangeSerMeal) {
        mealTypeMap = {
          "1": {
            // putNumber: [2, 1, 1, 0, 0],
            putNumber: [2, 2, 0, 0],
            allPieceNumber: 4,
            indPrize: [300, 300, 400, 0, 0],
            mealTotal: 1000
          },
          "2": {
            // putNumber: [4, 2, 1, 1, 0],
            putNumber: [4, 4, 0, 0],
            allPieceNumber: 8,
            indPrize: [600, 600, 400, 400, 0],
            mealTotal: 2000
          },
          "3": {
            // putNumber: [6, 5, 4, 1, 1],
            putNumber: [8, 8, 1, 1],
            allPieceNumber: 17,
            indPrize: [900, 1500, 1600, 400, 600],
            mealTotal: 5000
          },
          "4": {
            // putNumber: [16, 6, 6, 2, 1],
            putNumber: [16, 12, 2, 1],
            allPieceNumber: 31,
            indPrize: [2400, 1800, 2400, 800, 600],
            mealTotal: 8000
          },
          "5": {
            // putNumber: [26, 5, 3, 4, 3],
            putNumber: [28, 8, 3, 3],
            allPieceNumber: 41,
            indPrize: [3900, 1500, 1200, 1600, 1800],
            mealTotal: 10000
          },
          "6": {
            putNumber: [60, 40, 7, 7],
            allPieceNumber: 122,
            indPrize: [10500, 7500, 6000, 2400, 3600],
            mealTotal: 30000
          },
          "7": {
            // putNumber: [100, 52, 16, 10, 15],
            putNumber: [102, 62, 10, 15],
            allPieceNumber: 193,
            indPrize: [15000, 15600, 6400, 4000, 9000],
            mealTotal: 50000
          }
        };
      } else {
        mealTypeMap = {
          "1": {
            putNumber: [2, 1, 1, 0, 0],
            allPieceNumber: 4,
            indPrize: [300, 300, 400, 0, 0],
            mealTotal: 1000
          },
          "2": {
            putNumber: [4, 2, 1, 1, 0],
            allPieceNumber: 8,
            indPrize: [600, 600, 400, 400, 0],
            mealTotal: 2000
          },
          "3": {
            putNumber: [6, 5, 4, 1, 1],
            allPieceNumber: 17,
            indPrize: [900, 1500, 1600, 400, 600],
            mealTotal: 5000
          },
          "4": {
            putNumber: [16, 6, 6, 2, 1],
            allPieceNumber: 31,
            indPrize: [2400, 1800, 2400, 800, 600],
            mealTotal: 8000
          },
          "5": {
            putNumber: [26, 5, 3, 4, 3],
            allPieceNumber: 41,
            indPrize: [3900, 1500, 1200, 1600, 1800],
            mealTotal: 10000
          },
          "6": {
            putNumber: [70, 25, 15, 6, 6],
            allPieceNumber: 122,
            indPrize: [10500, 7500, 6000, 2400, 3600],
            mealTotal: 30000
          },
          "7": {
            putNumber: [100, 52, 16, 10, 15],
            allPieceNumber: 193,
            indPrize: [15000, 15600, 6400, 4000, 9000],
            mealTotal: 50000
          }
        };
      }
        //如果为自定义套餐直接使用传入的套装
        if (this.isCustom && this.mealTableData.length) {
          return {
            putNumber: this.mealTableData.map(i => i.putNumber),
            allPieceNumber: this.mealTableData[0].allNumber,
            indPrize: [300, 300, 400, 0, 0],
            mealTotal: this.mealTableData[0].mealTotal,
          }
        }
        return mealTypeMap[this.mealType];
      },
      mealHeaderData() {
        if (this.mealType < 0 || this.mealType > 8) throw new Error('mealType数据不正确');
        //如果为自定义套餐直接使用传入的套装
        let mealDataMap = {};
      if (this.isChangeSerMeal) {
        mealDataMap = {
          "1": {
            estimatePv: "8100-9500",
            minPv: "8000",
            goodsDetailNumber: "800"
          },
          "2": {
            estimatePv: "1.7-2.1万",
            minPv: "1.6万",
            goodsDetailNumber: "1.6k"
          },
          "3": {
            estimatePv: "3.7-4.1万",
            minPv: "3.6万",
            goodsDetailNumber: "3.6k"
          },
          "4": {
            estimatePv: "6.3-6.7万",
            minPv: "6.2万",
            goodsDetailNumber: "6.4k"
          },
          "5": {
            estimatePv: "8.5-9.2万",
            minPv: "8.4万",
            goodsDetailNumber: "8.4k"
          },
          "6": {
            estimatePv: "22.9-27.8",
            minPv: "22.8万",
            goodsDetailNumber: "2.28万"
          },
          "7": {
            estimatePv: "37.9-44.8万",
            minPv: "37.8万",
            goodsDetailNumber: "3.78万"
          }
        };
      } else {
        mealDataMap = {
          "1": {
            estimatePv: "8100-9500",
            minPv: "8000",
            goodsDetailNumber: "800"
          },
          "2": {
            estimatePv: "1.7-2.1万",
            minPv: "1.6万",
            goodsDetailNumber: "1600"
          },
          "3": {
            estimatePv: "4.1-5万",
            minPv: "4万",
            goodsDetailNumber: "4000"
          },
          "4": {
            estimatePv: "6.5-7.2万",
            minPv: "6.4万",
            goodsDetailNumber: "6400"
          },
          "5": {
            estimatePv: "7.9-8.6万",
            minPv: "7.8万",
            goodsDetailNumber: "7800"
          },
          "6": {
            estimatePv: "22.6-28.5万",
            minPv: "22.5万",
            goodsDetailNumber: "2.3万"
          },
          "7": {
            estimatePv: "40.6-48万",
            minPv: "40.5万",
            goodsDetailNumber: "4.1万"
          }
        };
      }
        if (this.mealType !== 0) return mealDataMap[this.mealType];
        const customMinRules = [2000, 1500, 2000, 1500, 2500];
        const customGoodsDetailRules = [166, 166, 166, 200, 300];
        let minPv = 0, estimatePv = 0, goodsDetailNumber = 0;
        if (this.mealTableData.length) {
          this.mealCurrentData.putNumber.forEach((item, index) => {
            if (item >= 0 && this.originalCustom) { // 原来的自定义按原来的算法
              minPv += customMinRules[index] * item;
              goodsDetailNumber += customGoodsDetailRules[index] * item;
            } else if (item >= 0 && !this.originalCustom) { //新的自定义算法
              minPv = this.mealTableData[0].allPieceNumber * 2000
              goodsDetailNumber = Math.round(minPv / 12)
            }
          });
        }
        return {minPv, estimatePv, goodsDetailNumber};
      },
      reasonList() {
        const reasonMap = {
          1: [
            "1、保底效果所提的PV是指同一套餐内所有文章的PV累加的总数；",
            "2、保底PV的数据统计周期为付款之日起往后计算的60天内（含付款当天）总数据，数据以京东前台数据为准；",
            "3、任务付款后，从付款当天算起，三天内开始写文章，七天内完成文章的上线；",
            "4、保底PV一般都会完成，若保底PV没有完成，我们将继续创作补发更多渠道和内容以达到保底PV。",
          ],
          2: [
            "1、保底效果所提的PV是指同一套餐内所有文章的PV累加的总数；",
            "2、保底PV的数据统计周期为付款之日起往后计算的60天内（含付款当天）总数据，数据以京东前台数据为准；",
            "3、任务付款后，从付款当天算起，三天内开始写文章，七天内完成文章的上线；",
            "4、保底PV一般都会完成，若保底PV没有完成，我们将继续创作补发更多渠道和内容以达到保底PV。",
          ],
          3: [
            "1、保底效果所提的PV是指同一套餐内所有文章的PV累加的总数；",
            "2、保底PV的数据统计周期为付款之日起往后计算的60天内（含付款当天）总数据，数据以京东前台数据为准；",
            "3、任务付款后，从付款当天算起，三天内开始写文章，十五天内完成文章的上线；",
            "4、保底PV一般都会完成，若保底PV没有完成，我们将继续创作补发更多渠道和内容以达到保底PV。",
          ],
          4: [
            "1、保底效果所提的PV是指同一套餐内所有文章的PV累加的总数；",
            "2、保底PV的数据统计周期为付款之日起往后计算的60天内（含付款当天）总数据，数据以京东前台数据为准；",
            "3、任务付款后，从付款当天算起，三天内开始写文章，二十天内完成文章的上线；",
            "4、保底PV一般都会完成，若保底PV没有完成，我们将继续创作补发更多渠道和内容以达到保底PV。",
          ],
          5: [
            "1、保底效果所提的PV是指同一套餐内所有文章的PV累加的总数；",
            "2、保底PV的数据统计周期为付款之日起往后计算的60天内（含付款当天）总数据，数据以京东前台数据为准；",
            "3、任务付款后，从付款当天算起，三天内开始写文章，三十天内完成文章的上线；",
            "4、保底PV一般都会完成，若保底PV没有完成，我们将继续创作补发更多渠道和内容以达到保底PV。",
          ],
          6: [
            "1、保底效果所提的PV是指同一套餐内所有文章的PV累加的总数；",
            "2、保底PV的数据统计周期为付款之日起往后计算的60天内（含付款当天）总数据，数据以京东前台数据为准；",
            "3、任务付款后，从付款当天算起，三天内开始写文章，五十天内完成文章的上线；",
            "4、保底PV一般都会完成，若保底PV没有完成，我们将继续创作补发更多渠道和内容以达到保底PV。",
          ],
          7: [
            "1、保底效果所提的PV是指同一套餐内所有文章的PV累加的总数；",
            "2、保底PV的数据统计周期为付款之日起往后计算的60天内（含付款当天）总数据，数据以京东前台数据为准；",
            "3、任务付款后，从付款当天算起，三天内开始写文章，六十天内完成文章的上线；",
            "4、保底PV一般都会完成，若保底PV没有完成，我们将继续创作补发更多渠道和内容以达到保底PV。",
          ],
          0: [
            "1、保底效果所提的PV是指同一套餐内所有文章的PV累加的总数；",
            "2、保底PV的数据统计周期请咨询您的运营经理，数据以京东前台数据为准；",
            "3、任务付款后，从付款当天算起，三天内开始写文章，而文章的上线的时间请咨询您的运营经理；",
            "4、保底PV一般都会完成，若保底PV没有完成，我们将继续创作补发更多渠道和内容以达到保底PV。",
          ]
        };
        return reasonMap[this.mealType];
      },
      // 是否为更改套餐2020.1.1
      isChangeSerMeal() {
        const changeDate = Date.parse("2020-01-01");
        const payTimeDate = Date.parse(this.applyTime);
        if (payTimeDate >= changeDate) {
          return true;
        } else {
          return false;
        }
      }
    },
    watch: {
      'mealPutList'() {
        this.mealTableData.map((item, index) => {
          item.putNumber = this.mealPutList[index];
        })
      },
      'mealType'() {
        this.initMealTableData();
      },
      'mealTableData': {
        handler(newVal, oldVal) {
          let allPieceNumber = 0;
          let mealTotal = 0;
          for (let i = 0; i < newVal.length; i++) {
            if (newVal[i].putNumber > 0) {
              //当前行的单项总价
              let currentRowTotal = (+newVal[i].putNumber) * (+newVal[i].prize);
              mealTotal += currentRowTotal;
              allPieceNumber += +newVal[i].putNumber;
              this.mealTableData[i].indPrize = currentRowTotal;
            }
          }
          this.mealTableData[0].allPieceNumber = allPieceNumber;

          if (this.isCustom) {
            if (mealTotal > 20000) {
              this.mealTableData[0].mealTotal = mealTotal * 0.85;
            } else if (mealTotal > 10000) {
              this.mealTableData[0].mealTotal = mealTotal * 0.9;
            } else if (mealTotal > 5000) {
              this.mealTableData[0].mealTotal = mealTotal * 0.95;
            } else if (mealTotal >= 2000) {
              this.mealTableData[0].mealTotal = mealTotal * 0.98;
            } else {
              this.mealTableData[0].mealTotal = mealTotal;
            }
          } else {
            this.mealTableData[0].mealTotal = mealTotal;
          }
        },
        deep: true,
      }
    },
    async created() {
      await this.initMealTableData();
    },
    methods: {
      initMealTableData() {
        let tableData = [];
        let mealData = [];
        if (this.isChangeSerMeal) {
          mealData = [
            {
              channel: "京东快报",
              context: "帖子",
              prize: 150,
              putNumber: 1,
              productNumber: "1~3",
              allPieceNumber: 4,
              indPrize: 300,
              mealTotal: 1000,
              mealDirection:
                "有思想的年轻人，总该买点不一样的！发现资讯为你呈现专业的内容导购，告诉你哪些好物值得买。",
              cycle: "持续展示"
            },
            {
              channel: "会买清单",
              context: "清单",
              prize: 350,
              putNumber: 1,
              productNumber: "1~7",
              allPieceNumber: 4,
              indPrize: 300,
              mealTotal: 1000,
              mealDirection:
                "场景化内容导购频道，清单推荐内容形式，引领最热选品指南、最in购物风尚。",
              cycle: "持续展示"
            },
            // {
            //     channel: "会买专辑",
            //     context: "专辑",
            //     prize: 400,
            //     putNumber: 1,
            //     productNumber: '1~3',
            //     allPieceNumber: 4,
            //     indPrize: 400,
            //     mealTotal: 1000,
            //     mealDirection: "首页核心的场景化内容导购频道，清单&专辑两种推荐内容形式，引领最热选品指南、最in购物风尚。",
            //     cycle: '持续展示',
            // },
            {
              channel: "发现好货",
              context: "单品",
              prize: 400,
              putNumber: 1,
              productNumber: 1,
              allPieceNumber: 4,
              indPrize: 0,
              mealTotal: 1000,
              mealDirection:
                "首页的核心内容个性化推荐导购平台，综合性流量分发渠道及达人单品推荐渠道。",
              cycle: "持续展示"
            },
            {
              channel: "排行榜",
              context: "榜单",
              prize: 600,
              putNumber: 1,
              productNumber: "1~3",
              allPieceNumber: 4,
              indPrize: 0,
              mealTotal: 1000,
              mealDirection: "首页核心的分类精准促销频道。",
              cycle: "持续展示"
            }
          ];
        } else {
          mealData = [
            {
              channel: "京东快报",
              context: "帖子",
              prize: 150,
              putNumber: 1,
              productNumber: "1~4",
              allPieceNumber: 4,
              indPrize: 300,
              mealTotal: 1000,
              mealDirection:
                "有思想的年轻人，总该买点不一样的！发现资讯为你呈现专业的内容导购，告诉你哪些好物值得买。",
              cycle: "持续展示"
            },
            {
              channel: "会买专辑",
              context: "清单",
              prize: 300,
              putNumber: 1,
              productNumber: "1~7",
              allPieceNumber: 4,
              indPrize: 300,
              mealTotal: 1000,
              mealDirection:
                "首页核心的场景化内容导购频道，清单&专辑两种推荐内容形式，引领最热选品指南、最in购物风尚。",
              cycle: "持续展示"
            },
            {
              channel: "会买专辑",
              context: "专辑",
              prize: 400,
              putNumber: 1,
              productNumber: "1~3",
              allPieceNumber: 4,
              indPrize: 400,
              mealTotal: 1000,
              mealDirection:
                "首页核心的场景化内容导购频道，清单&专辑两种推荐内容形式，引领最热选品指南、最in购物风尚。",
              cycle: "持续展示"
            },
            {
              channel: "发现好货",
              context: "单品",
              prize: 400,
              putNumber: 1,
              productNumber: 1,
              allPieceNumber: 4,
              indPrize: 0,
              mealTotal: 1000,
              mealDirection:
                "首页的核心内容个性化推荐导购平台，综合性流量分发渠道及达人单品推荐渠道。",
              cycle: "持续展示"
            },
            {
              channel: "排行榜",
              context: "攻略",
              prize: 600,
              putNumber: 1,
              productNumber: "1~2",
              allPieceNumber: 4,
              indPrize: 0,
              mealTotal: 1000,
              mealDirection:
                "首页核心的分类精准促销频道，达人推荐榜个性化展现类目下的优质内容榜单，引导用户高效决策、购买。",
              cycle: "持续展示"
            }
          ];
        }
        let customData = {
          putNumber: this.mealPutList,
          allPieceNumber: 0,
          indPrize: [300, 300, 400, 400, 600],
          mealTotal: 0,
          prize: [300, 300, 400, 400, 600],
        };
        let rowDataTarget = this.isCustom ? customData : this.mealCurrentData;
        if (!this.isCustom || this.originalCustom) {
          for (let i = 0; i < mealData.length; i++) {
            tableData.push({
              channel: mealData[i].channel,
              context: mealData[i].context,
              prize: this.isCustom ? rowDataTarget.prize[i] : mealData[i].prize,
              putNumber: rowDataTarget.putNumber[i],
              productNumber: mealData[i].productNumber,
              allPieceNumber: rowDataTarget.allPieceNumber,
              indPrize: rowDataTarget.indPrize[i],
              mealTotal: rowDataTarget.mealTotal,
              mealDirection: mealData[i].mealDirection,
              cycle: mealData[i].cycle,
            })
          }
        } else {
          for (let i = 0; i < this.customDataList.length; i++) { // 2.1详情
            tableData.push({
              channel: this.customDataList[i].name,
              context: this.customDataList[i].content,
              prize: this.customDataList[i].price,
              putNumber: this.customDataList[i].number,
              productNumber: this.customDataList[i].productNumber,
              allPieceNumber: 0,
              indPrize: this.customDataList[i].priceAll,
              mealTotal: 0,
              mealDirection: this.customDataList[i].direction,
              cycle: this.customDataList[i].period,
              id: this.customDataList[i].id,
              categoryRestrict: this.customDataList[i].restrict,
            })
          }
        }
        this.mealTableData = tableData;
        this.$emit('change', this.mealTableData.map(i => i.putNumber));
        this.$emit('totalChange', this.mealTableData[0].mealTotal);
      },
      tableDataMerge({row, column, rowIndex, columnIndex}) {
        let mergeRules = [
          {
            columnIndex: 0,
            rowIndex: 1,
            format: {
              rowspan: 2,
              colspan: 1
            },
          },
          {
            columnIndex: 8,
            rowIndex: 1,
            format: {
              rowspan: 2,
              colspan: 1
            },
          },
          {
            columnIndex: 5,
            rowIndex: 0,
            format: {
              rowspan: 5,
              colspan: 1
            },
          },
          {
            columnIndex: 7,
            rowIndex: 0,
            format: {
              rowspan: 5,
              colspan: 1
            },
          },
        ];
        for (let i = 0; i < mergeRules.length; i++) {
          let mergeRule = mergeRules[i];
          if (columnIndex === mergeRule.columnIndex) {
            if (rowIndex === mergeRule.rowIndex) {
              return mergeRule.format;
            } else if (rowIndex > mergeRule.rowIndex && rowIndex <= mergeRule.format.rowspan) {
              return {rowspan: 0, colspan: 0};
            }
          }
        }
      },
      putNumberLimit(scope) {
        let putNumber = scope.row.putNumber;
        let index = scope.$index;
        let reg = /^[1-9]\d*$/;
        if (!reg.test(putNumber)) {
          if (putNumber === '0' || putNumber === '' || isNaN(putNumber)) {
            this.mealTableData[index].putNumber = '';
          } else {
            this.mealTableData[index].putNumber = Math.floor(putNumber) + '';
          }
        }
      }
    },
  }
</script>
<style lang="scss" scoped>
  .meal-detail-group {
    box-sizing: border-box;
    font-size: 14px;

    .meal-detail-title {
      line-height: 40px;
      background-color: #fafafa;
      font-weight: bold;
      padding-left: 12px;
      border: 1px solid #eee;
      border-bottom: none;
    }

    .total {
      border-top: none !important;
      border-bottom: 1px solid #eee;
      border-right: 1px solid #eee;
    }

    .meal-row {
      height: 50px;
      display: flex;
      align-items: center;
      border-top: 1px solid #eee;
      font-size: 12px;
      background-color: #fff;

      .meal-row-left {
        width: 70px;
        height: 100%;
        line-height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-left: 1px solid #eee;
        box-sizing: border-box;
      }

      .meal-row-right {
        line-height: 50px;
        font-size: 14px;
        text-align: center;
        color: #F30213;
        flex: 1;
        border-right: 1px solid #eee;
        border-left: 1px solid #eee;
      }
    }

    .meal-table {
      /deep/ .table-header {
        font-weight: bold;
        font-size: 12px;
        color: #333;
      }

      .put-input {
        width: 100%;
        border: none;
        background: transparent;
        text-align: center;
      }

      /deep/ .color-red {
        color: #F30213;
      }
    }

    .reason-group {
      padding: 14px 12px;
      box-sizing: border-box;
      border: 1px solid #eee;
      border-top: none;
      font-size: 12px;
      background-color: #fff;

      .reason-text {
        margin-bottom: 6px;
      }
    }
  }
</style>
