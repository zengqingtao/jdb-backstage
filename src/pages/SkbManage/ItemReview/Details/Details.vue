<template>
  <el-main class="main" v-loading.fullscreen.lock="fullscreenLoading">
    <el-card class="box-card">
      <div slot="header">
        <span class="header-title">活动类型：爆款打造/维护</span>
      </div>
      <el-row>
        <el-col>
          <el-checkbox :checked="true" disabled>快速优化关键词排名/加购率/多天回访率/全维度UV价值</el-checkbox>
        </el-col>
      </el-row>
      <el-row class="firstBox" type="flex">
        <el-col>
          <div>适合店铺类型：</div>
          <div class="shopType">任何京东店铺</div>
        </el-col>
        <el-col>
          <div>效果建议投放单期总份数：</div>
          <p>小于50元客单（0-50元）≥49份</p>
          <p>50-100元客单≥42份</p>
          <p>100-300元客单≥28份</p>
          <p>高于300元客单≥21份</p>
        </el-col>
        <el-col>
          <div>优化权重建议：</div>
          <p>建议不低于2期，每期5-10天，数据统计95%成功案例连续投放4-6周期完成爆款的打造和稳定</p>
        </el-col>
      </el-row>
      <el-row class="lastTips">
        <el-col>任务开奖时间：每日10点，21点开奖。</el-col>
        <el-col>
          <el-row type="flex">
            <el-col class="label">用户申请流程：</el-col>
            <el-col>根据商家活动类型的不同，用户分1~6天申请。完成浏览、加购、收藏店铺 商品、深度访问、货比多家、浏览副商品、京东问答.等操作后，才可获得购买资格。快速稳定优化商品排名、销量、商品基础权重。</el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="box-card pd-b-0">
      <div slot="header">
        <span class="header-title">基本信息</span>
      </div>
      <el-row class="form">
        <el-form :model="orderBaseVO" label-width="90px">
          <el-form-item label="店铺名称:" prop="shopName" required>
            <el-input v-model="orderBaseVO.shopName" size="small" disabled></el-input>
          </el-form-item>
          <el-form-item label="活动标题:" prop="title" required>
            <el-input :value="orderBaseVO.manageTitle || orderBaseVO.title" size="small" disabled></el-input>
            <el-button v-if="orderVerifyVO.manageVerifyCode === 0 && canAuthStatus" class="mg-l-10" type="text" @click="changeNameFn">修改</el-button>
          </el-form-item>
          <el-form-item label="商品链接:" prop="url" required>
            <el-input v-model="orderBaseVO.url" size="small" disabled></el-input>
          </el-form-item>
          <el-form-item label="商品类目:" prop="categoryId" required>
            <el-select disabled size="small" v-model="orderBaseVO.categoryId" placeholder="请选择">
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品图片:" prop="test" required>
            <el-row type="flex">
              <div class="imgBox" v-if="orderBaseVO.imageUrl && orderBaseVO.imageUrl.length > 0" v-for="(item, index) of orderBaseVO.imageUrl" :key="index">
                <img :src="item.url">
              </div>
            </el-row>
          </el-form-item>
          <el-form-item label="联系QQ:" prop="qq" required>
            <el-input v-model="orderBaseVO.qq" class="QQ" size="small" disabled></el-input>
            <span class="mg-l-10 tips">用户获得资格后展示，必须设置QQ权限为允许任何人，允许临时会话</span>
          </el-form-item>
          <el-form-item label="是否包邮:" prop="test" required>
            <el-radio disabled>是</el-radio>
            <span class="mg-l-10 tips">（所有商品必须包邮）</span>
          </el-form-item>
        </el-form>
      </el-row>
    </el-card>

    <el-card class="box-card pd-b-0">
      <div slot="header">
        <span class="header-title">下单设置</span>
      </div>
      <el-row class="form">
        <el-form :model="orderPaySettingVO" label-width="100px">
          <el-form-item label="下单价:" prop="money" required>
            <el-input v-model="orderPaySettingVO.money" class="QQ" size="small" disabled></el-input>
            <span class="mg-l-10">元</span>
          </el-form-item>
          <el-form-item label="下单规格:">
            <el-input v-model="orderPaySettingVO.specification" class="QQ" size="small" disabled></el-input>
            <span class="mg-l-10 tips">（如需用户指定规格，此项必填，如未填，默认可拍任意规格；鞋服类商品不可限制规格。）</span>
          </el-form-item>
          <el-form-item label="支付方式:">
            <el-radio v-model="orderPaySettingVO.allowCreditCard" disabled :label="1">信用卡</el-radio>
            <el-radio v-model="orderPaySettingVO.allowJdWhite" disabled :label="1">京东白条</el-radio>
            <el-radio v-model="orderPaySettingVO.allowCoupon" disabled :label="1">优惠券</el-radio>
          </el-form-item>
          <el-form-item label="优惠券金额:" required v-if="orderPaySettingVO.allowCoupon === 1">
            <el-input v-model="orderPaySettingVO.couponPrice" class="QQ" size="small" disabled></el-input>
            <span class="mg-l-10">元</span>
            <span class="mg-l-10">原价：{{Number(orderPaySettingVO.couponPrice) + Number(orderPaySettingVO.money) || '-' }} 元</span>
          </el-form-item>
          <el-form-item v-if="orderPaySettingVO.allowCoupon === 1">
            <el-radio value="1" disabled label="1">进店铺领取优惠券</el-radio>
          </el-form-item>
        </el-form>
      </el-row>
    </el-card>

    <el-card class="box-card pd-b-0">
      <div slot="header">
        <span class="header-title">活动计划</span>
      </div>
      <el-row class="form">
        <el-form :model="orderPlanVO" label-width="120px">
          <el-form-item label="活动计划设置:">
            <el-radio disabled>平均分配</el-radio>
          </el-form-item>
          <el-form-item label="开始时间:" prop="startTime" required>
            <el-input v-model="orderPlanVO.startTime" class="QQ" size="small" disabled></el-input>
          </el-form-item>
        </el-form>
        <el-form :model="orderPlanVO" inline label-width="120px">
          <el-form-item label="总份数:" prop="totalCount" required>
            <el-input v-model="orderPlanVO.totalCount" class="small" size="small" disabled></el-input>
            <span class="mg-l-10">份</span>
            <span class="mg-l-10 tips">（至少12份）</span>
          </el-form-item>
          <el-form-item label="日开奖份数:" prop="dayCount" required>
            <el-input v-model="orderPlanVO.dayCount" class="small" size="small" disabled></el-input>
            <span class="mg-l-10">份</span>
            <span class="mg-l-10 tips">（至少1份）</span>
          </el-form-item>
        </el-form>
      </el-row>
      <el-card class="pd-b-0" shadow="never">
        <p class="mg0">移动端搜索关键词（请设置能搜索到商品的精准关键词！新品建议设置长尾词或半标题。若因为用户找不到商品导致申请量不理想，平台概不负责！）</p>
        <el-row type="flex" class="form mg-t-10" v-for="(item, index) of keywordParams" :key="index">
          <el-col>
            <el-form :inline="true" :model="item" label-width="110px">
              <el-form-item label="搜索关键词：" prop="keyword" required>
                <el-input v-model="item.keyword" class="QQ" size="small" disabled></el-input>
              </el-form-item>
              <el-form-item label="排序方式：" prop="sortType" required>
                <el-select v-model="item.sortType" class="QQ" size="small" disabled placeholder="请选择">
                  <el-option
                    v-for="item in sortList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

        <el-row type="flex" class="form mg-t-10">
          <el-col>
            <el-form :inline="true" :model="Price" label-width="110px">
              <el-form-item label="价格区间：">
                <el-input v-model="Price.minPrice" class="small" size="small" disabled></el-input>
                <span class="mg-l-10">~</span>
                <el-input v-model="Price.maxPrice" class="small mg-l-10" size="small" disabled></el-input>
                <span class="mg-l-10">元</span>
                <span class="mg-l-10 tips">（选填）</span>
              </el-form-item>
              <el-form-item label="关键词占比：" required>
                <el-input v-model="orderPlanVO.keywordPercent" class="QQ" size="small" disabled></el-input>
                <span class="mg-l-10">%</span>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="form mg-t-10 pd-b-0" shadow="never">
        <el-form :model="orderPlanVO" inline label-width="110px">
          <el-form-item label="商品链接：" prop="goodsUrl" required>
            <el-input v-model="orderPlanVO.goodsUrl" class="QQ" size="small" disabled></el-input>
          </el-form-item>
          <el-form-item label="链接占比：" prop="urlPercent" required>
            <el-input v-model="Price.urlPercent" class="QQ" size="small" disabled></el-input>
            <span class="mg-l-10">%</span>
          </el-form-item>
        </el-form>
      </el-card>
      <el-row class="form mg-t-10">
        <el-form inline label-width="100px">
          <el-form-item label="千里传音：" prop="test" required>
            <el-radio disabled>短信通知（审核通过却不见下单？试客宝在通过用户后发送短信通知用户0.07元/条）</el-radio>
          </el-form-item>
        </el-form>
      </el-row>
    </el-card>

    <el-card class="box-card">
      <div slot="header">
        <span class="header-title">增值服务设置（可设置：指定关键词转化、指定竞品货比）</span>
      </div>
      <el-row>
        <el-col>
          <el-radio v-model="orderServiceVO.assignKeyword" :label="1" disabled>指定关键词转化</el-radio><span class="tips">（2元/份）</span>
        </el-col>
        <el-col class="mg-t-10 red">说明：用户会重新搜索你设置的转化关键词进店下单购买，优化核心关键词转化！</el-col>
        <el-col class="mg-t-10" v-for="(item, index) of convertKeywordParams" :key="index">
          <el-form :model="item" class="form" inline label-width="110px">
            <el-form-item label="转化关键词：">
              <el-input v-model="item.convertKeyword" class="QQ" size="small" disabled></el-input>
              <el-input v-model="item.convertKeywordPercent" class="small mg-l-10" size="small" disabled></el-input>
              <span class="tips mg-l-10">%</span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <el-card class="pd-b-0" shadow="never">
        <el-row>
          <el-col>
            <el-radio v-model="orderServiceVO.assignCompeting" :label="1" disabled>指定竞品货比</el-radio><span class="tips">（2元/份）</span>
          </el-col>
          <el-col class="mg-t-10 red">说明：用户会对指定的竞品进行货比浏览并验证，强化类目标签，提升竞争指数！</el-col>
          <el-col class="mg-t-10">
            <el-form class="form" inline label-width="110px" v-for="(item, index) of competingUrl" :key="index">
              <el-form-item label="竞品链接：">
                <el-input class="QQ" size="small" :value="item" disabled></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-card>

      <!--<el-card class="pd-b-0" shadow="never">-->
        <!--<el-row>-->
          <!--<el-col>-->
            <!--<el-radio v-model="orderServiceVO.assignRecommend" :label="1" disabled>为你推荐设置</el-radio><span class="tips">（2元/份）</span>-->
          <!--</el-col>-->
          <!--<el-col class="mg-t-10 red">说明：用户在第二天回访商品时通过为你推荐入口进店浏览、收藏、关注并验证！</el-col>-->
          <!--<el-col class="mg-t-10">-->
            <!--<el-form class="form" inline label-width="110px">-->
              <!--<el-form-item label="设置比例：">-->
                <!--<el-input v-model="orderServiceVO.recommendPercent" class="small" size="small" disabled></el-input>-->
                <!--<span class="tips mg-l-10">%</span>-->
                <!--<span class="mg-l-10">温馨建议：新品前期不建议勾选此选项或选最低比例，老款建议不高于35%（入池参考：东京首页日UV>100）。</span>-->
              <!--</el-form-item>-->
            <!--</el-form>-->
          <!--</el-col>-->
        <!--</el-row>-->
      <!--</el-card>-->
    </el-card>

    <el-card class="box-card">
      <div slot="header">
        <span class="header-title">已支付费用清单</span>
      </div>
      <el-row class="form">
        <el-table :data="tableData">
          <el-table-column prop="entryName" label="项目名称">
          </el-table-column>
          <el-table-column prop="Detailed" label="明细">
          </el-table-column>
          <el-table-column prop="money" label="金额">
          </el-table-column>
          <el-table-column prop="account" label="缴费账户">
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-col class="mg-t-10 red">商品押金账户需支付：{{ orderPaidVO.depositMoney }}元</el-col>
        <el-col class="mg-t-10 red">京店宝账户需支付：{{ orderPaidVO.accountMoney }}元</el-col>
      </el-row>
      <el-row class="mg-t-10">
        <el-col v-if="orderVerifyVO.manageVerifyCode === 0">试客宝审批状态：待审批</el-col>
        <el-col v-else-if="orderVerifyVO.manageVerifyCode === 1">试客宝审批状态：通过</el-col>
        <el-col v-else-if="orderVerifyVO.manageVerifyCode === 2">
          <div>试客宝审批状态：驳回</div>
          <div class="mg-t-5">试客宝驳回原因：{{ orderVerifyVO.manageVerifyRemark }}</div>
        </el-col>
      </el-row>
      <el-row class="mg-t-10">
        <el-col v-if="orderVerifyVO.linglaVerifyCode === 0">领啦审批状态：待审核</el-col>
        <el-col v-else-if="orderVerifyVO.linglaVerifyCode === 1">领啦审批状态：通过</el-col>
        <el-col v-else-if="orderVerifyVO.linglaVerifyCode === 2">
          <div>领啦审批状态：驳回</div>
          <div class="mg-t-5">领啦驳回原因：{{ orderVerifyVO.linglaVerifyRemark }}</div>
        </el-col>
      </el-row>
      <el-row class="mg-t-10" type="flex" justify="center" v-if="orderVerifyVO.manageVerifyCode === 0 && canAuthStatus">
        <el-button type="primary" size="small" :loading="btnStatus" @click="passFn(orderBaseVO.id)">通过</el-button>
        <el-button type="primary" size="small" :loading="btnStatus" @click="rejectShow(orderBaseVO.id)" plain>驳回</el-button>
      </el-row>
    </el-card>
    <el-row class="mg-t-20" type="flex" justify="center">
      <el-button @click="changePage(lastId)" :loading="btnStatus" :disabled="!lastId" type="primary" class="mg-r-200" size="small" plain>上一条</el-button>
      <el-button @click="changePage(nextId)" :loading="btnStatus" :disabled="!nextId" type="primary" size="small" plain>下一条</el-button>
    </el-row>

    <el-dialog title="驳回理由" :visible.sync="modalStatus" width="30%" center :close-on-click-modal="false" @close="closeModalFn">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="驳回原因:" prop="reviewRemarks" :rules="[ { required: true, message: '驳回原因不能为空'}]">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="form.reviewRemarks" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="btnStatus" @click="rejectFn">确定</el-button>
        <el-button type="primary" size="small" plain @click="modalStatus = false">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="活动标题修改" :visible.sync="changeNameStatus" width="30%" center :close-on-click-modal="false" @close="closeModalFn">
      <el-form ref="nameForm" :model="nameForm" label-width="100px">
        <el-form-item label="原标题:">{{ orderBaseVO.title }}</el-form-item>
        <el-form-item label="修改后标题:" prop="manageTitle" :rules="[ { required: true, message: '修改后的标题不能为空'}]">
          <el-input placeholder="请输入内容" v-model="nameForm.manageTitle" clearable></el-input>
        </el-form-item>
        <el-form-item label="修改原因:" prop="reason" :rules="[ { required: true, message: '修改原因不能为空'}]">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="nameForm.reason" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="btnStatus" @click="submitNameFn">确定</el-button>
        <el-button type="primary" size="small" plain @click="changeNameStatus = false">取消</el-button>
      </span>
    </el-dialog>
  </el-main>
