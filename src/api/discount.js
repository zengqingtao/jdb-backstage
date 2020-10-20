import http from './http'

/**
 * @author yanbenyuan@yushutec.com
 * @date 2018-11-29
 * @description 广告宝方案相关 API
 */

export default {
    /**
     * @description 获取订单号信息
     * @param orderId: Number 订单号
     * @param account: String 京店宝账户
     */
    searchOrder: data => {
        return http.get('yushu-operation/discount/searchOrder', data)
    }
}