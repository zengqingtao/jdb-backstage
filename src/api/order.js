import http from './http'

/**
 * @author yanbenyuan@yushutec.com
 * @date 2018-07-25
 * @description 客户订单相关 API
 */

export default {
  /**
   * @description 查询本月业绩
   * @param id: String 登录用户ID
   * @param date: String 查询某月业绩 yyyy-MM
   */
  getThisMothOrder: data => {
    return http.get('yushu-operation/order/getThisMothOrder', data)
  },
  /**
   * @description 查询历史
   * @param id: String 登录用户ID
   * @param year: String 年份
   */
  historical: data => {
    return http.get('yushu-operation/order/historical', data)
  },
  /**
   * @description 所有订单信息分页
   * @param id: String 登录用户ID
   * @param startDate: String 开始日期
   * @param endDate: String 结束日期
   * @param page: Number 当前页
   * @param size: Number 每页显示
   * @param search: String 京店宝账户
   */
  getOrderAll: data => {
    return http.get('yushu-operation/order/getOrderAll', data)
  },
  /**
   * @description 查询订单号
   * @param account: String 京店宝账户
   * @param price: Number 充值金额
   * @param datetime: String 充值时间
   */
  searchOrderId: data => {
    return http.get('yushu-operation/order/searchOrderId', data)
  },
  /**
   * @description 添加订单
   * @param name: String 客户姓名
   * @param phone: String 客户电话
   * @param weChat: String 客户微信
   * @param account: String 京店宝账号
   * @param orderNumber String 订单号
   * @param rechargeTime: String 充值时间
   * @param rechargeMoney: String 充值金额
   * @param giveMoney: String 赠送金额
   * @param userId: String 客户ID
   */
  addOrder: data => {
    return http.get('yushu-operation/order/addOrder', data)
  },
  /**
   * @description 获取所有DB的业绩与信息
   * @param page: String 当前页
   * @param size: String 每页条数
   */
  getAllDb: data => {
    return http.get('yushu-operation/order/getAllDb', data)
  },
    /**
     * @description 获取所有DB的业绩与信息
     * @params orderId: String 当前页
     * @params money: String 每页条数
     */
    addMoreGiftMoney: data => {
        return http.get('yushu-operation/order/addMoreGiftMoney', data)
    },
}
