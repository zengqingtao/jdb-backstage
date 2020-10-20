import http from './http'

/**
 * @author yanbenyuan@yushutec.com
 * @date 2018-09-11
 * @description 订单退款相关 API
 */

export default {
  /**
   * @description 获取退款申请列表
   * @param page: Number 当前页码
   * @param size: Number 每页条目数
   * @param search: String 搜索关键词
   */
  getRefundList: data => {
    return http.get('yushu-operation/refund/listRefund', data)
  },
  /**
   * @description 计算实际退款额
   * @param giveMoney: Number 赠送金额
   * @param balance: Number 平台余额
   */
  getRefundMoney: data => {
    return http.get('yushu-operation/refund/money', data)
  },
  /**
   * @description 添加退款申请
   * @param id: Number 用户id
   * @param refundType 退款类型 0京店宝余额退款 1押金余额退款
   * @param name: String 客户姓名
   * @param phone: String 联系方式
   * @param account: String 京店宝账号
   * @param giveMoney: Number 赠送金额
   * @param balance: Number 平台余额
   * @param money: Number 实际退款金额
   * @param refundReason: String 退款原因
   * @param alipay: String 支付宝账号
   * @param alipayName: String 支付宝用户名
   */
  addRefund: data => {
    return http.get('yushu-operation/refund/add', data)
  },
  /**
   * @description 获取退款申请列表
   * @param type: Number 审核状态 1审核通过 2驳回
   * @param id: Number 列表ID
   * @param reason: String 驳回原因
   * @param userId: Number 用户ID
   */
  refundReview: data => {
    return http.get('yushu-operation/refund/review', data)
  },
}