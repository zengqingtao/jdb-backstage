import http from './http'

/**
 * @author yanbenyuan@yushutec.com
 * @date 2018-08-07
 * @description 人气宝相关 API
 */

export default {
  /**
   * @description 人气宝分页权限管理
   * @param userId: String 登录用户ID
   * @param page: Number 当前页码
   * @param size: Number 页码长度
   * @param search: String 搜索参数
   */
  getRenqibaoList: data => {
    return http.get('yushu-operation/renqibao/getRenqibaoList', data)
  },
  /**
   * @description 查看投放计划
   * @param taskType: Number 1、流量sku监控 2、快车sku监控
   * @param userId: Number 用户ID
   * @param sku: String 查询sku参数
   */
  getMonitor: data => {
    return http.get('yushu-operation/renqibao/monitor', data)
  },
  /**
   * @description 查看投放计划
   * @param userId: String 用户ID
   * @param flowTaskId: String 投放计划ID
   */
  getPlanList: data => {
    return http.get('yushu-operation/renqibao/plan', data)
  },
}