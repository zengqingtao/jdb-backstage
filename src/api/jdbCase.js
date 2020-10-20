import http from './http'

/**
 * @author yanbenyuan@yushutec.com
 * @date 2018-07-27
 * @description 京店宝案例相关 API
 */

export default {
  /**
   * @description 获取京店宝案例列表
   * @param page: Number 当前页码
   * @param size: Number 每页条码
   * @param search: String 搜索关键词
   */
  listJdbCase: data => {
    return http.get('yushu-operation/jdbCase/listJdbCase', data)
  },
  /**
   * @description 获取京店宝监控数据
   * @param type: Number 0：近7天 1：近10天 2：近15天
   * @param jdbCaseId: Number 京店宝案例ID
   */
  listJdbMonitor: data => {
    return http.get('yushu-operation/jdbCaseMonitor/listJdbMonitor', data)
  }
}