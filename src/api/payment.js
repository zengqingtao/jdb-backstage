import http from './http'

/**
 * @author yanbenyuan@yushutec.com
 * @date 2018-08-22
 * @description 催付款订单相关 API
 */

export default {
  /**
   * @description 获取催付款订单列表
   * @param id: Number 登录用户ID
   * @param page: Number 当前页
   * @param size: Number 每页条数
   * @param search: String 搜索参数
   */
  getPayment: data => {
    return http.get('yushu-operation/payment/getPayment', data)
  },
  /**
   * @description BD跟单
   * @param id: Number 待付款订单ID
   * @param userId: Number 用户ID
   */
  getDocumentary: data => {
    return http.get('yushu-operation/payment/documentary', data)
  },
  /**
   * @description 催付成功/催付失败
   * @param id: Number 待付款订单ID
   * @param userId: Number 用户ID
   * @param status: 2催单成功 3催单失败
   */
  result: data => {
    return http.get('yushu-operation/payment/result', data)
  },
}