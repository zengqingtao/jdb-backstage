import http from './http'

/**
 * @author yanbenyuan@yushutec.com
 * @date 2018-11-29
 * @description 广告宝方案相关 API
 */

export default {
  /**
   * @description 广告宝方案获取用户信息
   * @param id: Number 登录用户ID
   * @param page: Number 当前页
   * @param size: Number 每页显示长度
   * @param search: String 搜索关键字
   */
  customerList: data => {
    return http.get('yushu-operation/adsTask/listAds', data)
  },
  /**
   * @description 根据京店宝用户id获取任务
   * @param userId: Number 京店宝用户id
   * @param page: Number 当前页
   * @param search: String 搜索关键字
   */
  getAdsTaskList: data => {
    return http.get('yushu-operation/adsTask/listTaskDetail', data)
  },
  /**
   * @description 任务修改状态
   * @param id: Number 列表任务ID
   * @param type: Number 1:已跟进2：已忽略
   */
  changeAdsTaskStatus: data => {
    return http.get('yushu-operation/adsTask/updateBdStatus', data)
  },
  /**
   * @description 获取爆款计划数据
   * @param taskId: Number 该条记录的id
   * @param cookie: String 登录京准通后获取的cookie
   */
  getAdsTaskDetail: data => {
    return http.get('yushu-operation/adsTask/getAdsTaskDetail', data)
  },
  /**
   * @description 客户管理-广告宝方案-分配BD
   */
  updateUserId: data => {
    return http.get('yushu-operation/adsTask/updateUserId', data)
  },
  /**
   * @description 划扣列表
   * @param accountId: Number 京店宝用户id
   * @param page: Number 当前页码 默认值1
   * @param size: Number 每页大小 默认值10
   * @param search: String 月份 yyyy-MM
   */
  deductList: data => {
    return http.get('yushu-operation/deduct/list', data)
  },
  /**
   * @description 新增划扣
   * @param accountId: Number 京店宝用户id
   * @param account: Number 京店宝账号
   * @param business: Number 成交金额
   * @param deduct: Number 划扣金额
   */
  deductSave: data => {
    return http.jsonPost('yushu-operation/deduct/save', data, { 'Content-Type': 'application/json;charset=utf-8' })
  },
  /**
   * @description 清空欠款
   * @param id: Number 表id
   */
  arrears: data => {
    return http.get('yushu-operation/deduct/arrears', data)
  },
  /**
   * @description 划扣用户信息
   * @param accountId: Number 京店宝用户id
   */
  means: data => {
    return http.get('yushu-operation/deduct/means', data)
  },
  /**
   * @description 广告宝方案-初中级
   * @param page: Number 页码
   * @param account: string 京店宝用户id
   */
  listAds: data => {
    return http.get('yushu-operation/specialCustomer/listAds', data)
  },
  /**
   * @description 广告宝方案-初中级-查看详情
   * @param type: Number -1：全部 0：全品营销计划 1：精准爆破计划 2：爆款投放计划 3：超级推荐计划
   * @param page: Number 页码
   * @param name: string 店铺名称
   */
  listTaskDetail: data => {
    return http.get('yushu-operation/specialCustomer/vflourlistTaskDetail', data)
  },
  /**
   * @description 广告宝方案-高级
   * @param page: Number 页码
   * @param account: string 京店宝用户id
   */
  listAdvance: data => {
    return http.get('yushu-operation/specialCustomer/listAdvance', data)
  },
  /**
   * @description 广告宝方案-高级-服务费
   * @param page: Number 页码
   * @param advanceId: Number 从广告宝方案-高级接口获取
   */
  listAdvanceDetail: data => {
    return http.get('yushu-operation/specialCustomer/listAdvanceDetail', data)
  },
}
