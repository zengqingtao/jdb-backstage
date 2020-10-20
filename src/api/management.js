import http from './http'

/**
 * @author yanbenyuan@yushutec.com
 * @date 2018-07-23
 * @description 用户权限相关 API
 */

export default {
  /**
   * @description 分页获取用户信息
   * @param page: String 当前页
   * @param size: String 每页显示几条
   * @param search: String 搜索关键词
   */
  getUserPage: data => {
    return http.get('yushu-system/user/getUserPage', data)
  },
  /**
   * @description 添加用户
   * @param name: String 用户名称
   * @param password: String 密码
   * @param manage: Number 角色Id
   * @param phone: String 手机号码
   */
  addUser: data => {
    return http.get('yushu-system/user/addUser', data)
  },
  /**
   * @description 修改用户
   * @param id: Number 用户Id
   * @param name: String 用户名称
   * @param manage: Number 所选角色ID
   * @param phone: String 手机号
   */
  changeUser: data => {
    return http.get('yushu-system/user/changeUser', data)
  },
  /**
   * @description 删除用户
   * @param id: String 用户Id
   * @param name: String 用户名称
   */
  delete: data => {
    return http.get('yushu-system/user/delete', data)
  },
  /**
   * @description 获取分销商主管
   */
  getDistributorManage: data => {
    return http.get('yushu-system/user/getDistributorManage', data)
  }
}