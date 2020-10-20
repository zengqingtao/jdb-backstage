/*
 * @Author: chenzhenjin
 * @email: BrotherStudy@163.com
 * @Date: 2020-08-26 13:31:09
 * @LastEditTime: 2020-09-11 13:31:56
 * @Descripttion: 模块描述
 */
import http from './http'

/**
 * @author yanbenyuan@yushutec.com
 * @date 2018-09-14
 * @description 客户信息相关 API
 */

export default {
    /**
     * @description 添加客户信息
     * @param id: String 登录用户ID
     */
    customerAdd: data => {
        return http.get('yushu-operation/customer/add', data)
    },
    /**
     * @description 修改客户信息
     * @param id: String 列表ID
     */
    customerChange: data => {
        return http.get('yushu-operation/customer/change', data)
    },
    /**
     * @description 删除客户信息
     * @param id: String 列表ID
     */
    customerDel: data => {
        return http.get('yushu-operation/customer/delete', data)
    },
    /**
     * @description 客户信息-归属商家
     * @param id: String 登录用户ID
     * @param page: Number 当前页
     * @param size: Number 每页条目数
     * @param search: String 搜索关键词
     * @param belong: Number 是否归属 1归属 0没有归属
     */
    customerList: data => {
        return http.get('yushu-operation/customer/customerList', data)
    },
    /**
     * @description 客户信息-解除归属
     * @param id: String 登录用户ID
     * @param page: Number 当前页
     * @param size: Number 每页条目数
     * @param search: String 搜索关键词
     * @param belong: Number 是否归属 1归属 0没有归属
     */
    removeBelongCustomerList: data => {
        return http.get('yushu-operation/customer/removeBelongCustomerList', data)
    },
    /**
     * @description 获取客户信息
     * @param account: String 京店宝账户
     */
    customerInfo: data => {
        return http.get('yushu-operation/customer/customerByAccount', data)
    },
    /**
     * @description 解除归属
     * @param id: String 列表ID
     */
    removeBd: data => {
        return http.get('yushu-operation/customer/removeBd', data)
    },
    /**
     * @description 手动退款列表
     */
    listFlowManageRefund: data => {
        return http.get('yushu-operation/renqibao/listFlowManageRefund', data)
    },
    /**
     * @description 手动退款-添加退款-检测京店宝账号
     */
    checkJdbUser: data => {
        return http.get('yushu-operation/renqibao/checkJdbUser', data)
    },
    /**
     * @description: 手动退款-添加退款-检测京店宝手机号
     */    
    checkJdbUserByPhone: data => {
        return http.get('yushu-operation/renqibao/checkJdbUserByPhone', data)
    },
    /**
     * @description 手动退款-添加退款-检测任务编号
     */
    getFlowTaskPayInfo: data => {
        return http.get('yushu-operation/renqibao/getFlowTaskPayInfo', data)
    },
    /**
     * @description 手动退款-添加退款-提交手动退款
     */
    flowHandleRefund: data => {
        return http.jsonPost('yushu-operation/renqibao/flowHandleRefund', data, { 'Content-Type': 'application/json;charset=utf-8' })
    }
}