</template>

<script>
import testGuest from 'api/testGuest'

export default {
  name: 'Details',
  data () {
    return {
      canAuthStatus: false,
      changeNameStatus: false,
      fullscreenLoading: false,
      modalStatus: false,
      id: '',
      lastId: '',
      nextId: '',
      orderBaseVO: {}, // 基本信息
      orderPaySettingVO: {}, // 下单设置
      orderPlanVO: {}, // 活动计划
      Price: {}, // 包含价格区间与链接占比
      keywordParams: [], // 搜索关键词参数
      orderServiceVO: {}, // 增值服务设置
      convertKeywordParams: [], // 转化关键词
      competingUrl: [], // 竞品链接
      tableData: [
        {entryName: '商品押金', Detailed: '', money: '', account: '商品押金账户'},
        {entryName: '短信费', Detailed: '', money: '', account: '商品押金账户'},
        {entryName: '增值服务费', Detailed: '', money: '', account: '商品押金账户'},
        {entryName: '平台服务费', Detailed: '', money: '', account: '京店宝账户'}
      ],
      form: {
        reviewRemarks: ''
      },
      nameForm: {
        orderId: '',
        manageTitle: '',
        reason: ''
      },
      orderPaidVO: {}, // 已支付信息
      orderVerifyVO: {}, // 审核状态
      btnStatus: false,
      sortList: [
        {id: 1, label: '销量'},
        {id: 2, label: '综合'},
        {id: 3, label: '人气'},
        {id: 4, label: '信用'},
        {id: 5, label: '价格'},
      ],
      categoryList: [
        {id: 1, label: '服装鞋包'},
        {id: 2, label: '手机数码'},
        {id: 3, label: '家用电器'},
        {id: 4, label: '美妆饰品'},
        {id: 5, label: '母婴用品'},
        {id: 6, label: '百货建材'},
        {id: 7, label: '美食特产'},
        {id: 8, label: '运动户外'},
        {id: 9, label: '文化娱乐'},
        {id: 10, label: '日用家居'}
      ]
    }
  },
  methods: {
    async getCanAuthStatus () {
      const res = await testGuest.canAuth()
      this.canAuthStatus = res
    },
    changeNameFn () {
      this.nameForm = {
        orderId: this.orderBaseVO.id,
        manageTitle: this.orderBaseVO.manageTitle,
        reason: this.orderBaseVO.reason
      }
      this.changeNameStatus = true
    },
    submitNameFn () {
      this.$refs['nameForm'].validate(async valid => {
        if (valid) {
          const res = await testGuest.manageAlertTitle(this.nameForm)
          if (res.code === 200) {
            this.$message.success(res.msg || '修改成功！')
            this.closeModalFn()
            this.pageLoad()
          } else {
            this.$message.error(res.msg)
          }
        }
      })
    },
    closeModalFn () {
      this.changeNameStatus = false
      this.modalStatus = false
      this.form.reviewRemarks = ''
      this.nameForm = {
        orderId: '',
        manageTitle: '',
        reason: ''
      }
    },
    pageLoad () {
      testGuest.getShikeOrderDetailForManage({ osType: this.$route.query.osType, id: this.$route.query.id, title: this.$route.query.title, shopName: this.$route.query.shopName, jdbAccount: this.$route.query.jdbAccount, status: this.$route.query.status }).then(res => {
        if (res.code === 200) {
          this.nextId = res.data.nextId
          this.lastId = res.data.lastId
          this.orderBaseVO = res.data.orderBaseVO
          this.orderBaseVO.shopName = res.data.shopName
          this.orderPaySettingVO = res.data.orderPaySettingVO
          this.orderPlanVO = res.data.orderPlanVO
          this.keywordParams = res.data.orderPlanVO.keywordParams
          const { minPrice, maxPrice, urlPercent } = res.data.orderPlanVO
          this.Price = { minPrice, maxPrice, urlPercent }
          this.orderServiceVO = res.data.orderServiceVO
          this.convertKeywordParams = res.data.orderServiceVO.convertKeywordParams
          this.orderVerifyVO = res.data.orderVerifyVO
          this.orderPaidVO = res.data.orderPaidVO
          this.competingUrl = res.data.orderServiceVO.competingUrl
          this.tableData.forEach((item, index) => {
            if (index === 0) {
              item.Detailed = `${this.orderPaidVO.total} * ${this.orderPaidVO.goodsPrice}`
              item.money = this.orderPaidVO.deposit
            } else if (index === 1) {
              item.Detailed = `${this.orderPaidVO.total} * 0.07元`
              item.money = this.orderPaidVO.smsTotalMoney
            } else if (index === 2) {

              item.Detailed = `${this.orderPaidVO.total} * ${this.orderPaidVO.serviceCount} * 2元`
              item.money = this.orderPaidVO.totalServiceMoney
            } else if (index === 3) {
              item.Detailed = `${this.orderPaidVO.total} * ${this.orderPaidVO.commission}元`
              item.money = this.orderPaidVO.totalCommission
            }
          })
        } else {
          this.competingUrl = []
          this.nextId = ''
          this.lastId = ''
          this.tableData = []
          this.orderBaseVO = {}
          this.orderBaseVO.shopName = ''
          this.orderPaySettingVO = {}
          this.orderPlanVO = {}
          this.keywordParams = []
          this.orderServiceVO = {}
          this.convertKeywordParams = []
          this.orderPaidVO = {}
          this.orderVerifyVO = {}
        }
      })
    },
    changePage (id) {
      this.fullscreenLoading = this.btnStatus = true
      testGuest.getShikeOrderDetailForManage({ id, osType: this.$route.query.osType, title: this.$route.query.title, shopName: this.$route.query.shopName, jdbAccount: this.$route.query.jdbAccount, status: this.$route.query.status }).then(res => {
        this.fullscreenLoading = this.btnStatus = false
        if (res.code === 200) {
          this.nextId = res.data.nextId
          this.lastId = res.data.lastId
          this.orderBaseVO = res.data.orderBaseVO
          this.orderBaseVO.shopName = res.data.shopName
          this.orderPaySettingVO = res.data.orderPaySettingVO
          this.orderPlanVO = res.data.orderPlanVO
          this.keywordParams = res.data.orderPlanVO.keywordParams
          const { minPrice, maxPrice, urlPercent } = res.data.orderPlanVO
          this.Price = { minPrice, maxPrice, urlPercent }
          this.orderServiceVO = res.data.orderServiceVO
          this.convertKeywordParams = res.data.orderServiceVO.convertKeywordParams
          this.orderVerifyVO = res.data.orderVerifyVO
          this.orderPaidVO = res.data.orderPaidVO
          this.competingUrl = res.data.orderServiceVO.competingUrl
          this.tableData.forEach((item, index) => {
            if (index === 0) {
              item.Detailed = `${this.orderPaidVO.total} * ${this.orderPaidVO.goodsPrice}`
              item.money = this.orderPaidVO.deposit
            } else if (index === 1) {
              item.Detailed = `${this.orderPaidVO.total} * 0.07元`
              item.money = this.orderPaidVO.smsTotalMoney
            } else if (index === 2) {
              item.Detailed = `${this.orderPaidVO.total} * 2元`
              item.money = this.orderPaidVO.totalCommission
            } else if (index === 3) {
              item.Detailed = `${this.orderPaidVO.total} * ${this.orderPaidVO.serviceCount} * 2元`
              item.money = this.orderPaidVO.totalServiceMoney
            }
          })
        } else {
          this.competingUrl = []
          this.nextId = ''
          this.lastId = ''
          this.tableData = []
          this.orderBaseVO = {}
          this.orderBaseVO.shopName = ''
          this.orderPaySettingVO = {}
          this.orderPlanVO = {}
          this.keywordParams = []
          this.orderServiceVO = {}
          this.convertKeywordParams = []
          this.orderPaidVO = {}
          this.orderVerifyVO = {}
        }
      })
    },
    passFn (id) {
      this.btnStatus = true
      testGuest.manageVerifyPass({ orderId: id }).then(res => {
        this.btnStatus = false
        if (res.code === 200) {
          this.pageLoad()
          this.$message({
            message: '审核通过成功！',
            type: 'success',
          })
        } else {
          this.$message({
            message: res.msg,
            type: 'error',
          })
        }
      })
    },
    rejectShow (id) {
      this.id = id
      this.modalStatus = true
    },
    rejectFn () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnStatus = true
          testGuest.manageVerifyRefuse({ orderId: this.id, remark: this.form.reviewRemarks }).then(res => {
            this.closeModalFn()
            this.btnStatus = false
            if (res.code === 200) {
              this.$message({
                message: '审批驳回成功！',
                type: 'success',
              })
              this.pageLoad()
            } else {
              this.$message({
                message: res.msg,
                type: 'error',
              })
            }
          })
        }
      })
    }
  },
  mounted () {
    this.pageLoad()
    this.getCanAuthStatus()
  }
}
</script>

