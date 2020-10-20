import http from './http'

/**
 * @author yanbenyuan@yushutec.com
 * @date 2018-07-27
 * @description 京店联盟相关 API
 */

export default {
  /**
   * @description 未审核联盟信息
   * @param page: Number 当前页
   * @param size: Number 每页显示长度
   */
  cpsNoReview: data => {
    return http.get('yushu-operation/union/noReview', data)
  },
  /**
   * @description 审核通过的联盟信息
   * @param page: Number 当前页
   * @param size: Number 每页显示长度
   */
  cpsReview: data => {
    return http.get('yushu-operation/union/review', data)
  },
  /**
   * @description 审核未通过的联盟信息
   * @param page: Number 当前页
   * @param size: Number 每页显示长度
   */
  cpsNoPassReview: data => {
    return http.get('yushu-operation/union/reviewNoPass', data)
  },
  /**
   * @description 审核通过/未通过
   * @param status: String 2是通过 0是不通过
   * @param userPhone: String 用户手机号码
   * @param checkMsg: String 不通过原因
   */
  cpsReviewPass: data => {
    return http.get('yushu-operation/union/reviewPass', data)
  },
  /**
   * @description 查找联盟用户审核结果信息
   * @param phone: String 用户手机号
   * @param status: Number 0是不通过 1是未审核 2是通过
   */
  cpsByPhone: data => {
    return http.get('yushu-operation/union/cpsByPhone', data)
  },
  /**
   * @description 京店联盟查看业绩
   * @param search: String 搜索参数
   * @param page: Number 当前页
   * @param size: Number 每页显示条目数
   */
  getPassCps: data => {
    return http.get('yushu-operation/union/getPassCps', data)
  },
  /**
   * @description 京店联盟用户本月业绩
   * @param invitationCode: String 推荐码
   */
  cpsGetThisMonth: data => {
    return http.get('yushu-operation/union/cpsGetThisMonth', data)
  },
  /**
   * @description 京店联盟用户历史业绩
   * @param invitationCode: String 推荐码
   * @param year: String 年份
   */
  cpsHistorical: data => {
    return http.get('yushu-operation/union/cpsHistorical', data)
  },
  /**
   * @description 运营后台下级联盟查看业绩
   * @param search: String 搜索参数
   * @param page: Number 当前页
   * @param size: Number 每页显示条目数
   */
  SubordinateList: data => {
    return http.get('yushu-operation/union/subordinateAchievement', data)
  },
  /**
   * @description 查看下级联盟-上月记录
   * @param userId: CPS用户ID
   * @param search: String 搜索参数
   * @param page: Number 当前页
   * @param size: Number 每页显示条目数
   */
  SubordinateLastMonthList: data => {
    return http.get('yushu-operation/union/lastMonthSubordinate', data)
  },
  /**
   * @description 查看下级联盟-历史明细
   * @param userId: CPS用户ID
   * @param search: String 搜索参数
   * @param page: Number 当前页
   * @param size: Number 每页显示条目数
   */
  historySubordinate: data => {
    return http.get('yushu-operation/union/historySubordinate', data)
  },
  /**
   * @description 查看下级联盟-贡献统计
   * @param userId: CPS用户ID
   * @param search: String 搜索参数
   * @param page: Number 当前页
   * @param size: Number 每页显示条目数
   */
  listStatistics: data => {
    return http.get('yushu-operation/union/listStatistics', data)
  },
  /**
   * @description 京店联盟用户注册统计数的列表详情
   * @param page: Number 当前页
   * @param size: Number 每页显示条目数
   * @param phone: Number 京店联盟用户手机号码
   */
  cpsRegisterList: data => {
    return http.get('yushu-operation/union/list', data)
  },
  /**
   * @description 京店联盟用户下的京店宝注册关联用户列表详情
   * @param code: 邀请码
   * @param page: Number 当前页
   * @param size: Number 每页显示条目数
   * @param phone: Number 京店联盟用户手机号码
   */
  listPhoneByCode: data => {
    return http.get('yushu-operation/union/listPhoneByCode', data)
  },
  /**
   * @description 京店联盟用户下的京店宝注册未关联用户列表详情
   * @param code: 邀请码
   * @param page: Number 当前页
   * @param size: Number 每页显示条目数
   * @param phone: Number 京店联盟用户手机号码
   */
  listNoRecharge: data => {
    return http.get('yushu-operation/union/listNoRecharge', data)
  },
}
