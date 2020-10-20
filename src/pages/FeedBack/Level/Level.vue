<template>
  <el-container>
    <el-tabs class="tabs" v-model="activeName" type="card" @tab-click="tabsFn">
      <el-tab-pane label="充值记录" name="1"></el-tab-pane>
      <el-tab-pane label="邀请记录" name="3"></el-tab-pane>
      <el-tab-pane label="会员赠送" name="4"></el-tab-pane>
      <el-tab-pane label="会员购买" name="5"></el-tab-pane>
    </el-tabs>

    <el-header class="header" v-if="activeName !== '5'">
      <el-row type="flex" justify="space-between">
        <el-col :span="6" v-if="activeName === '1'">
          <span style="marginRight:10px">月余额充值累计金额：{{ totalCount }}</span>
          <el-button type="primary" size="small" plain @click="publicChargeModal = true">对公充值</el-button>
        </el-col>

        <el-col :span="4" v-else-if="activeName === '2'">月订购累计金额：{{ totalCount }}</el-col>
        <el-col :span="4" v-else-if="activeName === '3'">邀请注册总数：{{ totalCount }}</el-col>
        <el-col :span="4" v-else-if="activeName === '4'">
          <el-button type="primary" size="small" plain @click="giftModal = true">新增赠送</el-button>
        </el-col>

        <el-form inline size="small">
          <el-form-item v-if="activeName === '1' || activeName === '2'" label="充值时间:">
            <el-date-picker
              v-model="date"
              value-format="yyyy-MM"
              type="month"
              placeholder="选择日期"
              :default-value="new Date()"
              :clearable="false"
            ></el-date-picker>
          </el-form-item>
          <el-form-item class="mg-l-10" label="登录手机号:">
            <el-input clearable v-model="search" placeholder="登录手机号"></el-input>
            <el-button type="primary" size="small" @click="searchFn">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-header>

    <el-row v-if="activeName === '3'">
      <ve-line :data="chartData" :settings="chartSetting"></ve-line>
    </el-row>
    <el-row v-if="activeName === '5'">
      <ve-line :data="memBerBuyChartData" :settings="memBerBuyChartSetting"></ve-line>
    </el-row>
    <el-main>
      <el-table :data="tableData" v-if="activeName === '1'" key="1">
        <el-table-column prop="username" label="登录手机号"></el-table-column>
        <el-table-column prop="date" label="充值时间"></el-table-column>
        <el-table-column prop="amount" label="余额充值金额"></el-table-column>
        <el-table-column prop="resource" label="充值方式"></el-table-column>
      </el-table>

      <el-table :data="tableData" v-else-if="activeName === '2'" key="2">
        <el-table-column prop="username" label="登录手机号"></el-table-column>
        <el-table-column prop="date" label="订购时间"></el-table-column>
        <el-table-column prop="vipLevel" label="订购会员"></el-table-column>
        <el-table-column prop="amount" label="订购金额"></el-table-column>
      </el-table>

      <el-table :data="tableData" v-else-if="activeName === '3'" key="3">
        <el-table-column prop="username" label="登录手机号"></el-table-column>
        <el-table-column prop="inviteCount" label="邀请注册数"></el-table-column>
        <el-table-column prop="surplusCount" label="可用注册数"></el-table-column>
        <el-table-column prop="validCount" label="有效邀请人数"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="modalShow(scope.row.userId)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table :data="tableData" v-else-if="activeName === '4'" key="4">
        <el-table-column prop="username" label="登录手机号"></el-table-column>
        <el-table-column prop="nowVip" label="现有会员等级"></el-table-column>
        <el-table-column prop="nowEndTime" label="现有会员有效期至"></el-table-column>
        <el-table-column prop="presentVip" label="赠送会员等级"></el-table-column>
        <el-table-column prop="presentEndTime" label="赠送会员有效期至"></el-table-column>
      </el-table>

      <el-table :data="tableData" v-else-if="activeName === '5'" key="4">
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column prop="level2OneMonth" label="一个月标准会员人数"></el-table-column>
        <el-table-column prop="level2OneYear" label="一年标准会员人数"></el-table-column>
        <el-table-column prop="level3HalfYear" label="半年高级会员人数"></el-table-column>
        <el-table-column prop="level3OneYear" label="一年高级会员人数"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
      </el-table>
    </el-main>

    <el-row type="flex" class="row-bg" justify="end">
      <el-col class="page">
        <el-pagination
          v-show="page.total"
          @current-change="handleCurrentChange"
          :current-page="page.pageNo"
          layout="total, prev, pager, next, jumper"
          :total="page.total"
        ></el-pagination>
      </el-col>
    </el-row>

    <el-dialog
      title="对公充值"
      :visible.sync="publicChargeModal"
      width="30%"
      center
      @close="closeModalFn"
      :close-on-click-modal="false"
    >
      <el-form
        ref="publicChargeForm"
        :model="publicChargeForm"
        size="small"
        label-width="100px"
        :rules="publicChargeRules"
        :key="index"
      >
        <el-form-item label="登录手机号:" prop="account">
          <el-input
            placeholder="请输入登录手机号"
            v-model="publicChargeForm.account"
            @blur="chargeUsernameFn"
          ></el-input>
        </el-form-item>
        <el-form-item label="充值金额:" prop="amount">
          <el-input placeholder="请输入充值金额" v-model="publicChargeForm.amount"></el-input>
        </el-form-item>
        <el-form-item label="赠送金额:">
          <el-input placeholder="请输入赠送金额" v-model="publicChargeForm.giftAmount"></el-input>
        </el-form-item>
        <el-form-item label="充值时间:" prop="chargeTime">
          <el-date-picker
            v-model="publicChargeForm.chargeTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="BD角色:" style="marginBottom:0px;">
          <el-select
            v-model="publicChargeForm.type"
            clearable
            @change="bdRoleChange"
            :disabled="disableObj.type"
          >
            <el-option
              v-for="item of bdRoleOptions"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
          <span style="fontSize:12px;color:#F56C6C">BD角色可以不选择，为空状态</span>
        </el-form-item>
        <el-form-item label="归属BD:" :prop="publicChargeForm.type ? 'bdId' : ''">
          <el-select
            v-model="publicChargeForm.bdId"
            :disabled="publicChargeForm.type.length === 0 || disableObj.bdId"
            clearable
          >
            <el-option v-for="item of bdOptions" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户姓名:" :prop="publicChargeForm.type === 1 ? 'username' : ''">
          <el-input
            :placeholder="publicChargeForm.type === 2 ? '' : '请输入客户姓名'"
            v-model="publicChargeForm.username"
            :disabled="disableObj.username || publicChargeForm.type === 2"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户电话:" :prop="publicChargeForm.type ? 'phone' : ''">
          <el-input
            placeholder="请输入客户电话"
            v-model="publicChargeForm.phone"
            :disabled="disableObj.phone"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户微信:" :prop="publicChargeForm.type === 1 ? 'weChat' : ''">
          <el-input
            :placeholder="publicChargeForm.type === 2 ? '' : '请输入客户微信'"
            v-model="publicChargeForm.weChat"
            :disabled="disableObj.weChat || publicChargeForm.type === 2"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="btnStatus" @click="bdLoadChargeFn">确定</el-button>
        <el-button type="primary" size="small" plain @click="closeModalFn">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="邀请明细"
      :visible.sync="modalStatus"
      width="45%"
      center
      @close="closeModalFn"
      :close-on-click-modal="false"
    >
      <el-tabs class="tabs" v-model="modalActive" type="card" @tab-click="modalTabsLoad">
        <el-tab-pane label="注册数据" name="1"></el-tab-pane>
        <el-tab-pane label="注册数兑换记录" name="2"></el-tab-pane>
      </el-tabs>

      <el-table :data="modalTableData" v-if="modalActive === '1'" key="1">
        <el-table-column prop="index" label="序号"></el-table-column>
        <el-table-column prop="phoneNumber" label="手机号"></el-table-column>
        <el-table-column prop="registerDate" label="注册时间"></el-table-column>
        <el-table-column prop="status" label="验证通过"></el-table-column>
      </el-table>

      <el-table :data="modalTableData" v-else-if="modalActive === '2'" key="2">
        <el-table-column prop="index" label="序号"></el-table-column>
        <el-table-column prop="date" label="兑换时间"></el-table-column>
        <el-table-column prop="vipLevel" label="兑换会员"></el-table-column>
        <el-table-column prop="desc" label="自动兑换消耗数"></el-table-column>
      </el-table>

      <el-row type="flex" class="row-bg" justify="end">
        <el-col class="page">
          <el-pagination
            v-show="modalPage.total"
            @current-change="modalPageCurrentChange"
            :current-page="modalPage.pageNo"
            layout="total, prev, pager, next, jumper"
            :total="modalPage.total"
          ></el-pagination>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog
      title="会员赠送"
      :visible.sync="giftModal"
      width="45%"
      center
      @close="closeModalFn"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" size="small" label-width="160px" :rules="giveFormRules">
        <el-form-item
          label="登录手机号:"
          prop="username"
          :rules="[
            { validator: checkUsernameFn, trigger: 'blur' },
            { required: true, message: '登录手机号不能为空' }
          ]"
        >
          <el-input
            placeholder="请输入登录手机号"
            v-model="form.username"
            clearable
            @clear="clearNowVipInfo"
          ></el-input>
        </el-form-item>
        <el-form-item label="现有会员等级:">
          <el-input readonly v-model="form.vip"></el-input>
        </el-form-item>
        <el-form-item label="现有会员等级有效期至:">
          <el-input readonly v-model="form.endDate"></el-input>
        </el-form-item>
        <el-form-item
          label="赠送会员等级:"
          prop="vipType"
          :rules="[{ required: true, message: '登录手机号不能为空' }]"
        >
          <el-select v-model="form.vipType" class="vipTypeSelect">
            <el-option
              v-for="item of options"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="赠送会员天数:" prop="dateCount">
          <el-input placeholder="请输入赠送会员天数" v-model.number="form.dateCount"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="btnStatus" @click="submitFn">确定</el-button>
        <el-button type="primary" size="small" plain @click="closeModalFn">取消</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import tableMixins from "mixins/tableMixins";
