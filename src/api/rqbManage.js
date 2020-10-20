import http from './http'

/**
 * @author dengkangtai@yushutec.com
 * @date 2019-10-16
 * @description 人气宝管理API
 */

export default {
  /**
   * @description 获取流量订单
   * @param page: Number 当前页码
   * @param size: Number 每页条目数
   * @param endTime: String 结束时间
   * @param startTime: String 开始时间
   * @param status: Number 供应商状态
   * @param plant: Number 平台
   */
  listManageTask: data => {
    return http.jsonPost('yushu-operation/renqibao/listManageTask',  data, { 'Content-Type': 'application/json;charset=utf-8' })
  },
  /**
   * @description 获取流量任务
   * @param page: Number 当前页码
   * @param size: Number 每页条目数
   * @param endTime: String 结束时间
   * @param startTime: String 开始时间
   * @param status: Number 任务状态
   */
  listManageFlow: data => {
    return http.jsonPost('yushu-operation/renqibao/listManageFlow',  data, { 'Content-Type': 'application/json;charset=utf-8' })
  },
  /**
   * @description 获取每日订单任务
   * @param page: Number 当前页码
   * @param size: Number 每页条目数
   * @param taskId: Number 任务ID
   */
  listTaskDateList: data => {
    return http.get('yushu-operation/renqibao/listTaskDateList',  data)
  },
  /**
   * @description 获取流量任务详情
   * @param page: Number 当前页码
   * @param size: Number 每页条目数
   * @param taskId: Number 任务ID
   */
  listManageTaskByTaskId: data => {
    return http.jsonPost('yushu-operation/renqibao/listManageTaskByTaskId',  data, { 'Content-Type': 'application/json;charset=utf-8' })
  },
  /**
   * @description 获取异常流量任务
   * @param page: Number 当前页码
   * @param size: Number 每页条目数
   * @param endTime: String 结束时间
   * @param startTime: String 开始时间
   * @param jdbAccount: String 京店宝账号
   * @param pid: String 订单ID
   * @param taskId: Number 任务ID
   */
  listTaskWarn: data => {
    return http.jsonPost('yushu-operation/renqibao/listTaskWarn',  data, { 'Content-Type': 'application/json;charset=utf-8' })
  },
  /**
   * @description 复制异常任务
   */
  copyTask: data => {
    return http.get('yushu-operation/renqibao/copyTask',  data)
  }
}