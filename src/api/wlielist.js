import http from './http'

/**
 * @author yanbenyuan@yushutec.com
 * @date 2018-07-24
 * @description 白名单相关 API
 */

export default {
    /**
     * @description 分页获取白名单
     * @param id: Number 登录用户ID
     * @param page: String 当前页
     * @param size: String 每页显示几条
     */
    getwhilelistpage: data => {
        return http.get('yushu-operation/whilelist/getWhilelistPage', data)
    },
    /**
     * @description 白名单搜索
     * @param id: Number 登录用户ID
     * @param account: String 关键词
     */
    getWhilelist: data => {
        return http.get('yushu-operation/whilelist/getWhilelist', data)
    },
    /**
     * @description 添加白名单
     * @param id: Number 登录用户ID
     * @param account: String // 京店宝账户
     * @param store: String // 店铺名称
     * @param name: String // 联系人名称
     * @param phone: String // 联系方式
     * @param whilelistPower: String  // 权限
     * @param startTime: String // 有效开始时间
     * @param endTime: String // 有效结束时间
     */
    addWlilelist: data => {
        return http.get('yushu-operation/whilelist/addWlilelist', data)
    },
    /**
     * @description 修改白名单
     * @param id: String
     * @param account: String // 京店宝账户
     * @param store: String // 店铺名称
     * @param name: String // 联系人名称
     * @param phone: String // 联系方式
     * @param whilelistPower: String  // 权限
     * @param startTime: String // 有效开始时间
     * @param endTime: String // 有效结束时间
     */
    changeWlilelist: data => {
        return http.get('yushu-operation/whilelist/changeWlilelist', data)
    },
    /**
     * @description 删除白名单
     * @param id: String
     */
    deleteWlilelist: data => {
        return http.get('yushu-operation/whilelist/delete', data)
    },
    /**
     * @description 京挑客白名单-列表
     * @param page: Number 页码
     * @param size: Number 每页上限条数
     */
    listJtkWhiteList: data => {
        return http.get('yushu-operation/renqibao/listJtkWhiteList', data)
    },
    /**
     * @description 京挑客白名单-检测京店宝账号
     * @param jdbPhone: Number 京店宝账号
     */
    checkJdbUserByPhone: data => {
        return http.get('yushu-operation/renqibao/checkJdbUserByPhone', data)
    },
    /**
     * @description 京挑客白名单-添加京挑客白名单
     * @param jdbAccount: Number 京店宝账号
     */
    addJtkWhiteList: data => {
        return http.get('yushu-operation/renqibao/addJtkWhiteList', data)
    },
}