import report from "api/report";
import role from "api/role";
import { mapState } from "vuex";

export default {
  name: "Level",
  mixins: [tableMixins],

  data() {
    var checkDateCount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("赠送会员天数不能为空"));
      }
      if (!Number.isInteger(value)) {
        return callback(new Error("请输入数字值"));
      }
      return callback();
    };
    return {
      date: "",
      options: [],
      chartData: {
        columns: ["date", "amount", "otherAmount"],
        rows: []
      },
      chartSetting: {
        labelMap: {
          amount: "今日邀请数",
          otherAmount: "今日有效邀请数"
        }
      },
      memBerBuyChartData: {
        columns: [
          "date",
          "level2OneMonth",
          "level2OneYear",
          "level3HalfYear",
          "level3OneYear"
        ],
        rows: []
      },
      memBerBuyChartSetting: {
        labelMap: {
          date: "时间",
          level2OneMonth: "一个月标准会员人数",
          level2OneYear: "一年标准会员人数",
          level3HalfYear: "半年高级会员人数",
          level3OneYear: "一年高级会员人数"
        }
      },
      userId: "",
      activeName: "1",
      modalActive: "1",
      totalCount: 0,
      modalTableData: [],
      modalPage: {
        pageNo: 1,
        total: null
      },
      giftModal: false,
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() < new Date().getTime();
        }
      },
      form: {
        username: "",
        endTime: "",
        vip: "",
        vipType: "",
        endDate: "",
        dateCount: ""
      },
      bdRoleOptions: [],
      bdOptions: [],
      publicChargeModal: false,
      publicChargeForm: {
        account: "",
        amount: "",
        giftAmount: "",
        chargeTime: "",
        type: "",
        bdId: "",
        username: "",
        phone: "",
        weChat: ""
      },
      publicChargeRules: {
        account: [
          { required: true, message: "请输入登录手机号", trigger: "change" }
        ],
        amount: [
          { required: true, message: "请输入充值金额", trigger: "blur" }
        ],
        chargeTime: [
          { required: true, message: "请输入充值时间", trigger: "blur" }
        ],
        bdId: [{ required: true, message: "请输入归属BD", trigger: "blur" }],
        username: [
          { required: true, message: "请输入客户姓名", trigger: "blur" }
        ],
        phone: [{ required: true, message: "请输入客户电话", trigger: "blur" }],
        weChat: [{ required: true, message: "请输入客户微信", trigger: "blur" }]
      },
      giveFormRules: {
        dateCount: [
          { validator: checkDateCount, trigger: "blur", required: true }
        ]
      },
      disableObj: {},
      index: 0
    };
  },
  computed: {
    ...mapState(["jdb_userInfo"])
  },
  methods: {
    async chartDataLoad() {
      const { code, data } = await report.listDailyInvite();
      this.chartData.rows = code === 200 ? data : [];
    },
    tabsFn() {
      this.page.pageNo = 1
      this.search = "";
      this.getToDayFn();
      this.pageLoad();
    },
    async listLoad() {
      const request =
        this.activeName === "1"
          ? report.listChargeMoreThan2W
          : this.activeName === "2"
          ? report.listChargeForVip
          : this.activeName === "3"
          ? report.listInviteAccount
          : this.activeName === "4"
          ? report.listPresentVipRecord
          : report.listJdbUserVipOrderCount;
      let params = {};
      if (this.activeName !== "5") {
        params = {
          page: this.page.pageNo,
          username: this.search,
          month: this.date
        };
      } else {
        params = {
          page: this.page.pageNo
        };
      }
      const res = await request(params);
      if (res.code === 200) {
        this.tableData = res.data.results;
        this.page = {
          pageNo:res.data.pageNo,
          total:res.data.totalCount
        };
      }else{
        this.tableData = []
        this.page = {
          pageNo:1,
          total:null
        };
      }
    },
    async totalLoad() {
      if (this.activeName === "4") return;
      const listTotal =
        this.activeName === "1"
          ? report.getChargeMoreThan2WAmount
          : this.activeName === "2"
          ? report.getChargeForVipAmount
          : report.getInviteCount;
      const res = await listTotal({
        username: this.search,
        month: this.date
      });
      if(res.code===200){
        this.totalCount = res.data;
      }else{
        this.totalCount = null
      }
    },
    async pageLoad() {
      if (this.activeName === "3") await this.chartDataLoad();
      if (this.activeName === "5") await this.listLast10Count();
      await this.listLoad();
      await this.totalLoad();
    },
    async listLast10Count() {
      const { data, code,msg } = await report.listLast10Count();
      if (code === 200) {
        this.memBerBuyChartData.rows = data.reverse();
      }
    },
    clearNowVipInfo() {
      this.form = { ...this.form, endDate: "", vip: "" };
    },
    async checkUsernameFn(rule, value, callback) {
      if (!value) {
        return callback(new Error("登录手机号不能为空"));
      } else {
        const { code, data, msg } = await report.getUserVipByUsername({
          username: value
        });
        if (code === 200) {
          this.form.endDate = data.endTime;
          this.form.vip = data.vip;
          this.options = [
            { value: 2, label: "标准会员" },
            { value: 3, label: "高级会员" }
          ].filter(item => item.value >= data.vipType);
          return callback();
        } else {
          return callback(new Error(msg));
        }
      }
    },
    submitFn() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.btnStatus = true;
          const params = {
            username: this.form.username,
            type: this.form.vipType,
            dateCount: this.form.dateCount
          };
          const { code, msg } = await report.addUserVipByUsername(params);
          this.btnStatus = false;
          if (code === 200) {
            this.$message.success(msg || "提交成功");
            this.pageLoad();
            this.closeModalFn();
          }
        }
      });
    },
    datedifference(start, end) {
      var endTime =
        new Date(start).getTime() / 1000 -
        parseInt(new Date(end).getTime() / 1000);
      return parseInt(endTime / 60 / 60 / 24); //相差天数
    },
    async modalShow(userId) {
      this.userId = userId;
      await this.modalLoad();
      this.modalStatus = true;
    },
    modalTabsLoad() {
      this.modalPage.pageNo = 1;
      this.modalLoad();
    },
    async modalLoad() {
      const request =
        this.modalActive === "1"
          ? report.listUserInviteRecordForManage
          : report.listUserInviteConsumeRecordForManage;
      const { code, data } = await request({
        userId: this.userId,
        page: this.modalPage.pageNo
      });
      this.modalTableData = code === 200 ? data.results : [];
      this.modalPage = {
        pageNo: code === 200 ? data.pageNo : 1,
        total: code === 200 ? data.totalCount : null
      };
    },
    modalPageCurrentChange(val) {
      this.modalPage.pageNo = val;
      this.modalLoad();
    },
    closeModalFn() {
      this.modalStatus = this.giftModal = this.btnStatus = this.publicChargeModal = false;
      this.form = {
        username: "",
        endTime: "",
        vip: "",
        vipType: "",
        endDate: ""
      };
      this.publicChargeForm = {
        account: "",
        amount: "",
        giftAmount: "",
        chargeTime: "",
        type: "",
        bdId: "",
        username: "",
        phone: "",
        weChat: ""
      };
      this.disableObj = {};
    },
    getToDayFn() {
      const date = new Date();
      const year = date.getFullYear();
      const month =
        date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
      this.date = `${year}-${month}`;
    },
    judgeBdRoleOptions(flag) {
      if (flag) {
        this.bdRoleOptions = [{ value: 1, label: "BD" }];
      } else {
        this.bdRoleOptions = [
          { value: 1, label: "BD" },
          { value: 2, label: "分销商BD" }
        ];
      }
    },
    async chargeUsernameFn(e) {
      ["type", "bdId", "username", "phone", "weChat"].forEach(name => {
        this.publicChargeForm[name] = "";
      });
      this.disableObj = {};
      const { code, data, msg } = await report.getCustomerByAccount({
        account: e.target.value
      });
      if (code === 200) {
        if (data.bdId) {
          this.bdOptions.push({ id: data.bdId, name: data.bdName });
        }
        Object.keys(this.publicChargeForm).forEach(item => {
          if (data[item]) {
            this.publicChargeForm[item] = data[item];
            this.disableObj[item] = true;
          }
        });
        this.judgeBdRoleOptions(data.onlyBD);
      }
    },
    async bdRoleChange(type) {
      this.index++;
      this.bdOptions = [];
      this.publicChargeForm.bdId = "";
      const { code, data } = await report.listAddBd({ type });
      if (code === 200) {
        this.bdOptions = data;
      }
    },
    bdLoadChargeFn() {
      this.$refs["publicChargeForm"].validate(async valid => {
        if (valid) {
          if (!this.publicChargeForm.type) {
            this.$confirm("此选择的BD角色为空, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "返回",
              type: "warning"
            })
              .then(() => {
                this.commitChargeFn();
              })
              .catch(() => {
                return false;
              });
          } else {
            this.commitChargeFn();
          }
        }
      });
    },
    async commitChargeFn() {
      this.btnStatus = true;
      const { code, msg } = await report.bdLoadCharge(this.publicChargeForm);
      this.btnStatus = false;
      if (code === 200) {
        this.$message.success(msg || "提交成功");
        this.pageLoad();
        this.closeModalFn();
      }
    }
  },
  created() {
    this.getToDayFn();
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
.vipTypeSelect {
  width: 100% !important;
}
.el-select,
.el-date-editor.el-input {
  width: 100%;
}
</style>
