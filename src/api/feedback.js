import http from './http'

/**
 * @author yanbenyuan@yushutec.com
 * @date 2018-08-09
 * @description 吐槽模块相关 API
 */

/**
 * @description 获取模块
 * @param parentId: Number 父模块id 没有传0
 */
export const getJdbProductModule = data => {
    return http.get('yushu-operation/feedback/getJdbProductModule', data)
}

/**
 * @description 获取吐槽列表
 * @param userId: Number 登录用户ID
 * @param moduleId: Number 模块ID
 * @param page: Number 当前页码
 */
export const getFeedbackList = data => {
    return http.get('yushu-operation/feedback/getFeedbackList', data)
}

/**
 * @description 采纳吐槽
 * @param content: String 备注
 * @param authType: Number 2采纳 3不采纳
 * @param userId: Number 登录用户ID
 * @param id: Number 列表ID
 */
export const authFeedback = data => {
    return http.post('yushu-operation/feedback/authFeedback', data)
};
/**
 * @description 店铺诊断-获取列表
 * @param type: String  1店铺指标 2商品指标
 * @param page: Number 页码
 * @param size: Number 一页数量
 */
export const listIndexTip = data => {
        return http.get('yushu-operation/diagnosis/indexTip/listIndexTip', data)
    }
    /**
     * @description 店铺诊断-添加/修改
     * @param content: String  指标内容
     * @param id: Number 编号（编辑时传）
     * @param name: String 内容
     * @param type: Number 1:店铺 2：商品
     */
export const addIndexTip = data => {
    return http.jsonPost('yushu-operation/diagnosis/indexTip/addIndexTip', data, { 'Content-Type': 'application/json;charset=utf-8' })
}