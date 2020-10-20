import http from './http'

/**
 * @author wangsiyong@yushutec.com
 * @date 2019-07-15
 * @description 分销商管理 API
 */

export default {
    /**
     * @description 推荐码查看
     * @params page
     * @params size
     * @params search BD名称
     */
    distributorList: data => {
        return http.get('yushu-authorization-system/user/distributorList', data)
    },
    /**
     * @description 推荐码查看
     * @params page
     * @params size
     * @params search BD名称
     */
    bdBasicsList: data => {
        return http.get('yushu-operation/distributor/list', data)
    },
    /**
     * @description BD客户数据-业绩数据
     * @params page
     * @params size
     * @params search BD名称
     * @params date 时间 yyyy-MM 默认本月
     */
    listAchievement: data => {
        return http.get('yushu-operation/distributor/listAchievement', data)
    },
    /**
     * @description BD客户数据-余额明细查看
     * @params code 分销商BD邀请码
     * @params page
     * @params size
     * @params search 京店宝账号
     * @params start 开始时间 yyyy-mm-dd
     * @params end 结束时间 yyyy-mm-dd
     */
    listDetail: data => {
        return http.get('yushu-operation/distributor/listDetail', data)
    },
    /**
     * @description BD归属调整-调整列表
     * @params code 分销商BD邀请码
     * @params page
     * @params size
     * @params search 京店宝账号
     * @params start 开始时间 yyyy-mm-dd
     * @params end 结束时间 yyyy-mm-dd
     */
    listExchangeBd: data => {
        return http.get('yushu-operation/distributor/listExchangeBd', data)
    },
    /**
     * @description BD归属调整-调整
     * @params userPhone 京店宝账户，也是电话号码
     * @params bdName 分销商BD的名称
     */
    exchageBd: data => {
        return http.get('yushu-operation/distributor/exchageBd', data)
    },
    /**
     * @description BD归属调整-调整
     * @params page int 页码
     * @params size int 页大小
     * @params search String 查询的京店宝账号
     */
    getPayment: data => {
        return http.get('yushu-operation/distributor/getPayment', data)
    },
    /**
     * @description BD归属调整-调整
     * @params id int 待付款订单id
     * @params userId int 用户id
     */
    getDocumentary: data => {
        return http.get('yushu-operation/distributor/documentary', data)
    },
    /**
     * @description BD归属调整-调整
     * @params id int 待付款订单id
     * @params status int 状态 0未领取订单 1领取订单 2催单成功 3催单失败
     */
    result: data => {
        return http.get('yushu-operation/distributor/result', data)
    },

}