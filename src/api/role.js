import http from './http'

/**
 * @author yanbenyuan@yushutec.com
 * @date 2018-07-23
 * @description 角色权限相关 API
 */

export default {
  /**
   * @description 获取角色信息
   */
  roleInfo: data => {
    return http.get('yushu-system/role/roleInfo', data)
  },
  /**
   * @description 获取表格角色信息(分页)
   */
  getRoleAll: data => {
    return http.get('yushu-system/role/getRoleAll', data)
  },
  /**
   * @description 增加角色
   * @param roleName: String 角色名称
   * @param roleType: String 角色分类
   * @param roleDescribe: String 角色描述
   * @param Number 0 为未勾选 1 为勾选
   admin: 0, // 超级管理员
   whilelist: 0, //白名单权限
   whilelistClient: 0, //白名单客户权限
   powerTalent: 0, //达人权限
   talentReview: 0, //达人审核
   powerOrder: 0, //DB管理
   clientOrder: 0, //客户订单
   Performance: 0, //查看业绩
   menu: 0, //菜单管理
   powerRole: 0, //角色管理
   jurisdiction: 0, //权限管理
   */
  addRole: data => {
    // return http.get('yushu-system/role/addRole', data)
    return http.jsonPost('yushu-system/role/addNewRole', data, { 'Content-Type': 'application/json'})
  },
  /**
   * @description 修改角色
   * @param id: String 角色id
   * @param roleName: String 角色名称
   * @param roleType: String 角色分类
   * @param roleDescribe: String 角色描述
   */
  changeRole: data => {
    // return http.post('yushu-system/role/changeRole', data)
    return http.jsonPost('yushu-system/role/changeNewRole', data, { 'Content-Type': 'application/json'})
  },
  /**
   * @description 删除角色
   * @param id: String 角色id
   */
  deleteRole: data => {
    return http.get('yushu-system/role/delete', data)
  },
  /**
   * @description 返回角色信息
   * @param id: String 角色ID
   */
  getRoleInfo: data => {
    return http.get('yushu-system/role/getRoleInfo', data)
  },
}
