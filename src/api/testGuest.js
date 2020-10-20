import http from './http'

/**
 * @author yanbenyuan@yushutec.com
 * @date 2018-10-10
 * @description 试客宝相关 API
 */

export default {
  /**
   * @description 会员信息-BD跟进
   * @params accountId Number 京店宝用户ID
   */
  addBd: data => {
    return http.get('yushu-operation/testGuest/addBd', data)
  },
  /**
   * @description 是否可以审核或者修改
   */
  canAuth: data => {
    return http.get('yushu-operation/testGuest/canAuth', data)
  },
  /**
   * @description 客户预留信息-是否可以分配
   */
  canAddBd: data => {
    return http.get('yushu-operation/testGuest/canAddBd', data)
  },
  /**
   * @description 获取用户预留信息列表
   * @param id: Number 用户ID
   * @param search: String 模糊查询姓名
   * @param page: Number 当前页
   * @param size: Number 每页条目数
   */
  listTestGuestCustomer: data => {
    return http.get('yushu-operation/testGuest/listTestGuestCustomer', data)
  },
  /**
   * @description 获取BD姓名列表
   */
  listBdIdAndName: data => {
    return http.get('yushu-operation/testGuest/listBdIdAndName', data)
  },
  /**
   * @description 获取用户预留信息列表
   * @param id: Number 列表ID
   * @param bdId: Number BDId
   */
  select: data => {
    return http.get('yushu-operation/testGuest/select', data)
  },
  /**
   * @description 获取会员列表
   * @param page: Number 当前页
   * @param jdbAccount: String 京店宝账号
   * @param vip: Number 会员类型 1 免费 2 Plus会员
   * @param valid: Number 是否正常使用 1正常使用 2过期
   */
  getMemberLog: data => {
    return http.get('yushu-operation/testGuest/getMemberLog', data)
  },
  /**
   * @description 获取绑定店铺列表
   * @param page: Number 当前页
   * @param authStatus: Number 审核状态 1待审核 2审核成功 3驳回
   * @param jdbAccount: String 京店宝账号
   * @param shopName: String 店铺名称
   * @param contactName: String 咚咚名称
   */
  getBindShopList: data => {
    return http.get('yushu-operation/testGuest/getBindShopList', data)
  },
  /**
   * @description 获取绑定店铺详情
   * @param page: Number 当前页
   * @param id: Number 店铺ID
   * @param authStatus: Number 审核状态 1待审核 2审核成功 3驳回
   * @param jdbAccount: String 京店宝账号
   * @param shopName: String 店铺名称
   * @param contactName: String 咚咚名称
   */
  getBindShopDetailById: data => {
    return http.get('yushu-operation/testGuest/getBindShopDetailById', data)
  },
  /**
   * @description 审批店铺通过
   * @param id: Number 绑定店铺ID
   */
  authPass: data => {
    return http.get('yushu-operation/testGuest/authPass', data)
  },
  /**
   * @description 审批店铺驳回
   * @param id: Number 绑定店铺ID
   * @param reason: String 驳回理由
   */
  authFail: data => {
    return http.get('yushu-operation/testGuest/authFail', data)
  },
  /**
   * @description 活动发布审核--获取审核订单列表
   * @param page: Number 当前页码
   * @param status: Number 状态 0待审核 1审核通过 2驳回
   * @param title: String 活动名称
   * @param jdbAccount: String 京店宝账号
   * @param shopName: String 店铺名称
   */
  getShikeOrderListForManage: data => {
    return http.get('yushu-operation/testGuest/getShikeOrderListForManage', data)
  },
  /**
   * @description 活动发布审核--获取订单详情
   * @param id: Number 订单id
   * @param status: Number 状态 0待审核 1审核通过 2驳回
   * @param title: String 活动名称
   * @param jdbAccount: String 京店宝账号
   * @param shopName: String 店铺名称
   */
  getShikeOrderDetailForManage: data => {
    return http.get('yushu-operation/testGuest/getShikeOrderDetailForManage', data)
  },
  /**
   * @description 活动发布审核--审核通过
   * @param orderId: Number 订单id
   */
  manageVerifyPass: data => {
    return http.get('yushu-operation/testGuest/manageVerifyPass', data)
  },
  /**
   * @description 活动发布审核--审核驳回
   * @param orderId: Number 订单id
   * @param remark: String 驳回原因
   */
  manageVerifyRefuse: data => {
    return http.get('yushu-operation/testGuest/manageVerifyRefuse', data)
  },
  /**
   * @description 申请结算订单列表
   * @param page: Number 当前页
   * @param status: Number 状态 0待审核 1审核通过 2驳回
   * @param title: String 活动名称
   * @param jdbAccount: String 京店宝账号
   * @param shopName: String 店铺名称
   */
  getManageApplyFinishOrderList: data => {
    return http.get('yushu-operation/testGuest/getManageApplyFinishOrderList', data)
  },
  /**
   * @description 申请结算详情
   * @param id: Number 列表ID
   * @param page: Number 当前页
   * @param status: Number 状态 0待审核 1审核通过 2驳回
   * @param title: String 活动名称
   * @param jdbAccount: String 京店宝账号
   * @param shopName: String 店铺名称
   */
  getManageApplyFinish: data => {
    return http.get('yushu-operation/testGuest/getManageApplyFinish', data)
  },
  /**
   * @description 通过结算申请
   * @param id: Number 列表ID
   */
  managePassApplyFinish: data => {
    return http.get('yushu-operation/testGuest/managePassApplyFinish', data)
  },
  /**
   * @description 驳回结算申请
   * @param id: Number 列表ID
   * @param remark: String 驳回理由
   */
  manageRefuseApplyFinish: data => {
    return http.get('yushu-operation/testGuest/manageRefuseApplyFinish', data)
  },
  /**
   * @description 获取商品监控详情
   * @param page: Number 当前页
   * @param title: String 活动名称
   * @param jdbAccount: String 京店宝账号
   */
  getOrderTask: data => {
    return http.get('yushu-operation/testGuest/getOrderTask', data)
  },
  /**
   * @description 获取提现记录
   * @param page: Number 当前页
   */
  listManageWithdrawRecord: data => {
    return http.get('yushu-operation/testGuest/listManageWithdrawRecord', data)
  },
  /**
   * @description 提现
   * @param money: Number 提现金额
   * @param remark: String 备注
   * @param userId: Number 登录用户ID
   * @param username: Number 登录用户名称
   * @param password: Number 密码
   */
  withdrawMoney: data => {
    return http.get('yushu-operation/testGuest/withdrawMoney', data)
  },
  /**
   * @description 提现
   */
  getLinglaBalance: data => {
    return http.get('yushu-operation/testGuest/getLinglaBalance', data)
  },
  /**
   * @description 获取活动统计数据
   * @param osType: String 来源 1京店宝 3京大师
   * @param orderId: String 订单ID
   * @param startTime: String 开始时间
   * @param endTime: String 结束时间
   * @param jdbAccount: String 京店宝账号
   * @param title: String 活动名称
   */
  getOrderTaskDayRecord: data => {
    return http.get('yushu-operation/testGuest/getOrderTaskDayRecord', data)
  },
  /**
   * @description 获取活动统计数据
   * @param orderId: String 订单ID
   * @param manageTitle: String 修改后的标题
   * @param reason: String 修改原因
   */
  manageAlertTitle: data => {
    return http.get('yushu-operation/testGuest/manageAlertTitle', data)
  },
  /**
   * @description 获取近15收入
   * @param startTime: String 开始时间
   * @param endTime: String 结束时间
   */
  countIncome: data => {
    return http.get('yushu-operation/testGuest/countIncome', data)
  },
  /**
   * @description 获取商家与活动的总数量
   */
  getMemberAndActivityTaskCount: data => {
    return http.get('yushu-operation/testGuest/getMemberAndActivityTaskCount', data)
  },
  /**
   * @description 获取近7,15,30天收入折线图
   * @param startTime: String 开始时间
   * @param endTime: String 结束时间
   * @param type: Number 类型 1.7天 2.15天 3.30天
   */
  listLast15DaysDayIncome: data => {
    return http.get('yushu-operation/testGuest/listLast15DaysDayIncome', data)
  },
  /**
   * @description 获取组合数据
   */
  getCompositeMemberShopCount: data => {
    return http.get('yushu-operation/testGuest/getCompositeMemberShopCount', data)
  },
  /**
   * @description 获取收入前6的用户
   */
  getFirstIncomeList: data => {
    return http.get('yushu-operation/testGuest/getFirstIncomeList', data)
  },
  /**
   * @description 获取价格分布列表
   * @param page: Number 当前页
   * @param min: Number 最低价
   * @param max: Number 最高价
   */
  listOrderSimpleByPrice: data => {
    return http.get('yushu-operation/testGuest/listOrderSimpleByPrice', data)
  },
}
