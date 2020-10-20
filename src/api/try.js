import http from './http'

/**
 * @author yanbenyuan@yushutec.com
 * @date 2018-09-25
 * @description 试一试相关 API
 */

export default {
  /**
   * @description 获取试一试商家列表
   * @param search: String 搜索关键词
   * @param page: Number 当前页
   * @param size: Number 每页显示条目数
   */
  listTry: data => {
    return http.get('yushu-operation/try/listTry', data)
  },
  /**
   * @description 获取订单列表
   * @param tryId: String 试一试商家ID
   * @param type: Number 审核状态 0：未审核 1：审核通过 2：审核未通过
   * @param search: String 搜索关键词
   * @param page: Number 当前页
   * @param size: Number 每页显示条目数
   */
  listTryReview: data => {
    return http.get('yushu-operation/tryReview/listTryReview', data)
  },
  /**
   * @description 审核
   * @param id: String 订单ID
   * @param status: Number 审核状态 1：通过 2：不通过
   * @param reviewRemarks: String 审核备注
   * @param userId: Number 登陆用户ID
   */
  tryReview: data => {
    return http.get('yushu-operation/tryReview/review', data)
  },
}