import http from './http'

/**
 * @author yanbenyuan@yushutec.com
 * @date 2018-07-23
 * @description 用户模块相关 API
 */

export default {
    /**
     * @description 用户登录
     * @param name: String 账户
     * @param password: String 密码
     */
    login: data => {
        return http.post('yushu-system/user/login', data)
    },
    /**
     * @description 发送验证码
     * @param phone: String 手机号码
     */
    sendCode: data => {
        return http.post('yushu-system/user/sendCode', data)
    },
    /**
     * @description 找回密码（未登录）
     * @param phone: String 手机号码
     * @param code: String 验证码
     */
    verification: data => {
        return http.post('yushu-system/user/verification', data)
    },
    /**
     * @description 找回密码（未登录）
     * @param name: String 账号
     * @param phone: String 手机号码
     * @param password: String 新密码
     */
    retrieve: data => {
        return http.post('yushu-system/user/retrieve', data)
    },
    /**
     * @description 找回密码（已登录）
     * @param name: String 账户
     * @param oldPassword: String 旧密码
     * @param newPassword: String 新密码
     */
    changePassword: data => {
        return http.post('yushu-system/user/changePassword', data)
    },
    // /**
    //  * @description 退出登录
    //  * @param name: String 账户
    //  */
    // quit: data => {
    //     return http.post('yushu-system/user/loginOut', data)
    // },
    /**
     * @description 退出登录
     * @param name: String 账户
     */
    quit: data => {
        return http.post('/yushu-authorization-system/user/logout', data)
    },
    /**
     * @description 获取左侧路由菜单
     */
    getRole: data => {
        return http.get('yushu-system/user/getRole', data)
    },
    /**
     * @description 获取左侧路由菜单
     */
    getMenuList: data => {
        return http.get('yushu-authorization-system/menu/loadTreeMenuBySourceAndUserId', data)
    },
    /**
     * @description 获取用户信息
     */
    getUserInfo: data => {
        return http.get('/yushu-authorization-system/user/getUserInfo', data)
    }
}