<style lang="scss" scoped>
  .main {
    font-size: 14px;
    .box-card {
      color: #333333;
      /deep/ .el-checkbox__input.is-disabled+span.el-checkbox__label, /deep/ .el-radio__input.is-disabled+span.el-radio__label {
        color: #333333;
      }
      /deep/ .el-card__header {
        padding: 0 20px !important;
        height: 40px !important;
        line-height: 40px !important;
        background-color: #fafafa;
        .header-title {
          font-weight: bold;
        }
      }
      /deep/ .el-card__body {
        .firstBox {
          margin-top: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eeeeee;
          .el-col:first-child {
            .shopType {
              margin-top: 40px;
              color: #999999;
            }
          }
          .el-col:nth-child(2) {
            color: #f30213;
            line-height: 25px;
            p {
              margin: 0;
            }
          }
          .el-col:last-child {
            p {
              word-break: break-word;
              color: #999999;
            }
          }
        }
        .lastTips {
          margin-top: 10px;
          color: #999999;
          line-height: 25px;
          .label {
            width: 107px;
          }
        }
        .form {
          .el-input {
            max-width: 650px;
          }
          /deep/ .el-input.is-disabled .el-input__inner {
            color: #606266;
            cursor: text;
          }
          .QQ {
            width: 250px;
          }
          .small {
            width: 100px;
          }
          .imgBox {
            margin-right: 13px;
            width: 130px;
            height: 130px;
            border: 1px solid #eeeeee;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .tips {
        color: #999999;
      }
      &:nth-child(n+2) {
        margin-top: 15px;
      }
    }
    .mg-r-200 {
      margin-right: 200px;
    }
    .el-button--mini.is-plain {
      min-width: 68px !important;
    }
    .pd-b-0 {
      /deep/  .el-card__body {
        padding: 20px 20px 0 20px;
      }
    }
  }
</style>
