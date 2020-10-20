import http from './http'

/**
 * @author yanbenyuan@yushutec.com
 * @date 2018-12-27
 * @description 京币管理相关 API
 */

export default {
  /**
   * @description 京币管理-消费明细
   * @param page: Number 当前页码
   * @param size: Number 每页条码
   * @param search: String 搜索关键词
   * @param startDate: String 开始时间
   * @param endDate: String 结束时间
   * @param type 0免费领取 1充值 2支出
   * @param bizType 0.分享 1.充值 2.查销量 3.注册 4.查忽略数 5.增加排名监控-商品监控
   *                6.增加排名监控-店铺监控 7.增加竞品监控-商品监控 8.增加竞品监控-店铺监控
   *                9.奖励 10.吐槽反馈奖励 11.评价分析 12.秒杀分析 13.30天销量 14.忽略评价数
   */
  listConsumeDetail: data => {
    return http.get('yushu-operation/jingbiDataAnalysis/listConsumeDetail', data)
  },
  /**
   * @description 京币管理-消费明细-bizType-options
   */
  listLabel: data => {
    return http.get('yushu-operation/jingbiDataAnalysis/listLabel', data)
  },
  /**
   * @description 京币管理-数据分析
   * @param page: Number 当前页码
   * @param size: Number 每页条码
   * @param search: String 搜索关键词
   * @param type 0近7天消费京币 1近1月消费京币 2近3月消费京币 3累计消费京币 4目前京币 5近7天增加京币 6近1月增加的京币
   *             7近3月增加的京币 8累计增加的京币 9累计充值金额
   * @param orderBy 0升序 1降序
   */
  listSearch: data => {
    return http.get('yushu-operation/jingbiDataAnalysis/listSearch', data)
  }
}